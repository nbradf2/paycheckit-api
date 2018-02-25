const express = require('express');
// const cors = require('cors');
// const {CLIENT_ORIGIN} = require('./config');
const PORT = process.env.PORT || 8080;
const app = express();

// app.use(
// 	cors({
// 		origin: CLIENT_ORIGIN
// 	})
// );

app.get('/*', (req, res) => {
	res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};