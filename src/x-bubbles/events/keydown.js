const bubbleset = require('../bubbleset');
const events = require('../events');
const select = require('../select');

module.exports = function (event) {
    const code = event.charCode || event.keyCode;

    switch (code) {
    case 8: // Backspace
        events.backSpace(event);
        break;

    case 9: // Tab
        events.tab(event);
        break;

    case 37: // Left
        events.arrowLeft(event);
        break;

    // сдвигаем курсор в начало списка
    case 38: // Top
        events.arrowTop(event);
        break;

    case 39: // Right
        events.arrowRight(event);
        break;

    // сдвигаем курсор в конец списка
    case 40: // Bottom
        events.arrowBottom(event);
        break;

    case 65: // a
        if (event.metaKey) {
            if (!events.selectAll(event)) {
                const nodeSet = bubbleset.closestNodeSet(event.currentTarget);

                if (!nodeSet) {
                    return;
                }

                select.all(nodeSet);
            }
        }
        break;
    }
};
