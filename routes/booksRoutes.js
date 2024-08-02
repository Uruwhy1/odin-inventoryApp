const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

router.get("/", booksController.getAllBooks);

router.get("/new", booksController.newBookForm);
router.post("/new", booksController.createBook);

router.get("/:id/edit", booksController.editBookForm);
router.post("/:id/edit", booksController.updateBook);
router.post("/:id/delete", booksController.deleteBook);

module.exports = router;
