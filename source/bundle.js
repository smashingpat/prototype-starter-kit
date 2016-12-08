import React, { Component } from 'react'
import { render } from 'react-dom'
import imageSlicer from './image-slicer'

class App extends Component {
    constructor() {
        super()
        this.state = {
            imageUrl: '/image.jpg',
            horizontal: 2,
            vertical: 2,
            width: 0,
            height: 0,
            dataurl: [],
            showOutlines: false,
            showOriginal: false,
            showDifference: false,
            size: 300
        }
    }
    componentDidMount() {
        this.renderSlicedImage(this.state.imageUrl, {
            size: this.state.size,
            horizontal: this.state.horizontal,
            vertical: this.state.vertical,
        })
    }
    renderSlicedImage(imageUrl, params) {
        imageSlicer(imageUrl, params).then(data => {
            const { width, height, dataurl } = data;
            console.log(data);
            this.setState({
                width,
                height,
                dataurl,
            })

            const { image } = data;
            image.width = width
        });
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
        const imageUrl = this.refs.file.files[0] ? URL.createObjectURL(this.refs.file.files[0]) : this.state.imageUrl
        const horizontal = this.refs.horizontal.value
        const vertical = this.refs.vertical.value
        const size = this.refs.size.value

        this.setState({
            horizontal,
            vertical,
            size,
            imageUrl
        })

        this.renderSlicedImage(imageUrl, {
            size,
            horizontal,
            vertical,
        })
    }
    render() {
        return (
            <div className="Wrapper">
                <form onSubmit={this.formHandler.bind(this)}>
                    <div>
                        <input type="file" onChange={this.formHandler.bind(this)} ref="file" defaultValue={this.state.imageUrl}/>
                    </div>
                    <div>
                        <input ref="horizontal" defaultValue={this.state.horizontal}/>
                    </div>
                    <div>
                        <input ref="vertical" defaultValue={this.state.vertical}/>
                    </div>
                    <div>
                        <input ref="size" defaultValue={this.state.size}/>
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
                        width: this.state.width + 'px',
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
