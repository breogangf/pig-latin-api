const { logger } = require('../helpers');

exports.initialCheck = (req, res) => {
  const message = 'Everything seems to be working 😎';
  logger.log(message);
  return res.status(200).send({ message });
};
