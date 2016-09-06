var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");

var Models = require("../../database/Models");
var User = Models.User;

router.get('/', function (req, res, next) {
    res.render('infinitum/login');
});

router.post('/', function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;

    //console.log("Cookies :  ", req.cookies);
    //console.log("received userName password", userName, password);
    //console.log(randomstring.generate(60));

    User.findOne().where({
        userName: userName,
        password: password
    }).exec(function(err, doc) {
        if (err || doc == null) {
            var obj = {
                error: "Incorrect userName or password!"
            };
            res.clearCookie("id");
            //res.cookie('id' , '0', {expire : new Date()});
            //res.send(JSON.stringify(obj));
            res.render('infinitum/login', {error: "Incorrect userName or password!"});
        } else {
            var obj = "Logged in successfully";
            res.cookie('id' , doc.id, {expire : new Date() + 9999});
            //res.send(JSON.stringify(obj));

            //console.log('here i m sending to infinitum');

            res.redirect('/infinitum');
        }
    });

    //var name = req.body.name;
    //var email = req.body.email;
    //var userName = email.split('@')[0];
    //
    //User.findOne().where({
    //    userName: userName,
    //    email: email
    //}).exec(function(err, doc) {
    //    var genId = randomstring.generate(40);
    //    if (err || doc == null) {
    //        var user = new User({
    //            userName: userName,
    //            name: name,
    //            email: email,
    //            id: genId
    //        });
    //        user.save(function (err) {
    //            if (err) {
    //                res.send(JSON.stringify({error: "Error while register"}));
    //            } else {
    //                var obj = "Logged in successfully";
    //                res.cookie('id' , genId, {expire : new Date() + 9999});
    //                res.send(JSON.stringify(obj));
    //                //res.send(JSON.stringify("Registered Successfully"));
    //            }
    //        });
    //    } else {
    //        var obj = "Logged in successfully";
    //        res.cookie('id' , doc.id, {expire : new Date() + 9999});
    //        res.send(JSON.stringify(obj));
    //    }
    //
    //    //res.cookie('id' , doc.id, {expire : new Date() + 9999});
    //});
    //
    //console.log(name, email, userName);
    //
    ////res.send("successfull");
});

module.exports = router;