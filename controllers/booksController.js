const pool = require("../db/index");

exports.getAllBooks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT books.id, books.title, books.description, books.image_url, authors.name AS author_name
      FROM books
      JOIN authors ON books.author_id = authors.id
    `);
    res.render("books", { title: "Books", books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

exports.newBookForm = async (req, res) => {
  try {
    const authorsResult = await pool.query("SELECT id, name FROM authors");
    const categoriesResult = await pool.query(
      "SELECT id, name FROM categories"
    );
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
  const { title, description, author_id, category_id, image_url } = req.body;


  try {
    const result = await pool.query(
      "INSERT INTO books (title, description, author_id, category_id, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, author_id, category_id, image_url]
    );

    res.redirect("/books");
  } catch (err) {
    console.error("Error adding new book:", err.stack);
    res.status(500).send("Error adding new book");
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

    const authorsResult = await pool.query("SELECT * FROM authors");
    const categoriesResult = await pool.query("SELECT * FROM categories");

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
  const { title, description, author_id, category_id, image_url } = req.body;

  try {
    await pool.query(
      "UPDATE books SET title = $1, description = $2, author_id = $3, category_id = $4, image_url = $5 WHERE id = $6",
      [title, description, author_id, category_id, image_url, id]
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
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const bookResult = await pool.query(
      ` SELECT 
        books.id, 
        books.title, 
        books.description, 
        books.image_url, 
        authors.name AS author_name, 
        categories.name AS category_name
      FROM 
        books
      JOIN 
        authors ON books.author_id = authors.id
      JOIN 
        categories ON books.category_id = categories.id
      WHERE 
        books.id = $1;
    `,
      [id]
    );
    if (bookResult.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = bookResult.rows[0];

    res.render("individualBook", {
      book,
      image: book.image_url,
      title: book.title,
      description: book.description.split("\\n"),
      author: book.author_name,
      category: book.category_name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book details" });
  }
};
