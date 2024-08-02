const express = require("express");
const path = require("path");
require("dotenv").config();
const createTables = require("./db/init");

const booksRoutes = require("./routes/booksRoutes");
const authorsRoutes = require("./routes/authorsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/books", booksRoutes);
app.use("/authors", authorsRoutes);
app.use("/categories", categoriesRoutes);

createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing database:", err.stack);
  });
