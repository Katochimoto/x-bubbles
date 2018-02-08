const context = require('../../context');
const events = require('../events');
const utils = require('../utils');
const select = require('../select');
const bubbleset = require('../bubbleset');
const Modernizr = require('modernizr');
const { CLS, EV } = require('../constant');
const { getDragImage, onDropSuccess, DRAG_IMG } = require('./common');

let currentDragSet = null;
let currentMoveSet = null;
let currentDragElement = null;
let currentDragClassNames = null;

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
        nodeBubble: nodeBubble,
        nodeOffsetX: event.offsetX,
        nodeOffsetY: event.offsetY,
        onMousemove: utils.throttle(onMousemove.bind(this, nodeSet)),
        onMouseup: onMouseup.bind(this, nodeSet),
        onScroll: utils.throttle(onScroll.bind(this, nodeSet)),
        x: 0,
        y: 0,
    };

    currentDragSet = null;
    currentMoveSet = null;
    currentDragElement = null;
    currentDragClassNames = null;

    events.one(document, 'mouseup', drag.onMouseup);
    events.on(document, 'mousemove', drag.onMousemove);
    events.on(document, 'scroll', drag.onScroll);
}

function onMouseup(dragSet, event) {
    const drag = dragSet.__drag__;
    if (!drag) {
        return;
    }

    events.off(document, 'mousemove', drag.onMousemove);
    events.off(document, 'scroll', drag.onScroll);
    delete dragSet.__drag__;

    if (currentDragElement) {
        currentDragElement.parentNode && currentDragElement.parentNode.removeChild(currentDragElement);
        currentDragElement = null;
    }

    if (currentMoveSet) {
        const _ = currentMoveSet;
        currentMoveSet = null;

        _.classList.remove(CLS.DROPZONE);
        events.dispatch(_, EV.DRAGLEAVE, { bubbles: false, cancelable: false }, {
            dragClassNames: currentDragClassNames
        });
    }

    if (currentDragSet) {
        const nodeSet = bubbleset.closestNodeSet(event.target);
        const checkBubbleDrop = nodeSet.options('checkBubbleDrop');

        if (nodeSet && nodeSet !== currentDragSet) {
            const list = select.get(currentDragSet);

            if (list.length && checkBubbleDrop(list)) {
                bubbleset.moveBubbles(currentDragSet, nodeSet, list);
                context.setTimeout(onDropSuccess, 0, currentDragSet, nodeSet);
            }
        }

        const _ = currentDragSet;
        currentDragSet = null;

        _.classList.remove(CLS.DRAGSTART);
        events.dispatch(_, EV.DROP, { bubbles: false, cancelable: false }, { dragClassNames: currentDragClassNames });
        events.dispatch(_, EV.DRAGEND, { bubbles: false, cancelable: false }, {
            dragClassNames: currentDragClassNames
        });

        currentDragClassNames = null;
    }
}

function onMousemove(dragSet) {
    const drag = dragSet.__drag__;
    if (!drag) {
        return;
    }

    if (!currentDragSet) {
        const selection = context.getSelection();
        selection && selection.removeAllRanges();

        currentDragSet = dragSet;
        currentDragSet.classList.add(CLS.DRAGSTART);
        select.add(drag.nodeBubble);

        let moveElement;

        const list = select.get(currentDragSet);
        currentDragClassNames = list.map((elem) => elem.className);

        if (list.length === 1) {
            moveElement = drag.nodeBubble.cloneNode(true);
        }

        if (!moveElement) {
            moveElement = getDragImage();
            drag.nodeOffsetX = DRAG_IMG.w;
            drag.nodeOffsetY = DRAG_IMG.h;
        }

        currentDragElement = document.body.appendChild(document.createElement('div'));
        currentDragElement.style.cssText = 'position:absolute;z-index:9999;pointer-events:none;top:0;left:0;';
        currentDragElement.appendChild(moveElement);

        events.dispatch(currentDragSet, EV.DRAGSTART, { bubbles: false, cancelable: false }, {
            dragClassNames: currentDragClassNames
        });
    }

    drag.x = event.clientX;
    drag.y = event.clientY;
    onScroll(dragSet);

    const nodeSet = bubbleset.closestNodeSet(event.target);
    if (nodeSet && nodeSet !== currentDragSet) {
        if (currentMoveSet && currentMoveSet !== nodeSet) {
            currentMoveSet.classList.remove(CLS.DROPZONE);
            nodeSet.classList.add(CLS.DROPZONE);
            currentMoveSet = nodeSet;
            events.dispatch(currentMoveSet, EV.DRAGENTER, { bubbles: false, cancelable: false }, {
                dragClassNames: currentDragClassNames
            });

        } else if (!currentMoveSet) {
            nodeSet.classList.add(CLS.DROPZONE);
            currentMoveSet = nodeSet;
            events.dispatch(currentMoveSet, EV.DRAGENTER, { bubbles: false, cancelable: false }, {
                dragClassNames: currentDragClassNames
            });
        }

    } else if (currentMoveSet) {
        const _ = currentMoveSet;
        currentMoveSet = null;

        _.classList.remove(CLS.DROPZONE);
        events.dispatch(_, EV.DRAGLEAVE, { bubbles: false, cancelable: false }, {
            dragClassNames: currentDragClassNames
        });
    }
}

function onScroll(dragSet) {
    const drag = dragSet.__drag__;
    if (!drag || !currentDragElement) {
        return;
    }

    const x = drag.x - drag.nodeOffsetX + events.scrollX();
    const y = drag.y - drag.nodeOffsetY + events.scrollY();

    if (Modernizr.csstransforms3d) {
        currentDragElement.style.transform = `translate3d(${x}px, ${y}px, 0px)`;

    } else if (Modernizr.csstransforms) {
        currentDragElement.style.transform = `translate(${x}px, ${y}px)`;

    } else {
        currentDragElement.style.top = `${y}px`;
        currentDragElement.style.left = `${x}px`;
    }
}
