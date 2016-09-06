var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Models = require("../../database/Models");
var User = Models.User;
var Problem = Models.Problem;
var InfinitumSubmission = Models.InfinitumSubmission;


////------------------ for next Sequence --------------------------//
//var Counters = new Schema({
//    _id: String,
//    seq: Number
//});
//Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
//    return this.collection.findAndModify(query, sort, doc, options, callback);
//};
//var Counter = mongoose.model('counters', Counters);
////---------------------------------------------------------------//
var Counter = Models.Counter;

var loginMessage = "You need to sign in.";

router.post('/', function(req, res, next) {

    var id = req.cookies.id;
    if (!id) {
        res.send(JSON.stringify({error: loginMessage}));
    } else {
        User.findOne().where({
            id: id
        }).exec(function(err, user) {
            if (err || user == null) {
                res.send(JSON.stringify({error: loginMessage}));
            } else {
                receive(user, req, res);
            }
        });
    }
});

function receive(user, req, res) {
    var answer = req.body.answer;
    var problemId = req.body.problemId;
    //var userName = "meashish";

    //console.log(answer + " ss " + problemId);
    getNextSequence("submissionId", function(next) {
        //console.log("next", next);
        Problem.findOne().where({id: problemId}).exec(function(err, problem) {
            if (err || problem == null) {
                res.send(JSON.stringify({error: "Error while submitting"}));
            } else {
                receive2(answer, problemId, next, user, problem, req, res);
            }
        });

    });
}

function receive2(answer, problemId, next, user, problem, req, res) {
    if (answer == problem.answer) {
        InfinitumSubmission.findOne().where({
            userName: user.userName,
            problemId: problemId
        }).exec(function(err, doc) {
            if (doc == null) {
                var correct = "true";
                var infinitumSubmission = new InfinitumSubmission({
                    submissionsId: next,
                    userName: user.userName,
                    problemId: problemId,
                    correct: correct
                });

                infinitumSubmission.save(function(err) {
                    if (err) {
                        //console.log("error");
                        res.send(JSON.stringify({error: "Error while submitting"}));
                    } else {
                        res.send(JSON.stringify({success: "Correct Answer"}));
                    }
                });
            } else {
                res.send(JSON.stringify({success: "You have already solved this problem."}));
            }
        });
    } else {
        res.send(JSON.stringify({error: "Wrong Answer"}));
    }
}

module.exports = router;

function getNextSequence(name, callback) {
    Counter.findAndModify({_id: name}, [], {$inc: {seq: 1}}, {}, function (err, counter) {
        if (err) {
            //console.log("error while finding next sequence");
            callback({});
        }
        //console.log('updated, counter is ', counter.value.seq);
        callback(counter.value.seq);
    });
}

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
                    docs.forEach(function (doc) {
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