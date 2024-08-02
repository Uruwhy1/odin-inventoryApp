const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');


router.get('/', authorsController.listAuthors);
router.get('/new', authorsController.createAuthorForm);
router.post('/new', authorsController.createAuthor);
router.get('/:id', authorsController.listBooksByAuthor);
router.get('/:id/edit', authorsController.editAuthorForm);
router.post('/:id/edit', authorsController.updateAuthor);
router.post('/:id/delete', authorsController.deleteAuthor);


module.exports = router;
