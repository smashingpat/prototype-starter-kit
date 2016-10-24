/*
 * animation & transition prefix
 * -----------------------------
 *
 * Uses a CSS check to determine what prefix is needed
 * for transition and animation events
 ******************************************************************************/

const transitions = {
    'transition': {
        start: 'transitionstart',
        end: 'transitionend',
    },
    'WebkitTransition': {
        start: 'webkitTransitionStart',
        end: 'webkitTransitionEnd',
    },
    'MozTransition': {
        start: 'transitionstart',
        end: 'transitionend',
    },
    'OTransition': {
        start: 'oTransitionStart',
        end: 'oTransitionEnd',
    },
}

const animations = {
    'animation': {
        start: 'animationstart',
        end: 'animationend',
    },
    'WebkitAnimation': {
        start: 'webkitAnimationStart',
        end: 'webkitAnimationEnd',
    },
    'MozAnimation': {
        start: 'animationstart',
        end: 'animationend',
    },
    'OAnimation': {
        start: 'oAnimationStart',
        end: 'oAnimationEnd',
    },
}

function getPrefixes(object = {}) {
    let index;

    const el = document.createElement('prefix-element');

    for (index in object) {
        if (el.style[index] !== undefined ) {
            return object[index]
        }
    }
}

const prefixes = {
    transition: getPrefixes(transitions),
    animation: getPrefixes(animations),
}

// exports

export default prefixes

export let transition = prefixes.transition
export let animation = prefixes.animation
