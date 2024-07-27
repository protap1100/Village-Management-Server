const { ObjectId } = require("mongodb");
const connectToDatabase = require("../config/database");

async function createOccasion(req, res) {
  const client = await connectToDatabase();
  const occasionsCollection = client.db("Village-Management").collection("Occasions");
  const occasionsData = req.body;
  const result = await occasionsCollection.insertOne(occasionsData);
  res.send(result);
}

async function getOccasions(req, res) {
  const client = await connectToDatabase();
  const occasionsCollection = client.db("Village-Management").collection("Occasions");
  const occasions = await occasionsCollection.find().toArray();
  res.send(occasions);
}

async function deleteOccasion(req, res) {
  const client = await connectToDatabase();
  const occasionsCollection = client.db("Village-Management").collection("Occasions");
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await occasionsCollection.deleteOne(query);
  res.send(result);
}

module.exports = {
  createOccasion,
  getOccasions,
  deleteOccasion,
};
