const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  passwordResetRequestTime: Date,
  passwordResetToken: String,
  type: {
    type: String,
    enum: ['super_admin'],
    default: 'super_admin',
  },
  avatar: String,
  tokens:[{
    token:{
      type:String,
      required: true
    }
  }],
}, { timestamps: true, collation: { locale: 'en_US', strength: 1 } });

module.exports = mongoose.model('User', userSchema);
