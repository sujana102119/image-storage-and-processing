const router = require('express').Router();

const healthCheck = async (req, res) => {
  res.json({
    state: true,
    message: 'Service is Alive!',
    date: new Date().toISOString(),
  });
};

router.route('/').get(healthCheck);

module.exports = router;
