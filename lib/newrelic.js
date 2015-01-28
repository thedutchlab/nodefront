var request = require('request');
var utils = require('./utils');
var FeedParser = require('feedparser');
var request = require('request');

exports.getTriggers = function(callback) {

    var alerts = [];

    // parse the RSS feed
    var req = request(process.env.new_relic_alert_feed), feedparser = new FeedParser();

    req.on('error', function (error) {
        // handle any request errors
    });
    req.on('response', function (res) {
        var stream = this;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
        // always handle errors
    });
    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this
            , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
            , item;

        var alertItem = {
            title: '',
            pubDate: ''
        }

        while (item = stream.read()) {
            alertItem.title = item.title;
            alertItem.pubDate = item.pubDate;
            alerts.push(alertItem);
        }


    });

    feedparser.on('end', function() {
        callback(alerts);
    });
}

exports.getHostData = function(callback) {
    
    var options = {
        url: process.env.new_relic_endpoint,
        headers: {
            "X-Api-Key": process.env.new_relic_apikey
        }
    };
    
    var body;
    
    var req = request(options, function(error, response, body) {

        //console.log(body);
        var data = JSON.parse(body);
        
        //console.log(data.servers);
        
        var hostData = [];
        
        var servers = data.servers;
        
        for(var i=0; i < servers.length; i++) {
            
            var hostResult = {
                host_id: servers[i].id,
                hostname: servers[i].host,
                cpu: servers[i].summary.cpu,
                memory_total: servers[i].summary.memory_total,
                memory_avail: "",
                memory_usage_percentage: servers[i].summary.memory,
                disk_total: "",
                disk_avail: servers[i].summary.fullest_disk_free,
                disk_usage_percentage: servers[i].summary.fullest_disk,
                bars_disk: utils.getBarsInUse(servers[i].summary.fullest_disk),
                bars_mem: utils.getBarsInUse(servers[i].summary.memory),
                bars_cpu: utils.getBarsInUseCpuNewRelic(servers[i].summary.cpu),
                health_status : servers[i].health_status
            };
            
            hostData.push(hostResult);

        }
        
        callback(hostData);
        
        
    });

};