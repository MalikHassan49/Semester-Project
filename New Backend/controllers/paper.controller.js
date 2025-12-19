// const db = require('../config/db');
// const cloudinary = require('../config/cloudinary');

// // Submit Paper
// exports.submitPaper = async (req, res) => {
//   try {
//     const { title, abstract } = req.body;
//     const authorId = req.user.userId;

//     if (!title || !abstract) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title and abstract are required'
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'Paper file is required'
//       });
//     }

//     // Upload to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//       folder: 'research_papers',
//       resource_type: 'auto'
//     });

//     // Call stored procedure to insert paper
//     const [result] = await db.query(
//       'CALL sp_insert_paper(?, ?, ?, ?, ?)',
//       [authorId, title, abstract, uploadResult.secure_url, req.file.originalname]
//     );

//     const paperId = result[0][0].paper_id;

//     res.status(201).json({
//       success: true,
//       message: 'Paper submitted successfully',
//       paper: {
//         paper_id: paperId,
//         title,
//         abstract,
//         file_url: uploadResult.secure_url,
//         file_name: req.file.originalname
//       }
//     });
//   } catch (error) {
//     console.error('Submit paper error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while submitting paper'
//     });
//   }
// };

// // Get Author's Papers
// exports.getMyPapers = async (req, res) => {
//   try {
//     const authorId = req.user.userId;

//     // Call stored procedure
//     const [result] = await db.query('CALL sp_get_papers_by_author(?)', [authorId]);

//     res.status(200).json({
//       success: true,
//       papers: result[0]
//     });
//   } catch (error) {
//     console.error('Get papers error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching papers'
//     });
//   }
// };

// // Get All Papers (For Reviewers)
// exports.getAllPapers = async (req, res) => {
//   try {
//     // Call stored procedure
//     const [result] = await db.query('CALL sp_get_all_papers()');

//     res.status(200).json({
//       success: true,
//       papers: result[0]
//     });
//   } catch (error) {
//     console.error('Get all papers error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching papers'
//     });
//   }
// };

// // Search Papers
// exports.searchPapers = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     // Call stored procedure
//     const [result] = await db.query('CALL sp_search_papers(?)', [query]);

//     res.status(200).json({
//       success: true,
//       papers: result[0]
//     });
//   } catch (error) {
//     console.error('Search papers error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while searching papers'
//     });
//   }
// };


const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

// Submit Paper
exports.submitPaper = async (req, res) => {
  let connection;
  
  try {
    const { title, abstract } = req.body;
    const authorId = req.user.user_id;

    if (!title || !abstract) {
      return res.status(400).json({
        success: false,
        message: 'Title and abstract are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Paper file is required'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'research_papers',
      resource_type: 'auto'
    });

    // Get dedicated connection for transaction
    connection = await db.getConnection();
    
    // Increase lock wait timeout for this connection
    await connection.query('SET SESSION innodb_lock_wait_timeout = 120');
    
    // Start transaction
    await connection.beginTransaction();

    // Call stored procedure to insert paper
    const [result] = await connection.query(
      'CALL sp_insert_paper(?, ?, ?, ?, ?)',
      [authorId, title, abstract, uploadResult.secure_url, req.file.originalname]
    );

    // Commit transaction
    await connection.commit();

    const paperId = result[0][0].paper_id;

    res.status(201).json({
      success: true,
      message: 'Paper submitted successfully',
      paper: {
        paper_id: paperId,
        title,
        abstract,
        file_url: uploadResult.secure_url,
        file_name: req.file.originalname
      }
    });
  } catch (error) {
    // Rollback on error
    if (connection) {
      await connection.rollback();
    }
    
    console.error('Submit paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting paper',
      error: error.message
    });
  } finally {
    // Release connection back to pool
    if (connection) {
      connection.release();
    }
  }
};

// Get Author's Papers
exports.getMyPapers = async (req, res) => {
  let connection;
  
  try {
    const authorId = req.user.user_id;

    // Get connection
    connection = await db.getConnection();

    // Call stored procedure
    const [result] = await connection.query('CALL sp_get_papers_by_author(?)', [authorId]);

    res.status(200).json({
      success: true,
      papers: result[0]
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching papers'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Get All Papers (For Reviewers)
exports.getAllPapers = async (req, res) => {
  let connection;
  
  try {
    connection = await db.getConnection();
    
    // Call stored procedure
    const [result] = await connection.query('CALL sp_get_all_papers()');

    res.status(200).json({
      success: true,
      papers: result[0]
    });
  } catch (error) {
    console.error('Get all papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching papers'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Search Papers
exports.searchPapers = async (req, res) => {
  let connection;
  
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    connection = await db.getConnection();

    // Call stored procedure
    const [result] = await connection.query('CALL sp_search_papers(?)', [query]);

    res.status(200).json({
      success: true,
      papers: result[0]
    });
  } catch (error) {
    console.error('Search papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching papers'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
