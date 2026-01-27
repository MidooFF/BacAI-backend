require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const path = require("path");

const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");

const { logger } = require("./middleware/logEvents.js");
const errorLogger = require("./middleware/errorLog.js");
const verifyJWT = require("./middleware/verifyJWT.js");

connectDB();

app.use(cors(corsOptions));

app.use(credentials);

app.use(logger);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

app.use("/register", require("./routes/register.js"));
app.use("/auth", require("./routes/auth.js"));
app.use("/logout", require("./routes/logout.js"));
app.use("/refresh", require("./routes/refresh.js"));
app.use("/forgot-password", require("./routes/forgot-password.js"));
app.use("/verify-reset-code", require("./routes/verify-reset-code.js"));
app.use("/reset-password", require("./routes/reset-password.js"));

app.use(verifyJWT);

app.get("/is-auth", (req, res) => {
  res.json({ username: req.user });
});

app.use(errorLogger);

app.use((req, res) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 page not found" });
  } else {
    res.type("text").send("404 page not found");
  }
});

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => {
    console.log("server running on port " + PORT);
  });
});
