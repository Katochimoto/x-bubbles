const select = require('../select');

module.exports = function (event) {
    event.preventDefault();
    const head = event.currentTarget.querySelector('.bubble');

    if (head) {
        select.uniq(head);
    }
};
