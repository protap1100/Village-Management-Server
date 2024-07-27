const express = require("express");
const router = express.Router();
const { createFeedback, getFeedback, deleteFeedback } = require("../controllers/feedbackController");

router.post("/feedback", createFeedback);
router.get("/feedback", getFeedback);
router.delete("/feedback/:id", deleteFeedback);

module.exports = router;
