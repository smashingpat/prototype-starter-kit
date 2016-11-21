import React from 'react'
import { connect } from 'react-redux'
import { addTodo, removeTodo, toggleTodo } from '../actions'

class Todos extends React.Component {

    addTodo(event) {
        event.preventDefault()

        this.props.dispatch(addTodo(this.refs.textInput.value))
    }

    removeTodo(todoId) {
        this.props.dispatch(removeTodo(todoId))
    }

    changeDone(todoId) {
        this.props.dispatch(toggleTodo(todoId))
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Todo</div>
                <div className="panel-body">
                    <form onSubmit={this.addTodo.bind(this)}>
                        <div className='form-group'>
                            <input className="form-control" ref='textInput'/>
                        </div>
                        <button type='submit' className="btn btn-default">Add todo</button>
                    </form>
                    <hr/>
                    <ul className='list-group'>
                    {this.props.todos.map(todo => {
                        return (
                            <li key={todo.id} className={`list-group-item ${todo.done ? 'list-group-item-success' : ''}`}>
                                <input
                                    type='checkbox'
                                    checked={todo.done}
                                    onChange={() => this.changeDone(todo.id)}
                                />
                                {` ${todo.text} `}
                                <span className='glyphicon glyphicon-remove' onClick={() => this.removeTodo(todo.id)}/>
                            </li>
                        )
                    })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default connect(state => {
    return {
        todos: state.todos
    }
})(Todos)
