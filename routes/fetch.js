var express = require('express');
var router = express.Router();

var Models = require("../database/Models");
var Submission = Models.Submission;
var User = Models.User;
var Contest = Models.Contest;
var Game = Models.Game;
var Counter = Models.Counter;
var Judge = require("../judge/Judge");

router.get('/', function (req, res, next) {
    Contest.findOne().where({name: "AI"}).exec(function (err, doc) {
        var start = doc.startTime.getTime();
        var duration = doc.duration;

        var current = new Date().getTime();

        var started = false;
        var ended = false;
        var remaining = 0;
        if (current >= start && current <= (start + duration)) {
            started = true;
        } else if (current > (start + duration)) {
            ended = true;
        } else {
            remaining = start - current;
        }

        res.render('individual/home', {title: 'Express', started: started, ended: ended, remaining: remaining});
    });
});

router.get('/generateLeaderboarddfsdfdfdf', function (req, res, next) {
    Submission.distinct('userName').exec(function (err, userNames) {

        var count = userNames.length * userNames.length;

        userNames.forEach(function (userName1) {
            userNames.forEach(function (userName2) {
                if (userName1 === userName2) {
                    count--;
                    console.log("found same.");

                    if (count == 0) {
                        completeOneGame();
                        console.log("done for all");
                    }

                    return;
                }

                getNextSequence("submissionId", function (next) {
                    getLastSubmission(userName1, function (doc1) {
                        getLastSubmission(userName2, function (doc2) {
                            var game = new Game({
                                submissionsId: next,
                                userName: userName1,
                                language: doc1.language,
                                code: doc1.code,
                                opponentSubmissionId: doc2.submissionsId,
                                opponentUserName: userName2,
                                progress: 0
                            });

                            game.save(function (err) {
                                if (err) {
                                    console.log("error while saving");
                                } else {
                                    count--;
                                    console.log("saved successfully");

                                    if (count == 0) {
                                        completeOneGame();
                                        console.log("done for all");
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });
    });

    res.send("SD");
});

function completeOneGame() {
    Game.find().where({progress: 0}).limit(10).exec(function (err, docs) {
        var count = docs.length;
        docs.forEach(function (doc) {
            Submission.findOne().where({submissionsId: doc.opponentSubmissionId}).exec(function (err, doc2) {
                if (doc == null) {
                    return;
                }

                var judge = new Judge(doc.code, doc.language, doc2.code, doc2.language);
                judge.startBattle(function (game) {
                    Game.update(
                        {submissionsId: doc.submissionsId},
                        {progress: 100, game: game},
                        {multi: false},
                        function (err) {
                            console.log(err);

                            console.log("game updated successfully");

                            count--;
                            if (count == 0) {
                                console.log("Completed one batch");
                                completeOneGame();
                            }
                        }
                    );

                    // console.log("game");

                    // console.log(JSON.stringify(game));
                });
            });
        });
    });
}

var loginMessage = "Oh Snap! You need to sign in to view that page!";
var submissionMessage = "Oh snap! You don't have permission to view this.";
var notStartedYetMessage = "Oh snap! Contest has not started yet.";
var endedMessage = "Oh snap! Contest has ended.";

router.get('/problem', function (req, res, next) {
    Contest.findOne().where({name: "AI"}).exec(function (err, doc) {
        var start = doc.startTime.getTime();
        var duration = doc.duration;

        var current = new Date().getTime();

        var started = false;
        var ended = false;
        if (current >= start && current <= (start + duration)) {
            started = true;
        } else if (current > (start + duration)) {
            ended = true;
        }

        if (started) {
            var id = req.cookies.id;
            if (!id) {
                var obj = {
                    error: loginMessage
                };
                res.send(JSON.stringify(obj));
            } else {
                User.findOne().where({
                    id: id
                }).exec(function (err, doc) {
                    if (err || doc == null) {
                        res.clearCookie("id");
                        //res.cookie('id' , '0', {expire : new Date()});
                        res.send(JSON.stringify(obj));
                    } else {
                        Submission.find().distinct('userName', function (error, userNames) {
                            userNames = ["DefaultBot"];
                            res.render('individual/problem', {title: 'Express', opponents: userNames});
                        });
                    }
                });
            }
        } else if (ended) {
            res.send(JSON.stringify({error: endedMessage}));
        } else {
            res.send(JSON.stringify({error: notStartedYetMessage}));
        }
    });
});

router.get('/submissions', function (req, res, next) {
    Contest.findOne().where({name: "AI"}).exec(function (err, doc) {
        var start = doc.startTime.getTime();
        var duration = doc.duration;

        var current = new Date().getTime();

        var started = false;
        var ended = false;
        if (current >= start && current <= (start + duration)) {
            started = true;
        } else if (current > (start + duration)) {
            ended = true;
        }

        if (started) {
            doForSubmission(req, res, next);
        } else if (ended) {
            res.send(JSON.stringify({error: endedMessage}));
        } else {
            res.send(JSON.stringify({error: notStartedYetMessage}));
        }
    });
});

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

router.get('/recentGames', function (req, res, next) {
    if (!req.query.page) {
        res.send(JSON.stringify({error: "Invalid page number!"}));
        return;
    } else if (!isInt(req.query.page) || req.query.page <= 0) {
        res.send(JSON.stringify({error: "Invalid page number!"}));
        return;
    }

    try {
        Submission.find({progress: 100}).skip(10 * req.query.page).limit(10).exec(function (err, docs) {
            docs.forEach(function (doc) {
                doc.languageName = getLanguageFromCode(doc.language);
            });

            res.render('individual/games', {docs: docs});
        });
    } catch (errr) {
        console.log(errr);
    }
});

router.get('/viewGame', function (req, res, next) {
    Submission.findOne().where({
            submissionsId: req.query.id
        })
        .sort('-submissionsId')
        .exec(function (err, doc) {
            if (err || doc == null) {
                res.send(JSON.stringify({error: submissionMessage}));
                return;
            }

            User.findOne().where({userName: doc.userName}).exec(function (err, doc1) {
                if (err) {
                    throw err;
                }
                var name1 = doc1.name;

                User.findOne().where({userName: doc.opponentUserName}).exec(function (err, doc2) {
                    if (err) {
                        throw err;
                    }

                    var name2 = doc2.name;
                    doc.languageName = getLanguageFromCode(doc.language);
                    doc.name1 = name1;
                    doc.name2 = name2;

                    res.render('individual/viewGame', {doc: doc});
                });
            });
        });
});

function doForSubmission(req, res, next) {
    var id = req.cookies.id;
    if (!id) {
        var obj = {
            error: loginMessage
        };
        res.send(JSON.stringify(obj));
    } else {
        User.findOne().where({
            id: id
        }).exec(function (err, doc) {
            if (err || doc == null) {
                res.clearCookie("id");
                res.send(JSON.stringify(obj));
            } else {
                var userName = doc.userName;
                Submission.find()
                    .where({userName: userName})
                    .sort('-submissionsId')
                    .exec(function (err, docs) {
                        docs.forEach(function (doc) {
                            doc.languageName = getLanguageFromCode(doc.language);
                        });

                        res.render('individual/submissions', {docs: docs});
                    });
            }
        });
    }
}

router.get('/viewSubmission', function (req, res, next) {
    var id = req.cookies.id;
    if (!id) {
        var obj = {
            error: loginMessage
        };
        res.send(JSON.stringify(obj));
    } else {
        User.findOne().where({
            id: id
        }).exec(function (err, doc) {
            if (err || doc == null) {
                res.clearCookie("id");
                res.send(JSON.stringify(obj));
            } else {
                var userName = doc.userName;
                var submissionsId = req.query.id;
                viewSubmission(userName, submissionsId, res);
            }
        });
    }
});

router.get('/leaderboard', function (req, res, next) {
    var userScores = {};

    Game.find().distinct('userName', function (error, userNames) {

        var count = userNames.length;

        userNames.forEach(function (userName) {
            // console.log(userName);
            Game.find().where({userName: userName}).exec(function (err, docs) {

                docs.forEach(function (doc) {
                    var game = doc.game;
                    var winner = game.winner;

                    if (typeof userScores[doc.userName] == 'undefined') {
                        userScores[doc.userName] = 0;
                    }
                    if (typeof userScores[doc.opponentUserName] == 'undefined') {
                        userScores[doc.opponentUserName] = 0;
                    }

                    if (winner == 1) {
                        userScores[doc.userName]++;
                    } else {
                        userScores[doc.opponentUserName]++;
                    }
                });

                count--;
                if (count == 0) {
                    var items = Object.keys(userScores).map(function(key) {
                        return [key, userScores[key]];
                    });
                    items.sort(function(first, second) {
                        return second[1] - first[1];
                    });

                    res.render('individual/leaderboard', {userScores: items});
                }
            });
        });
    });


});

router.get('/battles', function (req, res, next) {
    var userName = req.query.userName;
    if (userName === undefined || userName == "" || userName == null) {
        var obj = {
            error: "Oh snap! 404, page not found"
        };
        res.send(JSON.stringify(obj));

        return;
    }

    Game.find().where({userName: userName}).exec(function (err, docs1) {
        Game.find().where({opponentUserName: userName}).exec(function (err, docs2) {
            var docs = docs1.concat(docs2);

            res.render('individual/battles', {docs: docs});
        });
    });
});

router.get('/viewBattle', function (req, res, next) {
    Submission.findOne().where({
            submissionsId: req.query.id
        })
        .sort('-submissionsId')
        .exec(function (err, doc) {
            if (err || doc == null) {
                res.send(JSON.stringify({error: submissionMessage}));
                return;
            }

            User.findOne().where({userName: doc.userName}).exec(function (err, doc1) {
                if (err) {
                    throw err;
                }
                var name1 = doc1.name;

                User.findOne().where({userName: doc.opponentUserName}).exec(function (err, doc2) {
                    if (err) {
                        throw err;
                    }

                    var name2 = doc2.name;
                    doc.languageName = getLanguageFromCode(doc.language);
                    doc.name1 = name1;
                    doc.name2 = name2;

                    res.render('individual/viewGame', {doc: doc});
                });
            });
        });
});

router.get('/forum', function (req, res, next) {
    var id = req.cookies.id;
    if (!id) {
        var obj = {
            error: loginMessage
        };
        res.send(JSON.stringify(obj));
    } else {
        User.findOne().where({
            id: id
        }).exec(function (err, doc) {
            if (err || doc == null) {
                res.clearCookie("id");
                res.send(JSON.stringify(obj));
            } else {
                res.render('individual/forum');
            }
        });
    }
});

function viewSubmission(userName, submissionsId, res) {
    Submission.findOne().where({
            submissionsId: submissionsId,
            userName: userName
        })
        .sort('-submissionsId')
        .exec(function (err, doc) {
            if (err || doc == null) {
                res.send(JSON.stringify({error: submissionMessage}));
                return;
            }
            if (userName != doc.userName) {
                res.send(JSON.stringify({error: submissionMessage}));
                return;
            }

            User.findOne().where({userName: doc.userName}).exec(function (err, doc1) {
                if (err) {
                    throw err;
                }
                var name1 = doc1.name;

                User.findOne().where({userName: doc.opponentUserName}).exec(function (err, doc2) {
                    if (err) {
                        throw err;
                    }

                    var name2 = doc2.name;
                    doc.languageName = getLanguageFromCode(doc.language);
                    doc.name1 = name1;
                    doc.name2 = name2;

                    res.render('individual/viewSubmission', {doc: doc});
                });
            });
        });
}

router.get('/gamefinal', function (req, res, next) {
    var submissionsId = req.query.id;

    Game.findOne().where({
            submissionsId: submissionsId
        })
        .sort('-submissionsId')
        .exec(function (err, doc) {
            User.findOne().where({userName: doc.userName}).exec(function (err, doc1) {
                if (err) {
                    throw err;
                }
                var name1 = doc1.name;

                User.findOne().where({userName: doc.opponentUserName}).exec(function (err, doc2) {
                    if (err) {
                        throw err;
                    }

                    getLastSubmission(doc2.userName, function(doc3) {
                        var name2 = doc2.name;
                        doc.languageName = getLanguageFromCode(doc.language);
                        doc.name1 = name1;
                        doc.name2 = name2;
                        doc.languageName2 =  getLanguageFromCode(doc3.language);
                        doc.code2 = doc3.code;

                        res.render('individual/finalBattle', {doc: doc});
                    });
                });
            });
        });
});

router.get('*', function (req, res, next) {
    var obj = {
        error: "Oh snap! 404, page not found"
    };
    res.send(JSON.stringify(obj));
});

router.put('*', function (req, res, next) {
    var obj = {
        error: "Oh snap! 404, page not found"
    };
    res.send(JSON.stringify(obj));
});

router.post('*', function (req, res, next) {
    var obj = {
        error: "Oh snap! 404, page not found"
    };
    res.send(JSON.stringify(obj));
});

router.delete('*', function (req, res, next) {
    var obj = {
        error: "Oh snap! 404, page not found"
    };
    res.send(JSON.stringify(obj));
});

module.exports = router;

var getLanguageFromCode = function (code) {
    switch (code) {
        case 7:
            return "C/C++";
        case 8:
            return "Java";
        case 0:
            return "Python";
    }
};

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
            callback(doc);
        });
}