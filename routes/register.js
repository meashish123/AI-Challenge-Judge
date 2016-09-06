var express = require('express');
var router = express.Router();

var randomstring = require("randomstring");

var Models = require("../database/Models");
var Submission = Models.Submission;
var User = Models.User;
var TempUser = Models.TempUser;

router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/', function (req, res, next) {
    //console.log("captcha", req.body['g-recaptcha-response']);

    User.findOne().where({
        userName: req.body.userName
    }).exec(function (err, doc) {
        if (doc == null) {
            User.findOne().where({
                email: req.body.email
            }).exec(function (err, doc2) {
                if (doc2 == null) {
                    //TempUser.findOneAndRemove({userName: req.body.userName}, function (err) {});
                    //TempUser.findOneAndRemove({email: req.body.email}, function (err) {});

                    var user = new User({
                        userName: req.body.userName,
                        name: req.body.name,
                        password: req.body.password,
                        email: req.body.email,
                        college: req.body.college,
                        year: req.body.year,
                        contact: req.body.contact,
                        id: randomstring.generate(40)
                    });
                    user.save(function (err) {
                        if (err) {
                            //res.send(JSON.stringify({error: "Error while register"}));
                            res.render('register', {error: 'Error while register'});
                        } else {
                            //res.send(JSON.stringify("Registered Successfully"));
                            res.redirect("/");
                        }
                    });

                    //var email   = require("emailjs");
                    //var server  = email.server.connect({
                    //    user:    "ashishchauhan013",
                    //    password:"veginapenis123#",
                    //    host:    "smtp.gmail.com",
                    //    ssl:     true
                    //});
                    //
                    //// send the message and get a callback with an error or details of the message that was sent
                    //server.send({
                    //    text:    "i hope this works",
                    //    from:    "you <ashishchauhan013@gmail.com>",
                    //    to:      "someone <iit2013071@iiita.ac.in>",
                    //    //cc:      "else <else@your-email.com>",
                    //    subject: "testing emailjs"
                    //}, function(err, message) { console.log(err || message); });

                } else {
                    res.render('register', {error: 'Email already registered'});
                    //res.send(JSON.stringify({error: "Email already registered"}));
                }
            });
        } else {
            var obj = {error: "UserName already in Use"};
            //res.send(JSON.stringify(obj));
            res.render('register', {error: 'Username already in Use'});
        }
    });

});

module.exports = router;
