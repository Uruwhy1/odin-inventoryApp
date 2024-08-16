const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
require("dotenv").config();

const { createTables, insertBooksIfEmpty } = require("./db/init");

const booksRoutes = require("./routes/booksRoutes");
const authorsRoutes = require("./routes/authorsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const pool = require("./db/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const categoriesResult = await pool.query(
      "SELECT * FROM categories LIMIT 7"
    );
    const authorsResult = await pool.query("SELECT * FROM authors LIMIT 7");
    res.render("home", {
      title: "Homepage",
      categories: categoriesResult.rows,
      authors: authorsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching catgories and authors:", err.stack);
    res.status(500).send("Error fetching catgories and authors");
  }
});

app.post("/insert", async (req, res) => {
  try {
    await insertBooksIfEmpty();
    res.redirect("/books");
  } catch (err) {
    console.error("Error inserting books:", err.stack);
    res.status(500).send("Error inserting books.");
  }
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
