import range from './utils/range';


const defaultSettings = {
    width: 700,
    height: 500,
};

const spaceInvader = (canvasElement, userSettings = {}) => {
    const canvas = canvasElement;
    const ctx = canvas.getContext('2d');
    const settings = { ...defaultSettings, ...userSettings };
    const CANVAS_WIDTH = settings.width;
    const CANVAS_HEIGHT = settings.height;
    const PLAYER_WIDTH = 30;
    const PLAYER_HEIGHT = 20;
    const INVADER_WIDTH = 40;
    const INVADER_HEIGHT = 26;
    const INVADER_PLANE_WIDTH = INVADER_WIDTH * 8;
    const INVADER_PLANE_HEIGHT = INVADER_HEIGHT * 5;
    const MISSILE_WIDTH = 4;
    const MISSILE_HEIGHT = 8;

    let mouseX = 0;
    let mouseY = 0;
    let playerX = 0;
    let playerY = 0;
    let invaderPlane = null;
    const missiles = [];

    const createInvader = (initialX, initialY) => {
        let didHit = false;
        let x = initialX;
        let y = initialY;
        return {
            get didHit() { return didHit; },
            draw() {
                if (!didHit) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(
                        x,
                        y,
                        INVADER_WIDTH,
                        INVADER_HEIGHT,
                    );
                }
                y += 1;
            },
            checkHit(hits) {
                hits.forEach((hit) => {
                    if (
                        (!hit.didHit) &&
                        (!didHit) &&
                        (hit.x + MISSILE_WIDTH > x && hit.x < x + INVADER_WIDTH) &&
                        (hit.y + MISSILE_HEIGHT > y && hit.y < y + INVADER_HEIGHT)
                    ) {
                        hit.hit();
                        this.hit();
                        this.destroy();
                    }
                });
            },
            hit() {
                didHit = true;
            },
            destroy() {
                setTimeout(() => {
                    enemies.splice(enemies.indexOf(this), 1);
                }, 0);
            },
        };
    };

    const createInvaderPlane = () => {
        const invaders = [];
        let x = (CANVAS_WIDTH - INVADER_PLANE_WIDTH) / 2;
        let y = 10;
        let goingLeft = true;

        return {
            draw() {
                ctx.fillStyle = 'rgba(255,50,50,.2)';
                ctx.fillRect(
                    x,
                    y,
                    INVADER_PLANE_WIDTH,
                    INVADER_PLANE_HEIGHT,
                );
                if (goingLeft) {
                    x += 18;
                } else {
                    x -= 18;
                }
                if (x + INVADER_PLANE_WIDTH > CANVAS_WIDTH) {
                    goingLeft = false;
                    y += INVADER_HEIGHT;
                }
                if (x < 0) {
                    goingLeft = true;
                    y += INVADER_HEIGHT;
                }
                if (y + INVADER_PLANE_HEIGHT > CANVAS_HEIGHT + INVADER_HEIGHT) {
                    startGame();
                }
            },
        };
    };

    const createMissile = (initialX, initialY) => {
        const x = initialX + ((PLAYER_WIDTH / 2) - (MISSILE_WIDTH / 2));
        let y = initialY;
        let didHit = false;

        return {
            get x() {
                return x;
            },
            get y() {
                return y;
            },
            get didHit() { return didHit; },
            draw() {
                if (y < 0) {
                    this.remove();
                    return;
                }
                if (!didHit) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(
                        x,
                        y,
                        MISSILE_WIDTH,
                        MISSILE_HEIGHT,
                    );
                }
                y -= 5;
            },
            hit() {
                didHit = true;
            },
            remove() {
                setTimeout(() => {
                    missiles.splice(missiles.indexOf(this), 1);
                }, 0);
            },
        };
    };

    const player = (x, y) => {
        ctx.fillStyle = 'tomato';
        playerX = Math.max(Math.min((x - (PLAYER_WIDTH / 2)), canvas.width - PLAYER_WIDTH), 0);
        playerY = Math.max(Math.min((y - (PLAYER_HEIGHT / 2)), canvas.height - PLAYER_HEIGHT), 0); // eslint-disable-line max-len

        ctx.fillRect(
            playerX,
            playerY,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
        );
    };

    const mouseMoveHandler = (e) => {
        mouseX = e.clientX - canvas.offsetLeft;
        mouseY = e.clientY - canvas.offsetTop;
    };

    const mouseDownHandler = () => {
        missiles.push(createMissile(playerX, playerY));
    };

    const addEventListeners = () => {
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mousedown', mouseDownHandler);
    };

    const render = () => {
        ctx.clearRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
        );

        missiles.forEach(missile => missile.draw());
        player(mouseX, canvas.height - 60);

        invaderPlane.draw();

        requestAnimationFrame(render, canvas);
    };

    const gameOver = () => {

    }

    const startGame = () => {
        missiles.splice(0, missiles.length);
        invaderPlane = createInvaderPlane();
    };

    const init = () => {
        canvas.height = CANVAS_HEIGHT;
        canvas.width = CANVAS_WIDTH;
        addEventListeners();
        startGame();
        render();
        // setInterval(() => {
        //     enemies.push(createInvader(CANVAS_WIDTH / 2, 100));
        // }, 1000);
    };

    init();
};

spaceInvader(document.getElementById('canvas'));
