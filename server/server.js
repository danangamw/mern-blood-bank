require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./config/dbConfig");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const userRoute = require("./routes/user_route");
const inventoryRoute = require("./routes/inventory_route");

app.use("/api/users", userRoute);
app.use("/api/inventory", inventoryRoute);

const start = async () => {
  try {
    await connectDB(process.env.mongo_url);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
