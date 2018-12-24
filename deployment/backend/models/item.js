const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ItemSchema = new Schema({
  bin: { type: Schema.Types.ObjectId, ref: 'Bin' },
  type: { type: Schema.Types.ObjectId, ref: 'Type' },
  title: String,
  image: String,
  description: String,
  tipCompostWrong: { type: String, default: undefined },
  tipRecycleWrong: { type: String, default: undefined },
  tipLandfillWrong: { type: String, default: undefined },
  correctAnswerFeedback: { type: String, default: undefined },
  isCompostAndLandfill: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});



let Model = mongoose.model('Item', ItemSchema);

module.exports = Model;