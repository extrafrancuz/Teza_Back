const Feedback = require("../models/Feedback");
const User = require("../models/User");

// Add new feedback
exports.addFeedback = async (req, res) => {
  try {
    const { stars, message, username } = req.body;

    // Validate stars
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({
        status: "FAILED",
        message: "Stars must be between 1 and 5",
      });
    }

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        status: "FAILED",
        message: "Message is required",
      });
    }

    // Create feedback
    const feedback = new Feedback({
      username,
      stars,
      message,
    });

    await feedback.save();

    return res.status(201).json({
      status: "SUCCESS",
      message: "Feedback added successfully",
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }); // Sort by newest first

    return res.status(200).json(feedback);
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// Get user's feedback
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(feedback);
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { stars, message } = req.body;

    // Validate stars
    if (stars && (stars < 1 || stars > 5)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Stars must be between 1 and 5",
      });
    }

    const feedback = await Feedback.findOne({
      _id: feedbackId,
      userId: req.user.id,
    });

    if (!feedback) {
      return res.status(404).json({
        status: "FAILED",
        message: "Feedback not found or unauthorized",
      });
    }

    if (stars) feedback.stars = stars;
    if (message) feedback.message = message;

    await feedback.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findOneAndDelete({
      _id: feedbackId,
      userId: req.user.id,
    });

    if (!feedback) {
      return res.status(404).json({
        status: "FAILED",
        message: "Feedback not found or unauthorized",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};
