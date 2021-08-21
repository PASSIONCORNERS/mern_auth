const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

// db
mongoose.connect(
  process.env.MONGO_URL,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("db connected");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
  }
);

// mw
app.use(express.json());
express.urlencoded({ extended: true });
app.use(cookieParser());
// app.use(cors());
app.use(morgan("tiny"));
app.use("/uploads", express.static("uploads")); // use uploads folder to save image

// routes
// routes order has to be correct when require in
app.use(userRoute);
app.use(uploadRoute);
