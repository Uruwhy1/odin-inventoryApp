const pool = require('../db/index');

exports.listAuthors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors');
    res.render('authors', { authors: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
};

exports.listBooksByAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const authorResult = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    if (authorResult.rows.length === 0) {
      return res.status(404).send('Author not found');
    }
    const booksResult = await pool.query('SELECT * FROM books WHERE author_name = $1', [authorResult.rows[0].name]);
    res.render('authorBooks', { author: authorResult.rows[0], books: booksResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books by author' });
  }
};

exports.editAuthorForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Author not found');
    }
    res.render('editAuthor', { author: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch author' });
  }
};

exports.updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query('UPDATE authors SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Author not found');
    }
    res.redirect(`/authors/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update author' });
  }
};

exports.deleteAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Author not found');
    }
    res.redirect('/authors');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete author' });
  }
};
