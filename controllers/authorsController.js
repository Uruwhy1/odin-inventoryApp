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

    res.render("individualAuthor", {
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
  const { name, image_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO authors (name, image_url) VALUES ($1, $2)",
      [name, image_url]
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
  const { name, image_url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE authors SET name = $1, image_url = $2 WHERE id = $3",
      [name, image_url, id]
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
    // find or create the "no category" entry
    const noAuthorResult = await pool.query(
      "SELECT id FROM authors WHERE name = $1",
      ["No Author"]
    );

    let noAuthorId;

    if (noAuthorResult.rows.length === 0) {
      const newNoCategory = await pool.query(
        "INSERT INTO authors (name) VALUES ($1) RETURNING id",
        ["No Author"]
      );
      noAuthorId = newNoCategory.rows[0].id;
    } else {
      noAuthorId = noAuthorResult.rows[0].id;
    }

    // update books to 'no category' and delete category
    await pool.query(
      "UPDATE books SET author_id = $1 WHERE author_id = $2",
      [noAuthorId, id]
    );
    await pool.query("DELETE FROM authors WHERE id = $1", [id]);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete author" });
  }
};
