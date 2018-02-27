// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const passport = require('pasport');
// const cors = require('cors');
// const {CLIENT_ORIGIN} = require('./config');

const {router: ledgerEntriesRouter} = require('./budget')

const PORT = process.env.PORT || 8080;
const app = express();

// app.use(
// 	cors({
// 		origin: CLIENT_ORIGIN
// 	})
// );

app.use(morgan('common'));
app.use('/budget/', ledgerEntriesRouter);

app.get('/*', (req, res) => {
	res.json({ok: "monkey"});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};