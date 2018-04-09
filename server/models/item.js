const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({

  description: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
