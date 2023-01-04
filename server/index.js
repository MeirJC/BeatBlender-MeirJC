const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoutes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const app = express();

const PORT = 4000 || process.env.PORT;
mongoose.set("strictQuery", false);

mongoose
  .connect(
    `mongodb+srv://${process.env.USERDB}:${process.env.PASSDB}@cluster0.s1qgqvo.mongodb.net/?retryWrites=true&w=majority`,
    {}
  )
  .then(() => {
    console.log(
      "mongoose: index.js: DB connection successfull, Connected to database"
    );
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const publicPath = path.join(__dirname, "build");
app.use(express.static(publicPath));

app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);

app.get("*", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully.");
  }
});
