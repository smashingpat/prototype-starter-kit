import React from 'react'

import { Button } from '../components'

class Counter extends React.Component {
    constructor() {
        super()
        this.state = {
            count: 0
        }
    }

    incrementCount() {
        let newCount = this.state.count + 1
        this.setState({ count: newCount })
    }

    decrementCount() {
        let newCount = this.state.count - 1
        this.setState({ count: newCount <= 0 ? 0 : newCount })
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Counter</div>
                <div className="panel-body">
                    <div className="well">{this.state.count}</div>
                    <div className="btn-group">
                        <Button className="btn btn-default" onClick={this.incrementCount.bind(this)}>increment</Button>
                        <Button className="btn btn-default" onClick={this.decrementCount.bind(this)}>decrement</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Counter
