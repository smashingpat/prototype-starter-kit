// import React from 'react'
// import ReactDOM from 'react-dom'
//
// import App from './containers/App'
//
// ReactDOM.render(
//     <App/>,
//     document.getElementById('root')
// )

import { createStore, applyMiddleware } from 'redux'
import { List, Map } from 'immutable';


const initialState = new List([]);

const reducer = (state = initialState, action) => {
    if (action.type === 'ADD_TODO') {
        return state.push(Map(action.payload))
    }
    return state
}

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', JSON.stringify(store.getState(), null, 2))
    return result
}

const middleware = applyMiddleware(logger)

const store = createStore(reducer, middleware)

function addTodo(text) {
    return {
        type: 'ADD_TODO',
        payload: {
            id: Math.random(),
            text,
            done: false
        }
    }
}

store.dispatch(addTodo('adding a todo'))
store.dispatch(addTodo('adding another todo'))
