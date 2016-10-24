import select from './libs/selector'


let element = select('button')

element.on('click', function clickHandler(event) {
    event.preventDefault()
    console.log('I got clicked', element);
    element.off('click', clickHandler);
})
