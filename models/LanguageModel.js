const mongoose = require('mongoose');

const { Schema } = mongoose;
const languageSchema = new Schema({
  name: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true, collation: { locale: 'en_US', strength: 1 } });

module.exports = mongoose.model('Language', languageSchema);
