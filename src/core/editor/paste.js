const context = require('../../context');
const bubble = require('../bubble');
const cursor = require('../cursor');
const text = require('../text');

module.exports = function (event) {
    event.preventDefault();
    const nodeEditor = event.currentTarget;

    if (context.clipboardData && context.clipboardData.getData) {
        onPasteSuccess(nodeEditor, context.clipboardData.getData('Text'));

    } else if (event.clipboardData) {
        const contentType = 'text/plain';
        const clipboardData = event.clipboardData;
        const data = clipboardData.getData && clipboardData.getData(contentType);

        if (!onPasteSuccess(nodeEditor, data) && clipboardData.items) {
            Array.prototype.slice.call(clipboardData.items)
                .filter(item => item.kind === 'string' && item.type === contentType)
                .some(function (item) {
                    item.getAsString(function (dataText) {
                        onPasteSuccess(nodeEditor, dataText);
                    });

                    return true;
                });
        }
    }
};

function onPasteSuccess(nodeEditor, dataText) {
    const checkBubblePaste = nodeEditor.options('checkBubblePaste');
    const selection = context.getSelection();
    const isBubbling = do {
        if (dataText && selection.isCollapsed && !nodeEditor.inputValue) {
            checkBubblePaste(dataText);

        } else {
            false;
        }
    };

    if (text.replaceString(dataText, selection)) {
        if (isBubbling) {
            bubble.bubbling(nodeEditor);
            cursor.restore(nodeEditor);

        } else {
            nodeEditor.fireInput();
        }

        return true;
    }

    return false;
}
