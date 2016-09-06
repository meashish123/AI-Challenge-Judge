var dialog1 = $('[data-remodal-id=profile]').remodal();
//var dialog2 = $('[data-remodal-id=register]').remodal();

$(function () {
    //console.log("ready!");
    window.onpopstate = function (event) {
        //console.log("loaded");
        var pathname = window.location.pathname + window.location.search;

        //console.log(pathname);
        //console.log(window.location);

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
        //window.history.pushState("object or string", "Title", "/login");
        //loadPage('/login');

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
        //console.log("Data: " + data + "\nStatus: " + status);
        try {
            var obj = JSON.parse(data);
            if (obj.error) {
                //$('.container').stop().html(obj.error).hide(0).fadeIn("fast");
                //$('.container').html(obj.error);
                window.history.pushState("object or string", "Title", "/");
                loadPage('/');
                //console.log(obj.error);
                ohSnap(obj.error, {color: 'red'});
            }
        } catch (err) {
            //$('.container').stop().html(data).hide(0).fadeIn("fast");
            $('.container').html(data);
        }
        NProgress.done();
    });
};

//
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

//$(document).on('closed', '.register-dialog', function (e) {
//    // Reason: 'confirmation', 'cancellation'
//    console.log('Modal is closing' + (e.reason ? ', reason: ' + e.reason : ''));
//
//    if (e.reason && e.reason == "cancellation") {
//        dialog1.open();
//    } else if (e.reason && e.reason == "confirmation") {
//        $.post("register",
//            {
//                userName: $('#register-userName').val(),
//                password: $('#register-password').val(),
//                name: $('#register-name').val(),
//                email: $('#register-email').val(),
//                college: $('#register-college').val(),
//                year: $('#register-year').val(),
//                contact: $('#register-contact').val()
//            },
//            function (data, status) {
//                //console.log("Data: " + data + "\nStatus: " + status);
//                var res = JSON.parse(data);
//                if (res.error) {
//                    $('#register-error').text(res.error);
//                    dialog2.open();
//                } else {
//                    window.location = window.location.pathname + window.location.search;
//                }
//            });
//    }
//});