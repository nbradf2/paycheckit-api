exports.DATABASE_URL = 
	process.env.MONGODB_URI ||
	global.DATABASE_URL ||
	'mongodb://localhost/budget';

exports.PORT = process.env.PORT || 8080;

// module.exports = {
// 	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
// };