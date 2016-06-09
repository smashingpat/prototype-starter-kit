import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'

const todos = (state = [
  {
    "id": 0.3036832902096378,
    "text": "Hug a bear",
    "completed": false
  },
  {
    "id": 0.8992375776503609,
    "text": "Get groceries",
    "completed": false
  }
], action) => {
    if (action.type === "ADD_TODO") {
        let id = Math.random()
        return state.concat({
            id,
            text: action.text,
            completed: false
        })
    }
    if (action.type === "REMOVE_TODO") {
        return state.filter(item => {
            return item.id !== action.id
        })
    }
    if (action.type === "TOGGLE_COMPLETED") {
        return state.map(item => {

        })
    }

    return state
}

const filter = (state = '', action) => {
    switch(action.type) {
        case 'CHANGE_FILTER':
            return action.filter
        default:
            return state
    }
}

const reducers = combineReducers({
    filter,
    todos
})

const store = createStore(reducers);

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            todos: []
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                todos: store.getState().todos
            })
        })
    }

    onSubmitHandler(e) {
        e.preventDefault()
        if (this.refs.input.value) {
            store.dispatch({
                type: 'ADD_TODO',
                text: this.refs.input.value
            })
            this.refs.input.value = ''
        }
    }

    completeToggle(id) {
        store.dispatch({
            type: 'TOGGLE_COMPLETED',
            id: id
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmitHandler.bind(this)}>
                    <input type='text' ref='input'/>
                    <button type='submit'>Add todo</button>
                </form>
                <ul>
                    {this.state.todos.map(todo => (
                        <li
                            key={todo.id}
                            onClick={() => this.completeToggle(todo.id)}>
                            {todo.text}
                        </li>
                    ))}
                </ul>
                <code><pre>{JSON.stringify(this.state.todos, null, 2)}</pre></code>
            </div>
        )
    }
}

render(
    <App says="Hello world"/>,
    document.getElementById('root')
)

store.dispatch({
    type: ''
})
