// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const passport = require('pasport');
// const cors = require('cors');
// const {CLIENT_ORIGIN} = require('./config');

const {router: ledgerEntriesRouter} = require('./budget')

const {PORT, DATABASE_URL} = require('./config');
const app = express();

// app.use(
// 	cors({
// 		origin: CLIENT_ORIGIN
// 	})
// );

app.use(morgan('common'));

// app.use(passport.initialize());
// app.use(localStrategy);
// app.use(jwtStrategy);

app.use('/budget/', ledgerEntriesRouter);

app.get('/*', (req, res) => {
	res.json({ok: true});
});

let server;

function runServer() {
	return new Promise((resolve, reject) => {
		mongoose.connect(DATABASE_URL, err => {
			if (err) {
				return reject(err);
			}
			server = app
				.listen(PORT, () => {
					console.log(`Your app is listening on port ${PORT}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app};