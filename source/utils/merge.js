/*
    Merge
    -----

    Merges all objects together
    in order.
------------------------------------------ */

export default function(...objects) {
    return Object.assign({}, ...objects)
}
