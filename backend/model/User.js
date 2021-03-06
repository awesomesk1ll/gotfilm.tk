const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  wishlist: { type: Array },
  blacklist: { type: Array },
  partFilms: { type: Array },
});

module.exports = model('User', schema);
