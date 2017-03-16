const defaultSettings = {
    width: 700,
    height: 500,
};

const spaceinvader = (canvasElement, userSettings = {}) => {
    const canvas = canvasElement;
    const ctx = canvas.getContext('2d');
    const settings = { ...defaultSettings, ...userSettings };
    const invaderWidth = 30;
    const invaderHeight = 20;
    const missileWidth = 2;
    const missileHeight = 5;

    let mouseX = 0;
    let mouseY = 0;
    let invaderX = 0;
    let invaderY = 0;
    const enemies = [];
    const missiles = [];

    const createEnemy = (initialX, initialY) => {
        let x = initialX;
        let y = initialY;
        const size = 50;
        return {
            draw() {
                x = mouseX;
                y = mouseY;
                ctx.fillStyle = 'rgba(0,0,0,.4)';
                ctx.fillRect(
                    x,
                    y,
                    size,
                    size,
                );
            },
            checkHit(missiles) {
                missiles.forEach(missile => {
                    if (
                        (missile.x > x && missile.x < x + size) &&
                        (missile.y > y && missile.y < y + size)
                    ) {
                        missile.hit();
                    }
                })
            },
        };
    };

    const createMissile = (initialX, initialY) => {
        const x = initialX + ((invaderWidth / 2) - (missileWidth / 2));
        let y = initialY;
        let hit = false;

        return {
            get x() {
                return x;
            },
            get y() {
                return y;
            },
            draw() {
                if (y < 0) {
                    this.remove();
                    return;
                }
                if (!hit) {
                    ctx.fillStyle = 'cyan';
                    ctx.fillRect(
                        x,
                        y,
                        missileWidth,
                        missileHeight,
                    );
                }
                y -= 5;
            },
            hit() {
                hit = true;
            },
            remove() {
                missiles.shift();
            },
        };
    };

    const invader = (x, y) => {
        ctx.fillStyle = 'tomato';
        invaderX = Math.max(Math.min(x - (invaderHeight / 2), canvas.width - invaderHeight), 0);
        invaderY = Math.max(Math.min(y - (invaderWidth / 2), canvas.height - invaderWidth), 0);

        ctx.fillRect(
            invaderX,
            invaderY,
            invaderWidth,
            invaderHeight,
        );
    };

    const mouseMoveHandler = (e) => {
        mouseX = e.clientX - canvas.offsetLeft;
        mouseY = e.clientY - canvas.offsetTop;
        missiles.push(createMissile(invaderX, invaderY));
    };

    const mouseDownHandler = () => {
        missiles.push(createMissile(invaderX, invaderY));
    };

    const addEventListeners = () => {
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mousedown', mouseDownHandler);
    };

    const render = () => {
        ctx.fillStyle = 'black';
        ctx.clearRect(
            0,
            0,
            settings.width,
            settings.height,
        );

        missiles.forEach(missile => missile.draw());
        enemies.forEach((enemy) => {
            enemy.draw();
            enemy.checkHit(missiles);
        });
        invader(mouseX, canvas.height - 10);

        requestAnimationFrame(render, canvas);
    };

    const init = () => {
        canvas.height = settings.height;
        canvas.width = settings.width;
        addEventListeners();
        render();
        enemies.push(createEnemy(100, 100));
    };

    init();
};

spaceinvader(document.getElementById('canvas'));
