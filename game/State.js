module.exports = function (x1, y1, x2, y2) {
    this.state = [];
    this.player1 = [x1, y1];
    this.player2 = [x2, y2];

    var n = 6, m = 6;
    for (var i = 0; i < n; i++) {
        this.state.push([]);

        for (var j = 0; j < m; j++) {
            this.state[i].push(0);
        }
    }

    this.size = [n, m];

    this.toString = function (player) {
        var str = [];
        for (var i = 0; i < this.state.length; i++) {
            str.push(this.state[i].join(' '));
        }

        return player + "\n" + str.join('\n') + "\n" + this.player1.join(" ") + "\n" + this.player2.join(" ") + "\n";
    };

    this.getPosition = function (player) {
        var position;
        if (player == 1) {
            position = this.player1;
        } else {
            position = this.player2;
        }

        return position;
    };

    this.setPosition = function (player, move) {
        if (player == 1) {
            this.player1 = [move[0], move[1]];
        } else {
            this.player2 = [move[0], move[1]];
        }
    };

    this.canMakeMove = function (player) {
        var position = this.getPosition(player);
        var position2 = this.getPosition(3 - player);

        for (var i = position[0] - 1; i <= position[0] + 1; i++) {
            for (var j = position[1] - 1; j <= position[1] + 1; j++) {
                if (i == position[0] && j == position[1]) {
                    continue;
                }

                if (!check(i, n) || !check(j, m)) {
                    continue;
                }

                if (this.state[i][j] <= -3) {
                    continue;
                }

                if (i == position2[0] && j == position2[1]) {
                    continue;
                }

                return true;
            }
        }

        return false;
    };

    this.get = function(i, j) {
        return this.state[i][j];
    }

    this.decrement = function(i, j) {
        this.state[i][j]--;
    }
};

var check = function (a, n) {
    return (a >= 0 && a < n);
};