const {
    images,
    health,
  } = require('../service');
  
  module.exports = (app) => {
    app.use('/health', health);
    app.use('/api/images', images);
  };
  