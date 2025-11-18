const GameDir = document.getElementById('GameDir');
let Stones = [];
for (let i = 0; i < 15; i++) {
    Stones[i] = [];
    for (let j = 0; j < 15; j++) {
        const block = document.createElement('div');

        if (Stones[i][Math.max(0, j - 1)] && Math.random() > 0.2) {
            block.classList.add('wall');
            Stones[i][j] = 1;
        };

        if (Math.random() > 0.8) {
            block.classList.add('wall');
            Stones[i][j] = 1;
        };

        GameDir.appendChild(block);
    }
}

/*
let cols = 5;
let rows = 5;

let grid = new Array(cols);

let openSet = [];
let closedSet = [];

let start;
let end;
let path = [];
*/
