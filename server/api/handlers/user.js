const Boom = require('boom');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const UsersModel = require('../../models/users').UsersModel;
const config = require('../../config/secret');

const praseToken = (token) => {
  console.log(token);
  const jwtToken = jwt.verify(token, config);
  return { username: jwtToken.username, role: jwtToken.role };
};

exports.user = {
  list: {
    tags: ['api'],
    handler: (request, reply) => {
      const token = request.headers.authorization;
      let userRole = praseToken(token).role;
      const isAll = request.query.all || 'true';
      if (isAll === 'false') {
        userRole = request.query.queryRole;
      }
      UsersModel.find({ role: isAll === 'true' ? { $lte: userRole } : userRole })
        .then((doc) => {
          reply(doc);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.notFound(e.message));
        });
    },
  },
  get: {
    tags: ['api'],
    validate: {
    },
    handler: (request, reply) => {
      const { _id, name } = request.query;
      let q;
      if (_id) {
        q = { _id: _id };
      }
      if (name) {
        q = { name: name };
      }
      UsersModel.findOne(q)
        .then((doc) => {
          reply(doc);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.notFound(e.message));
        });
    },
  },
  create: {
    tags: ['api'],
    validate: {
      payload: {
        name: Joi.string(),
        passwd: Joi.string(),
        group: Joi.string(),
        role: Joi.number(),
        description: Joi.string(),
      },
    },
    handler: (request, reply) => {
      const { payload: { name, passwd, role, group, description } } = request;
      const token = request.headers.authorization;
      const userRole = praseToken(token).role;
      if (userRole <= role) {
        reply('permission denied,token error!');
        return null;
      }
      const list = new UsersModel({ name, passwd, role, group, description });
      list.save()
        .then((doc) => {
          reply(doc).code(201);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.badRequest(e.message));
        });
      return null;
    },
  },
  update: {
    tags: ['api'],
    validate: {
      params: {
        id: Joi.string(),
      },
    },
    handler: (request, reply) => {
      const { id } = request.params;
      const { name, passwd, role, group, description } = request.payload;
      const token = request.headers.authorization;
      const userRole = praseToken(token).role;
      if (role && userRole < role) {
        reply('permission denied,token error!');
        return null;
      }
      UsersModel.where({ _id: id })
        .update({ name, passwd, group, description, role })
        .then((doc) => {
          reply(doc).code(200);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.badRequest(e.message));
        });
      return null;
    },
  },
  destroy: {
    tags: ['api'],
    validate: {
      params: {
        id: Joi.string(),
      },
    },
    handler: (request, reply) => {
      const { id } = request.params;
      const token = request.headers.authorization;
      const userRole = praseToken(token).role;
      UsersModel.where({ _id: id })
        .then((doc) => {
          if (doc && userRole <= doc.role) {
            reply('permission denied,token error!');
            return null;
          }
          UsersModel.remove({ _id: id })
            .then((doc2) => {
              reply(doc2).code(204);
            })
            .catch((e) => {
              request.log.error(e);
              reply(Boom.badRequest(e.message));
            });
          return null;
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.badRequest(e.message));
        });
    },
  },
};