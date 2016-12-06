(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _times = require('./utils/times');

var _times2 = _interopRequireDefault(_times);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    Create the image and wait for it to be loaded
------------------------------------ */
var imagePath = '/image.jpg';
var image = new Image();

image.onload = function () {
    var data = getImageData(this);

    console.log(data);
};

image.src = imagePath;

/*
    Create the canvas and split it
------------------------------------ */
function getImageData(image, userSettings) {
    var imageHeight = image.height;
    var imageWidth = image.width;
    var initialSettings = {
        horizontal: 10,
        vertical: 10
    };
    var settings = Object.assign({}, initialSettings, userSettings);
    var slices = settings.horizontal * settings.vertical;

    var dataurl = void 0;

    function splitImageData() {
        var horizontal = settings.horizontal;
        var vertical = settings.vertical;

        var imageWidthSlice = imageWidth / horizontal;
        var imageHeightSlice = imageHeight / vertical;

        var data = [];
        var x = 0;
        var y = 0;

        (0, _times2.default)(slices)(function (i) {
            var index = i + 1;
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = imageHeightSlice;
            canvas.width = imageWidthSlice;

            // Draw the image
            context.drawImage(image, x, y);

            // Move the pointers
            if ((index + 1) % horizontal != 0) {
                x = x - imageWidthSlice;
            } else {
                x = 0;
                y = y - imageHeightSlice;
            }

            data.push({
                index: index,
                imageData: canvas.toDataURL()
            });

            // temporarely render the canvas on the body
            document.body.appendChild(canvas);
        });

        return data;
    }

    dataurl = splitImageData();

    return dataurl;
}

},{"./utils/times":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
    Times function
    --------------

    Simple function that repeats a given function x ammount of times
============================================================================ */

var iterator = function iterator(instance) {
    return function (fn) {
        return function (x) {
            if (instance > 0) {
                return iterator(instance - 1)(fn)(fn(x));
            }
            return x;
        };
    };
};

var times = function times(x) {
    return function (fn) {
        return iterator(x)(function (i) {
            return fn(i), i + 1;
        })(0);
    };
};

exports.default = times;

},{}]},{},[1]);
