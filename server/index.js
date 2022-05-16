const PORT = 8000;
//const PORT = process.env.PORT || 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
//for generating unique user id
const { v4: uuidv4 } = require("uuid");
//for generating unique web token
const jwt = require("jsonwebtoken");
const cors = require("cors");
//for hashing password
const bcrypt = require("bcrypt");
require("dotenv").config();
//connect with mongodb
const uri = process.env.URI;

// const uri = process.env.MONGODB_URI;
// mongoose
//   .connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to mongo", MONGODB_URI))
//   .catch(console.log);

// for reading json
const app = express();

//ratelimit
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 24 hours)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const slowDown = require("express-slow-down");

const speedLimiter = slowDown({
  windowMs: 1000, // 1 second
  delayAfter: 1, // allow 1 requests per 1 second, then...
  delayMs: 500, // begin adding 500ms of delay per request above 1:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

app.use(speedLimiter);

app.use(cors());
app.use(express.json());

//pass the data from the backend to the frontend
//sending json to the brouser home page
app.get("/", (req, res) => {
  res.json("Hello from my backend");
});

//sending data to a database, POST1
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  //for generating unique user id
  const generatedUserId = uuidv4();
  //for hashing password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  ///sending over to database
  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");
    //check if user already exists
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    }
    // sanitize and make sure email just with lower letters
    const sanitizedEmail = email.toLowerCase();
    //this is wil sended to the database
    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };
    //and safe in mongodb one new
    const insertedUser = await users.insertOne(data);

    //generated a token  with json webtoken pakage
    const token = jwt.sign(insertedUser, sanitizedEmail, {
      //token will expire in 24 hours
      expiresIn: 60 * 24,
    });
    res.status(201).json({ token, userId: generatedUserId });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");

    //find the user with uniq email exists
    const user = await users.findOne({ email });

    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );
    //console.log("email");
    // if this email and password( thrue hasshed password) is correct
    if (user && correctPassword) {
      //then create tocen ones again
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, userId: user.user_id });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  // console.log('userId', userId)

  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);
    //console.log(user);
    res.send(user);
  } finally {
    //close for client after visit
    await client.close();
  }
});
//query retyrning all identificated users who maches with logged user
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);
  //in console array [] with matched users id
  //console.log(userIds);

  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");

    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    //after pipline multiple users turn to array
    const foundUsers = await users.aggregate(pipeline).toArray();
    //console.log(foundUsers);
    //get users back into frontend
    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

// query returning all users  from mongodb to localhost:8000/users
app.get("/identified-users", async (req, res) => {
  const client = new MongoClient(uri);
  const ident = req.query.ident;

  //console.log("ident", ident);

  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");
    //ident 'volunteer'
    const query = { identity: { $eq: "volunteer" } };
    const foundUsers = await users.find(query).toArray();

    res.send(foundUsers);
  } finally {
    //close for client after visit
    await client.close();
  }
});

//Method Put for updating user
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_identity: formData.show_identity,
        identity: formData.identity,
        interest: formData.interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
      },
    };
    const insertedUser = await users.updateOne(query, updateDocument);
    res.send(insertedUser);
  } finally {
    await client.close();
  }
});

app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("good_data");
    const users = database.collection("users");
    // user who is sing in
    const query = { user_id: userId };
    const updateDocument = {
      //update mathces by pushing user id
      $push: { matches: { user_id: matchedUserId } },
    };
    const user = await users.updateOne(query, updateDocument);
    res.send(user);
  } finally {
    await client.close();
  }
});

app.get("/messages", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, correspondingUserId } = req.query;
  //console.log(userId.correspondingUserId);
  try {
    await client.connect();
    const database = client.db("good_data");
    const messages = database.collection("messages");

    //query for serching into a message collection looking for any logged user id o corresponding(clicked) user id
    const query = {
      from_userId: userId,
      to_userId: correspondingUserId,
    };
    //await for messages
    const foundMessages = await messages.find(query).toArray();
    //and resend found messages
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("good_data");
    const messages = database.collection("messages");
    const insertedMessages = await messages.insertOne(message);
    res.send(insertedMessages);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log("Server running on PORT " + PORT));
