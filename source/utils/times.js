/*
    Times function
    --------------

    Simple function that repeats a given function x ammount of times
============================================================================ */

const iterator = instance => fn => x => {
    if (instance > 0) {
        return iterator(instance - 1)(fn)(fn(x))
    }
    return x
}

const times = x => fn => {
    return iterator(x)(i => (fn(i), i + 1))(0)
}


export default times
