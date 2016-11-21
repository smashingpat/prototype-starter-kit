export function addTodo(text) {
    return {
        type: "ADD_TODO",
        payload: {
            id: Math.random(),
            text,
            done: false
        }
    }
}

export function removeTodo(id) {
    return {
        type: 'REMOVE_TODO',
        payload: id
    }
}

export function toggleTodo(id) {
    return {
        type: "TOGGLE_TODO",
        payload: id
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
