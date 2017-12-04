const mongoose = require('mongoose');

exports.register = (server, options, next) => {
  mongoose.Promise = Promise;
  mongoose.connect(options.url);
  next();
};

exports.register.attributes = {
  name: 'mongodbPlugin',
};

