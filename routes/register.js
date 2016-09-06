var express = require('express');
var router = express.Router();

var randomstring = require("randomstring");

var Models = require("../database/Models");
var User = Models.User;

router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/', function (req, res, next) {
    User.findOne().where({
        userName: req.body.userName
    }).exec(function (err, doc) {
        if (doc == null) {
            User.findOne().where({
                email: req.body.email
            }).exec(function (err, doc2) {
                if (doc2 == null) {
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
                            res.render('register', {error: 'Error while register'});
                        } else {
                            res.redirect("/");
                        }
                    });

                } else {
                    res.render('register', {error: 'Email already registered'});
                }
            });
        } else {
            res.render('register', {error: 'Username already in Use'});
        }
    });

});

module.exports = router;
