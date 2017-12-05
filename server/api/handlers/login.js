const Boom = require('boom');
const Joi = require('joi');
const jsonwebtoken = require('jsonwebtoken');
const UsersModel = require('../../models/users').UsersModel;
const config = require('../../config/secret');

const getToken = function getToken(username, role) {
  return (0, jsonwebtoken.sign)({ username: username, role: role }, config, { expiresIn: '2h' });
};

exports.login = {
  login: {
    tags: ['api'],
    validate: {
      payload: {
        name: Joi.string(),
        password: Joi.string(),
      },
    },
    handler: (request, reply) => {
      const { name, password } = request.payload;
      try {
        UsersModel.findOne({ name: name, passwd: password })
          .then((doc) => {
            reply({ doc, token: getToken(name, doc.role) }).code(200);
          });
      } catch (e) {
        request.log.error(e);
        reply(Boom.notFound(e.message));
      }
    }
  }
};
