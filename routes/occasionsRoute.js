const express = require("express");
const router = express.Router();
const { createOccasion, getOccasions, deleteOccasion } = require("../controllers/occasionController");

router.post("/occasions", createOccasion);
router.get("/occasions", getOccasions);
router.delete("/occasions/:id", deleteOccasion);

module.exports = router;
