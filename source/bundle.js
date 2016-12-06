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
    }
    componentDidMount() {
        this.renderSlicedImage(this.state.imageUrl)
    }
    renderSlicedImage(imageUrl) {
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

        image.src = imageUrl
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
    inputHandler(event) {
        const imageUrl = URL.createObjectURL(event.target.files[0])
        this.setState({
            imageUrl
        })

        this.renderSlicedImage(imageUrl)
    }
    render() {
        return (
            <div className="Wrapper">
                <div>
                    <input type="file" onChange={this.inputHandler.bind(this)} /> <br/>
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
                        outline: '1px solid red',
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
                        filter: this.state.showDifference && 'invert(100%) opacity(50%)',
                        display: !this.state.showOriginal && 'none',
                        outline: '1px solid green',
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
