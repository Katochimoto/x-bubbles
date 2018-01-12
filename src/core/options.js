const context = require('../context');
const { PROPS } = require('./constant');

const REG_STRREG = /\/(.+)\/([gimy]{0,3})/i;

const OPTIONS = {
    begining:           [ 'reg', null, 'begining' ],
    bubbleCopy:         [ 'func', function (list) {
        return list.map(item => item.innerHTML).join(', ');
    }, 'bubble-copy' ],
    bubbleDeformation:  [ 'func', function () {}, 'bubble-deformation' ],
    bubbleFormation:    [ 'func', function () {}, 'bubble-formation' ],
    checkBubblePaste:   [ 'func', function () {
        return true;
    }, 'check-bubble-paste' ],
    classBubble:        [ 'str', 'bubble', 'class-bubble' ],
    disableControls:    [ 'bool', false, 'disable-controls' ],
    draggable:          [ 'bool', true, 'draggable' ],
    checkBubbleDrop:    [ 'func', function () {
        return true;
    }, 'check-bubble-drop' ],
    ending:             [ 'reg', null, 'ending' ], // /\@ya\.ru/g
    selection:          [ 'bool', true, 'selection' ],
    separator:          [ 'reg', /[,;]/, 'separator' ],
    separatorCond:      [ 'func', null, 'separator-cond' ],
    tokenizer:          [ 'func', null, 'tokenizer' ]
};

const OPTIONS_PREPARE = {
    func: function (value) {
        const type = typeof value;
        switch (type) {
        case 'string':
            return new Function('context', `return context.${value};`)(context);

        case 'function':
            return value;
        }
    },
    bool: function (value) {
        const type = typeof value;
        switch (type) {
        case 'string':
            return (value === 'true' || value === 'on');

        case 'boolean':
            return value;
        }
    },
    noop: function (value) {
        return value;
    },
    reg: function (value) {
        const type = typeof value;
        switch (type) {
        case 'string':
            if (value) {
                const match = value.match(REG_STRREG);
                if (match) {
                    return new RegExp(match[1], match[2]);
                }
            }

            return null;

        case 'object':
            if (value instanceof context.RegExp || value === null) {
                return value;
            }
        }
    },
    str: function (value) {
        if (typeof value !== 'undefined') {
            return value ? String(value) : '';
        }
    }
};

module.exports = function (node, name, value) {
    if (name) {
        if (!node[ PROPS.OPTIONS ]) {
            reinitOptions(node);
        }

        if (typeof value !== 'undefined') {
            node[ PROPS.OPTIONS ][ name ] = value;
            prepareOptions(node[ PROPS.OPTIONS ]);

        } else {
            return node[ PROPS.OPTIONS ][ name ];
        }

    } else {
        reinitOptions(node);
    }
};

function reinitOptions(node) {
    const options = node[ PROPS.OPTIONS ] = node[ PROPS.OPTIONS ] || {};

    for (const optionName in OPTIONS) {
        const attrName = `data-${OPTIONS[ optionName ][2]}`;
        if (node.hasAttribute(attrName)) {
            options[ optionName ] = node.getAttribute(attrName);
        }
    }

    prepareOptions(options);
}

function prepareOptions(options) {
    for (let name in OPTIONS) {
        const [ type, def ] = OPTIONS[ name ];
        options[ name ] = OPTIONS_PREPARE[ type ](options[ name ]);
        if (typeof options[ name ] === 'undefined') {
            options[ name ] = def;
        }
    }
}
