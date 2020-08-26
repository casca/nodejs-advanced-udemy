const { clearHash } = require('../services/cache');

module.exports = async (req, _res, next) => {
  await next();
  clearHash(req.user.id);
};
