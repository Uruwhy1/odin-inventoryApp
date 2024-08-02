const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

router.get("/new", categoriesController.createCategoryForm);
router.post("/new", categoriesController.createCategory);

router.get("/", categoriesController.listCategories);
router.get("/:id", categoriesController.listBooksByCategory);

router.get("/:id/edit", categoriesController.editCategoryForm);
router.post("/:id/edit", categoriesController.editCategory);
router.post("/:id/delete", categoriesController.deleteCategory);

module.exports = router;
