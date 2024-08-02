// app.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const createTables = require("./db/init");

const booksRoutes = require("./routes/booksRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const authorsRoutes = require("./routes/authorsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/books", booksRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing database:", err.stack);
  });
