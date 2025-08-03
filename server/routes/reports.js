import express from 'express';
import Report from '../models/Report.js';
import GroceryItem from '../models/GroceryItem.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new report (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, reason, description } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!itemId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and reason are required'
      });
    }

    // Check if item exists
    const item = await GroceryItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check for existing report from same user for same item
    const existingReport = await Report.findOne({
      itemId: itemId,
      user: userId,
      status: { $in: ['pending', 'under-review'] }
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: 'You have already reported this item. Please wait for the existing report to be resolved.'
      });
    }

    // Create new report
    const report = new Report({
      itemId,
      user: userId,
      reason,
      description: description?.trim() || undefined
    });

    await report.save();

    // Populate the report with item and user info for response
    await report.populate([
      { path: 'itemId', select: 'itemName store.name' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. We will review it shortly.',
      data: {
        reportId: report._id,
        status: report.status,
        createdAt: report.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get user's reports (requires authentication)
router.get('/my-reports', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    // Get paginated reports
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reports = await Report.find(query)
      .populate('itemId', 'itemName store.name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReports = await Report.countDocuments(query);
    const totalPages = Math.ceil(totalReports / parseInt(limit));

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalReports,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Check if user has already reported an item
router.get('/check/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.userId;

    const existingReport = await Report.findOne({
      itemId: itemId,
      user: userId,
      status: { $in: ['pending', 'under-review'] }
    });

    res.json({
      success: true,
      data: {
        hasReported: !!existingReport,
        report: existingReport ? {
          id: existingReport._id,
          reason: existingReport.reason,
          status: existingReport.status,
          createdAt: existingReport.createdAt
        } : null
      }
    });

  } catch (error) {
    console.error('Error checking report status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get report reasons (public endpoint)
router.get('/reasons', (req, res) => {
  const reasons = [
    { value: 'incorrect-price', label: 'Incorrect Price' },
    { value: 'expired-deal', label: 'Expired Deal/Promotion' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'wrong-location', label: 'Wrong Store Location' },
    { value: 'inappropriate-content', label: 'Inappropriate Content' },
    { value: 'duplicate-item', label: 'Duplicate Item' },
    { value: 'spam', label: 'Spam' },
    { value: 'other', label: 'Other' }
  ];

  res.json({
    success: true,
    data: reasons
  });
});

export default router;
