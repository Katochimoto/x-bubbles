const select = require('../select');

module.exports = function (event) {
    event.preventDefault();
    const head = select.fullHead(event.currentTarget);

    if (head) {
        select.uniq(head);
    }
};
