var express = require('express');
var fs = require('fs-extra');
var router = express.Router();
var Models = require("../database/Models");
var mongoose = require('mongoose');

var Judge = require("../judge/Judge");
var User = Models.User;

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("We are connected!");
});

router.get('/', function (req, res, next) {
    var id = req.cookies.id;
    if (!id) {
        res.render('index', {title: 'AI', loggedIn: false});
    } else {
        User.findOne().where({
            id: id
        }).exec(function(err, doc) {
            if (err || doc == null) {
                res.render('index', {title: 'AI', loggedIn: false});
            } else {
                res.render('index', {title: 'AI', loggedIn: true, userName: doc.userName, doc: doc});
            }
        });
    }
});

module.exports = router;
