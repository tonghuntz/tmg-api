const express = require('express');
const router = express.Router();
const config = require('../../../config');
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

//  POST /api/lookup/partner/nbr
router.get('/:PARTNER_NBR/:PARTNER_ID', function(req,res){
  // get mcard 
  	var stmt = "select *";
        stmt += " from MBRFLIB/PM110MP PM110MP";
        stmt += " inner join MBRFLIB/PM100MP PM100MP on PM110MP.PNID = PM100MP.PNID";
        stmt += " where PM110MP.PNNUM = '" + req.params.PARTNER_NBR + "' and PM110MP.PNID='" + req.params.PARTNER_ID + "'";
  pool.query(stmt)
    .then(function(result) {
      console.log(result.length);
      console.log(result);

      if(result.length > 0){
        res.status(200);
        res.json(result);
        
      }
      else{
        res.status(404);
        res.end();
      }
    })
    .catch(function(err){

    });
});

module.exports = router;
