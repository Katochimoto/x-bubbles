const raf = require('raf');

module.exports = function (callback, context) {
    let throttle = 0;
    const animationCallback = function () {
        throttle = 0;
    };

    return function () {
        if (throttle) {
            return;
        }

        throttle = raf(animationCallback);

        callback.apply(context || this, arguments);
    };
};
