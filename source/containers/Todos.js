import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

class Todos extends React.Component {

    addTodo(event) {
        event.preventDefault()

        this.props.dispatch(addTodo(this.refs.textInput.value))
    }

    changeDone(todoId) {
        this.setState({
            todos: this.state.todos.map(todo => {
                if (todoId === todo.id) {
                    todo.done = !todo.done
                }
                return todo
            })
        })
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
                                {todo.text}
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
