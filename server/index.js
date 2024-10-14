// const PORT = 8080;
const PORT = process.env.PORT || 8080;
const express = require("express");
//for Mongo connection
const { MongoClient, ObjectId } = require("mongodb");
//for generating unique user id
const { v4: uuidv4 } = require("uuid");
//for generating unique web token
const jwt = require("jsonwebtoken");

const cors = require("cors");

//middleware
const morgan = require("morgan");
const helmet = require("helmet");

//for hashing password
const bcrypt = require("bcrypt");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const session = require("express-session");

// for allowed IP adress
// const ipfilter = require("express-ipfilter").IpFilter;

// for allowed IP adress
// const ips = ["::1", "172.20.10.12"];

// for allowed IP adress
// app.use(ipfilter(ips, { mode: "allow" }));

const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo"))
  .catch(console.log);

// for reading json
const app = express();

//ratelimit
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 500, // 24 hours
  max: 500, // Limit each IP to 100 requests per `window` (here, per 24 hours)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const e = require("express");

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

const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://dogood-done.herokuapp.com",
    "https://dogood-done-admin.herokuapp.com",
  ],
  // origin: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(helmet());
app.use(cookieParser());

morgan.token("session", (req, res) => {
  return req.cookies.AuthToken?.substring(0, 20) ?? "No Session";
});

// app.use(morgan(":remote-addr :session :date[iso] :method :url"));
app.use(morgan("combined"));

//pass the data from the backend to the frontend
//sending json to the brouser home page
app.get("/", (req, res, next) => {
  req.session.views = (req.session.views || 0) + 1;
  res.json(req.session.views + "views");
});

app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    if (req.body.email === "" || req.body.password === "") {
      res.status(400).send("Missing Email or Password");
    }
  } catch {
    res.status(400).send("Unknown error");
  }
  //console.log(req.body);
  const { email, password } = req.body;
  //for generating unique user id
  const generatedUserId = uuidv4();
  //for hashing password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  ///sending over to database
  try {
    await client.connect();
    const database = client.db("app-data");
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
    const database = client.db("app-data");
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
      //then create token ones again
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, userId: user.user_id });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

//sending data to a database, POST1
app.post("/signupadmin", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  //for generating unique user id
  const generatedAdminId = uuidv4();
  //for hashing password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  ///sending over to database
  try {
    await client.connect();
    const database = client.db("app-data");
    const admins = database.collection("admins");
    //check if user already exists
    const existingAdmin = await admins.findOne({ email });

    if (existingAdmin) {
      return res.status(409).send("Admin already exists. Please login");
    }
    // sanitize and make sure email just with lower letters
    const sanitizedEmail = email.toLowerCase();
    //this is will sent to the database
    const data = {
      admin_id: generatedAdminId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };
    //and safe in mongodb one new
    const insertedAdmin = await admins.insertOne(data);

    //generated a token  with json webtoken pakage
    const token = jwt.sign(insertedAdmin, sanitizedEmail, {
      //token will expire in 24 hours
      expiresIn: 60 * 24,
    });
    res.status(201).json({ token, adminId: generatedAdminId });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

app.post("/new_user", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    if (req.body.email === "" || req.body.password === "") {
      res.status(400).send("Missing Email or Password");
    }
  } catch {
    res.status(400).send("Unknown error");
  }
  //console.log(req.body);
  const { email, password } = req.body;
  //for generating unique user id
  const generatedUserId = uuidv4();
  //for hashing password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  ///sending over to database
  try {
    await client.connect();
    const database = client.db("app-data");
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

    res.status(201).json({ userId: generatedUserId });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

app.post("/loginadmin", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const admins = database.collection("admins");

    //find the user with uniq email exists
    const admin = await admins.findOne({ email });

    const correctPassword = await bcrypt.compare(
      password,
      admin.hashed_password
    );
    //console.log("email");
    // if this email and password( thrue hasshed password) is correct
    if (admin && correctPassword) {
      //then create token ones again
      const token = jwt.sign(admin, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, adminId: admin.admin_id });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    console.error("Invalid Credentials");
  } finally {
    await client.close();
  }
});

//query retyrning logged users for client side by Id
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  // console.log('userId', userId)

  try {
    await client.connect();
    const database = client.db("app-data");
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

//query retyrning all identificated users who maches with logged user for client side
app.get("/users", async (req, res) => {
  //console.log("Get users request received");
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);
  //in console array [] with matched users id
  //console.log(userIds);

  try {
    await client.connect();
    const database = client.db("app-data");
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
    const database = client.db("app-data");
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

// query returning user by _id ObjeciID for admin panel
app.get("/user/:userId", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  // console.log('userId', userId)
  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = { _id: ObjectId(userId) };
    // console.log(query);
    const user = await users.findOne(query);
    // console.log(user);
    res.send(user);
  } finally {
    //close for client after visit
    await client.close();
  }
});
// query returning user by _id ObjeciID for admin panel
app.post("/user/:userId", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  // console.log('userId', userId)
  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = { _id: ObjectId(userId) };
    // console.log(query);
    const user = await users.findOne(query);
    // console.log(user);
    res.send(user);
  } finally {
    //close for client after visit
    await client.close();
  }
});

// query returning all users for admin panel
app.get("/all-users", async (req, res) => {
  const client = new MongoClient(uri);
  const allusers = req.query.allusers;

  //console.log("ident", ident);

  try {
    await client.connect();
    const database = client.db("app-data");
    const allusers = database.collection("users");
    const query = {};
    const foundAllusers = await allusers.find(query).toArray();

    res.send(foundAllusers);
  } finally {
    //close for client after visit
    await client.close();
  }
});

app.get("/all-messages", async (req, res) => {
  const client = new MongoClient(uri);
  const allmessages = req.query.allmessages;

  //console.log("ident", ident);

  try {
    await client.connect();
    const database = client.db("app-data");
    const allmessages = database.collection("messages");
    const query = {};
    const foundAllmessages = await allmessages.find(query).toArray();

    res.send(foundAllmessages);
  } finally {
    //close for client after visit
    await client.close();
  }
});

//sending data to a database, POST1
app.post("/useradmin", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  //for generating unique user id
  const generatedUserId = uuidv4();
  //for hashing password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  ///sending over to database
  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    //check if user already exists
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists.");
    }
    // sanitize and make sure email just with lower letters
    const sanitizedEmail = email.toLowerCase();
    //this is wil sended to the database
    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
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

//Method Put for updating user
app.put("/user", async (req, res) => {
  //console.log("User Put request made");
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    if (
      (formData.first_name != "", formData.identity != "", formData.about != "")
    ) {
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
          timestamp: new Date().toISOString(),
        },
      };
      const insertedUser = await users.updateOne(query, updateDocument);
      res.send(insertedUser);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } finally {
    await client.close();
  }
});

//Method Put for updating useradmond for admin
app.put("/useradmond", async (req, res) => {
  //console.log("User Put request made");
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    if ((formData.first_name != "", formData.identity != "")) {
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
          timestamp: new Date().toISOString(),
        },
      };

      const insertedUser = await users.updateOne(query, updateDocument);
      res.send(insertedUser);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } finally {
    await client.close();
  }
});

app.put("/addmatch", async (req, res) => {
  console.log("Add match put received");
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
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
    const database = client.db("app-data");
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
    const database = client.db("app-data");
    const messages = database.collection("messages");
    const insertedMessages = await messages.insertOne(message);
    res.send(insertedMessages);
  } finally {
    await client.close();
  }
});

app.post("/messageadmin", async (req, res) => {
  const client = new MongoClient(uri);
  const { timestamp, from_userId, to_userId, message } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");
    const data = {
      timestamp: new Date().toISOString(),
      from_userId: from_userId,
      to_userId: to_userId,
      message: message,
    };
    const insertedMessages = await messages.insertOne(data);
    res.status(201).json({ message });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// query returning user by _id ObjeciID for admin panel
app.get("/message/:messageId", async (req, res) => {
  const client = new MongoClient(uri);
  const messageId = req.params.messageId;
  // console.log('messageId', messageId)
  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");
    const query = { _id: ObjectId(messageId) };
    // console.log(query);
    const message = await messages.findOne(query);
    // console.log(user);
    res.send(message);
  } finally {
    //close for client after visit
    await client.close();
  }
});

//for admin
app.patch("/message/:messageId", async (req, res) => {
  const client = new MongoClient(uri);
  const messageId = req.params.messageId;
  //console.log("messageId", messageId);
  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const fields = JSON.parse(req.body.messageData);
    //console.log(fields.about);
    const message = await messages.findOneAndUpdate(
      { _id: ObjectId(messageId) },
      {
        $set: {
          message: fields.message,
        },
      }
    );

    res.send(message);
  } finally {
    await client.close();
  }
});
// delete message for admin panel
app.delete("/message/:messageId", async (req, res) => {
  const client = new MongoClient(uri);
  const messageId = req.params.messageId;
  //console.log("messageId", messageId);
  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");
    const query = { _id: ObjectId(messageId) };
    const deleteMessage = await messages.deleteOne(query);
    res.send(deleteMessage);
  } finally {
    await client.close();
  }
});

// delete user
app.delete("/user/:userId", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  //console.log("userId", userId);
  try {
    await client.connect();
    const database = client.db("app-data");
    const user = database.collection("users");
    const query = { _id: ObjectId(userId) };
    const deleteUser = await user.deleteOne(query);
    //console.log(deleteUser);
    res.send(deleteUser);
  } finally {
    await client.close();
  }
});

//update user for admin
app.patch("/user/:userId", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    //const query = { _id: ObjectId(userId) };
    // console.log(query);

    const fields = JSON.parse(req.body.userData);
    // console.log(fields.about);
    const user = await users.findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          first_name: fields.first_name,
          identity: fields.identity,
          about: fields.about,
          url: fields.url,
        },
      }
    );

    //const user = await users.updateOne(query);
    res.send(user);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log("Server running on PORT " + PORT));
