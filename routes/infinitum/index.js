var express = require('express');
//var fs = require('fs-extra');
var router = express.Router();

var login = require('./login');
var register = require('./register');

var Models = require("../../database/Models");
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

//var Compiler = require('compiler');
//var Judge = require("../judge/Judge");
var User = Models.User;
var Problem = Models.Problem;
var InfinitumSubmission = Models.InfinitumSubmission;

//var Submission = Models.Submission;

//mongoose.connect('mongodb://localhost/test');
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function () {
//    console.log("We are connected!");
//});

router.use('/login', login);
router.use('/register', register);

router.get('/logout', function (req, res, next) {
    res.clearCookie("id");
    res.redirect('/infinitum');
});

router.get('*', function (req, res, next) {
    var unlocked = [true, true, false, false, false, false, false];

    //res.render('infinitum/index', {title: 'AI', loggedIn: false});
    var id = req.cookies.id;
    if (!id) {
        res.render('infinitum/index', {title: 'AI', loggedIn: false, unlocked: unlocked});
    } else {
        User.findOne().where({
            id: id
        }).exec(function(err, doc) {
            if (err || doc == null) {
                res.render('infinitum/index', {title: 'AI', loggedIn: false, unlocked: unlocked});
            } else {

                var count = 0;

                for (var i = 1; i <= 5; i++) {
                    isLevelAtleast3(doc.userName, i, function(level, tf) {
                        //console.log(user.userName, levelId, tf);
                        unlocked[level + 1] = tf;
                        count++;
                        if (count >= 5) {
                            //console.log(unlocked);
                            res.render('infinitum/index', {title: 'AI', loggedIn: true, userName: doc.userName, doc: doc, unlocked: unlocked});
                        }
                    });
                }
            }
        });
    }
});

//router.get('/level', function (req, res, next) {
//    var levelId = req.query.id;
//
//    console.log("here level");
//    res.render('infinitum/level', {title: 'AI', loggedIn: false});
//
//    //var id = req.cookies.id;
//    //if (!id) {
//    //    res.render('index', {title: 'AI', loggedIn: false});
//    //} else {
//    //    User.findOne().where({
//    //        id: id
//    //    }).exec(function(err, doc) {
//    //        if (err || doc == null) {
//    //            res.render('index', {title: 'AI', loggedIn: false});
//    //        } else {
//    //            res.render('index', {title: 'AI', loggedIn: true, userName: doc.userName});
//    //        }
//    //    });
//    //}
//});


module.exports = router;


function isLevelAtleast3(userName, level, callback) {
    Problem.find().where({level: level}).exec(function (err, problems) {
        var problemIds = [];
        problems.forEach(function (problem) {
            problemIds.push(problem.id);
        });
        //console.log(problemIds);

        InfinitumSubmission.find({'problemId': {$in: problemIds}})
            .where({userName: userName})
            .exec(function (err, docs) {
                //console.log(docs);
                if (err || docs == null) {
                    callback(level, false);
                } else {
                    var set = {};
                    var count = 0;
                    docs.forEach(function(doc) {
                        if (!set["" + doc.problemId]) {
                            count++;
                        }
                        set["" + doc.problemId] = true;
                    });

                    if (count >= 3) {
                        callback(level, true);
                    } else {
                        callback(level, false);
                    }
                }
            });
    });
}