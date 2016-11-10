import React from 'react'

import Todos from './Todos'
import Counter from './Counter'

class App extends React.Component {
    render() {
        return (
            <div className='container'>
                <Todos />
                <Counter />
            </div>
        )
    }
}

export default App
