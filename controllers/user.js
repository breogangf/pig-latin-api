const logger = require('../helpers/logger');
const User = require('../models/user');

exports.registerUser = (req, res, next) => {
	if (!req.body.email || !req.body.username || !req.body.password) {
		return res.status(400).send({ message: 'Please provide email, username, password' });
	}
		const userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		};
		User.create(userData, (err, user) => {
			if (err) {
				logger.log(`Error registering the user: ${err}`);
				return next(err);
			}
			return res.status(201).send(user);
		});
};
