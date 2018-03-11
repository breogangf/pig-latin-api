const User = require('../models/user');

exports.loginUser = (req, res, next) => {
	//register
	if (req.body.email &&
		req.body.username &&
		req.body.password) {
		const userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		};
		User.create(userData, (errorCreatingUser, user) => {
			if (errorCreatingUser) {
				return next(errorCreatingUser);
			}
			req.session.userId = user._id;
			User.findById(req.session.userId, (errorRetrivingUser, user) => {
				if (errorRetrivingUser) {
					return next(errorRetrivingUser);
				}
				if (user === null) {
					const err = new Error('Not authorized!');
					err.status = 401;
					return next(err);
				}
				return res.status(201).send(user);
			});
		});
	} else if (req.body.email && req.body.password) {
		//login
		User.authenticate(req.body.email, req.body.password, (errorAuthenticatingUser, user) => {
			if (errorAuthenticatingUser || !user) {
				const err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			}
			req.session.userId = user._id;
			return res.status(200).send(user);
		});
	} else {
		return res.status(400).send({ message: 'Please provide email, username, password' });
	}
};
