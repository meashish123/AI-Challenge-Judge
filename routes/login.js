var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");

var Models = require("../database/Models");
var User = Models.User;

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;

    User.findOne().where({
        userName: userName,
        password: password
    }).exec(function(err, doc) {
        if (err || doc == null) {
            res.clearCookie("id");
            res.render('login', {error: "Incorrect userName or password!"});
        } else {
            res.cookie('id' , doc.id, {expire : new Date() + 9999});
            res.redirect('/');
        }
    });
});

module.exports = router;