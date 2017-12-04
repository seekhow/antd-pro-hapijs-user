const mongoose = require('mongoose');

exports.UsersModel = mongoose.model(
  'Users',
  new mongoose.Schema({
    name: { type: String, default: '' },
    passwd: { type: String, default: '' },
    tags: { type: Array, default: [] },
    update: { type: Date, default: Date.now },
  })
);
