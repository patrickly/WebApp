const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const mongooseAlgolia = require('mongoose-algolia');

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

/*
ItemSchema.plugin(mongooseAlgolia, {
  appId: 'PHBBHP1WCG',
  apiKey: '80528809550065a09f7443b98c55ad44',
  indexName: 'wastenot',
  selector: '_id title image description created',
  mappings: {
    title: function(value) {
      return `${value}`;
    }
  },
  debug: true
});

*/

let Model = mongoose.model('Item', ItemSchema);
/*
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ['title']
});
*/
module.exports = Model;
