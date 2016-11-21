import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducers from './reducers'
import App from './containers/App'


const middleware = applyMiddleware(
    thunk,
    logger({collapsed: true})
)

// create store
const store = createStore(reducers, middleware)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)
