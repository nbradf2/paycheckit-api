const express = require('express');
const config = require('../config');

const router = express.Router();
// const passport = require('passport');
const bodyParser = require('bodyParser');
const {LedgerEntry} = require('./models');

router.get('/', (req, res)=> {
	LedgerEntry
		.find()
		.exec()
		.then(entries => {
			res.status(200).json(entries)
		})
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		})
});

router.get('/user/:user', (req, res) => {
	LedgerEntry
		.find({user: `${req.params.user}`})
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
		.catch(err = {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		})
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['month', 'day', 'year', 'amount', 'category'];
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
		type: req.body.type,
		category: req.body.category
	});
	res.status(201).json(item);
});




























