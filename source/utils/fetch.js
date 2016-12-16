/*
    Fetch
------------------------------------------ */
function parseJson(string) {
    try {
        return JSON.parse(string)
    } catch (e) {
        return string
    }
}

function openXMLRequest(url, onload, onerror) {
    const request = new XMLHttpRequest()

    request.open('GET', url, true)

    if (onload) {
        request.onload = () => onload(request)
    }
    if (onerror) {
        request.onerror = () => onload(request)
    }

    request.send()
}

function fetch(url) {
    const request = new XMLHttpRequest()
    const promise = new Promise((resolve, reject) => {
        openXMLRequest(url, (req) => {
            resolve({
                data: parseJson(req.responseText),
                status: req.status,
            })
        })
    })

    return promise
}

const all = promises => Promise.all(promises)
const spread = callback => spread => callback(...spread)

fetch.all = all
fetch.spread = spread


/*
    Exports
------------------------------------------ */

export default fetch
export { fetch, all, spread }
