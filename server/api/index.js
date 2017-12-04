const hello = require('./handlers/home').hello;
const notFound = require('./handlers/home').notFound;

exports.register = (plugin, options, next) => {

  plugin.route([
    { method: 'GET', path: '/hello', config: hello.list },
    { method: 'GET', path: '/hello/{id}', config: hello.get },
    { method: 'POST', path: '/hello', config: hello.create },
    { method: 'PUT', path: '/hello/{id}', config: hello.update },
    { method: 'DELETE', path: '/hello/{id}', config: hello.destroy },
    { method: 'GET', path: '/{path*}', config: notFound },
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};