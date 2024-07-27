const { ObjectId } = require("mongodb");
const connectToDatabase = require("../config/database");

async function createProject(req, res) {
  const client = await connectToDatabase();
  const projectCollection = client.db("Village-Management").collection("Projects");
  const projectData = req.body;
  const result = await projectCollection.insertOne(projectData);
  res.send(result);
}

async function getProjects(req, res) {
  const client = await connectToDatabase();
  const projectCollection = client.db("Village-Management").collection("Projects");
  const projects = await projectCollection.find().toArray();
  res.send(projects);
}

async function deleteProject(req, res) {
  const client = await connectToDatabase();
  const projectCollection = client.db("Village-Management").collection("Projects");
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await projectCollection.deleteOne(query);
  res.send(result);
}

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};
