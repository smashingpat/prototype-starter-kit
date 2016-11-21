import React from 'react'
import { connect } from 'react-redux'
import { incrementCount, decrementCount } from '../actions'

import { Button } from '../components'


class Counter extends React.Component {

    incrementCount() {
        this.props.dispatch(incrementCount())
    }

    decrementCount() {
        this.props.dispatch(decrementCount())
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Counter</div>
                <div className="panel-body">
                    <div className="well">{this.props.counter}</div>
                    <div className="btn-group">
                        <Button className="btn btn-default" onClick={this.incrementCount.bind(this)}>increment</Button>
                        <Button className="btn btn-default" onClick={this.decrementCount.bind(this)}>decrement</Button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { counter } = state
    return {
        counter,
    }
}

export default connect(mapStateToProps)(Counter)
