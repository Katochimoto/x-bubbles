const zws = require('./zws');


const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('keydown', onKeydown, false);
            this.addEventListener('keypress', onKeypress, false);
            this.addEventListener('paste', onPaste, false);
            this.addEventListener('blur', onBlur, false);
            this.addEventListener('focus', onFocus, false);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('keydown', onKeydown, false);
            this.removeEventListener('keypress', onKeypress, false);
            this.removeEventListener('paste', onPaste, false);
            this.removeEventListener('blur', onBlur, false);
            this.removeEventListener('focus', onFocus, false);
        }
    },

    attributeChangedCallback: {
        value: function (name, previousValue, value) {}
    }
});

module.exports = document.registerElement('x-bubbles', {
    prototype: XBubbles
});

var set = document.getElementById('set');

var REG_SEPARATOR = /[,]/;
var REG_ENDING; // = /\@ya\.ru/g;
var REG_BEGINING;

function onKeydown(event) {
    var set = event.currentTarget;
    var code = event.charCode || event.keyCode;

    if (code === 13) {
        //event.preventDefault();
    }

    // Backspace
    if (code === 8) {
        event.preventDefault();
        if (isBubbleNode(event.target)) {
            var previousBubble = event.target.previousSibling;
            event.target.parentNode.removeChild(event.target);

            if (isBubbleNode(previousBubble)) {
                previousBubble.focus();

            } else {
                restoreCursor(set);
            }

        } else {
            backSpace(set);
        }
    }

    // Tab
    if (code === 9) {
        if (isBubbleNode(event.target)) {
            event.preventDefault();
            set.focus();
        }
    }

    // Left
    if (code === 37) {

    }

    // Right
    if (code === 39) {

    }


    //console.log(event.keyCode);
}

function onKeypress(event) {
    var set = event.currentTarget;
    var code = event.charCode || event.keyCode;

    // Enter
    if (code === 13) {
        event.preventDefault();
    }

    // Backspace
    if (code === 8) {
        event.preventDefault();
    }

    // Enter || , || ;
    if (code === 13 || code === 44 || code === 59) {
        event.preventDefault();
        bubbling(set);
        restoreCursor(set);
    }
}

function onPaste(event) {
    var set = event.currentTarget;
    setTimeout(function () {
        bubbling(set);
        restoreCursor(set);
    }, 0);
}

function onBlur(event) {
    var set = event.currentTarget;
    bubbling(set);
}

function onFocus(event) {
    var set = event.currentTarget;
    restoreCursor(set);
}


function setStartOffset(range) {
    var startContainer = range.startContainer;
    var startOffset = range.startOffset - 1;
    var setAfter = false;
    var setBefore = false;

    if (isBubbleNode(startContainer)) {
        range.setStartAfter(startContainer);
        return range;
    }

    if (startOffset >= 0 &&
        startContainer.nodeType === Node.TEXT_NODE &&
        zws.check(startContainer.nodeValue[ startOffset ])) {

        startOffset--;
    }

    while (startOffset < 0) {
        var previousContainer = startContainer.previousSibling;
        if (!previousContainer) {
            setBefore = true;
            break;
        }

        startContainer = previousContainer;

        if (isBubbleNode(startContainer)) {
            setAfter = true;
            break;

        } else if (startContainer.nodeType === Node.TEXT_NODE) {
            startOffset = startContainer.nodeValue.length - 1;
        }
    }

    if (setAfter) {
        range.setStartAfter(startContainer);

    } else if (setBefore) {
        range.setStartBefore(startContainer);

    } else {
        range.setStart(startContainer, startOffset);
    }

    return range;
}

function backSpace(node) {
    var sel = window.getSelection();
    if (!sel) {
        return;
    }

    var range;

    if (sel.isCollapsed && sel.rangeCount) {
        range = setStartOffset(sel.getRangeAt(0));
        sel.removeAllRanges();
        sel.addRange(range);
    }

    var startRange = sel.rangeCount && sel.getRangeAt(0);
    var startContainer = startRange && startRange.startContainer;
    if (startContainer === node) {
        startContainer = startContainer.childNodes[ startRange.startOffset - 1 ];
    }

    if (sel.isCollapsed) {
        if (isBubbleNode(startContainer)) {
            startContainer.focus();
        }

    } else {
        var text = sel.toString();
        var hasZeroWidthSpace = zws.check(text);

        if (hasZeroWidthSpace && text.length === 1 && isBubbleNode(startContainer)) {
            startContainer.focus();

        } else {
            sel.deleteFromDocument();
            if (hasZeroWidthSpace && sel.rangeCount && sel.isCollapsed) {
                var fakeText = zws.createElement();
                range = sel.getRangeAt(0);

                range.deleteContents();
                range.insertNode(fakeText);
                sel.removeAllRanges();
                sel.collapse(fakeText, 1);
            }
        }
    }
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

function isBubbleNode(node) {
    return node && node.nodeType === Node.ELEMENT_NODE && node.classList.contains('bubble');
}

function restoreCursor(node) {
    var fakeText = zws.createElement();

    if (node.hasChildNodes()) {
        var lastNode = node.childNodes[ node.childNodes.length - 1 ];

        if (lastNode.isEqualNode(fakeText)) {
            fakeText = lastNode;

        } else {
            node.appendChild(fakeText);
        }

    } else {
        node.appendChild(fakeText);
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.collapse(fakeText, 1);
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
    var res;
    var lastIndex = 0;
    var loop = 999;

    reg.lastIndex = 0;
    while ((res = reg.exec(str)) !== null && loop) {
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
