var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");

var Models = require("../database/Models");
var User = Models.User;
var Contest = Models.Contest;

router.get('/', function (req, res, next) {
    res.render('contesttime');
});

router.post('/', function (req, res, next) {
    var datetime = req.body.datetime;
    var duration = req.body.duration;

    Contest.findOne().where({
        name: "AI"
    }).exec(function(err, doc) {
        if (err || doc == null) {
            res.render('contesttime', {error: "Error while parsing date!"});
        } else {
            try {
                var date = Date.parse(datetime);
                doc.startTime = date;
                doc.duration = duration * 60 * 60 * 1000;

                doc.save(function (err) {
                    if (err) {
                        res.render('contesttime', {error: "Error while parsing date!"});
                    } else {
                        res.redirect('/');
                    }
                });
            }
            catch(err) {
                res.render('contesttime', {error: "Error while parsing date!"});
            }
        }
    });
});

module.exports = router;