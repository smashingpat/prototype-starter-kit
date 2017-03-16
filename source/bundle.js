const defaultSettings = {
    width: 500,
    height: 300,
};

const spaceinvader = (canvasElement, userSettings = {}) => {
    const canvas = canvasElement;
    const ctx = canvas.getContext('2d');
    const settings = { ...defaultSettings, ...userSettings };

    let mouseX = 0;
    let mouseY = 0;
    const missiles = [];

    const createMissile = (initialX, initialY) => {
        let x = initialX;
        let y = initialY;

        return {
            draw() {
                ctx.fillStyle = 'white';
                ctx.fillRect(
                    x,
                    y,
                    10,
                    40,
                );
                y -= 5;
            },
        };
    };

    const invader = (x, y) => {
        const size = 50;

        ctx.fillStyle = 'white';
        ctx.fillRect(
            x - (size / 2),
            y - (size / 2),
            size,
            size,
        );
    };

    const addEventListeners = () => {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - canvas.offsetLeft;
            mouseY = e.clientY - canvas.offsetTop;
        });
        document.addEventListener('mousedown', () => {
            missiles.push(createMissile(mouseX, mouseY));
        });
    };

    const render = () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(
            0,
            0,
            settings.width,
            settings.height,
        );

        invader(mouseX, mouseY);
        missiles.forEach(missile => missile.draw());

        requestAnimationFrame(render, canvas);
    };

    const init = () => {
        canvas.height = settings.height;
        canvas.width = settings.width;
        addEventListeners();
        render();
    };

    init();
};

spaceinvader(document.getElementById('canvas'));
