const Quote = require('../models/Quote');

const createQuote = async (req, res) => {
  const { quote, author, tags } = req.body;
  const newQuote = await Quote.create({
    quote,
    author,
    tags,
    createdBy: req.user._id,
  });
  res.status(201).json(newQuote);
};

const getQuotes = async (req, res) => {
  const { author, search, tags } = req.query;
  let filter = { createdBy: req.user._id };

  if (author) {
    filter.author = new RegExp(author, 'i');
  }

  if (search) {
    filter.quote = new RegExp(search, 'i');
  }

  if (tags) {
    const tagsArray = tags.split(',').map((tag) => tag.trim());
    filter.tags = { $in: tagsArray };
  }

  const quotes = await Quote.find(filter).sort({ createdAt: -1 });
  res.json(quotes);
};

const updateQuote = async (req, res) => {
  const quote = await Quote.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!quote) {
    res.status(404);
    throw new Error('Quote not found');
  }

  const { quote: newText, author, tags } = req.body;
  if (newText !== undefined) quote.quote = newText;
  if (author !== undefined) quote.author = author;
  if (tags !== undefined) quote.tags = tags;

  const updated = await quote.save();
  res.json(updated);
};

const deleteQuote = async (req, res) => {
  const quote = await Quote.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!quote) {
    res.status(404);
    throw new Error('Quote not found or not authorized');
  }

  res.json({ message: 'Quote deleted' });
};

module.exports = {
  createQuote,
  getQuotes,
  updateQuote,
  deleteQuote,
};
