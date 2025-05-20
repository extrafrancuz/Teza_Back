const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create new feedback
router.post('/feedback', feedbackController.addFeedback);

// Get all feedback
router.get('/feedback/all', feedbackController.getAllFeedback);

// Get user's feedback
router.get('/feedback/my', feedbackController.getUserFeedback);

// Update feedback
router.put('/feedback/:feedbackId', feedbackController.updateFeedback);

// Delete feedback
router.delete('/feedback/:feedbackId', feedbackController.deleteFeedback);

module.exports = router;