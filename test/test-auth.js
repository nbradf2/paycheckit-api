const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', function () {
	const username = 'exampleUser';
	const password = 'examplePassword';
	const firstName = 'Example';
	const lastName = 'User';

	before(function () {
		return runServer(TEST_DATABASE_URL);
	});

	after(function () {
		return closeServer();
	});

	beforeEach(function () {
		return User.hashPassword(password).then(password => 
			User.create({
				username,
				password,
				firstName,
				lastName
			})
		);
	});

	afterEach(function () {
		return User.remove({});
	});

	describe('/api/auth/login', function () {
		it('Should reject requests with no credentials', function () {
			return chai
				.request(app)
				.post('/api/auth/login')
				.then(() =>
					expect.fail(null, null, 'Request should not succeed')
				)
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}

					const res = err.response;
					expect(res).to.have.status(400);
				});
		});
		it('Should reject requests with incorrect usernames', function () {
			return chai
				.request(app)
				.post('/api/auth/login')
				.send({ username: 'wrongUsername', password })
				.then(() =>
					expect.fail(null, null, 'Request should not succeed')
				)
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}

					const res = err.response;
					expect(res).to.have.status(401);
				});
		});
		it('Should reject requests with incorrect passwords', function () {
			return chai
				.request(app)
				.post('/api/auth/login')
				.send({ username, password: 'wrongPassword' })
				.then(() => 
					expect.fail(null, null, 'Request should not succeed')
				)
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}

					const res = err.response;
					expect(res).to.have.status(401);
				});
		});

	})
})



























