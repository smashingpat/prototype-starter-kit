import times from '../utils/times'

/*
function imageSlicer(imageUrl, userSettings) {
    const initialSettings = {
        horizontal: 2,
        vertical: 2,
        maxSize: 1000,
    };
    const settings = Object.assign({}, initialSettings, userSettings);
    const slices = (settings.horizontal * settings.vertical);
    // const sizes = calculateSizes();

    let imageHeight = 0;
    let imageWidth = 0;

    let dataurl;

    function createImage() {
        const image = new Image();

        image.onload = () => {
            console.log('image loaded');
            imageHeight = sizes.height
            imageWidth = sizes.width
        }

        image.src = imageUrl;
    }

    createImage();

    function calculateSizes() {
        const { maxSize } = settings
        const { width, height } = image;
        let newSize = {
            height,
            width,
        }

        if ( maxSize && width > maxSize && height > maxSize) {
            if (width > height) {
                newSize.width = maxSize
                newSize.height = maxSize * (height / width)
            } else {
                newSize.width = maxSize * (width / height)
                newSize.height = maxSize
            }
        }

        return newSize
    }

    function splitImageData() {
        const { horizontal, vertical } = settings
        const imageWidthSlice = imageWidth / horizontal
        const imageHeightSlice = imageHeight / vertical

        let data = []

        let x = 0
        let y = 0

        times(slices)((index) => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            canvas.height = imageHeightSlice
            canvas.width = imageWidthSlice

            // Draw the image
            context.drawImage(image, x, y, imageWidth, imageHeight)

            // Move the pointers
            if ((index + 1) % horizontal != 0) {
                x = x - imageWidthSlice
            } else {
                x = 0
                y = y - imageHeightSlice
            }

            data.push({
                index,
                imageData: canvas.toDataURL()
            })
        })

        return data
    }

    dataurl = splitImageData()

    return {
        totalSize: {
            height: imageHeight,
            width: imageWidth,
        },
        dataurl
    }
}*/

function imageSlicer(imageUrl, userSettings) {
    const initialSettings = {
        horizontal: 2,
        vertical: 2,
        size: null,
    };
    const settings = Object.assign({}, initialSettings, userSettings);

    let image;
    let width = 0;
    let height = 0;
    let dataurl = [];

    /*
        Create a image element and fire
        the slicer when it's done loading
        through a promise
    ------------------------------------------ */
    function getImage() {
        return new Promise((resolve, reject) => {
            image = new Image();

            image.onload = () => {
                calculateSizes();
                createCanvas();
                resolve({
                    image,
                    width,
                    height,
                    dataurl,
                });
            }

            image.onerror = () => {
                reject(`Image couldn't be found`);
            }

            image.src = imageUrl;
        })
    }


    /*
        Calculate sizes
    ------------------------------------ */
    function calculateSizes() {
        const { size } = settings
        const originalWidth = image.width;
        const originalHeight = image.height;

        width = image.width
        height = image.height

        if ( size && width > size && height > size) {
            if (width > height) {
                width = size
                height = size * (height / width)
            } else {
                width = size * (width / height)
                height = size
            }
        }
    }

    /*
        Draw image on canvas and resize it
    ------------------------------------------ */
    function createCanvas() {
        const { horizontal, vertical } = settings
        const imageWidthSlice = width / horizontal
        const imageHeightSlice = height / vertical
        const slices = (settings.horizontal * settings.vertical);

        dataurl = [] // empty previous data

        let x = 0
        let y = 0

        times(slices)((index) => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            canvas.height = imageHeightSlice
            canvas.width = imageWidthSlice

            // Draw the image
            context.drawImage(image, x, y, width, height)

            // Move the pointers
            if ((index + 1) % horizontal != 0) {
                x = x - imageWidthSlice
            } else {
                x = 0
                y = y - imageHeightSlice
            }

            dataurl.push({
                index,
                imageData: canvas.toDataURL()
            })
        })

    }


    function initialize() {
        getImage();
    }

    initialize()

    return getImage();
}

export default imageSlicer
