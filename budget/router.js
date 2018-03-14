const express = require('express');
const config = require('../config');

const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {LedgerEntry} = require('./models');

router.get('/:user', passport.authenticate('jwt', {session: false}), (req, res) => { 
	LedgerEntry
		.find({user: req.params.user}).sort({year: 1, month: 1, day: 1})
		.exec()
		.then(entries => {
			res.status(200).json(entries)
		})
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		})
});

router.get('/:id', (req, res) => {
	LedgerEntry
		.findById(req.params.id)
		.exec()
		.then(entry => res.status(200).json(entry))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		})
});

router.post('/', jsonParser, (req, res) => {
	console.log('data posted');
	console.log(req.body);
	const requiredFields = ['month', 'day', 'year', 'amount'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = LedgerEntry.create({
		user: req.body.user,
		name: req.body.name,
		month: req.body.month,
		day: req.body.day,
		year: req.body.year,
		amount: req.body.amount,
		label: req.body.label,
		amountType: req.body.amountType
	})
	.then(ledgerEntry => res.status(200).json(ledgerEntry))
	.catch(err => res.status(500).json({message: 'Internal server error'}))
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['month', 'day', 'year', 'amount', 'category'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating ledger entry item ${req.params.id}`);
	LedgerEntry
		.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
		.exec()
		.then(ledgerEntry => res.status(200).json(ledgerEntry))
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		});
});

router.delete('/:id', (req, res) => {
	LedgerEntry
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => res.status(204).end())
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		})
});

router.use('*', (req, res) => {
	res.status(404).send('URL not found');
});



module.exports = {router};
























