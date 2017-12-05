const hello = require('./handlers/home').hello;
const notFound = require('./handlers/home').notFound;
const user = require('./handlers/user').user;
const login = require('./handlers/login').login;

exports.register = (plugin, options, next) => {

  plugin.route([
    // hello route
    { method: 'GET', path: '/hello', config: hello.list },
    { method: 'GET', path: '/hello/{id}', config: hello.get },
    { method: 'POST', path: '/hello', config: hello.create },
    { method: 'PUT', path: '/hello/{id}', config: hello.update },
    { method: 'DELETE', path: '/hello/{id}', config: hello.destroy },
    { method: 'GET', path: '/{path*}', config: notFound },
    // user route 
    { method: 'GET', path: '/users', config: user.list },
    { method: 'GET', path: '/user/{id}', config: user.get },
    { method: 'POST', path: '/user', config: user.create },
    { method: 'PUT', path: '/user/{id}', config: user.update },
    { method: 'DELETE', path: '/user/{id}', config: user.destroy },
    // login route
    { method: 'POST', path: '/login', config: login.login },
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};