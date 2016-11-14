const DRAG_IMG = { w: 16, h: 16 };

let dragImage = null;

exports.DRAG_IMG = DRAG_IMG;

exports.getDragImage = function () {
    if (!dragImage) {
        dragImage = new Image();
        dragImage.src = require('url?mimetype=image/png!./bubbles.png');
    }

    return dragImage;
};

exports.onDropSuccess = function (fromNodeSet, toNodeSet) {
    fromNodeSet.fireChange();
    toNodeSet.focus();
    toNodeSet.fireChange();
};
