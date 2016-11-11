import React from 'react'

class Todos extends React.Component {
    constructor() {
        super()
        this.state = {
            todos: [
                {
                    id: 1,
                    text: 'Do groceries',
                    done: false
                },
                {
                    id: 2,
                    text: 'Wrestle a bear',
                    done: false
                },
                {
                    id: 3,
                    text: 'Make pancakes',
                    done: false
                }
            ]
        }
    }

    addTodo(event) {
        event.preventDefault()

        this.setState({
            todos: this.state.todos.concat({
                id: Math.random(),
                text: this.refs.textInput.value,
                done: false
            })
        })
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
                    {this.state.todos.map(todo => {
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

export default Todos
