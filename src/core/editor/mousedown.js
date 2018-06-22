const bubbleset = require('../bubbleset');

module.exports = function (event) {
    const nodeEditor = bubbleset.closestNodeSet(event.target);

    if (!nodeEditor) {
        return;
    }

    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    // Don't show cursor if can't add bubble
    if (!nodeBubble && !nodeEditor.canAddBubble()) {
        nodeEditor.focus();
        event.preventDefault();
    }
};
