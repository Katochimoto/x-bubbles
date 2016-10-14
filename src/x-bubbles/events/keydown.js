const bubbleset = require('../bubbleset');
const events = require('../events');
const select = require('../select');

module.exports = function (event) {
    const code = event.charCode || event.keyCode;
    const nodeSet = bubbleset.closestNodeSet(event.currentTarget);
    const enable = nodeSet && !nodeSet.hasAttribute('disable-controls');

    switch (code) {
    case 8: // Backspace
        event.preventDefault();
        events.backSpace(event);
        break;

    case 9: // Tab
        event.preventDefault();
        enable && events.tab(event);
        break;

    case 37: // Left
        event.preventDefault();
        events.arrowLeft(event);
        break;

    // сдвигаем курсор в начало списка
    case 38: // Top
        event.preventDefault();
        enable && events.arrowTop(event);
        break;

    case 39: // Right
        event.preventDefault();
        events.arrowRight(event);
        break;

    // сдвигаем курсор в конец списка
    case 40: // Bottom
        event.preventDefault();
        enable && events.arrowBottom(event);
        break;

    case 65: // a
        if (event.metaKey) {
            event.preventDefault();

            if (!events.selectAll(event)) {
                select.all(nodeSet);
            }
        }
        break;
    }
};
