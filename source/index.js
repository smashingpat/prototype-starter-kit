import select from './libs/selector'


let element = select('h1')

element.once('click', function clickHandler() {
    console.log('I got clicked');
})
