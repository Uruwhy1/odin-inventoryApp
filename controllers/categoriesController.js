const pool = require('../db/index');

exports.listCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.render('categories', { categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.listBooksByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryResult = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (categoryResult.rows.length === 0) {
      return res.status(404).send('Category not found');
    }
    const booksResult = await pool.query('SELECT * FROM books WHERE category_id = $1', [id]);
    res.render('categoryBooks', {
      category: categoryResult.rows[0],
      books: booksResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books by category' });
  }
};

exports.createCategoryForm = (req, res) => {
  res.render('newCategory');
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.editCategoryForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Category not found');
    }
    res.render('editCategory', { category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

exports.editCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await pool.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
