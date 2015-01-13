
function slide(hosts){
    // Calculate number hosts and if there are more than 6 hosts use a slider,
    // devide the number by 9 and spread it over several 'slides'.
    
    if (hosts.length > 9) {
        var slides = Math.ceil(hosts.length/9);

        // split the hosts array into chunks of 9 hosts
        var hostArrays = [];
        while (hosts.length > 0) {
            hostArrays.push(hosts.splice(0, 9));
        }

        for (var i = 0; i < slides; i++) {

            $('#container .group').append("<div class='row'></div>");
            // add the hosts per slide.
            for (var y=0; y < hostArrays[i].length; y++) {
                $('#container .row:nth-child('+(i+1)+')').append(hostArrays[i][y]);
            }
        }

        /////////////////////////////////// sliding logic
        var displayTime = 5000,
        transitionTime = 2000;
        var currIdx = 0;
        var $slides = $('#container .group .row');

        function animateBG() {
            currIdx = (currIdx < $slides.length-1) ? currIdx + 1 : 0;
            setTimeout(function() {
                $slides.css('z-index', 1);
                $slides.eq(currIdx).css('z-index', 2).fadeIn(transitionTime, function() {
                    $slides.not(this).hide();
                    animateBG();
                });
            }, displayTime)

        }
        animateBG();

    } else {
        // less then 9 hosts, display without rotating logic
        for(var i=0; i < hosts.length; i++) {
            $(".group").append(hosts[i]);
        }
    }
}
