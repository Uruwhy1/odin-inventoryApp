const pool = require("../db/index");

exports.getAllBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.render("books", { title: "Books", books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

exports.newBookForm = async (req, res) => {
  try {
    const authorsResult = await pool.query("SELECT name FROM authors");
    const categoriesResult = await pool.query("SELECT name FROM categories");
    res.render("newBook", {
      title: "Add Book",
      authors: authorsResult.rows,
      categories: categoriesResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch authors and categories" });
  }
};

exports.createBook = async (req, res) => {
  const { title, description, author_name, category_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO books (title, description, author_name, category_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, author_name, category_name]
    );
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add book" });
  }
};

exports.editBookForm = async (req, res) => {
  const { id } = req.params;
  try {
    const bookResult = await pool.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);
    if (bookResult.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = bookResult.rows[0];

    const authorsResult = await pool.query("SELECT name FROM authors");
    const categoriesResult = await pool.query("SELECT name FROM categories");

    res.render("editBook", {
      book,
      title: "Edit Book",
      authors: authorsResult.rows,
      categories: categoriesResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book details" });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, description, author_name, category_name } = req.body;

  try {
    await pool.query(
      "UPDATE books SET title = $1, description = $2, author_name = $3, category_name = $4 WHERE id = $5",
      [title, description, author_name, category_name, id]
    );

    res.redirect(`/books`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update book" });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

exports.getBookById = async (req, res) => {};
