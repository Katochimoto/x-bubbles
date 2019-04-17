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
    checkBubbleDrop:    [ 'func', function () {
        return true;
    }, 'check-bubble-drop' ],
    classBubble:        [ 'str', 'bubble', 'class-bubble' ],
    disableControls:    [ 'bool', false, 'disable-controls' ],
    draggable:          [ 'bool', true, 'draggable' ],
    ending:             [ 'reg', null, 'ending' ], // /\@ya\.ru/g
    limit:              [ 'uint', 0, 'limit' ],
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
    },
    uint: function (value) {
        value = Number(value);

        if (!isNaN(value) && value > 0) {
            return value;
        }
    }
};

/**
 * @param {HTMLElement} node
 * @param {array} args
 * @param {string|object} args.0 - string, if only one option is inserted, or object, if many options inserted,
 *  in the second case second argument doing nothing
 * @param {*} args.1 - value of inserted option
 *
 * @returns {*}
 */
function handleOptions(node, ...args) {
    const value = args[ 0 ];

    if (value) {
        if (!node[ PROPS.OPTIONS ]) {
            reinitOptions(node);
        }

        if (typeof value === 'object' && value !== null) {
            const optionsObj = value;

            Object.keys(optionsObj).forEach((optionName) => {
                node[ PROPS.OPTIONS ][ optionName ] = optionsObj[ optionName ];
            });

            prepareOptions(node[ PROPS.OPTIONS ]);

            return;
        }

        const optionName = value;
        const optionValue = args[ 1 ];

        if (typeof optionValue !== 'undefined') {
            node[ PROPS.OPTIONS ][ optionName ] = optionValue;
            prepareOptions(node[ PROPS.OPTIONS ]);

        } else {
            return node[ PROPS.OPTIONS ][ optionName ];
        }

    } else {
        reinitOptions(node);
    }
}

handleOptions.attributes = Object.keys(OPTIONS).map((optionName) => `data-${OPTIONS[optionName][2]}`);

module.exports = handleOptions;

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
