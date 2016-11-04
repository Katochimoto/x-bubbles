const raf = require('raf');
const context = require('../context');

/* eslint quotes: 0 */

const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
};

const HTML_UNESCAPES = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
};

const REG_ESCAPED_HTML = /&(?:amp|lt|gt|quot|#39|#96);/g;
const REG_UNESCAPED_HTML = /[&<>"'`]/g;
const REG_HAS_ESCAPED_HTML = RegExp(REG_ESCAPED_HTML.source);
const REG_HAS_UNESCAPED_HTML = RegExp(REG_UNESCAPED_HTML.source);
const REG_IE = /Trident|Edge/;

exports.throttle = function (callback, runContext) {
    let throttle = 0;
    const animationCallback = function () {
        throttle = 0;
    };

    return function () {
        if (throttle) {
            return;
        }

        throttle = raf(animationCallback);

        callback.apply(runContext || this, arguments);
    };
};

exports.escape = function (data) {
    data = String(data);

    if (data && REG_HAS_UNESCAPED_HTML.test(data)) {
        return data.replace(REG_UNESCAPED_HTML, escapeHtmlChar);
    }

    return data;
};


exports.unescape = function (data) {
    data = String(data);

    if (data && REG_HAS_ESCAPED_HTML.test(data)) {
        return data.replace(REG_ESCAPED_HTML, unescapeHtmlChar);
    }

    return data;
};

exports.canUseDrag = function () {
    return !REG_IE.test(context.navigator.userAgent);
};

function unescapeHtmlChar(chr) {
    return HTML_UNESCAPES[ chr ];
}

function escapeHtmlChar(chr) {
    return HTML_ESCAPES[ chr ];
}
