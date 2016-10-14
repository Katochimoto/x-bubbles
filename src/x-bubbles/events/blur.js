const bubble = require('../bubble');

module.exports = function (event) {
    bubble.bubbling(event.currentTarget);
};
