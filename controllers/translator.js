const logger = require('../helpers/logger');

//TODO (Just stub at this moment)
exports.translate = (req, res) => {
    logger.log('This comment will not appear for NODE_ENV == test');
    return res.status(200).send([]);
};