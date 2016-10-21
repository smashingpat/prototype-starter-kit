function getTransitionEvent() {
    let index;
    const el = document.createElement('transitionelement');
    const transitions = {
        'transition': {
            start: 'transitionstart',
            end: 'transitionend'
        },
        'WebkitTransition': {
            start: 'webkitTransitionStart',
            end: 'webkitTransitionEnd'
        },
        'MozTransition': {
            start: 'transitionstart',
            end: 'transitionend'
        },
        'OTransition': {
            start: 'oTransitionStart',
            end: 'oTransitionEnd'
        },
    }

    for (index in transitions) {
        if (el.style[index] !== undefined ) {
            return transitions[index]
        }
    }
}

export default {
    transition: getTransitionEvent()
}
