import select from './libs/selector'


select('h1').each(element => {
    select(element).on('click', (event) => {
        console.log('event', event);
        console.log('this', element);
    })
});
