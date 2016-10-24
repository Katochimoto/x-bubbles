const native = require('./drag/native');
const mouse = require('./drag/mouse');
const { msie } = require('./utils');

exports.init = function (nodeSet) {
    if (msie) {
        return mouse.init(nodeSet);
    }

    return native.init(nodeSet);
};

exports.destroy = function (nodeSet) {
    if (msie) {
        return mouse.destroy(nodeSet);
    }

    return native.destroy(nodeSet);
};
