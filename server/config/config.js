const defaultConfig = {
  DEBUG: false,
  CONNECT: {
    HOST: '127.0.0.1',
    PORT: '3000',
  },
  MONGO_URL: 'mongodb://127.0.0.1:27017/hapi-api',
};
exports.MONGO_URL=defaultConfig.MONGO_URL;

