import times from './utils/times'

/*
    Create the image and wait for it to be loaded
------------------------------------ */
const imagePath = '/image.jpg'
const image = new Image()


image.onload = function() {
    const data = getImageData(this);

    console.log(data);
}


image.src = imagePath

/*
    Create the canvas and split it
------------------------------------ */
function getImageData(image, userSettings) {
    const initialSettings = {
        horizontal: 4,
        vertical: 4,
        maxSize: 800,
    }
    const settings = Object.assign({}, initialSettings, userSettings);
    const slices = (settings.horizontal * settings.vertical)
    const sizes = calculateSizes()
    const imageHeight = sizes.height
    const imageWidth = sizes.width

    console.log(sizes);

    let dataurl;

    function calculateSizes() {
        const { maxSize } = settings
        const { width, height } = image;
        let newSize = {
            height,
            width,
        }

        if (width > maxSize && height > maxSize) {
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

        let data = [];
        let x = 0
        let y = 0

        times(slices)((index) => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.height = imageHeightSlice
            canvas.width = imageWidthSlice

            // Draw the image
            context.drawImage(image, x, y)

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

            // temporarely render the canvas on the body
            document.body.appendChild(canvas)
        })

        return data
    }

    dataurl = splitImageData()

    return dataurl
}
