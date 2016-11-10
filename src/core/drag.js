const native = require('./drag/native');
const mouse = require('./drag/mouse');
const { canUseDrag } = require('./utils');

exports.init = function (nodeSet) {
    if (canUseDrag) {
        return native.init(nodeSet);
    }

    return mouse.init(nodeSet);
};

exports.destroy = function (nodeSet) {
    if (canUseDrag) {
        return native.destroy(nodeSet);
    }

    return mouse.destroy(nodeSet);
};
