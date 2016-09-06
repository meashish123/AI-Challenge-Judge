var express = require('express');
var router = express.Router();

var Models = require("../database/Models");
var Problem = Models.Problem;

router.post('/', function(req, res, next) {
    var problem = new Problem({
        id: req.body.problemId,
        name: req.body.name,
        statement: req.body.statement,
        level: req.body.level,
        answer: req.body.answer
    });

    problem.save(function(err) {
        if (err) {
            res.send('error while adding');
        } else {
            res.send('respond with a resource');
        }
    });
});

module.exports = router;