const native = require('./drag/native');
const mouse = require('./drag/mouse');

exports.init = function (nodeSet) {
    // return native.init(nodeSet);
    return mouse.init(nodeSet);
};

exports.destroy = function (nodeSet) {
    // return native.destroy(nodeSet);
    return mouse.destroy(nodeSet);
};
