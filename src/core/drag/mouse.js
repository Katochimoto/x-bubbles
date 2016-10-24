const context = require('../../context');
const events = require('../events');
const select = require('../select');
const bubbleset = require('../bubbleset');
const Modernizr = require('modernizr');
const { CLS } = require('../constant');
const { getDragImage } = require('./common');

let currentDragSet = null;
let currentMoveSet = null;
let currentDragElement = null;

exports.init = function (nodeSet) {
    events.on(nodeSet, 'mousedown', onMousedown);
};

exports.destroy = function (nodeSet) {
    events.off(nodeSet, 'mousedown', onMousedown);
};

function onMousedown(event) {
    const nodeBubble = bubbleset.closestNodeBubble(event.target);
    if (!nodeBubble) {
        return;
    }

    const nodeSet = bubbleset.closestNodeSet(event.target);
    if (!nodeSet) {
        return;
    }

    event.preventDefault();
    nodeSet.focus();

    const drag = nodeSet.__drag__ = {
        onMouseup: onMouseup.bind(this, nodeSet),
        onMousemove: events.throttle(onMousemove.bind(this, nodeSet))
    };

    currentDragSet = null;
    currentMoveSet = null;
    currentDragElement = null;

    events.one(document, 'mouseup', drag.onMouseup);
    events.on(document, 'mousemove', drag.onMousemove);
}

function onMouseup(dragSet, event) {
    const drag = dragSet.__drag__;
    if (!drag) {
        return;
    }

    events.off(document, 'mousemove', drag.onMousemove);
    delete dragSet.__drag__;

    if (currentDragElement) {
        currentDragElement.parentNode && currentDragElement.parentNode.removeChild(currentDragElement);
        currentDragElement = null;
    }

    if (currentMoveSet) {
        currentMoveSet.classList.remove(CLS.DROPZONE);
        currentMoveSet = null;
    }

    if (currentDragSet) {
        const nodeSet = bubbleset.closestNodeSet(event.target);

        if (nodeSet && nodeSet !== currentDragSet) {
            const list = select.get(currentDragSet);

            if (list.length) {
                list.forEach(item => nodeSet.appendChild(item));

                setTimeout(() => {
                    nodeSet.focus();
                    nodeSet.fireChange();
                }, 0);
            }
        }

        currentDragSet.classList.remove(CLS.DRAGSTART);
        currentDragSet = null;
    }
}

function onMousemove(dragSet, event) {
    const drag = dragSet.__drag__;
    if (!drag) {
        return;
    }

    if (!currentDragSet) {
        const selection = context.getSelection();
        selection && selection.removeAllRanges();

        currentDragSet = dragSet;
        currentDragSet.classList.add(CLS.DRAGSTART);

        const nodeBubble = bubbleset.closestNodeBubble(event.target);
        nodeBubble && select.add(nodeBubble);

        currentDragElement = document.body.appendChild(document.createElement('div'));
        currentDragElement.style.cssText = 'position:absolute;z-index:9999;pointer-events:none;top:0;left:0;';

        const list = select.get(currentDragSet);
        if (list.length > 1) {
            currentDragElement.appendChild(getDragImage());
        } else {
            currentDragElement.appendChild(nodeBubble.cloneNode(true));
        }
    }

    const x = event.clientX;
    const y = event.clientY + document.body.scrollTop;

    if (Modernizr.csstransforms) {
        if (Modernizr.csstransforms3d) {
            currentDragElement.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
        } else {
            currentDragElement.style.transform = `translate(${x}px, ${y}px)`;
        }

    } else {
        currentDragElement.style.top = `${x}px`;
        currentDragElement.style.left = `${y}px`;
    }

    const nodeSet = bubbleset.closestNodeSet(event.target);
    if (nodeSet && nodeSet !== currentDragSet) {
        if (currentMoveSet && currentMoveSet !== nodeSet) {
            currentMoveSet.classList.remove(CLS.DROPZONE);
            nodeSet.classList.add(CLS.DROPZONE);
            currentMoveSet = nodeSet;

        } else if (!currentMoveSet) {
            nodeSet.classList.add(CLS.DROPZONE);
            currentMoveSet = nodeSet;
        }

    } else if (currentMoveSet) {
        currentMoveSet.classList.remove(CLS.DROPZONE);
        currentMoveSet = null;
    }
}
