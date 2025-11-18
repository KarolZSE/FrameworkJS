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

let x = 0, y = 15;
const Player = document.getElementById('Player');
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() == 'w') {
        if (Stones[y - 1][x]) return;
        y--;
        Player.style.top = Number(Player.offsetTop) - 40 + 'px';
    };

    if (e.key.toLowerCase() == 's') {
        if (Stones[y + 1][x]) return;
        y++;
        Player.style.top = Number(Player.offsetTop) + 40 + 'px';
    };

    if (e.key.toLowerCase() == 'a') {
        if (Stones[y][x - 1]) return;
        x--;
        Player.style.left = Number(Player.offsetLeft) - 40 + 'px';
    };

    if (e.key.toLowerCase() == 'd') {
        if (Stones[y][x + 1]) return;
        x++;
        Player.style.left = Number(Player.offsetLeft) + 40 + 'px';
    };

});

// window.onerror = () => true;

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
