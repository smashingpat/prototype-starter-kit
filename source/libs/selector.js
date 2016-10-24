/*
    JQuery-esque selector for DOM elements

    usage:

        let elements = selector('.my-selector');

        elements.css({
            'background-color': 'red',
            fontSize: '30px'
        });

        elements.each((element) => {
            // do stuff with element
        });

============================================================================ */

function selector(selectors, parent = document) {

    let singleNode = false;
    let nodes;


    /*
        Node
    ------------------------------------ */

    function ifNode(node) {
        return (
            typeof HTMLElement === "object" ?
                node instanceof HTMLElement : //DOM2
                node && typeof node === "object" && node !== null && node.nodeType === 1 && typeof node.nodeName==="string"
        )
    }

    function getNodes() {
        if (ifNode(selectors)) {
            singleNode = true
            nodes = selectors
        } else {
            nodes = parent.querySelectorAll(selectors);
        }
    }

    function eachNode(callback) {
        if (!singleNode) {
            let i = 0;
            for (let i = 0; i < nodes.length; i++) {
                callback(nodes[i])
            }
        } else {
            callback(nodes)
        }

        return this;
    }

    /*
        Css
    ------------------------------------ */

    function changeNodeCss(css) {
        for (const key of Object.keys(css)) {
            eachNode(node => {
                node.style[key] = css[key]; // eslint-disable-line
            });
        }

        return this;
    }

    /*
        Classes
    ------------------------------------ */

    function addClass(classes) {
        eachNode(element => element.classList.add(classes));

        return this;
    }

    function removeClass(classes) {
        eachNode(element => element.classList.remove(classes));

        return this;
    }

    function toggleClass(classes) {
        eachNode(element => element.classList.toggle(classes));

        return this;
    }


    /*
        Events
    ------------------------------------ */

    function addEvents(eventNames, callback) {
        eachNode(element => {
            eventNames.split(' ').map(eventName => {
                if (eventName) {
                    return element.addEventListener(eventName, callback);
                }

                return false
            });
        });

        return this;
    }

    function removeEvents(eventNames, callback) {
        eachNode(element => {
            eventNames.split(' ').map(eventName => {
                element.removeEventListener(eventName, callback);
            });
        });

        return this;
    }


    /*
        initialize
    ------------------------------------ */

    function init() {
        getNodes();
    }

    init();

    return {
        nodes,
        addClass,
        removeClass,
        toggleClass,
        on: addEvents,
        off: removeEvents,
        css: changeNodeCss,
        each: eachNode,
    };
}

export default selector;