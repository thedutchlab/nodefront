$(function() {
    
    initHosts();
    
    // refresh every x seconds
    window.setInterval(function(){
        
        // get zabbix data
        getHostData(function(data){
            updateHostsUI(data);
        });
        
        getTriggerData(function(data){
            updateTriggersUI(data);
        });
        
    }, 5000);
    
    // ########################################################################### HOSTS
    
    function initHosts() {
        
        // init html for number of hosts in the data object
        var data = getHostData(function(data) {
            //console.log(data);
            // init the containers for the hosts
            var hosts = [];
            
            $.each( data, function( key, val ) {
                
                // init mustache templates with values.
                var template = $('#zabbix_host_template').html();
                Mustache.parse(template); // optional, speeds up future uses
                var rendered = Mustache.render(template, {
                    host_id: val.host_id, 
                    hostname: val.hostname, 
                    cpu: val.cpu,
                    mem: val.memory_usage_percentage,
                    dsk: val.disk_usage_percentage,
                    ip_1: val.ip_1
                });
                
                hosts.push(rendered);
                
            });
            
            slide(hosts);
            // update UI
            updateHostsUI(data);
            
        });
    };
    
    // update all data for every hosts that was initialized.
    // TODO
    // Need to do this more fancy!
    function updateHostsUI(data){
        
        // reset ui first
        $("li").removeClass('active');
        
        var items = [];
        
        $.each( data, function( key, val ) {
            // get ID for html item
            var hostId = val.host_id;
            
            // CPU ####################
            
            // set cpu value
            $("#data_"+hostId+" .cpu .value").html(val.cpu);
            // set cpu bars
            $("#data_"+hostId+" .cpu ul li:nth-last-child("+(val.bars_cpu+1)+")").nextAll().addClass('active');
            
            // MEM ####################
            
            // set memory value
            $("#data_"+hostId+" .mem .value").html(val.memory_usage_percentage + "%");
            // set memory bars
            $("#data_"+hostId+" .mem ul li:nth-last-child("+(val.bars_mem+1)+")").nextAll().addClass('active');
            
            // DSK ####################
            // set disk value
            $("#data_"+hostId+" .dsk .value").html(val.disk_usage_percentage + "%");
            // set disk bars
            $("#data_"+hostId+" .dsk ul li:nth-last-child("+(val.bars_disk+1)+")").nextAll().addClass('active');
        });
        
    };
    
    function getHostData(callback){
        
        $('#refresh').fadeIn();
        $.getJSON( "/zabbix/hostdata", function( data ) {
            callback(data);
            $('#refresh').fadeOut();
        });
    };
    
    // ########################################################################### TRIGGERS
    
    // update all data for every hosts that was initialized.
    function updateTriggersUI(data){
        // init html for the trigger
        
        $('ul.trigger_list').html("");

        // init the containers for the hosts
        $.each( data, function( key, val ) {
            $('ul.trigger_list').append('<li>'+'<span>'+val.host+'</span>'+val.description+'</li>');
        });        
    }
    
    function getTriggerData(callback){
        
        $('#refresh').fadeIn();
        $.getJSON( "/zabbix/triggerdata", function( data ) {
            callback(data);
            $('#refresh').fadeOut();
        });
    };
    
});