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

    // Projects Related Api's
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

    // User's Related Api's
    app.post("/register", async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });

    app.get("/logged-user/:email", async (req, res) => {
      const userEmail = req.params.email;
      const filter = { email: userEmail };
      const singleUser = await userCollection.findOne(filter);
      res.send(singleUser);
    });

    // Occasions Related Api's
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

    // Post Related Api's
    app.post("/post", async (req, res) => {
      const postData = req.body;
      const result = await postCollection.insertOne(postData);
      res.send(result);
    });

    app.get("/post", async (req, res) => {
      const result = await postCollection.find().toArray();
      res.send(result);
    });

    app.get("/post-details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await postCollection.findOne(filter);
      res.send(result);
    });

    app.post("/post/:user_email", async (req, res) => {
      const email = req.params.user_email;
      console.log(email);
      const query = { user_email: email };
      const findData = await postCollection.find(query).toArray();
      res.send(findData);
    });

    app.post("/post/:id/comments", async (req, res) => {
      const id = req.params.id;
      const { comment, author, photo } = req.body;
      const filter = { _id: new ObjectId(id) };

      try {
        const post = await postCollection.findOne(filter);
        if (!post) {
          return res.status(404).send({ message: "Post not found" });
        }
        const newComment = {
          text: comment,
          author: author || "Anonymous",
          timestamp: new Date(),
          photo: photo,
        };
        const updateResult = await postCollection.updateOne(filter, {
          $push: { comment: newComment },
        });
        if (updateResult.modifiedCount > 0) {
          res.status(200).send(newComment);
        } else {
          res.status(400).send({ message: "Failed to add comment" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.post("/post/:id/likes", async (req, res) => {
      const postId = req.params.id;
      const userId = req.body.userId; 
      console.log(userId)
      if (!ObjectId.isValid(postId)) {
        return res.status(400).send({ message: "Invalid post ID" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      try {
        const filter = { _id: new ObjectId(postId) };
        const post = await postCollection.findOne(filter);
        if (!post) {
          return res.status(404).send({ message: "Post not found" });
        }
        if (post.likes && post.likes.includes(userId)) {
          return res
            .status(400)
            .send({ message: "User has already liked this post" });
        }
        const updateResult = await postCollection.updateOne(filter, {
          $push: { likes: userId },
        });
        console.log(updateResult)
        if (updateResult.modifiedCount > 0) {
          res.status(200).send({ message: "Like added successfully" });
        } else {
          res.status(400).send({ message: "Failed to add like" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Feedback Related Api's
    app.post("/feedback", async (req, res) => {
      const feedbackData = req.body;
      const result = contactCollection.insertOne(feedbackData);
      res.send(result);
    });

    app.get("/feedback", async (req, res) => {
      const feedback = await contactCollection.find().toArray();
      res.send(feedback);
    });

    app.delete("/feedback/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await contactCollection.deleteOne(query);
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
