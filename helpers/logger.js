var exports = module.exports = {};

exports.log = function(string) {
	if (process.env.NODE_ENV !== 'test') {
		console.log(string);
	}
};