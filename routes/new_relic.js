var express = require('express');
var router = express.Router();
var new_relic = require('../lib/newrelic');

/* get newrelic host data */
router.get('/hostdata', function(req, res) {
    var data = new_relic.getHostData(function(data){
        
        console.log("length: " + data.length);
        res.send(JSON.stringify(data));
        
    }); 
});

module.exports = router;