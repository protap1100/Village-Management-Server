require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Define the collections
    const database = client.db("Village-Management");
    const projectCollection = database.collection("Projects");
    const memberCollection = database.collection("Member");
    const contactCollection = database.collection("Contact");
    const occasionsCollection = database.collection("Occasions");
    const postCollection = database.collection("posts");
    const userCollection = database.collection("users");

    // Define the API endpoints
    app.post("/projects", async (req, res) => {
      const projectData = req.body;
      const result = await projectCollection.insertOne(projectData);
      res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const projects = await projectCollection.find().toArray();
      res.send(projects);
    });

    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectCollection.deleteOne(query);
      res.send(result);
    });
    
    app.post("/occasions", async (req, res) => {
      const occasionsData = req.body;
      const result = await occasionsCollection.insertOne(occasionsData);
      res.send(result);
    });

    app.get("/occasions", async (req, res) => {
      const occasions = await occasionsCollection.find().toArray();
      res.send(occasions);
    });

    app.delete("/occasions/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await occasionsCollection.deleteOne(query);
      res.send(result);
    });



  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Village Management Is Running");
});

app.listen(port, () => {
  console.log(`Village Management is running on port ${port}`);
});
