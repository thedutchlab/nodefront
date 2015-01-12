var Zabbix = require ('zabbix');
var zabbix = new Zabbix(process.env.zabbix_endpoint,process.env.zabbix_user, process.env.zabbix_pwd);
var utils = require('./utils');

// https://www.zabbix.com/documentation/2.2/manual/api/reference/host/get

zabbix.getApiVersion(function (err, resp, body) {
    if (!err) {
        console.log("Unauthenticated API version request, and the version is: " + body.result)
    }
});

exports.getTriggers = function(callback) {
    
    var triggers = [];
    
    zabbix.authenticate(function (err, resp, body) {
        if (!err) {
            console.log("Authenticated! AuthID is: " + zabbix.authid);
        }
        // Unless there are any errors, we are now authenticated and can do any call we want to! :)

        zabbix.getApiVersion(function (err, resp, body) {
            console.log("Zabbix API version is: " + body.result);
        });
        
        zabbix.call("trigger.get",
            {
                "output": [
                    "triggerid",
                    "description",
                    "priority"
                ],
                "filter": {
                    "value": 1 // 0 = OK, 1 = PROBLEM
                },
                "sortfield": "priority",
                "sortorder": "ASC",
                "selectHosts": "extend"
            }, function (err, resp, body) {
            if (!err) {
                //console.log("body: " + JSON.stringify(body.result));
                
                var data = body.result;
                //console.log(resp.statusCode + " result: " + JSON.stringify(body.result));
                console.log("Found hosts: " + body.result.length);
                for(var i=0; i < body.result.length; i++) {
                    
                    var triggerResult = {
                        description: "",
                        host: ""
                    };
                    
                    var trigger = body.result[i];
                    
                    triggerResult.description = trigger.description;
                    
                    var hosts = trigger.hosts;
                    
                    for(var x=0; x < hosts.length; x++) {
                        // for now only the last host of the array is listed in the object...
                        var host = hosts[x];
                        
                        triggerResult.host = host.host;
                    }
                    
                    triggers.push(triggerResult);
                };
                
                callback(triggers);
            }
        });
    
    });
}
                        

exports.getHostData = function(callback) {
    
    var hosts = [];
    
    zabbix.authenticate(function (err, resp, body) {
        if (!err) {
            console.log("Authenticated! AuthID is: " + zabbix.authid);
        }
        // Unless there are any errors, we are now authenticated and can do any call we want to! :)

        zabbix.getApiVersion(function (err, resp, body) {
            console.log("Zabbix API version is: " + body.result);
        });

        zabbix.call("host.get",
            {
                "output": "extend",
                "groupids" : process.env.zabbix_group_ids,
                "selectItems": "extend",
                "selectInterfaces": "extend"
            }, function (err, resp, body) {
            if (!err) {
                var data = body.result;
                //console.log(resp.statusCode + " result: " + JSON.stringify(body.result));
                console.log("Found hosts: " + body.result.length);
                for(var i=0; i < body.result.length; i++) {

                    var hostResult = {
                        host_id: "",
                        hostname: "",
                        cpu: "",
                        memory_total: "",
                        memory_avail: "",
                        memory_usage_percentage: 0,
                        disk_total: "",
                        disk_avail: "",
                        disk_usage_percentage: 0,
                        bars_disk: 0,
                        bars_mem: 0,
                        bars_cpu: 0,
                        ip_1: ""
                    };

                    var host = body.result[i];
                    hostResult.host_id = host.hostid;
                    hostResult.hostname = host.host
                    //console.log(host);
                    //console.log(host.host);
                    //console.log(host.error);
                    //console.log(host.available);
                    
                    if (host.error === "") {
                    
                        var items = host.items;
                        for(var x=0; x < items.length; x++) {
                            var item = items[x];

                            // cpu load
                            if (item['key_'] === "system.cpu.load[percpu,avg1]") {
                                //console.log(item['key_'] + ": " + item['lastvalue']);
                                hostResult.cpu = item['lastvalue'];
                            }

                            // total memory
                            if (item['key_'] === "vm.memory.size[total]") {
                                //console.log(item['key_'] + ": " + item['lastvalue']);
                                hostResult.memory_total = item['lastvalue'];
                            }

                            // memory available
                            if (item['key_'] === "vm.memory.size[available]") {
                                //console.log(item['key_'] + ": " + item['lastvalue']);
                                hostResult.memory_avail = item['lastvalue'];
                            }

                            // total disk
                            if (item['key_'] === "vfs.fs.size[/,total]") {
                                //console.log(item['key_'] + ": " + item['lastvalue']);
                                hostResult.disk_total = item['lastvalue'];
                            }

                            // available disk
                            if (item['key_'] === "vfs.fs.size[/,used]") {
                                //console.log(item['key_'] + ": " + item['lastvalue']);
                                hostResult.disk_avail = item['lastvalue'];
                            }

                        }
                        
                        // interfaces
                        
                        var interfaces = host.interfaces;

                        for(var y=0; y < interfaces.length; y++) {
                            
                            var interface = interfaces[y];
                            
                            // one interface only for now (even if it's the last one...)
                            if (interface.ip !== "") {
                                hostResult.ip_1 = interface.ip;
                            }
                            
                        };

                        hostResult.memory_usage_percentage = utils.calcPercentageInUse(hostResult.memory_total, hostResult.memory_avail);
                        hostResult.disk_usage_percentage = utils.calcPercentage(hostResult.disk_total, hostResult.disk_avail);

                        hostResult.bars_mem = utils.getBarsInUse(hostResult.memory_usage_percentage);
                        hostResult.bars_disk = utils.getBarsInUse(hostResult.disk_usage_percentage);
                        hostResult.bars_cpu = utils.getBarsInUseCpuZabbix(hostResult.cpu)
                        //console.log(hostResult);
                    
                    }
                    hosts.push(hostResult);
                }

                callback(hosts);
            }
        
            
        });
        
    });
    
}