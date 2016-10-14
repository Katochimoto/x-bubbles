const bubble = require('../bubble');
const select = require('../select');

module.exports = function (event) {
    select.clear(event.currentTarget);
    bubble.bubbling(event.currentTarget);
};
