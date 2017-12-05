const mongoose = require('mongoose');

exports.UsersModel = mongoose.model(
  'Users',
  new mongoose.Schema({
    name: { type: String, default: '' },
    passwd: { type: String, default: ''},
    role: { type: Number, default: 1 },
    description: { type: String, default: '该用户暂时没有添加描述' },
    group: { type: String, default: '' },
    update: { type: Date, default: Date.now },
  })
);
