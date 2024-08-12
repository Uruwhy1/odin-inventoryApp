const pool = require("../db/index");

exports.listCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.render("categories", { title: "Categories", categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.listBooksByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryResult = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    if (categoryResult.rows.length === 0) {
      return res.status(404).send("Category not found");
    }

    const category = categoryResult.rows[0];
    const booksResult = await pool.query(
      "SELECT * FROM books WHERE category_id = $1",
      [id]
    );

    res.render("categoryBooks", {
      title: `Books in ${category.name}`,
      category: category,
      books: booksResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books by category" });
  }
};

exports.createCategoryForm = (req, res) => {
  res.render("newCategory", { title: "New Category" });
};

exports.createCategory = async (req, res) => {
  const { name, image_url } = req.body;
  try {
    await pool.query("INSERT INTO categories (name, image_url) VALUES ($1, $2)", [name, image_url]);
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.editCategoryForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    res.render("editCategory", {
      title: "Edit Category",
      category: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

exports.editCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image_url } = req.body;
  try {
    await pool.query("UPDATE categories SET name = $1, image_url = $2 WHERE id = $3", [
      name,
      image_url,
      id,
    ]);
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // find or create the "no category" entry
    const noCategoryResult = await pool.query(
      "SELECT id FROM categories WHERE name = $1",
      ["No Category"]
    );

    let noCategoryId;

    if (noCategoryResult.rows.length === 0) {
      const newNoCategory = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        ["No Category"]
      );
      noCategoryId = newNoCategory.rows[0].id;
    } else {
      noCategoryId = noCategoryResult.rows[0].id;
    }

    // update books to 'no category' and delete category
    await pool.query(
      "UPDATE books SET category_id = $1 WHERE category_id = $2",
      [noCategoryId, id]
    );
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);

    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
