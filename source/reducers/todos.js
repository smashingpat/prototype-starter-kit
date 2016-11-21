const initialState = [
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

const todos = ( state = initialState, action) => {
    switch(action.type) {
        case 'ADD_TODO': {
            return state.concat(action.payload)
        }
    }
    return state
}

export default todos