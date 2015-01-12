var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    
    res.render('index', { title: process.env.company_name, source: process.env.data_source });
});

module.exports = router;