const express = require('express');
const {
  createQuote,
  getQuotes,
  updateQuote,
  deleteQuote,
} = require('../controllers/quoteController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createQuote)
  .get(protect, getQuotes);

router.route('/:id')
  .put(protect, updateQuote)
  .delete(protect, deleteQuote);

module.exports = router;
