var Rule = require('../game/Rule');
var Compiler = require('compiler');

// 2 TLE: "\nExecution Timed Out"
// 1 Compilation Error: "Compilation Failed\n"
// 3 RTE:

var OK = 0;
var compilationError = 1;
var TLE = 2;
var RTE = 3;

module.exports = function (code1, lang1, code2, lang2) {
    this.startBattle = function (callback) {
        var state = Rule.getInitialState();
        var playerToPlay = 1;

        var gm = {
            moves: []
        };

        play(state, code1, lang1, code2, lang2, playerToPlay, gm, function (game) {
            callback(game);
        }, 0);
    }
};


var play = function (state, code1, lang1, code2, lang2, player, game, callback, count) {
    count++;
    console.log("Running", count);
    //console.log(state.toString(player));

    var code, lang;
    if (player == 1) {
        code = code1;
        lang = lang1;
    } else {
        code = code2;
        lang = lang2;
    }

    if (!state.canMakeMove(player)) {
        //console.log("Player", player, "cannot Make move");

        console.log("count", count);
        game.winner = 3 - player;
        callback(game);
        return;
    }

    Compiler.compile(lang, code, state.toString(player), function (data) {
        //console.log("output: ", JSON.stringify(data.output));
        //console.log("error: ", JSON.stringify(data.errors));
        //console.log("time: ", JSON.stringify(data.time));

        var moveObject = {
            player: player,
            //state: JSON.parse(JSON.stringify(state.state)),
            move: data.output,
            time: data.time,
            error: data.errors
        };

        if (data.output == "\nExecution Timed Out") {
            moveObject.status = TLE;
            moveObject.valid = false;
        } else if (data.output == "Compilation Failed\n") {
            moveObject.status = compilationError;
            moveObject.valid = false;
        } else if (data.errors.length > 0) {
            moveObject.status = RTE;
            moveObject.valid = false;
        } else {
            moveObject.status = OK;
        }

        if (!Rule.isValidOutput(data.output)) {
            //console.log("Invalid Output");

            moveObject.valid = false;
            game.moves.push(moveObject);

            game.winner = 3 - player;
            callback(game);
            return;
        }

        var move = Rule.getMoveFromOutput(data.output);

        if (!Rule.isValidMove(state, player, move)) {
            //console.log("Invalid Move");

            moveObject.valid = false;
            game.moves.push(moveObject);

            game.winner = 3 - player;
            callback(game);
            return;
        }

        moveObject.valid = true;
        game.moves.push(moveObject);

        var finalState = Rule.nextState(state, player, move);
        player = 3 - player;
        play(finalState, code1, lang1, code2, lang2, player, game, callback, count);
    });
};