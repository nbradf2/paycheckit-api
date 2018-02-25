const express = require('express');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const app = express();

app.use(
	cors({
		origin: CLIENT_ORIGIN
	})
);

app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

app.listen(3000);

module.exports = {app};