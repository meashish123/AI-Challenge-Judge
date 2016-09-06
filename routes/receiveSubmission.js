var express = require('express');
var router = express.Router();
var Models = require("../database/Models");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Submission = Models.Submission;

var User = Models.User;

var Judge = require("../judge/Judge");


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

router.post('/', function (req, res, next) {
    //console.log("just got into receive submission");
    //console.log(JSON.stringify(req.body));

    var obj = {
        error: "Please Login First"
    };

    var id = req.cookies.id;
    if (!id) {
        res.send(JSON.stringify(obj));
    } else {
        User.findOne().where({
            id: id
        }).exec(function (err, doc) {
            if (err || doc == null) {
                res.send(JSON.stringify(obj));
            } else {
                receiveSubmission(doc.userName, req, res);
            }
        });
    }
});

/**
 * checks for previous running
 * @param userName
 * @param req
 * @param res
 */
function receiveSubmission(userName, req, res) {
    if (req.body.language != 7 && req.body.language != 8 && req.body.language != 0) {
        res.send(JSON.stringify({error: "Select a valid language"}));
        return;
    }

    Submission.find().where({
        progress: 0,
        userName: userName
    }).exec(function (err, docs) {
        if (!err && docs.length > 1) {
            res.send(JSON.stringify({error: "Please wait! your old bot is still in the battle"}));
        } else {
            receiveSubmission2(userName, req, res);
        }
    });
}

function receiveSubmission2(userName, req, res) {
    console.log("received userName", userName);
    getNextSequence("submissionId", function (next) {
        //console.log("got next submission sequence", next);
        getLastSubmission(req.body.opponent, function (doc) {
            if (doc == null) {
                res.send(JSON.stringify({error: "Select a valid userName to play against"}));
                return;
            }

            //console.log("got opponent code");
            var sub1 = new Submission({
                submissionsId: next,
                userName: userName,
                language: req.body.language,
                code: req.body.code,
                opponentSubmissionId: doc.submissionsId,
                opponentUserName: req.body.opponent,
                progress: 0
            });
            sub1.save(function (err) {
                if (err) {
                    console.log("error while saving");
                    return;
                }
                console.log("Submission saved");
            });

            var judge = new Judge(req.body.code, req.body.language, doc.code, doc.language);

            console.log("starting battle", userName, " vs " , req.body.opponent);

            //judge.startBattle(function (game) {
            //    Submission.update(
            //        {submissionsId: next},
            //        {progress: 100, game: game},
            //        {multi: false},
            //        function (err) {
            //            console.log(err);
            //
            //            console.log("game updated successfully");
            //        }
            //    );
            //
            //    console.log("game");
            //    //for (var i = 0; i < game.moves.length; i++) {
            //    //    console.log("Player:", JSON.stringify(game.moves[i].player), " move:", game.moves[i].move);
            //    //}
            //    //console.log("Winner:", game.winner);
            //    console.log(JSON.stringify(game));
            //});
            res.send(JSON.stringify('received submission'));
        });
    });

}

doincomplete();

function doincomplete() {
    //console.log("called complete");

    Submission.find().where({progress: 0}).limit(2).exec(function (err, docs) {
        var count = docs.length;

        if (count == 0) {
            //console.log("zero count");
            setTimeout(doincomplete, 1000);
        }

        docs.forEach(function (doc) {
            Submission.findOne().where({submissionsId: doc.opponentSubmissionId}).exec(function (err, doc2) {
                if (doc == null) {
                    return;
                }

                var judge = new Judge(doc.code, doc.language, doc2.code, doc2.language);
                judge.startBattle(function (game) {
                    Submission.update(
                        {submissionsId: doc.submissionsId},
                        {progress: 100, game: game},
                        {multi: false},
                        function (err) {
                            console.log(err);

                            console.log("game updated successfully");

                            count--;
                            if (count == 0) {
                                console.log("Completed one batch");
                                doincomplete();
                            }
                        }
                    );

                    console.log("game");
                    //for (var i = 0; i < game.moves.length; i++) {
                    //    console.log("Player:", JSON.stringify(game.moves[i].player), " move:", game.moves[i].move);
                    //}
                    //console.log("Winner:", game.winner);
                    console.log(JSON.stringify(game));
                });
            });
        });
    });
}

module.exports = router;

function getNextSequence(name, callback) {
    Counter.findAndModify({_id: name}, [], {$inc: {seq: 1}}, {}, function (err, counter) {
        if (err) {
            console.log("error while finding next sequence");
            callback({});
        }
        console.log('updated, counter is ', counter.value.seq);
        callback(counter.value.seq);
    });
}

function getLastSubmission(userName, callback) {
    Submission.findOne()
        .where({userName: userName})
        .sort('-submissionsId')
        .exec(function (err, doc) {
            //console.log("found doc", JSON.stringify(doc));
            callback(doc);
        });
}