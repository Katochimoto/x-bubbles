let dragImage = null;

exports.getDragImage = function () {
    if (!dragImage) {
        dragImage = new Image();
        dragImage.src = require('url?mimetype=image/png!./bubbles.png');
    }

    return dragImage;
};
