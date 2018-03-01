const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {LedgerEntry} = require('../budget/models');
const {app, runServer, closeServer} = require('../server');
const {JWT_EXPIRY, JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const should = chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

let loginDetails = {
	'username': 'tester2',
	'password': 'testertester'
}

let testUsername = 'tester2'
let testPassword = 'testertester'

let authToken;

function seedBudgetData() {
	console.info('seeding budget data');
	const seedData = [];

	for (let i=1; i<10; i++) {
		seedData.push(generateBudgetData());
	}
	return LedgerEntry.insertMany(seedData);
}

function generateUserName() {
	const userNames = [
	'Nicole', 'Paul', 'Ramona'];
	return userNames[Math.floor(Math.random() * userNames.length)];
}

function generateMonth() {
	const months = [
	1, 2, 3];
	return months[Math.floor(Math.random() * months.length)];
}

function generateDay() {
	const days = [
	4, 5, 6];
	return days[Math.floor(Math.random() * days.length)];
}

function generateYear() {
	const years = [
	2018, 2019, 2020];
	return years[Math.floor(Math.random() * years.length)];
}

function generateAmount() {
	const amounts = [
	2000, 50, -60];
	return amounts[Math.floor(Math.random() * amounts.length)];
}

function generateLabel() {
	const labels = [
	'Work Paycheck', 'Visa', 'Verizon'];
	return labels[Math.floor(Math.random() * labels.length)];
}

function generateType() {
	const types = [
	'income', 'expense'];
	return types[Math.floor(Math.random() * types.length)];
}

function generateCategory() {
	const categories = [
	'Utility', 'Paycheck', 'Loan'];
	return categories[Math.floor(Math.random() * categories.length)];
}

function generateBudgetData() {
	return {
		user: testUsername,
		name: generateUserName(),
		month: generateMonth(),
		day: generateDay(),
		year: generateYear(),
		amount: generateAmount(),
		label: generateLabel(),
		type: generateType(),
		category: generateCategory()
	}
}

function tearDownDb() {
	return new Promise((resolve, reject) => {
		console.warn('deleting test database');
		mongoose.connection
			.dropDatabase()
			.then(result => resolve(result))
			.catch(err => reject(err));
	});
}

describe('Budget API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	});

	describe('Test all endpoints', function() {
		beforeEach(function() {
			return seedBudgetData();
		});
		afterEach(function() {
			return tearDownDb();
		});

		it('Should return all existing ledger entries on GET/budget', function(done) {
			let res;
			console.log('authToken=' + authToken);
			chai.request(app)
				.get('/budget')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);
					return Budget.count();
				})
				.then(function(count) {
					res.body.should.have.length.of(count);
				});
			done();
		});
	})
})
