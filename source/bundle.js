import React, { Component } from 'react'
import { render } from 'react-dom'
import imageSlicer from './image-slicer'

class App extends Component {
    constructor() {
        super()
        this.state = {
            imageUrl: '/image.jpg',
            horizontalSlices: 2,
            verticalSlices: 2,
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
                maxSize: this.state.maxSize,
                horizontal: this.state.horizontalSlices,
                vertical: this.state.verticalSlices,
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
    formHandler(event) {
        event.preventDefault();
        const imageUrl = URL.createObjectURL(this.refs.file.files[0])
        const horizontalSlices = this.refs.horizontal.value
        const verticalSlices = this.refs.vertical.value
        this.setState({
            horizontalSlices,
            verticalSlices,
            imageUrl
        })

        this.renderSlicedImage(imageUrl)
    }
    render() {
        return (
            <div className="Wrapper">
                <form onSubmit={this.formHandler.bind(this)}>
                    <div>
                        <input type="file" onChange={this.formHandler.bind(this)} ref="file" defaultValue={this.state.imageUrl}/>
                    </div>
                    <div>
                        <input ref="horizontal" defaultValue={this.state.horizontalSlices}/>
                        <input ref="vertical" defaultValue={this.state.verticalSlices}/>
                    </div>
                    <button type="submit">submit</button>
                </form>
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
