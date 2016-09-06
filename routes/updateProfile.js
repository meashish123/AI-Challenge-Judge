var express = require('express');
var router = express.Router();

var Models = require("../database/Models");
var User = Models.User;

var loginMessage = "Oh Snap! You need to sign in to view that page!";

router.post('/', function(req, res, next) {
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
                res.cookie('id' , '0', {expire : new Date()});
                res.send(JSON.stringify(obj));
            } else {
                doc.college = req.body.college;
                doc.year = req.body.year;
                doc.contact = req.body.contact;
                doc.save(function(err) {
                    if (err) {
                        res.send(JSON.stringify({error: "Error while updating"}));
                    } else {
                        res.send(JSON.stringify("Updated Successfully"));
                    }
                });
            }
        });
    }
});

module.exports = router;
