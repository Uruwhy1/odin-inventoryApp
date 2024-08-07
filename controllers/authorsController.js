const pool = require("../db/index");

exports.listAuthors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM authors");
    res.render("authors", { title: "Authors", authors: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
};

exports.listBooksByAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const authorResult = await pool.query(
      "SELECT * FROM authors WHERE id = $1",
      [id]
    );
    if (authorResult.rows.length === 0) {
      return res.status(404).send("Author not found");
    }

    const author = authorResult.rows[0];
    const booksResult = await pool.query(
      "SELECT * FROM books WHERE author_id = $1",
      [id]
    );

    res.render("authorBooks", {
      author: author,
      books: booksResult.rows,
      title: `Books by ${author.name}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books by author" });
  }
};

exports.createAuthorForm = (req, res) => {
  res.render("newAuthor", { title: "Create New Author" });
};

exports.createAuthor = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO authors (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.redirect("/authors");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create author" });
  }
};

exports.editAuthorForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM authors WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Author not found");
    }

    res.render("editAuthor", {
      author: result.rows[0],
      title: `Edit ${result.rows[0].name}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch author" });
  }
};

exports.updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE authors SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Author not found");
    }
    res.redirect(`/authors/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update author" });
  }
};

exports.deleteAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Author not found");
    }
    res.redirect("/authors");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete author" });
  }
};
