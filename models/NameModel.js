const mongoose = require('mongoose');

const { Schema } = mongoose;
const nameSchema = new Schema({

  name: String,
  meaning: String,
  views: {
    type: Number,
    default: 0,
  },
  similar_names: String,
  gender: {
    type: String,
    enum: ['male', 'female', ''],
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'removed'],
    default: 'active',
  },
  categories: {
    type: Array,
    default: [],
  },
  languages: [
    {
      language_id: {
        type: Schema.ObjectId,
        ref: 'Language',
      },
      word: {
        type: String,
        default: null,
      },
    },
  ],
}, { timestamps: true, collation: { locale: 'en_US', strength: 1 } });

module.exports = mongoose.model('Name', nameSchema);