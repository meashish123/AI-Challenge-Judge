var dialog1 = $('[data-remodal-id=profile]').remodal();

$(function () {
    window.onpopstate = function (event) {
        var pathname = window.location.pathname + window.location.search;

        switch (pathname) {
            case '/problem':
                $('.nav-selected').removeClass('nav-selected');
                $('#nav2').addClass('nav-selected');
                break;
            case '/submissions':
                $('.nav-selected').removeClass('nav-selected');
                $('#nav3').addClass('nav-selected');
                break;
            case '/leaderboard':
                $('.nav-selected').removeClass('nav-selected');
                $('#nav4').addClass('nav-selected');
                break;
            case '/forum':
                $('.nav-selected').removeClass('nav-selected');
                $('#nav5').addClass('nav-selected');
                break;
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
        dialog1.open();
    });

    $('.nav-button').click(function() {
        $('.nav-selected').removeClass('nav-selected');
        $(this).addClass('nav-selected');
    });

    $('#nav1').click(function() {
        window.history.pushState("object or string", "Title", "/");
        loadPage('/');
    });

    $('#nav2').click(function() {
        window.history.pushState("object or string", "Title", "/problem");
        loadPage('/problem');
    });

    $('#nav3').click(function() {
        window.history.pushState("object or string", "Title", "/submissions");
        loadPage('/submissions');
    });

    $('#nav4').click(function() {
        window.history.pushState("object or string", "Title", "/leaderboard");
        loadPage('/leaderboard');
    });
    $('#nav5').click(function() {
        window.history.pushState("object or string", "Title", "/forum");
        loadPage('/forum');
    });
});

var loadPage = function(path) {
    NProgress.start();

    $.get("fetch" + path, function(data, status){
        try {
            var obj = JSON.parse(data);
            if (obj.error) {
                window.history.pushState("object or string", "Title", "/");
                loadPage('/');
                ohSnap(obj.error, {color: 'red'});
            }
        } catch (err) {
            $('.container').html(data);
        }
        NProgress.done();
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
