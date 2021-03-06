const express = require('express');
const router = express.Router();
const config = require('../../../../config');
var rp = require('request-promise');
const config_400 = {
	host: config.db.host,
	user: config.db.user,
	password: config.db.password
	//host: '172.16.25.71',
	//user: 'qsecofr',
	//password: 'qsecofr'
};
const pool = require('node-jt400').pool(config_400);

router.post('/:MBCODE', function (req, res) {

	var date_str = '';
	var today = new Date();
	date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

	var update_stmt = "update MBRFLIB/MVM02P ";
	update_stmt += " set MBCRE9=?";
	update_stmt += " where MBCODE='" + req.params.MBCODE + "'";
	var update_params = ['1'];

	pool.update(update_stmt, update_params)
      .then(function(result) {
		console.log(result.length);
		console.log(result);
		res.status(200);
		res.json({});
	})
	.catch (function (err) {
		res.status(500);
		console.log(err);
		res.end();
	});
});

module.exports = router;
