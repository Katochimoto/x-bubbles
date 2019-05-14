const raf = require('raf');
const context = require('../context');
const { dispatch } = require('./events');
const { EV } = require('./constant');

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
const REG_MOBILE_IE = /IEMobile/;

exports.getLastChar = function (node) {
    const content = node.textContent;

    return content.charAt(content.length - 1);
};

exports.getSelection = function (nodeEditor) {
    const selection = context.getSelection();

    if (selection && selection.anchorNode && (nodeEditor.compareDocumentPosition(selection.anchorNode) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
        return selection;
    }
};

exports.correctSelection = function (selection) {
    let endNode = selection.focusNode;
    let endOffset = selection.focusOffset;
    let startNode = selection.anchorNode;
    let startOffset = selection.anchorOffset;
    let revert = false;

    if (startNode === endNode) {
        startOffset = Math.min(selection.anchorOffset, selection.focusOffset);
        endOffset = Math.max(selection.anchorOffset, selection.focusOffset);
        revert = selection.anchorOffset > selection.focusOffset;

    } else {
        const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            startNode = selection.focusNode;
            startOffset = selection.focusOffset;
            endNode = selection.anchorNode;
            endOffset = selection.anchorOffset;
            revert = true;
        }
    }

    return { startNode, endNode, startOffset, endOffset, revert };
};

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

exports.canUseDrag = (function () {
    return !REG_IE.test(context.navigator.userAgent);
})();

exports.isIE = (function () {
    return REG_IE.test(context.navigator.userAgent);
})();

exports.isMobileIE = (function () {
    return REG_MOBILE_IE.test(context.navigator.userAgent);
})();

exports.ready = (function () {
    let elements = [];
    let ready = false;
    let lock = false;

    function onready() {
        raf(function () {
            context.setTimeout(function () {
                elements.length && dispatch(context, EV.READY, { detail: { data: elements.splice(0) } });
                ready = true;
            });
        });
    }

    function run() {
        if (ready && !lock) {
            lock = true;
            raf(function () {
                dispatch(context, EV.READY, { detail: { data: elements.splice(0) } });
                lock = false;
            });
        }
    }

    if (context.document.readyState === 'complete') {
        onready();

    } else if (context.document.readyState === 'interactive' && !context.attachEvent && (!context.HTMLImports || context.HTMLImports.ready)) {
        onready();

    } else {
        context.addEventListener(context.HTMLImports && !context.HTMLImports.ready ? 'HTMLImportsLoaded' : 'DOMContentLoaded', onready);
    }

    return function (element) {
        elements.push(element);
        run();
    };
})();

function unescapeHtmlChar(chr) {
    return HTML_UNESCAPES[ chr ];
}

function escapeHtmlChar(chr) {
    return HTML_ESCAPES[ chr ];
}
