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
                    moveEnemy();
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

            // Player spawn
            if (j == 0 && i == 0) {
                const Rect = GameDir.getBoundingClientRect();
                Player.style.left = Rect.left + 1 + 'px';
                Player.style.top = Rect.top + 1 + 'px';
            }

            GameDir.appendChild(block);

            // Monster Spawn
            if (!Stones[i][j] && Math.random() > 0.9) {
                const Monster = document.createElement('div');
                Monster.classList.add('monster');
                block.appendChild(Monster);
            }

            // Chests Spawn
            if (!Stones[i][j] && Math.random() > 0.99) {
                const Chest = document.createElement('div');
                block.addEventListener('click', () => {});
                Chest.classList.add('chest');
                block.classList.remove('wall');
                Stones[i][j] = 3;
                block.appendChild(Chest);

            }
        }
    } 
};

let InFight = true;
const PotionCount = document.getElementById('PotionCount');

GridMaking();
// console.log(Elements);
document.addEventListener('keydown', (e) => {
    if (InFight) return;
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
        Player.style.transform = 'scaleX(1)';
    };

    if (e.key.toLowerCase() == 'd') {
        if (x + 1 >= 15 || Stones[y][x + 1] == 1) return;
        x++;
        Player.style.left = Number(Player.offsetLeft) + 40 + 'px';
        Player.style.transform = 'scaleX(-1)';
    };

    if (Stones[y][x] == 2) {
        console.log('test');
        PotionCount.textContent = Number(PotionCount.textContent) + 1;
        GridMaking();
    }

    if (Stones[y][x] == 3) {
        InfoMenu.style.display = 'inline';
        Elements[y][x].innerHTML = '';
        Stones[y][x] = 0;
        RandomDrop();
    }

    moveEnemy();
});

function moveEnemy() {
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
        
        if (m.x === x && m.y === y) {
            Elements[m.y][m.x].removeChild(m.el);
            console.log('Enemy Touched the player');
            break;
        }
    }
}
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
            const cell = Elements[i][j];
            if (!cell) continue;
            const child = cell.firstChild;
            if (child && child.classList && child.classList.contains('monster')) {
                monsters.push({
                    el: child,
                    x: j,
                    y: i
                });
            }
        }
    }

    return monsters;
}

// Inventory Placeholder

const Inv = document.getElementById('Inventory');

let Slots = [];
let SlotFull = [];
    for (let i = 0; i < 5; i++) {
        Slots[i] = [];
        SlotFull[i] = [];
        for (let j = 0; j < 9; j++) {
            const slot = document.createElement('div');
            Slots[i][j] = slot;
            slot.draggable = 'true';
            Inv.appendChild(slot);
        }
    }

const InfoMenu = document.getElementById('InfoMenu');
const IMG = document.querySelector('InfoMenu img');
const Rarity = document.getElementById('Rarity');
const ItemType = document.getElementById('ItemType');
let global = {};
global['Weapon'] = 0;
global['Armor'] = 0;
let equipped = {};

InfoMenu.addEventListener('click', () => {
    InfoMenu.style.display = 'none';
})

function RandomDrop() {
    let Placed, Type;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 9; j++) {
            if (!Slots[i][j].dataset.type && !Placed) {
    let temp1 = Math.random();
    let x, y, r;
    if (temp1 > 0.99) {
        Rarity.textContent = 'Legendary';
        y = 3
        r = 5
    } else if (temp1 > 0.95) {
        Rarity.textContent = 'Epic';
        y = 2
        r = 4
    } else if (temp1 > 0.8) {
        Rarity.textContent = 'Rare';
        y = 1
        r = 3
    }  else if (temp1 > 0.5) {
        Rarity.textContent = 'Uncommon';
        y = 4
        r = 2
    } else {
        Rarity.textContent = 'Common';
        y = 0
        r = 1
    }

    if (Math.random() > 0.5) {
        Type = 'Armor';
        let temp2 = Math.random();
        if (temp2 > 0.75) {
            Slots[i][j].dataset.type = "Chestplate";
            ItemType.textContent = 'Chestplate';
            x = 0;
        } else if (temp2 > 0.5) {
            Slots[i][j].dataset.type = "Helmet";
            ItemType.textContent = 'Helmet';
            x = 1;
        } else if (temp2 > 0.25) {
            Slots[i][j].dataset.type = "Shield";
            ItemType.textContent = 'Shield';
            x = 2;
        } else {
            Slots[i][j].dataset.type = "Boots";
            ItemType.textContent = 'Boots';
            x = 3;
        }
    } else {
        Type = 'Weapon';
        Slots[i][j].dataset.type = 'Sword';
        ItemType.textContent = 'Sword';
        x = 4;
    }

                Slots[i][j].classList.add('FullSlot');
                document.getElementById('Preview').style.backgroundPosition = `-${300 * x}px -${300 * y}px`;
                Slots[i][j].style.backgroundPosition = `-${60 * x}px -${60 * y}px`;
                Placed = true;

                Slots[i][j].addEventListener("click", () => {
                    moveEnemy();
                    let temp = document.getElementById(Slots[i][j].dataset.type).style;

                    if (!global[Type]) global[Type] = 0;

                    if (equipped[Slots[i][j].dataset.type]) {
                        const current = equipped[Slots[i][j].dataset.type];

                        if (current.y === y) return;
    
                        global[Type] -= current.r * 100 / 4;
                    };

                    // if (temp.backgroundPositionY / 80 == y) return; 
                    temp.backgroundPosition = `-${80 * x}px -${80 * y}px`;
                    
                    global[Type] += r * 100 / 4;
                    document.getElementById(`${Type}Proc`).textContent = global[Type];

                    equipped[Slots[i][j].dataset.type] = { x, y, r};
                });
            }
        }
    }
}

// Button functionality
const PlayerLevel = document.getElementById('PlayerLevel');
const EnemyHealth = document.getElementById('EnemyHealth');
const EnemyHealthBar = document.getElementById('EnemyHealthBar');
const SlashAnimation = document.getElementById('SlashAnimation');
const PlayerHealth = document.getElementById('PlayerHealth');

const buttons = document.querySelectorAll('.button');
let HeavyAttack = false;

buttons.forEach(e => {
    e.addEventListener('click', () => {
        if (e.textContent === 'Attack') {
            EnemyHealth.textContent = (Number(EnemyHealth.textContent) - Number(PlayerLevel.textContent) * (global['Weapon'] / 100 + 1) * Math.random() * 2).toFixed(2);
            
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    console.log('bruh');
                    SlashAnimation.style.backgroundPosition = `-${i * 250}px 0`;
                }, 100 * i); 
            }
            setTimeout(() => {
                SlashAnimation.style.backgroundPosition = `-2500px 0`;                
            }, 500);
        }

        if (e.textContent === 'Heavy Attack' && HeavyAttack) {
            HeavyAttack = false;
            EnemyHealth.textContent = (Number(EnemyHealth.textContent) - Number(PlayerLevel.textContent) * (global['Weapon'] / 100 + 1) * Math.random() * 2 * 3).toFixed(2);
            
            for (let i = 5; i < 9; i++) {
                setTimeout(() => {
                    SlashAnimation.style.backgroundPosition = `-${i * 250}px 0`;
                }, 100 * (i - 5)); 
            }
            setTimeout(() => {
                SlashAnimation.style.backgroundPosition = `-2500px 0`;                
            }, 500);
        } else if (e.textContent === 'Heavy Attack') {
            console.log('heavy attack on!');
            HeavyAttack = true;
        }

        if (e.textContent === 'Heal') {
            PotionCount.textContent = Number(PotionCount.textContent) - 1;
            console.log(Number(PlayerHealth.textContent), Math.random() * 50)
            PlayerHealth.textContent = Math.min(100, Number(PlayerHealth.textContent) + Math.random() * 50);
        };

        EnemyHealthBar.style.background = `linear-gradient(to left, red ${100 - Number(EnemyHealth.textContent)}%, green 1%, green)`;
        if (Number(EnemyHealth.textContent) <= 0) {
            FightScreen.style.display = 'none';
            InFight = false;
            console.log('Enemy Lost')
        }
    });
});

function EnemyAttack() {
    
}