const context = require('../../context');
const select = require('../select');
const bubbleset = require('../bubbleset');
const events = require('../events');
const { CLS } = require('../constant');
const { getDragImage, DRAG_IMG_WIDTH } = require('./common');

const EVENTS = {
    dragend: onDragend,
    dragenter: onDragenter,
    dragleave: onDragleave,
    dragover: onDragover,
    dragstart: onDragstart,
    drop: onDrop,
};

let currentDragSet = null;

exports.init = function (nodeSet) {
    events.on(nodeSet, EVENTS);
};

exports.destroy = function (nodeSet) {
    events.off(nodeSet, EVENTS);
};

function onDragstart(event) {
    event.stopPropagation();

    const nodeSet = bubbleset.closestNodeSet(event.target);
    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    if (!nodeSet || !nodeBubble) {
        event.preventDefault();
        return;
    }

    const selection = context.getSelection();
    selection && selection.removeAllRanges();

    currentDragSet = nodeSet;
    nodeSet.classList.add(CLS.DRAGSTART);
    select.add(nodeBubble);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', '');

    const list = select.get(currentDragSet);
    if (list.length > 1) {
        event.dataTransfer.setDragImage(getDragImage(), DRAG_IMG_WIDTH, DRAG_IMG_WIDTH);
    }
}

function onDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (!nodeSet || nodeSet === currentDragSet) {
        return;
    }

    const list = select.get(currentDragSet);

    if (list.length) {
        list.forEach(item => nodeSet.appendChild(item));

        context.setTimeout(function (fromNodeSet, toNodeSet) {
            fromNodeSet.fireChange();
            toNodeSet.focus();
            toNodeSet.fireChange();
        }, 0, currentDragSet, nodeSet);
    }
}

function onDragover(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    event.dataTransfer.dropEffect = 'move';
}

function onDragenter(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    const nodeSet = bubbleset.closestNodeSet(event.target);
    if (nodeSet && nodeSet !== currentDragSet) {
        nodeSet.classList.add(CLS.DROPZONE);
    }
}

function onDragleave(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    const nodeSet = bubbleset.closestNodeSet(event.target);
    if (nodeSet && nodeSet !== currentDragSet) {
        nodeSet.classList.remove(CLS.DROPZONE);
    }
}

function onDragend(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    currentDragSet.classList.remove(CLS.DRAGSTART);

    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (nodeSet && nodeSet !== currentDragSet) {
        nodeSet.classList.remove(CLS.DROPZONE);
    }

    currentDragSet = null;
}
