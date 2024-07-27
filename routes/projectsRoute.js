const express = require("express");
const router = express.Router();
const { createProject, getProjects, deleteProject } = require("../controllers/projectController");

router.post("/projects", createProject);
router.get("/projects", getProjects);
router.delete("/projects/:id", deleteProject);

module.exports = router;
