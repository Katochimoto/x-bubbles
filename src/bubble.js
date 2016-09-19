const zws = require('./zws');

var REG_SEPARATOR = /[,]/;
var REG_ENDING; // = /\@ya\.ru/g;
var REG_BEGINING;

exports.isBubbleNode = isBubbleNode;
exports.bubbling = bubbling;

function isBubbleNode(node) {
    return node && node.nodeType === Node.ELEMENT_NODE && node.classList.contains('bubble');
}

function bubbling(set) {
    var ranges = getBubbleRanges(set);
    var nodes = [];

    ranges.forEach(function (range) {
        var text = zws.textClean(range.toString()).trim();

        if (text) {
            var textParts = [ text ];

            if (REG_SEPARATOR) {
                textParts = text.split(REG_SEPARATOR).map(trimIterator).filter(nonEmptyIterator);
            }

            if (REG_ENDING) {
                textParts = textParts.reduce(reduceByEnding, []).map(trimIterator).filter(nonEmptyIterator);

            } else if (REG_BEGINING) {
                textParts = textParts.reduce(reduceByBeginning, []).map(trimIterator).filter(nonEmptyIterator);
            }

            if (textParts.length) {
                var fragment = document.createDocumentFragment();

                textParts.forEach(function (textPart) {
                    var wrap = document.createElement('span');
                    wrap.innerText = textPart;
                    // ...
                    wrap.classList.add('bubble');
                    wrap.setAttribute('contenteditable', 'false');
                    wrap.setAttribute('tabindex', '-1');

                    fragment.appendChild(wrap);
                    nodes.push(wrap);
                });

                range.deleteContents();
                range.insertNode(fragment);

            } else {
                range.deleteContents();
            }

        } else {
            range.deleteContents();
        }
    });

    return nodes;
}

function getBubbleRanges(set) {
    var i;
    var rng;
    var node;
    var ranges = [];
    var children = set.childNodes;

    for (i = 0; i < children.length; i++) {
        node = children[i];

        if (isBubbleNode(node)) {
            if (rng) {
                rng.setEndBefore(node);
                ranges.push(rng);
                rng = undefined;
            }

        } else {
            if (!rng) {
                rng = document.createRange();
                rng.setStartBefore(node);
            }
        }
    }

    if (rng) {
        rng.setEndAfter(node);
        ranges.push(rng);
    }

    return ranges;
}

function trimIterator(str) {
    return str.trim();
}

function nonEmptyIterator(str) {
    return Boolean(str);
}

function reduceByEnding(parts, str) {
    return parts.concat(parseFragmentByEnding(str, REG_ENDING));
}

function reduceByBeginning(parts, str) {
    return parts.concat(parseFragmentByBeginning(str, REG_BEGINING));
}

function parseFragmentByEnding(str, reg) {
    var parts = [];
    var lastIndex = 0;
    var loop = 999;

    reg.lastIndex = 0;
    while (reg.exec(str) !== null && loop) {
        loop--;
        parts.push(str.substring(lastIndex, reg.lastIndex));
    }

    return parts;
}

function parseFragmentByBeginning(str, reg) {
    var parts = [];
    var res;
    var index = 0;
    var loop = 999;

    reg.lastIndex = 0;
    while ((res = reg.exec(str)) !== null && loop) {
        loop--;
        if (index !== res.index) {
            parts.push(str.substring(index, res.index));
            index = res.index;
        }
    }

    parts.push(str.substring(index, str.length));
    return parts;
}
