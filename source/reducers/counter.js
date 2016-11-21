const counter = (state = 0, action) => {
    if (action.type === 'INCREMENT_COUNT') {
        return state + 1
    }
    if (action.type === 'DECREMENT_COUNT') {
        return state - 1
    }
    return state
}

export default counter
