const GameDir = document.getElementById('GameDir');
let Stones = [];
let Elements = [];

let x = 0, y = 0;
const Player = document.getElementById('Player');

function GridMaking() {
    Stones = [];
    Elements = [];

    GameDir.innerHTML = '';
    x = 0, y = 0;

    for (let i = 0; i < 15; i++) {
        Stones[i] = [];
        Elements[i] = [];
        for (let j = 0; j < 15; j++) {
            const block = document.createElement('div');

            Elements[i][j] = block;
            // block.textContent = j;

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

            if ((j == 0 || j == 14 || i == 0 || i == 14) && Math.random() > 0.9) {
                block.classList.remove('wall');
                block.classList.add('door');
                Stones[i][j] = 2;
            }

            if (j == 0 && i == 0) {
                const Rect = GameDir.getBoundingClientRect();
                Player.style.left = Rect.left + 1 + 'px';
                Player.style.top = Rect.top + 1 + 'px';
            }

            GameDir.appendChild(block);

            if (!Stones[i][j] && Math.random() > 0.9) {
                const Monster = document.createElement('div');
                Monster.classList.add('monster');
                block.appendChild(Monster);
            }
        }
    } 
};

GridMaking();
// console.log(Elements);
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() == 'w') {
        if (y - 1 < 0 || Stones[y - 1][x] == 1) return;
        y--;
        Player.style.top = Number(Player.offsetTop) - 40 + 'px';
    };

    if (e.key.toLowerCase() == 's') {
        if (y + 1 >= 15 || Stones[y + 1][x] == 1) return;
        y++;
        Player.style.top = Number(Player.offsetTop) + 40 + 'px';
    };

    if (e.key.toLowerCase() == 'a') {
        if (x - 1 < 0 || Stones[y][x - 1] == 1) return;
        x--;
        Player.style.left = Number(Player.offsetLeft) - 40 + 'px';
    };

    if (e.key.toLowerCase() == 'd') {
        if (x + 1 >= 15 || Stones[y][x + 1] == 1) return;
        x++;
        Player.style.left = Number(Player.offsetLeft) + 40 + 'px';
    };

    if (Stones[y][x] == 2) {
        console.log('test');
        GridMaking();
    }

    const monsters = getMonsters();

    for (let m of monsters) {
        const path = astar({ x: m.x, y: m.y }, { x, y });

        if (path && path.length > 0) {
            const next = path[0];

            Elements[m.y][m.x].removeChild(m.el);

            m.x = next.x;
            m.y = next.y;

            Elements[m.y][m.x].appendChild(m.el);
        }
        
    }

});

// window.onerror = () => true;

function astar(start, goal) {
    let openSet = [];
    let closedSet = new Set();
    let cameFrom = {};

    const gScore = {};
    const fScore = {};

    const key = (x, y) => `${x}, ${y}`;

    const heuristic = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

    let startkey = key(start.x, start.y);
    gScore[startkey] = 0;
    fScore[startkey] = heuristic(start.x, start.y, goal.x, goal.y);

    openSet.push({ x: start.x, y: start.y, f: fScore[startkey]});

    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        const curKey = key(current.x, current.y);

        if (current.x === goal.x && current.y === goal.y) {
            const path = [];
            let k = curKey;
            while (k in cameFrom) {
                const [px, py] = cameFrom[k].split(',').map(Number);
                const [cx, cy] = k.split(',').map(Number);
                path.unshift({ x: cx, y: cy });
                k = key(px, py);
            }

            return path;
        }

        closedSet.add(curKey);

        for (const d of directions) {
            const nx = current.x + d.x;
            const ny = current.y + d.y;

            if (
                nx < 0 || nx >= 15 ||
                ny < 0 || ny >= 15 ||
                Stones[ny][nx] === 1
            ) continue;

            const neighKey = key(nx, ny);

            if (closedSet.has(neighKey)) continue;

            const tentativeG = gScore[curKey] + 1;

            if (!(neighKey in gScore) || tentativeG < gScore[neighKey]) {
                cameFrom[neighKey] = curKey;
                gScore[neighKey] = tentativeG;
                fScore[neighKey] = tentativeG + heuristic(nx, ny, goal.x, goal.y);

                if (!openSet.some(n => n.x === nx && n.y === ny)) {
                    openSet.push({ x: nx, y: ny, f: fScore[neighKey] });
                }
            }
        }
    }

    return null;
}

function getMonsters() {
    let monsters = [];
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (Elements[i][j].firstChild && Elements[i][j].firstChild.classList.contains('monster')) {
                monsters.push({
                    el: Elements[i][j].firstChild,
                    x: j,
                    y: i
                });
            }
        }
    }

    return monsters;
}