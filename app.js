
const connection = require("./Config/db")
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();


const UserModel = require("./Models/User.model");
const TicketRoute = require("./routes/ticket.routres")

const app = express();
app.use(express.json());
app.use(cors());



app.get("/", (req, res) => {
  res.send("Welcome to Homepage");
});

//SignUp User

app.post("/signup", async (req, res) => {
  const {email, password,username } = req.body;
  const isUser = await UserModel.findOne({ email });
  // res.send(req.body)
  if (isUser) {
    res.send({ msg: "Users already exists!!" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went! wrong please try again " });
      }
      const new_user = new UserModel({username,email, password: hash });
      try {
        await new_user.save();
        res.send({ msg: "Signup Successfull" });
      } catch (error) {
        res.send({ msg: "Something went wrong" });
      }
    })
  }
});

//Login User

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hashed_pass = user.password;
  const user_id = user._id;
  console.log(user._id)
  bcrypt.compare(password, hashed_pass, function (err, result) {
    if (err) {
      res.send({ msg: "Something went wrong" });
    }
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      res.send({ msg: "login successfull", token });
    } else {
      res.send({ msg: "login failed,try again" });
    }
  });
});

//Connection

app.use("/ticket",TicketRoute)
app.listen(process.env.PORT || 8000, async (req, res) => {
  try {
    await connection;
    console.log("connection successfull");
  } catch (error) {
    console.log("connection to database failed");
    console.log(error);
  }
  console.log(`listening on port ${process.env.PORT}`);
});
