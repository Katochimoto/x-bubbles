const context = require('../../context');
const select = require('../select');
const bubbleset = require('../bubbleset');
const events = require('../events');
const { CLS } = require('../constant');
const { getDragImage, onDropSuccess, DRAG_IMG } = require('./common');

const EVENTS = {
    dragend: onDragend,
    dragenter: onDragenter,
    dragleave: onDragleave,
    dragover: onDragover,
    dragstart: onDragstart,
    drop: onDrop,
};

let currentDragSet = null;
let currentDragClassNames = null;

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

    const list = select.get(currentDragSet);
    currentDragClassNames = list.map((elem) => elem.className);

    addCustomPropsForEvent(event);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', '');

    if (list.length > 1) {
        event.dataTransfer.setDragImage(getDragImage(), DRAG_IMG.w, DRAG_IMG.h);
    }
}

function onDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    addCustomPropsForEvent(event);

    const nodeSet = bubbleset.closestNodeSet(event.target);
    const checkBubbleDrop = nodeSet.options('checkBubbleDrop');

    if (!nodeSet || nodeSet === currentDragSet) {
        return;
    }

    const list = select.get(currentDragSet);

    if (list.length && checkBubbleDrop(list)) {
        bubbleset.moveBubbles(currentDragSet, nodeSet, list);
        context.setTimeout(onDropSuccess, 0, currentDragSet, nodeSet);
    }
}

function onDragover(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    addCustomPropsForEvent(event);

    event.dataTransfer.dropEffect = 'move';
}

function onDragenter(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    addCustomPropsForEvent(event);

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

    addCustomPropsForEvent(event);

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

    addCustomPropsForEvent(event);

    currentDragSet.classList.remove(CLS.DRAGSTART);

    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (nodeSet && nodeSet !== currentDragSet) {
        nodeSet.classList.remove(CLS.DROPZONE);
    }

    currentDragSet = null;
    currentDragClassNames = null;
}

function addCustomPropsForEvent(event) {
    event.dragClassNames = currentDragClassNames;
}
