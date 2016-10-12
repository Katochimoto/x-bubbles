const bubble = require('../bubble');
const select = require('../select');

module.exports = function (event) {
    bubble.bubbling(event.currentTarget);
    select.clear(event.currentTarget);
};
