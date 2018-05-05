const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongooseAlgolia = require('mongoose-algolia');

const ItemSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  title: String,
  image: String,
  description: String,
  created: { type: Date, default: Date.now },
});

ItemSchema.plugin(mongooseAlgolia, {
  appId: 'EKCTT87239',
  apiKey: 'ad656ee62527848cbc0287fa2053e6e9',
  indexName: 'wastenot',
  selector: '_id title image description created',
  mappings: {
    title: function(value) {
      return `${value}`
    }
  },
  debug: true
});

let Model =  mongoose.model('Item', ItemSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ['title']
});
module.exports = Model
