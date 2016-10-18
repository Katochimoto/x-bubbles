/* eslint quotes: 0 */

const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
};

const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
};

const reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g;
const reUnescapedHtml = /[&<>"'`]/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

exports.escape = function (data) {
    data = String(data);

    if (data && reHasUnescapedHtml.test(data)) {
        return data.replace(reUnescapedHtml, escapeHtmlChar);
    }

    return data;
};


exports.unescape = function (data) {
    data = String(data);

    if (data && reHasEscapedHtml.test(data)) {
        return data.replace(reEscapedHtml, unescapeHtmlChar);
    }

    return data;
};


function unescapeHtmlChar(chr) {
    return htmlUnescapes[ chr ];
}

function escapeHtmlChar(chr) {
    return htmlEscapes[ chr ];
}
