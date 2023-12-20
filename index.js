const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
//admin
//SR04ivkKKZ4FI1p5

const uri =
  "mongodb+srv://admin:SR04ivkKKZ4FI1p5@cluster0.cmi4wzm.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log("DB Connected Successfully✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const database = client.db("taskDB");
const newTasksCollection = database.collection("newTasks");
const usersCollection = database.collection("users");

//task related API

app.get("/all-to-do-tasks", async (req, res) => {
  try {
    const userEmail = req.query.email;
    let queryObj = {};
    if (userEmail) {
      queryObj.userEmail = userEmail;
    }
    const result = await newTasksCollection.find(queryObj).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/create-new-task", async (req, res) => {
  try {
    const newTask = req.body;
    const result = await newTasksCollection.insertOne(newTask);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

//user related API
app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    const userEmail = newUser.email;
    const query = { email: userEmail };
    const isExist = await usersCollection.findOne(query);
    if (isExist) {
      return res.send("user already exists");
    } else {
      const userResult = await usersCollection.insertOne(newUser);
      return res.send(userResult);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
