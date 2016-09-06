var request = require('request');

module.exports = function (code1, code2) {
    this.code1 = code1;
    this.code2 = code2;
    //this.state;
    this.game = {};

    this.start = function () {
        var n = 4, m = 4;
        state = create2dArray(n, m);
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < m; j++) {
                state[i][j] = 0;
            }
        }
        state[0][0] = 1;
        state[n - 1][m - 1] = 2;
        var player = 2;

        //console.log(toString(state, player));
        makeMove(state, 1, code1, code2);

        //var str = 'as \nadf     sfdsg wad';
        //var stringArray = str.trim().match(/\S+/g);
        //console.log(stringArray);

        //getOutput(this.code1, toString(state, player), function(result) {
        //    console.log(result);
        //});
    };
};

makeMove = function(state, player, code1, code2) {
    if (canMakeMove(state, player)) {
        var code = (player == 1) ? code1 : code2;

        getOutput(code, toString(state, player), function(result) {
            //console.log(result);
            var output = result.run_status.output;
            console.log(output);
            //return;
            var stringArray = output.trim().match(/\S+/g);

            var n = state.length;
            var m = state[0].length;

            var x = 0, y = 0;
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < m; j++) {
                    if (state[i][j] == player) {
                        x = i;
                        y = j;
                        break;
                    }
                }
            }

            var x2 = parseInt(stringArray[0]);
            var y2 = parseInt(stringArray[1]);

            state[x][y] = -1;
            state[x2][y2] = player;

            console.log(state);
            makeMove(state, (player == 1) ? 2 : 1, code1, code2);
        });
    } else {
        console.log((player == 1) ? 2 : 1, ' wins');
    }
};

var global;

getOutput = function(code, input, callback) {
    global = callback;
    var source = code;
    //var CLIENT_SECRET = '68495bf1346e48077bb8d92b894d2085dd2e0256';
    var CLIENT_SECRET = '2727ff1b6899521aea33c53d63eca50f4d2978b9';
    //console.log("Running App");
    var data = {
        'client_secret': CLIENT_SECRET,
        'async': 0,
        'source': source,
        'lang': "JAVA",
        'input': input,
        'time_limit': 1,
        'memory_limit': 262144
    };
    //console.log(source);

    request.post(
        'http://api.hackerearth.com/code/run/',
        {form: data},
        function (error, response, body) {
            //console.log('got response');
            if (error) {
                console.log('got Error:', error);
                getOutput(code, global);
            } else {
                var result = JSON.parse(body);
                if (result.compile_status == 'Error code: 1200') {
                    getOutput(code, global);
                } else {
                    callback(JSON.parse(body));
                }

                //console.log(body);

            }
        }
    );
};

var freeCell = 0;

create2dArray = function(rows, cols) {
    var x = new Array(rows);
    for (var i = 0; i < rows; i++) {
        x[i] = new Array(cols);
    }

    return x;
};

canMakeMove = function(state, player) {
    var n = state.length;
    var m = state[0].length;

    var x = 0, y = 0;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            if (state[i][j] == player) {
                x = i;
                y = j;
                break;
            }
        }
    }

    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (check(i, n) && check(j, m) && state[i][j] == freeCell) {
                return true;
            }
        }
    }

    return false;
};

check = function(x, n) {
    return x >= 0 && x < n;
};

toString = function(state, player) {
    var n = state.length;
    var m = state[0].length;

    var str = "".concat(n).concat(" ").concat(m).concat(" ");
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            str = str.concat(state[i][j]).concat(" ");
        }
    }
    str = str.concat(player);

    return str;
};