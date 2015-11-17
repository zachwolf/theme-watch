// Adds a border around a block of text

/////////////
// IMPORTS //
/////////////

var colors = require('colors')

///////////////
// CONSTANTS //
///////////////

var char = {
	corner:  '+'.grey,
	top:     '-'.grey,
	right:   '|'.grey,
	bottom:  '-'.grey,
	left:    '|'.grey,
	padding: ' '.grey
}

/////////////
// HELPERS //
/////////////

function toArray (args) {
	return Array.prototype.slice.call(args, 0)
}

function rest (arr) {
	return arr.slice(1, arr.length)
}

function curry (fn) {
    'use strict';
    
    var that = this
      , args = rest(toArray(arguments))

    return function() {
        var subArgs = [].concat(args, toArray(arguments))
        return fn.apply(that, subArgs)
    }
}

function equalizeWidths (length, line) {
	var spaceLength = length - line.length
		, spaces = ''

	if (spaceLength) {
		while (spaceLength--) {
			spaces += char.padding
		}
	}

	return line + spaces
}

function pad (str) {
	return char.padding + char.padding + str + char.padding + char.padding
}

function leftBorder (str) {
	return char.left + str
}

function rightBorder (str) {
	return str + char.right
}

function topBorder (length) {
	var border = ''
		, paddedLength = length + 4

	while (paddedLength--) {
		border += char.top
	}

	return char.corner + border + char.corner
}

function bottomBorder (length) {
	var border = ''
		, paddedLength = length + 4

	while (paddedLength--) {
		border += char.bottom
	}

	return char.corner + border + char.corner
}


////////////
// PUBLIC //
////////////

module.exports = function (text) {
	var lines = text.split(/\n/g)
		, contentWidth = lines.slice().sort(function (a, b) {
				return a.length < b.length
			})[0].length
		, _equalizeWidths = curry(equalizeWidths, contentWidth)

	// add empty lines before and after block
	lines.push('')
	lines.splice(0, 0, '')

	// maps all lines consistent length
	lines = lines
						.map(_equalizeWidths)
						.map(pad)
						.map(leftBorder)
						.map(rightBorder)

	lines.push(topBorder(contentWidth))
	lines.splice(0, 0, bottomBorder(contentWidth))

	return lines.join('\n')
}