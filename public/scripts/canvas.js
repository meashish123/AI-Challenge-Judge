console.log(game);
console.log(progress);

if (progress == 100) {
    function getMoveFromOutput(output) {
        var nums = output.trim().split(/\s+/);

        return [parseInt(nums[0]), parseInt(nums[1])];
    }

    var multiple = 50;
    var state = {
        x1: [0], y1: [0],
        x2: [5], y2: [5],
        arr: [[[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]]],
        index: 0
    };

    for (var i = 0; i < game.moves.length; i++) {
        if (!game.moves[i].valid) {
            break;
        }

        state.x1.push(state.x1[i]);
        state.y1.push(state.y1[i]);
        state.x2.push(state.x2[i]);
        state.y2.push(state.y2[i]);

        state.arr.push(JSON.parse(JSON.stringify(state.arr[i])));

        var pos = getMoveFromOutput(game.moves[i].move);
        if (game.moves[i].player == 1) {
            state.arr[i + 1][state.x1[i]][state.y1[i]]--;

            state.x1[i + 1] = pos[0];
            state.y1[i + 1] = pos[1];
        } else {
            state.arr[i + 1][state.x2[i]][state.y2[i]]--;

            state.x2[i + 1] = pos[0];
            state.y2[i + 1] = pos[1];
        }
    }

    $('#layer0').drawImage({
        source: 'images/canvas/matrix.png',
        x: 0, y: 0,
        width: 6 * multiple,
        height: 6 * multiple,
        fromCenter: false
    });

    $('#layer1').drawImage({
        source: 'images/canvas/q1.png',
        x: 0, y: 0,
        layer: true,
        name: 'player1',
        fromCenter: false
    });
    $('#layer2').drawImage({
        source: 'images/canvas/q2.png',
        x: 5 * multiple, y: 5 * multiple,
        layer: true,
        name: 'player2',
        fromCenter: false
    });

    $("#next").click(function () {
        next();
    });

    $("#prev").click(function () {
        prev();
    });

    var intervalId, running = false;

    $("#play").click(function () {
        if (!running) {
            running = true;

            $("#play").addClass('stop-btn').removeClass('play-btn');
            $("#prev").prop('disabled', true);
            $("#next").prop('disabled', true);

            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(play, 750);
        } else {
            running = false;

            $("#play").removeClass('stop-btn').addClass('play-btn');
            $("#prev").prop('disabled', false);
            $("#next").prop('disabled', false);

            clearInterval(intervalId);
        }
    });

    $("#stop").click(function () {
        clearInterval(intervalId);
    });

    function next() {
        if (state.index >= state.arr.length - 1) {
            return;
        }
        state.index++;

        $('#layer1').animateLayer('player1', {
            y: state.x1[state.index] * multiple,
            x: state.y1[state.index] * multiple
        }, 400);
        $('#layer2').animateLayer('player2', {
            y: state.x2[state.index] * multiple,
            x: state.y2[state.index] * multiple
        }, 400);

        $('#layer3').clearCanvas();
        var arr = state.arr[state.index];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j] == 0) {
                    continue;
                }
                if ((-arr[i][j]) == 3) {
                    $('#layer3').drawRect({
                        fillStyle: "rgba(255, 210, 0, 0.5)",
                        y: i * multiple, x: j * multiple,
                        width: multiple,
                        height: multiple,
                        fromCenter: false
                    });

                    var p1 = [j * multiple, i * multiple];
                    var p2 = [(j + 1) * multiple, i * multiple];
                    var p3 = [(j + 1) * multiple, (i + 1) * multiple];
                    var p4 = [j * multiple, (i + 1) * multiple];

                    var color = "rgba(255, 210, 0, 1)";
                    if (i == 0 || arr[i][j] != arr[i - 1][j]) {
                        drawLine("#layer3", color, p1, p2);
                    }
                    if (j == 5 || arr[i][j] != arr[i][j + 1]) {
                        drawLine("#layer3", color, p2, p3);
                    }
                    if (i == 5 || arr[i][j] != arr[i + 1][j]) {
                        drawLine("#layer3", color, p3, p4);
                    }
                    if (j == 0 || arr[i][j] != arr[i][j - 1]) {
                        drawLine("#layer3", color, p4, p1);
                    }
                } else {
                    $('#layer3').drawImage({
                        source: 'images/canvas/c' + (-arr[i][j]) + '.png',
                        y: i * multiple, x: j * multiple,
                        fromCenter: false
                    });
                }
            }
        }
        $('#bob-' + state.index).css('background-color', '#EB3E36').css('color', 'white').css('opacity', '0.8');

        var oldTopValue = parseInt($("#moves-numbers").css('top'));
        $("#moves-numbers").animate({"top": "" + (oldTopValue - 33)}, 500);

    }

    function prev() {
        if (state.index <= 0) {
            return;
        }
        $('#bob-' + state.index).css('background-color', 'rgb(200, 200, 200)').css('color', 'black').css('opacity', '1');

        var oldTopValue = parseInt($("#moves-numbers").css('top'));
        $("#moves-numbers").animate({"top": "" + (oldTopValue + 33)}, 500);

        state.index--;

        $('#layer1').animateLayer('player1', {
            y: state.x1[state.index] * multiple,
            x: state.y1[state.index] * multiple
        }, 400);
        $('#layer2').animateLayer('player2', {
            y: state.x2[state.index] * multiple,
            x: state.y2[state.index] * multiple
        }, 400);

        $('#layer3').clearCanvas();
        var arr = state.arr[state.index];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j] == 0) {
                    continue;
                }
                if ((-arr[i][j]) == 3) {
                    $('#layer3').drawRect({
                        fillStyle: "rgba(255, 210, 0, 0.5)",
                        y: i * multiple, x: j * multiple,
                        width: multiple,
                        height: multiple,
                        fromCenter: false
                    });

                    var p1 = [j * multiple, i * multiple];
                    var p2 = [(j + 1) * multiple, i * multiple];
                    var p3 = [(j + 1) * multiple, (i + 1) * multiple];
                    var p4 = [j * multiple, (i + 1) * multiple];

                    var color = "rgba(255, 210, 0, 1)";
                    if (i == 0 || arr[i][j] != arr[i - 1][j]) {
                        drawLine("#layer3", color, p1, p2);
                    }
                    if (j == 5 || arr[i][j] != arr[i][j + 1]) {
                        drawLine("#layer3", color, p2, p3);
                    }
                    if (i == 5 || arr[i][j] != arr[i + 1][j]) {
                        drawLine("#layer3", color, p3, p4);
                    }
                    if (j == 0 || arr[i][j] != arr[i][j - 1]) {
                        drawLine("#layer3", color, p4, p1);
                    }
                } else {
                    $('#layer3').drawImage({
                        source: 'images/canvas/c' + (-arr[i][j]) + '.png',
                        y: i * multiple, x: j * multiple,
                        fromCenter: false
                    });
                }
            }
        }
    }

    function drawLine(canvas, color, p1, p2) {
        var x1 = p1[0], y1 = p1[1];
        var x2 = p2[0], y2 = p2[1];

        $(canvas).drawLine({
            strokeStyle: color,
            strokeWidth: 2,
            x1: x1, y1: y1,
            x2: x2, y2: y2
        });
    }

    var play = function () {
        console.log("playing");
        if (state.index >= state.arr.length - 1) {
            clearInterval(intervalId);
            running = false;
            $("#play").removeClass('stop-btn').addClass('play-btn');
            $("#prev").prop('disabled', false);
            $("#next").prop('disabled', false);

            return;
        }

        next();
    };
}