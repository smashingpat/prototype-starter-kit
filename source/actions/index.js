export function addTodo(text) {
    return function(dispatch) {
        dispatch({
            type: "ADD_TODO",
            payload: {
                id: Math.random(),
                text,
                done: false
            }
        })
    }
}

export function addTodoWithCount(text) {
    return dispatch => {
        dispatch(addTodo(text))
        dispatch(incrementCount())
    }
}

export function incrementCount() {
    return {
        type: 'INCREMENT_COUNT'
    }
}

export function decrementCount() {
    return {
        type: 'DECREMENT_COUNT'
    }
}
