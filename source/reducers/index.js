import { combineReducers } from 'redux'

import counter from './counter'
import todos from './todos'

const reducers = combineReducers({
    counter,
    todos
})

export default reducers
