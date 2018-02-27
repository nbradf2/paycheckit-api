const mongoose = require('mongoose');

const ledgerEntrySchema = mongoose.Schema({
	//add required: true once login is setup
	user: {type: String},
	//add required: true once login is setup
	name: {type: String},
	month: {type: Number, required: true},
	day: {type: Number, required: true},
	year: {type: Number, required: true},
	amount: {type: Number, required: true},
	label: {type: String},
	type: {type: String},
	category: {type: String, required: true}
})

const LedgerEntry = mongoose.model('LedgerEntry', ledgerEntrySchema)

module.exports = {LedgerEntry};