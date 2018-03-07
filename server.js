require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: ledgerEntriesRouter} = require('./budget')

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const app = express();

app.use(
	cors({
		origin: [CLIENT_ORIGIN]
	})
);

app.use(morgan('common'));

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/budget/', ledgerEntriesRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/api/protected', jwtAuth, (req, res) => {
	return res.json({
		data: 'rosebud'
	});
});

app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
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

module.exports = { app, runServer, closeServer };