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
    text: `please click the verification link to verify your email: http://localhost/8000/${verificationToken}`,
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
app.get("/verify/:toker", async (req, res) => {
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
