const { ObjectId } = require("mongodb");
const connectToDatabase = require("../config/database");

async function createFeedback(req, res) {
  const client = await connectToDatabase();
  const contactCollection = client.db("Village-Management").collection("Contact");
  const feedbackData = req.body;
  const result = await contactCollection.insertOne(feedbackData);
  res.send(result);
}

async function getFeedback(req, res) {
  const client = await connectToDatabase();
  const contactCollection = client.db("Village-Management").collection("Contact");
  const feedback = await contactCollection.find().toArray();
  res.send(feedback);
}

async function deleteFeedback(req, res) {
  const client = await connectToDatabase();
  const contactCollection = client.db("Village-Management").collection("Contact");
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await contactCollection.deleteOne(query);
  res.send(result);
}

module.exports = {
  createFeedback,
  getFeedback,
  deleteFeedback,
};
