var State = require('./State');

exports.getInitialState = function () {
    return new State(0, 0, 5, 5);
};

var isValidOutputFormat = function (output) {
    var nums = output.trim().split(/\s+/);

    if (nums.length > 2) {
        return false;
    }

    return isInt(nums[0]) && isInt(nums[1]);
};

var getMoveFromOutput = function(output) {
    var nums = output.trim().split(/\s+/);

    return [parseInt(nums[0]), parseInt(nums[1])];
};

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

var isValidMove = function (state, player, move) {
    if (!check(move[0], state.size[0]) || !check(move[1], state.size[1])) {
        return false;
    }

    var position = state.getPosition(player);

    var diff1 = Math.abs(position[0] - move[0]);
    var diff2 = Math.abs(position[1] - move[1]);

    if (diff1 > 1 || diff2 > 1) {
        return false;
    }

    var position2 = state.getPosition(3 - player);
    if (move[0] == position2[0] && move[1] == position2[1]) {
        return false;
    }

    if (move[0] == position[0] && move[1] == position[1]) {
        return false;
    }

    return !(state.get(move[0], move[1]) <= -3 || state.get(move[0], move[1]) > 0);
};

var nextState = function (state, player, move) {
    if (!isValidMove(state, player, move)) {
        return false;
    }

    var position = state.getPosition(player);
    state.decrement(position[0], position[1]);

    state.setPosition(player, move);

    return state;
};

var check = function (a, n) {
    return (a >= 0 && a < n);
};

exports.isValidMove = isValidMove;
exports.nextState = nextState;
exports.isValidOutput = isValidOutputFormat;
exports.getMoveFromOutput = getMoveFromOutput;