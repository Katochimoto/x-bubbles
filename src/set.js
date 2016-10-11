

exports.getBubbleSet = function (node) {
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.getAttribute('is') === 'x-bubbles') {

            return node;
        }

        node = node.parentNode;
    }
};
