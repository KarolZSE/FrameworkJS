const GameDir = document.getElementById('GameDir');
let Stones = [];
for (let i = 0; i < 15; i++) {
    Stones[i] = [];
    for (let j = 0; j < 15; j++) {
        const block = document.createElement('div');

        if (Stones[i][Math.max(0, j - 1)] && Math.random() > 0.2) {
            WallMaking();
        } else if (Math.random() > 0.8) {
            WallMaking();
        };

        function WallMaking() {
            block.classList.add('wall');
            Stones[i][j] = 1;

            let destruction_level = 0;
            block.addEventListener('click', () => {
                if (++destruction_level >= 4) {
                    Stones[i][j] = 0;
                    block.classList.remove('wall');
                    block.textContent = '';
                } else {
                    block.textContent = destruction_level;
                }   
            });
        };

        GameDir.appendChild(block);
    }
}

let x = 0, y = 0;
const Player = document.getElementById('Player');
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() == 'w') {
        if (y - 1 < 0 || Stones[y - 1][x]) return;
        y--;
        Player.style.top = Number(Player.offsetTop) - 40 + 'px';
    };

    if (e.key.toLowerCase() == 's') {
        if (y + 1 >= 15 || Stones[y + 1][x]) return;
        y++;
        Player.style.top = Number(Player.offsetTop) + 40 + 'px';
    };

    if (e.key.toLowerCase() == 'a') {
        if (x - 1 < 0 || Stones[y][x - 1]) return;
        x--;
        Player.style.left = Number(Player.offsetLeft) - 40 + 'px';
    };

    if (e.key.toLowerCase() == 'd') {
        if (x + 1 >= 15 || Stones[y][x + 1]) return;
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
