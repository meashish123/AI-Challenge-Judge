var express = require('express');
var router = express.Router();

var Models = require("../../database/Models");
var User = Models.User;
var Problem = Models.Problem;
var InfinitumSubmission = Models.InfinitumSubmission;

//router.get('/', function (req, res, next) {
//    res.render('individual/home', {title: 'Express'});
//});

var loginMessage = "Oh Snap! You need to sign in to view that page!";
var submissionMessage = "Oh snap! You don't have permission to view this.";

var hits = 0;

router.get('/', function (req, res, next) {
    //console.log("routes2 infinitium");
    res.render('infinitum/home');
});

router.get('/infinitum', function (req, res, next) {
    //console.log("routes2 infinitium");
    res.render('infinitum/home');
});

//console.log("before fetch users");


//console.log("finding users");
//User.find().select({
//    "_id": 0, "userName": 1
//}).exec(function (err, docs) {
//    if (!err) {
//        console.log("found users");
//    } else {
//        console.log("Error", err);
//    }
//});
//User.find().distinct('userName', function(err, userNames) {
//    User
//});


router.get('/leaderboard', function (req, res, next) {
    var userArray = [];
    var count = 0;

    User.find().distinct('userName', function(err, userNames) {
        console.log("users fetched", userNames.length);

        userNames.forEach(function(userName) {
            //console.log("doing for", userName);
            InfinitumSubmission.find().where({userName: userName}).exec(function(err, docs) {
                //console.log("found for ", userName);

                var score = 0;
                var time = 0;
                docs.forEach(function(doc) {
                    score += (Math.floor((doc.problemId - 1) / 5) + 1) * 10;
                    time = Math.max(time, doc.createdAt.getTime());
                });
                //console.log(time);

                User.findOne({userName: userName}).exec(function(err, doc) {
                    doc.score = score;
                    doc.time = "" + time;

                    userArray.push({
                        userName: userName,
                        score: score,
                        time: time
                    });
                    //console.log("pushed" , userName, score);

                    count++;
                    if (count == userNames.length) {
                        console.log("done for all");

                        userArray.sort(function(a, b) {
                            if (a.score != b.score) {
                                return  b.score - a.score;
                            }

                            return ("" + a.time).localeCompare(b.time);
                        });

                        //userArray.forEach(function(userArrayOne) {
                        //    console.log(userArrayOne.userName, userArrayOne.score);
                        //});
                        res.render('infinitum/leaderboard', {usersArray: userArray});
                        //console.log(userArray.length);
                    }

                    doc.save(function(err) {
                        if (!err) {
                            //console.log("doc saved", userName);
                        }
                    });
                });
                //console.log("j");
            });
        });
    });
    //console.log("generating leaderboard");
    //getLevelFromProblem(function (prob2Level) {
    //    console.log("done problem level");
    //
    //    InfinitumSubmission.find({})
    //        //    .select({
    //        //    "_id": 0, "userName": 1, "problemId": 1
    //        //})
    //        .exec(function (err, docs) {
    //            //if (err) {
    //            //    console.log("error", err);
    //            //}
    //            //
    //            //console.log(JSON.stringify(docs));
    //            //return;
    //
    //            console.log("submissions fetch");
    //
    //            var users = {};
    //
    //            docs.forEach(function (submission) {
    //                if (users["" + submission.userName] == undefined) {
    //                    users["" + submission.userName] = {
    //                        levelScore: [0, 0, 0, 0, 0, 0, 0],
    //                        problemDone: newFilledArray(31, 0),
    //                        maxProblem: 0,
    //                        maxTimeLong: 0,
    //                        maxTime: new Date()
    //                    };
    //                }
    //
    //                if (users["" + submission.userName].problemDone[submission.problemId] == 0) {
    //                    users["" + submission.userName].levelScore[prob2Level[submission.problemId]]++;
    //                    users["" + submission.userName].problemDone[submission.problemId] = 1;
    //
    //                    if (users["" + submission.userName].maxProblem < submission.problemId) {
    //                        users["" + submission.userName].maxProblem = submission.problemId;
    //                    }
    //
    //                    if (users["" + submission.userName].maxTimeLong < submission.createdAt.getTime()) {
    //                        users["" + submission.userName].maxTimeLong = submission.createdAt.getTime();
    //                        users["" + submission.userName].maxTime = submission.createdAt;
    //                    }
    //                }
    //            });
    //
    //            var usersArray = [];
    //
    //            for (var key in users) {
    //                var score = 0;
    //                for (var i = 1; i <= 6; i++) {
    //                    score += users[key].levelScore[i] * i * 10;
    //                }
    //                users[key].score = score;
    //
    //                //console.log(key, users[key].levelScore, users[key].maxTimeLong, users[key].score);
    //
    //                usersArray.push({
    //                    userName: key,
    //                    score: score,
    //                    maxTimeLong: users[key].maxTimeLong
    //                });
    //            }
    //
    //            usersArray.sort(function (a, b) {
    //                if (a.score > b.score) {
    //                    return -1;
    //                } else if (a.score < b.score) {
    //                    return 1;
    //                } else {
    //                    if (a.maxTimeLong < b.maxTimeLong) {
    //                        return -1;
    //                    } else if (a.maxTimeLong > b.maxTimeLong) {
    //                        return 1;
    //                    } else {
    //                        return 0;
    //                    }
    //                }
    //            });
    //
    //            //console.log(JSON.stringify(usersArray));
    //            res.render('infinitum/leaderboard', {usersArray: usersArray});
    //        });
    //});
});

function getLevelFromProblem(callback) {
    Problem.find().exec(function (err, docs) {
        var arr = newFilledArray(31, 0);

        docs.forEach(function (problem) {
            arr[problem.id] = problem.level;
        });

        //console.log(arr);
        callback(arr);
    });
}

function newFilledArray(len, val) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
}

router.get('/level', function (req, res, next) {

    console.log('level', hits);
    hits++;
    //res.render('infinitum/level', {title: 'AI', loggedIn: false});

    var id = req.cookies.id;
    if (!id) {
        res.send(JSON.stringify({error: loginMessage}));
    } else {
        User.findOne().where({
            id: id
        }).exec(function (err, user) {
            if (err || user == null) {
                res.clearCookie('id');
                res.send(JSON.stringify({error: loginMessage}));
            } else {
                var levelId = req.query.id;
                if (levelId == 1) {
                    level(user, req, res);
                } else if (levelId > 6 || levelId < 1) {
                    res.send(JSON.stringify({error: "Invalid level Id"}));
                } else {
                    isLevelAtleast3(user.userName, parseInt(levelId) - 1, function (lvl, tf) {
                        if (tf) {
                            level(user, req, res);
                        } else {
                            res.send(JSON.stringify({error: "Level is currently locked, solve at least 3 problems of previous level"}));
                        }
                    });
                }
            }
        });
    }
});

function level(user, req, res) {
    var levelId = req.query.id;

    //console.log("before level unlocked");

    Problem.find().where({level: levelId}).exec(function (err, problems) {
        if (err || problems.length == 0) {
            res.send(JSON.stringify({error: "Not a valid level"}));
        } else {
            var count = problems.length;

            problems.forEach(function (problem) {
                InfinitumSubmission.findOne().where({
                    userName: user.userName,
                    problemId: problem.id
                }).exec(function (err, doc) {
                    problem.solved = !(err || doc == null);

                    count--;

                    if (count == 0) {
                        res.render('infinitum/level', {level: levelId, problems: problems});
                    }
                });
            });
        }
    });
}

router.get('/problem', function (req, res, next) {

    //res.render('infinitum/level', {title: 'AI', loggedIn: false});

    var id = req.cookies.id;
    if (!id) {
        res.send(JSON.stringify({error: loginMessage}));
    } else {
        User.findOne().where({
            id: id
        }).exec(function (err, user) {
            if (err || user == null) {
                res.clearCookie('id');
                res.send(JSON.stringify({error: loginMessage}));
            } else {
                var problemId = req.query.id;

                //console.log("here problem id" + problemId);
                Problem.findOne().where({id: problemId}).exec(function (err, problem) {
                    if (err || problem == null) {
                        res.send(JSON.stringify({error: "Not a valid problem"}));
                    } else {
                        checkAndSendProblem(user, problem, req, res);
                    }
                });
            }
        });
    }
});

function checkAndSendProblem(user, problem, req, res) {
    if (problem.level == 1) {
        res.render('infinitum/problem', {problem: problem});
    } else {
        isLevelAtleast3(user.userName, problem.level - 1, function (lvl, tf) {
            if (tf) {
                res.render('infinitum/problem', {problem: problem});
            } else {
                res.send(JSON.stringify({error: 'Problem belongs to the locked level.'}));
            }
        });
    }
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