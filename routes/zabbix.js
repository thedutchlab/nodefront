var express = require('express');
var router = express.Router();
var zabbix = require('../lib/zabbix');

/* get zabbix host data */
router.get('/hostdata', function(req, res) {
    var data = zabbix.getHostData(function(data){
        
        //console.log("length: " + data.length);
        res.send(JSON.stringify(data));
        
    }); 
});

/* get zabbix alert data */
router.get('/triggerdata', function(req, res) {
    var data = zabbix.getTriggers(function(data){
        
        //console.log("length: " + data.length);
        res.send(JSON.stringify(data));
        
    });
});

module.exports = router;