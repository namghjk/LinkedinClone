const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://namsgu123:09072001@cluster0.gplygt6.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting MongoDB", err);
  });

app.listen(port, () => {
  console.log("server is running on port: 8000");
});

const User = require("../api/models/user");
const Post = require("../api/models/post");

//endpoint to register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    //Check exsiting user
    const exsitingUser = await User.findOne({ email: email });
    if (exsitingUser) {
      console.log("User already registered");
      res.status(400).json({ message: "User already registered" });
    }

    //create new User
    const newUser = new User({
      name,
      email,
      password,
      image,
    });

    //generate the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    newUser.save();

    //send the verification mail to the user
    sendVerificationMail(newUser.email, newUser.verificationToken);

    res.status(202).json({
      message:
        "Registration successful, please check your mail for verification",
    });
  } catch (error) {
    console.log("Error registering");
    res.status(500).json({ message: "Registration failed", error: error });
  }
});

const sendVerificationMail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "namjoker456@gmail.com",
      pass: "pxyu bnjn toky rbuc",
    },
  });

  const mailOptions = {
    from: "Linkedin.com",
    to: email,
    subject: "Email verification",
    text: `please click the verification link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error to send verification email", error);
  }
};

//endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    //Check exsiting the token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //mark the user as verified
    user.verified = true;
    user.verficationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed " });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed" });
  }
});

//generate the secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//user'profile
app.get("/profile/:userId").then(async (req, res) => {
  try {
    const userId = req.param.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});

//users connected with user login
app.get("/users/:userId").then(async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    //fetch the logged user connections
    const loggedInUser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not found" });
    }

    //get the ID of connected user
    const connectedUserIds = loggedInUser.connections.map(
      (connection) => connection.id
    );

    //find the users who r not connected to the logged user id
    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUserIds },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error retrieving users", error);
    res.status(500).json({ message: "Error retrieving users", error });
  }
});
