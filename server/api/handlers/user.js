const Boom =require('boom');
const Joi = require('joi');

const UsersModel = require('../../models/users').UsersModel;

exports.user = {
  list: {
    tags: ['api'],
    handler: (request, reply) => {
      console.info(request.query);
      UsersModel.find()
        .then((doc) => {
          reply({ result: doc });
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
      params: {
        id: Joi.array(),
      },
    },
    handler: (request, reply) => {
      const { id } = request.params;
      UsersModel.findById(id)
        .then((doc) => {
          reply({ result: doc });
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
        role: Joi.number(),
        description: Joi.string(),
        group: Joi.string(),
      },
    },
    handler: (request, reply) => {
      const { payload: { name, passwd, role, description, group } } = request;
      const list = new UsersModel({ name, passwd, role, description, group });
      list.save()
        .then((doc) => {
          reply({ result: doc }).code(201);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.badRequest(e.message));
        });
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
      const { name, passwd, role, description, group } = request.payload;
      UsersModel.where({ _id: id }).update({ name, passwd, role, description, group })
        .then((doc) => {
          reply(doc);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.badRequest(e.message));
        });
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
      UsersModel.remove({ _id: id })
        .then((doc) => {
          reply(doc).code(204);
        })
        .catch((e) => {
          request.log.error(e);
          reply(Boom.badRequest(e.message));
        });
    },
  },
};