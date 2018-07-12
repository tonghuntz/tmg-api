const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../../config/')

// /mapp/inquiry/
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200
  const validator_partner_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/partner/10200';
  const validator_schema_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/schema/';

  var options = {
    method: 'POST',
    uri: validator_schema_url + 'cobrand_inquiry_by_partner',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
  };

  var date_str = '';
  var today = new Date();
  date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
  
  rp(options)
    .then(function(result){
      console.log(result);
      console.log('get Inquiry by partner');
      rp.get(''+ config.endpoint.api_partner_inquiry.protocol +'://'+ config.endpoint.api_partner_inquiry.url +':'+ config.endpoint.api_partner_inquiry.port +'/cobrand/inquiry_by_partner/' + req.body.mbcode)
        .then(function(mcard){
          console.log("mcard found", mcard);
		  if(isNaN(mcard[0].MBID)){
		  	res.json({
		  		"fnme": mcard[0].MBENAM,
		  		"lnme": mcard[0].MBESUR,
		  		"lgnme": "EN",
		  		"mobile": mcard[0].MBPTEL
		  	});
		  	return;
		  }
		  else{
		  	res.json({
		  		"fnme": mcard[0].MBTNAM,
		  		"lnme": mcard[0].MBTSUR,
		  		"lgnme": "TH",
		  		"mobile": mcard[0].MBPTEL
		  	});
		  	return;
		  }	
        })
        .catch(function(err){
          console.log('No MCard');
          res.status(400);
          res.end();
        });
    })
    .catch(function(err){
      console.log('failure');
      res.status(500);
      res.end();
    });
});

module.exports = router;
