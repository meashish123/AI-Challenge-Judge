var rootPath = '@URL.Content("~")';

var dialog1 = $('[data-remodal-id=profile]').remodal();
//var dialog2 = $('[data-remodal-id=register]').remodal();

$(function () {
    console.log("ready!");

    $('#nav1').click(function() {
        window.location.href = "/infinitum";
    });
    $('#nav8').click(function() {
        window.history.pushState("object or string", "Title", "/infinitum/leaderboard");
        loadPage("/leaderboard");
    });

    $('div[level]').click(function() {
        if ($(this).attr('make-disabled') == "true") {
            return;
        }

        //alert('level clicked: ' + $(this).attr('level'));
        window.history.pushState("object or string", "Title", "/infinitum/level?id=" + $(this).attr('level'));
        loadPage("/level?id=" + $(this).attr('level'));
    });

    window.onpopstate = function (event) {
        //console.log("loaded");
        var pathname = window.location.pathname + window.location.search;
        pathname = pathname.substring(10);
        //alert(pathname);
        //console.log(pathname);
        //console.log(window.location);

        switch (pathname) {
            case '/':
                $('.nav-selected').removeClass('nav-selected');
                $('#nav1').addClass('nav-selected');
                break;
            default:
                $('.nav-selected').removeClass('nav-selected');
                break;
        }

        loadPage(pathname);
    };

    window.onpopstate();

    $('#nav-profile-btn').click(function() {
        //window.history.pushState("object or string", "Title", "/login");
        //loadPage('/login');
        //alert('Click');
        dialog1.open();
    });
    //
    $('.nav-button').click(function() {
        if ($(this).attr('make-disabled') == "true") {
            return;
        }

        $('.nav-selected').removeClass('nav-selected');
        $(this).addClass('nav-selected');
    });

});

var loadPage = function(path) {
    NProgress.start();

    //console.log("fetch2" + path);
    $.get("/fetch2" + path, function(data, status){
        //console.log("Data: " + data + "\nStatus: " + status);
        try {
            var obj = JSON.parse(data);
            if (obj.error) {
                //$('.container').stop().html(obj.error).hide(0).fadeIn("fast");
                //$('.container').html(obj.error);
                window.history.pushState("object or string", "Title", "/infinitum");
                loadPage('/infinitum');
                //console.log(obj.error);
                ohSnap(obj.error, {color: 'red'});
            }
            NProgress.done();
        } catch (err) {
            //$('.container').stop().html(data).hide(0).fadeIn("fast");
            $('.container').html(data);
            NProgress.done();
        }
    });
};

$(document).on('closed', '.profile-dialog', function (e) {
    // Reason: 'confirmation', 'cancellation'
    console.log('Modal is closing' + (e.reason ? ', reason: ' + e.reason : ''));

    if (e.reason && e.reason == "confirmation") {
        if (!$('#college').val() || !$('#year').val() || !$('#contact').val()) {
            ohSnap('Oh snap! You have entered an empty value', {color: 'red'});
            return;
        }

        $.post("/updateProfile",
            {
                college: $('#college').val(),
                year: $('#year').val(),
                contact: $('#contact').val()
            },
            function (data, status) {
                //console.log("Data: " + data + "\nStatus: " + status);
                var res = JSON.parse(data);
                if (res.error) {
                    ohSnap(res.error, {color: 'red'});
                } else {
                    //window.location = window.location.pathname + window.location.search;
                    ohSnap(data, {color: 'green'});
                }
            });
    }
});
