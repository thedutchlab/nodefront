var sndStart = new Audio("/sounds/start.wav");
sndStart.play();

function slide(hosts, hosts_per_slide){
    // Calculate number hosts and if there are more than x (hosts_per_slider) hosts use a slider,
    // devide the number by hosts_per_slider and spread it over several 'slides'.

    if (hosts.length > hosts_per_slide) {
        var slides = Math.ceil(hosts.length/hosts_per_slide);

        // split the hosts array into chunks of x (hosts_per_slide) hosts
        var hostArrays = [];
        while (hosts.length > 0) {
            hostArrays.push(hosts.splice(0, hosts_per_slide));
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
        // less then x (hosts_per_slide) hosts, display without rotating logic
        for(var i=0; i < hosts.length; i++) {
            $(".group").append(hosts[i]);
        }
    }
}
