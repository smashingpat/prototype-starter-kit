import select from './libs/selector'
import { transition } from './libs/prefixes'

const animationHandler = () => console.log('animation is done')

select('h1').on(transition.end, animationHandler);
