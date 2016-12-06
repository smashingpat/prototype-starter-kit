import React, { Component } from 'react'
import { render } from 'react-dom'
import imageSlicer from './image-slicer'

class App extends Component {
    constructor() {
        super()
        this.state = {
            imageUrl: '/image.jpg',
            width: 0,
            height: 0,
            dataurl: [],
            showOutlines: false,
            showOriginal: false,
            showDifference: false,
            maxSize: 500
        }
        this.renderSlicedImage()
    }
    renderSlicedImage() {
        const image = new Image()

        image.onload = () => {
            const data = imageSlicer(image, {
                maxSize: this.state.maxSize
            });
            const { dataurl } = data;
            const { height, width } = data.totalSize;
            this.setState({
                width,
                height,
                dataurl,
            })
        }

        image.src = this.state.imageUrl
    }
    toggleOutline() {
        this.setState({
            showOutlines: !this.state.showOutlines
        })
    }
    toggleOriginal() {
        this.setState({
            showOriginal: !this.state.showOriginal,
            showDifference: false
        })
    }
    toggleDifference() {
        this.setState({
            showOriginal: true,
            showDifference: !this.state.showDifference
        })
    }
    render() {
        return (
            <div className="Wrapper">
                <div>
                    <button onClick={this.toggleOutline.bind(this)}>toggle outline</button>
                    <button onClick={this.toggleOriginal.bind(this)}>toggle original</button>
                    <button onClick={this.toggleDifference.bind(this)}>toggle difference</button>
                </div>
                <div style={{
                    position: 'relative',
                }}>
                    <div style={{
                        display: 'inline-block',
                        width: this.state.width,
                        fontSize: 0,
                    }}>
                        {this.state.dataurl.map(data => {
                            let styles = {
                                display: 'inline-block',
                                outline: this.state.showOutlines && '2px solid blue',
                            }
                            return (
                                <img style={styles} key={data.index} src={data.imageData} />
                            )
                        })}
                    </div>
                    <img src={this.state.imageUrl} width={this.state.width} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        filter: !this.state.showDifference && 'invert(100%) opacity(50%)',
                        display: !this.state.showOriginal && 'none',
                        outline: '5px solid green',
                    }}/>
                </div>
            </div>
        )
    }
}

render(
    <App/>,
    document.getElementById('root')
)

/*
//     Create the image and wait for it to be loaded
// ------------------------------------ */
// const imagePath = '/image.jpg'
// const image = new Image()
//
// image.onload = function() {
//     const data = imageSlicer(this);
//
//     data.dataurl.map(node => {
//         const image = new Image()
//         image.src = node.imageData
//
//         document.getElementById('imageContainer').appendChild(image)
//     })
// }
//
// // load image
// image.src = imagePath
//
//
// /*
//     Set input field that changes the above image
// ------------------------------------ */
// const input = document.getElementById('upload');
//
// input.addEventListener('change', function(event) {
//      image.src = URL.createObjectURL(event.target.files[0]);
// })
