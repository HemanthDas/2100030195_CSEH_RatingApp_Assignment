const express = require("express");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/stores", storeRoutes);
const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Database sync failed", error);
  });

app.get("/", (req, res) => {
  res.send("Server Running");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
