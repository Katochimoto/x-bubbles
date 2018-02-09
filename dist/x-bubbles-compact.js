var XBubbles =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * XBubbles custom element.
	 * @module x-bubbles
	 */

	var context = __webpack_require__(1);
	var editor = __webpack_require__(2);
	var utils = __webpack_require__(6);
	var options = __webpack_require__(36);

	/**
	 * Prototype of XBubbles.
	 * @type {Object}
	 */
	var XBubbles = Object.create(HTMLDivElement.prototype, {
	    createdCallback: {
	        value: function value() {
	            initEditor(this);
	            utils.ready(this);
	        }
	    },

	    attachedCallback: {
	        value: function value() {
	            initEditor(this);
	            this.editor.bubbling();
	        }
	    },

	    detachedCallback: {
	        value: function value() {
	            destroyEditor(this);
	        }
	    },

	    attributeChangedCallback: {
	        value: function value() /* name, prevValue, value */{
	            options(this);
	        }
	    },

	    /**
	     * The receiving and recording settings.
	     * @memberof XBubbles
	     * @function
	     * @param {string|object} name - string, if only one option is inserted, or object - if many options inserted
	     * @param {*} value
	     * @returns {*}
	     * @public
	     */
	    options: {
	        value: function value(name, _value) {
	            return options(this, name, _value);
	        }
	    },

	    /**
	     * List bablow.
	     * @memberof XBubbles
	     * @type {array}
	     * @public
	     */
	    items: {
	        get: function get() {
	            return this.editor.getItems();
	        }
	    },

	    /**
	     * The value entered.
	     * @memberof XBubbles
	     * @type {string}
	     * @public
	     */
	    inputValue: {
	        get: function get() {
	            return this.editor.inputValue();
	        }
	    },

	    /**
	     * Set contents of the set.
	     * @function
	     * @memberof XBubbles
	     * @param {string} data
	     * @returns {boolean}
	     * @public
	     */
	    setContent: {
	        value: function value(data) {
	            return this.editor.setContent(data);
	        }
	    },

	    /**
	     * Add bubble.
	     * @function
	     * @memberof XBubbles
	     * @param {string} bubbleText
	     * @param {Object} [data]
	     * @returns {boolean}
	     * @public
	     */
	    addBubble: {
	        value: function value(bubbleText, data) {
	            return this.editor.addBubble(bubbleText, data);
	        }
	    },

	    /**
	     * Remove bubble.
	     * @function
	     * @memberof XBubbles
	     * @param {HTMLElement} nodeBubble
	     * @returns {boolean}
	     * @public
	     */
	    removeBubble: {
	        value: function value(nodeBubble) {
	            return this.editor.removeBubble(nodeBubble);
	        }
	    },

	    /**
	     * Edit bubble.
	     * @function
	     * @memberof XBubbles
	     * @param {HTMLElement} nodeBubble
	     * @returns {boolean}
	     * @public
	     */
	    editBubble: {
	        value: function value(nodeBubble) {
	            return this.editor.editBubble(nodeBubble);
	        }
	    },

	    /**
	     * Starting formation bablow.
	     * @function
	     * @memberof XBubbles
	     * @returns {boolean}
	     * @public
	     */
	    bubbling: {
	        value: function value() {
	            return this.editor.bubbling();
	        }
	    }
	});

	module.exports = context.document.registerElement('x-bubbles', {
	    extends: 'div',
	    prototype: XBubbles
	});

	function initEditor(node) {
	    if (!node.editor) {
	        Object.defineProperty(node, 'editor', {
	            configurable: true,
	            value: editor.init(node)
	        });
	    }
	}

	function destroyEditor(node) {
	    if (node.editor) {
	        editor.destroy(node);
	        delete node.editor;
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	    /* eslint no-eval: 0 */
	    return this || (1, eval)('this');
	}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);
	var bubbleset = __webpack_require__(3);
	var bubble = __webpack_require__(4);
	var cursor = __webpack_require__(13);

	var _require = __webpack_require__(12),
	    EV = _require.EV,
	    PROPS = _require.PROPS;

	var text = __webpack_require__(5);
	var events = __webpack_require__(10);
	var utils = __webpack_require__(6);
	var drag = __webpack_require__(15);
	var select = __webpack_require__(14);

	var COMMON_EVENTS = {
	    blur: __webpack_require__(21),
	    click: __webpack_require__(22),
	    focus: __webpack_require__(23),
	    keydown: __webpack_require__(24)
	};

	var EDITOR_EVENTS = {
	    blur: __webpack_require__(25),
	    click: __webpack_require__(26),
	    focus: __webpack_require__(27),
	    keydown: __webpack_require__(28),
	    keypress: __webpack_require__(29),
	    keyup: __webpack_require__(30),
	    paste: __webpack_require__(31)
	};

	var SELECT_EVENTS = {
	    blur: __webpack_require__(32),
	    click: __webpack_require__(33),
	    keydown: __webpack_require__(34),
	    keypress: __webpack_require__(35)
	};

	var PROXY_EVENTS = {
	    blur: events.proxyLocal,
	    click: events.proxyLocal,
	    focus: events.proxyLocal,
	    keydown: events.proxyLocal,
	    keypress: events.proxyLocal,
	    keyup: events.proxyLocal,
	    mscontrolselect: events.prevent,
	    paste: events.proxyLocal,
	    resize: events.prevent,
	    resizestart: events.prevent
	};

	exports.init = function (nodeWrap) {
	    var nodeEditor = nodeWrap;
	    nodeEditor.setAttribute('contenteditable', 'true');
	    nodeEditor.setAttribute('spellcheck', 'false');

	    events.onLocal(nodeEditor, COMMON_EVENTS);
	    events.onLocal(nodeEditor, EDITOR_EVENTS);

	    if (nodeEditor.options('selection')) {
	        events.onLocal(nodeEditor, SELECT_EVENTS);
	        drag.init(nodeEditor);
	    }

	    events.on(nodeEditor, PROXY_EVENTS);

	    nodeEditor.fireChange = utils.throttle(fireChange, nodeEditor);
	    nodeEditor.fireEdit = utils.throttle(fireEdit, nodeEditor);
	    nodeEditor.fireInput = utils.throttle(fireInput, nodeEditor);
	    nodeEditor.fireBeforeRemove = fireBeforeRemove.bind(nodeEditor);

	    return {
	        addBubble: addBubble.bind(nodeEditor),
	        bubbling: bubbling.bind(nodeEditor),
	        editBubble: editBubble.bind(nodeEditor),
	        getItems: getItems.bind(nodeEditor),
	        inputValue: inputValue.bind(nodeEditor),
	        removeBubble: removeBubble.bind(nodeEditor),
	        setContent: setContent.bind(nodeEditor)
	    };
	};

	exports.destroy = function (nodeWrap) {
	    var nodeEditor = nodeWrap;
	    events.off(nodeEditor, PROXY_EVENTS);
	    events.offLocal(nodeEditor, COMMON_EVENTS);
	    events.offLocal(nodeEditor, EDITOR_EVENTS);

	    if (nodeEditor.options('selection')) {
	        events.offLocal(nodeEditor, SELECT_EVENTS);
	        drag.destroy(nodeEditor);
	    }
	};

	function getItems() {
	    return bubbleset.getBubbles(this);
	}

	function setContent(data) {
	    var selection = context.getSelection();
	    selection && selection.removeAllRanges();

	    var list = select.get(this);
	    if (list.length) {
	        bubbleset.removeBubbles(this, list);
	        this.fireChange();
	    }

	    while (this.firstChild) {
	        this.removeChild(this.firstChild);
	    }

	    data = text.html2text(data);
	    this.appendChild(this.ownerDocument.createTextNode(data));
	    bubble.bubbling(this);
	    cursor.restore(this);

	    return true;
	}

	function addBubble(bubbleText, dataAttributes) {
	    var nodeBubble = bubble.create(this, bubbleText, dataAttributes);
	    if (!nodeBubble) {
	        return false;
	    }

	    if (text.text2bubble(this, nodeBubble)) {
	        this.fireInput();
	        this.fireChange();
	        cursor.restore(this);
	        return true;
	    }

	    return false;
	}

	function removeBubble(nodeBubble) {
	    if (this.contains(nodeBubble)) {
	        bubbleset.removeBubbles(this, [nodeBubble]);
	        this.fireChange();
	        return true;
	    }

	    return false;
	}

	function editBubble(nodeBubble) {
	    if (this.contains(nodeBubble)) {
	        return bubble.edit(this, nodeBubble);
	    }

	    return false;
	}

	function inputValue() {
	    var textRange = text.currentTextRange(this);
	    return textRange && text.textClean(textRange.toString()) || '';
	}

	function bubbling() {
	    bubble.bubbling(this);
	}

	/**
	 * Генерация события редактирования бабла.
	 * Выполняется в контексте узла-обертки.
	 * @alias module:x-bubbles/editor.fireEdit
	 * @param {HTMLElement} nodeBubble нода бабл
	 * @this HTMLElement
	 * @private
	 */
	function fireEdit(nodeBubble) {
	    events.dispatch(this, EV.BUBBLE_EDIT, {
	        bubbles: false,
	        cancelable: false,
	        detail: { data: nodeBubble }
	    });
	}

	/**
	 * Генерация события изменения набора баблов.
	 * Выполняется в контексте узла-обертки.
	 * @alias module:x-bubbles/editor.fireChange
	 * @this HTMLElement
	 * @private
	 */
	function fireChange() {
	    events.dispatch(this, EV.CHANGE, {
	        bubbles: false,
	        cancelable: false
	    });
	}

	/**
	 * Генерация события ввода текста.
	 * Выполняется в контексте узла-обертки.
	 * @alias module:x-bubbles/editor.fireInput
	 * @this HTMLElement
	 * @private
	 */
	function fireInput() {
	    var editText = inputValue.call(this);

	    if (this[PROPS.BUBBLE_VALUE] !== editText) {
	        this[PROPS.BUBBLE_VALUE] = editText;

	        events.dispatch(this, EV.BUBBLE_INPUT, {
	            bubbles: false,
	            cancelable: false,
	            detail: { data: editText }
	        });
	    }
	}

	/**
	 * Генерация события удаления баблов перед выполнением удаления из DOM.
	 * Выполняется в контексте узла-обертки.
	 * @alias module:x-bubbles/editor.fireRemove
	 * @param {array} list список удаляемых узлов
	 * @this HTMLElement
	 * @private
	 */
	function fireBeforeRemove(list) {
	    events.dispatch(this, EV.BEFORE_REMOVE, {
	        bubbles: false,
	        cancelable: false,
	        detail: { data: list }
	    });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bubble = __webpack_require__(4);
	var text = __webpack_require__(5);

	exports.closestNodeBubble = closestNodeBubble;
	exports.closestNodeSet = closestNodeSet;
	exports.findBubbleLeft = findBubbleLeft;
	exports.findBubbleRight = findBubbleRight;
	exports.getBubbles = getBubbles;
	exports.hasBubbles = hasBubbles;
	exports.headBubble = headBubble;
	exports.lastBubble = lastBubble;
	exports.nextBubble = nextBubble;
	exports.prevBubble = prevBubble;
	exports.removeBubbles = removeBubbles;
	exports.moveBubbles = moveBubbles;

	function lastBubble(nodeSet) {
	    return nodeSet.querySelector('[bubble]:last-child');
	}

	function headBubble(nodeSet) {
	    return nodeSet.querySelector('[bubble]:first-child');
	}

	function getBubbles(nodeSet) {
	    return Array.prototype.slice.call(nodeSet.querySelectorAll('[bubble]'));
	}

	function hasBubbles(nodeSet) {
	    return Boolean(nodeSet.querySelector('[bubble]'));
	}

	function findBubbleLeft(selection) {
	    if (!selection.focusNode || !selection.anchorNode) {
	        return;
	    }

	    var node = selection.focusNode.previousSibling;

	    if (selection.anchorNode !== selection.focusNode && selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
	        node = selection.anchorNode.previousSibling;
	    }

	    while (node) {
	        if (bubble.isBubbleNode(node)) {
	            return node;
	        }

	        if (node.nodeType === Node.TEXT_NODE && text.textClean(node.nodeValue)) {
	            return;
	        }

	        node = node.previousSibling;
	    }
	}

	function findBubbleRight(selection) {
	    if (!selection.focusNode || !selection.anchorNode) {
	        return;
	    }

	    var node = selection.focusNode.nextSibling;

	    if (selection.anchorNode !== selection.focusNode && selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
	        node = selection.anchorNode.nextSibling;
	    }

	    while (node) {
	        if (bubble.isBubbleNode(node)) {
	            return node;
	        }

	        if (node.nodeType === Node.TEXT_NODE && text.textClean(node.nodeValue)) {
	            return;
	        }

	        node = node.nextSibling;
	    }
	}

	function closestNodeSet(node) {
	    while (node) {
	        if (isEditorNode(node)) {
	            return node;
	        }

	        node = node.parentNode;
	    }
	}

	function closestNodeBubble(node) {
	    while (node) {
	        if (bubble.isBubbleNode(node)) {
	            return node;
	        }

	        if (isEditorNode(node)) {
	            return;
	        }

	        node = node.parentNode;
	    }
	}

	function prevBubble(target) {
	    var node = target && target.previousSibling;
	    while (node) {
	        if (bubble.isBubbleNode(node)) {
	            return node;
	        }

	        node = node.previousSibling;
	    }
	}

	function nextBubble(target) {
	    var node = target && target.nextSibling;
	    while (node) {
	        if (bubble.isBubbleNode(node)) {
	            return node;
	        }

	        node = node.nextSibling;
	    }
	}

	function isEditorNode(node) {
	    return node.nodeType === Node.ELEMENT_NODE && node.getAttribute('is') === 'x-bubbles';
	}

	function removeBubbles(nodeEditor, list) {
	    nodeEditor.fireBeforeRemove(list);
	    list.forEach(function (item) {
	        return nodeEditor.removeChild(item);
	    });
	}

	function moveBubbles(nodeEditorFrom, nodeEditorTo, list) {
	    nodeEditorFrom.fireBeforeRemove(list);
	    list.forEach(function (item) {
	        return nodeEditorTo.appendChild(item);
	    });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);
	var text = __webpack_require__(5);

	var _require = __webpack_require__(6),
	    escape = _require.escape,
	    canUseDrag = _require.canUseDrag;

	exports.isBubbleNode = isBubbleNode;
	exports.bubbling = bubbling;
	exports.create = create;
	exports.edit = edit;

	function isBubbleNode(node) {
	    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
	        return false;
	    }

	    return node.hasAttribute('bubble');
	}

	function edit(nodeSet, nodeBubble) {
	    if (nodeBubble.hasAttribute('readonly')) {
	        return false;
	    }

	    var selection = context.getSelection();

	    if (!selection) {
	        return false;
	    }

	    var bubbleDeformation = nodeSet.options('bubbleDeformation');
	    var rangeParams = bubbleDeformation(nodeBubble);

	    if (!rangeParams) {
	        var dataText = text.textClean(nodeBubble.innerText);

	        rangeParams = {
	            text: dataText,
	            startOffset: 0,
	            endOffset: dataText.length
	        };
	    }

	    var textFake = text.createZws();
	    var textNode = context.document.createTextNode(rangeParams.text);

	    nodeSet.fireEdit(nodeBubble);
	    nodeSet.replaceChild(textNode, nodeBubble);
	    nodeSet.insertBefore(textFake, textNode);

	    var range = context.document.createRange();
	    range.setStart(textNode, rangeParams.startOffset);
	    range.setEnd(textNode, rangeParams.endOffset);

	    selection.removeAllRanges();
	    selection.addRange(range);
	    return true;
	}

	/**
	 * У обертки нельзя делать tabindex=-1, иначе будет слетать фокус с поля ввода.
	 * @param {HTMLElement} nodeEditor
	 * @param {string} dataText
	 * @param {Object} [dataAttributes={}]
	 * @returns {?HTMLElement}
	 */
	function create(nodeEditor, dataText) {
	    var dataAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    dataText = text.textClean(dataText);

	    if (!dataText) {
	        return;
	    }

	    var bubbleFormation = nodeEditor.options('bubbleFormation');
	    var classBubble = nodeEditor.options('classBubble');
	    var draggable = canUseDrag && nodeEditor.options('draggable') && nodeEditor.options('selection');
	    var wrap = nodeEditor.ownerDocument.createElement('span');

	    wrap.innerText = dataText;

	    for (var key in dataAttributes) {
	        if (dataAttributes[key]) {
	            wrap.setAttribute('data-' + key, escape(dataAttributes[key]));
	        }
	    }

	    bubbleFormation(wrap);

	    if (classBubble) {
	        var classes = String(classBubble).trim().split(/\s+/);
	        var len = classes.length;

	        while (len--) {
	            wrap.classList.add(classes[len]);
	        }
	    }

	    wrap.setAttribute('bubble', '');
	    wrap.setAttribute('contenteditable', 'false');
	    draggable && wrap.setAttribute('draggable', 'true');

	    return wrap;
	}

	function bubbling(nodeSet) {
	    var begining = nodeSet.options('begining');
	    var ending = nodeSet.options('ending');
	    var separator = nodeSet.options('separator');
	    var tokenizer = nodeSet.options('tokenizer');
	    var ranges = getBubbleRanges(nodeSet);
	    var nodes = [];

	    ranges.forEach(function (range) {
	        var dataText = text.textClean(range.toString());

	        if (!dataText) {
	            range.deleteContents();
	            return;
	        }

	        var textParts = [dataText];

	        if (tokenizer) {
	            textParts = tokenizer(dataText);
	        } else {
	            if (separator) {
	                textParts = dataText.split(separator).map(trimIterator).filter(nonEmptyIterator);
	            }

	            if (ending) {
	                textParts = textParts.reduce(function (parts, str) {
	                    return parts.concat(parseFragmentByEnding(str, ending));
	                }, []).map(trimIterator).filter(nonEmptyIterator);
	            } else if (begining) {
	                textParts = textParts.reduce(function (parts, str) {
	                    return parts.concat(parseFragmentByBeginning(str, begining));
	                }, []).map(trimIterator).filter(nonEmptyIterator);
	            }
	        }

	        if (!Array.isArray(textParts) || !textParts.length) {
	            range.deleteContents();
	            return;
	        }

	        var fragment = context.document.createDocumentFragment();

	        textParts.forEach(function (textPart) {
	            var nodeBubble = create(nodeSet, textPart);
	            if (nodeBubble) {
	                fragment.appendChild(nodeBubble);
	                nodes.push(nodeBubble);
	            }
	        });

	        range.deleteContents();
	        range.insertNode(fragment);
	    });

	    nodeSet.fireInput();

	    if (nodes.length) {
	        nodeSet.fireChange();
	    }

	    return nodes;
	}

	function getBubbleRanges(nodeSet) {
	    var ranges = [];
	    var children = nodeSet.childNodes;
	    var range = void 0;
	    var node = void 0;

	    for (var i = 0; i < children.length; i++) {
	        node = children[i];

	        if (isBubbleNode(node)) {
	            if (range) {
	                range.setEndBefore(node);
	                ranges.push(range);
	                range = undefined;
	            }
	        } else {
	            if (!range) {
	                range = context.document.createRange();
	                range.setStartBefore(node);
	            }
	        }
	    }

	    if (range) {
	        range.setEndAfter(node);
	        ranges.push(range);
	    }

	    return ranges;
	}

	function trimIterator(str) {
	    return str.trim();
	}

	function nonEmptyIterator(str) {
	    return Boolean(str);
	}

	function parseFragmentByEnding(str, reg) {
	    var parts = [];
	    var lastIndex = 0;
	    var loop = 999;

	    reg.lastIndex = 0;
	    while (reg.exec(str) !== null && loop) {
	        loop--;
	        parts.push(str.substring(lastIndex, reg.lastIndex));
	        lastIndex = reg.lastIndex;
	    }

	    return parts;
	}

	function parseFragmentByBeginning(str, reg) {
	    var parts = [];
	    var res = void 0;
	    var index = 0;
	    var loop = 999;

	    reg.lastIndex = 0;
	    while ((res = reg.exec(str)) !== null && loop) {
	        loop--;
	        if (index !== res.index) {
	            parts.push(str.substring(index, res.index));
	            index = res.index;
	        }
	    }

	    parts.push(str.substring(index, str.length));
	    return parts;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);
	var bubbleset = __webpack_require__(3);

	var _require = __webpack_require__(6),
	    getSelection = _require.getSelection,
	    correctSelection = _require.correctSelection;

	/* eslint-disable max-len */


	var REG_REPLACE_NON_PRINTABLE = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
	var REG_ZWS = /\u200B/;
	var TEXT_ZWS = '\u200B';

	exports.isEmptyLeft = isEmptyLeft;
	exports.isEmptyRight = isEmptyRight;
	exports.arrowRight = arrowRight;
	exports.arrowLeft = arrowLeft;
	exports.remove = remove;
	exports.html2text = html2text;
	exports.currentTextRange = currentTextRange;
	exports.text2bubble = text2bubble;
	exports.replaceString = replaceString;
	exports.selectAll = selectAll;
	exports.textClean = textClean;
	exports.checkZws = checkZws;
	exports.createZws = createZws;

	function isEmptyLeft(selection) {
	    var _correctSelection = correctSelection(selection),
	        startNode = _correctSelection.startNode,
	        startOffset = _correctSelection.startOffset;

	    var isEmpty = true;
	    var node = startNode;

	    while (node) {
	        if (node.nodeType === Node.TEXT_NODE) {
	            var value = startOffset > 0 ? node.nodeValue.substring(0, startOffset) : node.nodeValue;

	            if (textClean(value)) {
	                isEmpty = false;
	                break;
	            }
	        } else {
	            break;
	        }

	        startOffset = 0;
	        node = node.previousSibling;
	    }

	    return isEmpty;
	}

	function isEmptyRight(selection) {
	    var _correctSelection2 = correctSelection(selection),
	        endNode = _correctSelection2.endNode,
	        endOffset = _correctSelection2.endOffset;

	    var node = endNode;

	    while (node) {
	        if (node.nodeType === Node.TEXT_NODE) {
	            var value = endOffset > -1 && endOffset < node.nodeValue.length ? node.nodeValue.substring(endOffset) : node.nodeValue;

	            if (textClean(value)) {
	                return false;
	            }
	        } else {
	            return false;
	        }

	        endOffset = -1;
	        node = node.nextSibling;
	    }

	    return true;
	}

	function text2bubble(nodeEditor, nodeBubble) {
	    var selection = getSelection(nodeEditor);
	    var range = selection && currentTextRange(nodeEditor, selection);

	    if (range) {
	        selection.removeAllRanges();
	        selection.addRange(range);
	        replace(selection, nodeBubble);
	    } else {
	        nodeEditor.appendChild(nodeBubble);
	    }

	    return true;
	}

	function currentTextRange(nodeEditor, selection) {
	    selection = selection || getSelection(nodeEditor);
	    if (!selection) {
	        return;
	    }

	    var pointNode = selection.focusNode && selection.focusNode.nodeType === Node.TEXT_NODE ? selection.focusNode : selection.anchorNode && selection.anchorNode.nodeType === Node.TEXT_NODE ? selection.anchorNode : undefined;

	    if (!pointNode) {
	        return;
	    }

	    var startNode = pointNode;
	    var endNode = pointNode;
	    var item = pointNode;

	    while (item && item.nodeType === Node.TEXT_NODE) {
	        startNode = item;
	        item = item.previousSibling;
	    }

	    item = pointNode;

	    while (item && item.nodeType === Node.TEXT_NODE) {
	        endNode = item;
	        item = item.nextSibling;
	    }

	    var range = nodeEditor.ownerDocument.createRange();
	    range.setStartBefore(startNode);
	    range.setEndAfter(endNode);

	    return range;
	}

	function remove(selection) {
	    return replace(selection, createZws());
	}

	function replace(selection, node) {
	    if (!selection || !selection.rangeCount) {
	        return false;
	    }

	    var anchor = context.document.createElement('span');
	    selection.getRangeAt(0).surroundContents(anchor);
	    anchor.parentNode.replaceChild(node, anchor);

	    selection.removeAllRanges();

	    if (node.nodeType === Node.TEXT_NODE) {
	        var range = context.document.createRange();
	        // для ИЕ обязательно указывать node.nodeValue.length
	        range.setStart(node, node.nodeValue.length);
	        range.collapse(false);
	        selection.addRange(range);
	    } else {
	        selection.collapse(node, 0);
	    }

	    return true;
	}

	function replaceString(data, selection) {
	    data = textClean(data);
	    if (!data) {
	        return false;
	    }

	    selection = selection || context.getSelection();
	    var textNode = context.document.createTextNode(data);

	    if (!replace(selection, textNode)) {
	        return false;
	    }

	    selection.collapse(textNode, textNode.nodeValue.length);
	    return true;
	}

	function arrowLeft(selection, extend) {
	    selection = selection || context.getSelection();

	    if (!selection || !selection.anchorNode || selection.anchorNode.nodeType !== Node.TEXT_NODE) {

	        return false;
	    }

	    var _correctSelection3 = correctSelection(selection),
	        startNode = _correctSelection3.startNode,
	        endNode = _correctSelection3.endNode,
	        startOffset = _correctSelection3.startOffset,
	        endOffset = _correctSelection3.endOffset,
	        revert = _correctSelection3.revert;

	    if (!selection.isCollapsed && !extend) {
	        selection.collapse(startNode, startOffset);
	        return true;
	    }

	    var isNativeExtend = Boolean(selection.extend);
	    revert = isNativeExtend ? revert : !revert;
	    var node = revert ? startNode : endNode;
	    var offset = revert ? startOffset : endOffset;

	    while (node) {
	        if (node.nodeType !== Node.TEXT_NODE) {
	            return false;
	        }

	        if (offset === null) {
	            offset = node.nodeValue.length;
	        }

	        if (offset - 1 < 0) {
	            node = node.previousSibling;
	            offset = null;
	            continue;
	        }

	        var text = node.nodeValue.substring(offset - 1, offset);

	        if (checkZws(text)) {
	            offset = offset - 1;
	            continue;
	        }

	        break;
	    }

	    if (!node || offset === null) {
	        return false;
	    }

	    if (extend) {
	        if (isNativeExtend) {
	            selection.extend(node, offset - 1);
	        } else {
	            var range = context.document.createRange();

	            if (revert) {
	                range.setStart(node, offset - 1);
	                range.setEnd(endNode, endOffset);
	            } else {
	                range.setStart(startNode, startOffset);
	                range.setEnd(node, offset - 1);
	            }

	            selection.removeAllRanges();
	            selection.addRange(range);
	        }
	    } else {
	        selection.collapse(node, offset - 1);
	    }

	    return true;
	}

	function arrowRight(selection, extend) {
	    selection = selection || context.getSelection();

	    if (!selection || !selection.focusNode || selection.focusNode.nodeType !== Node.TEXT_NODE) {

	        return false;
	    }

	    var _correctSelection4 = correctSelection(selection),
	        startNode = _correctSelection4.startNode,
	        endNode = _correctSelection4.endNode,
	        startOffset = _correctSelection4.startOffset,
	        endOffset = _correctSelection4.endOffset,
	        revert = _correctSelection4.revert;

	    if (!selection.isCollapsed && !extend) {
	        selection.collapse(endNode, endOffset);
	        return true;
	    }

	    var node = revert ? startNode : endNode;
	    var offset = revert ? startOffset : endOffset;

	    while (node) {
	        if (node.nodeType !== Node.TEXT_NODE) {
	            return false;
	        }

	        var len = node.nodeValue.length;

	        if (offset + 1 > len) {
	            node = node.nextSibling;
	            offset = 0;
	            continue;
	        }

	        var text = node.nodeValue.substring(offset, offset + 1);

	        if (checkZws(text)) {
	            offset = offset + 1;
	            continue;
	        }

	        break;
	    }

	    if (!node) {
	        return false;
	    }

	    if (extend) {
	        var isNativeExtend = Boolean(selection.extend);

	        if (isNativeExtend) {
	            selection.extend(node, offset + 1);
	        } else {
	            var range = context.document.createRange();

	            if (revert) {
	                range.setStart(node, offset + 1);
	                range.setEnd(endNode, endOffset);
	            } else {
	                range.setStart(startNode, startOffset);
	                range.setEnd(node, offset + 1);
	            }

	            selection.removeAllRanges();
	            selection.addRange(range);
	        }
	    } else {
	        selection.collapse(node, offset + 1);
	    }

	    return true;
	}

	function html2text(value) {
	    if (!value) {
	        return '';
	    }

	    var DOMContainer = context.document.implementation.createHTMLDocument('').body;
	    DOMContainer.innerText = value;

	    return DOMContainer.innerText.replace(/^[\u0020\u00a0]+$/gm, '').replace(/\n/gm, ' ').trim();
	}

	function selectAll(selection, nodeSet) {
	    selection = selection || context.getSelection();
	    var node = selection && selection.anchorNode;

	    if (!node || node.nodeType !== Node.TEXT_NODE) {
	        return false;
	    }

	    var fromNode = void 0;
	    var toNode = void 0;
	    var item = node;

	    while (item && item.nodeType === Node.TEXT_NODE) {
	        fromNode = item;
	        item = item.previousSibling;
	    }

	    item = node;

	    while (item && item.nodeType === Node.TEXT_NODE) {
	        toNode = item;
	        item = item.nextSibling;
	    }

	    var hasBubbles = bubbleset.hasBubbles(nodeSet);
	    var range = context.document.createRange();
	    range.setStartBefore(fromNode);
	    range.setEndAfter(toNode);

	    var dataText = textClean(range.toString());

	    if (dataText || !dataText && !hasBubbles) {
	        if (!dataText) {
	            range.collapse();
	        }

	        selection.removeAllRanges();
	        selection.addRange(range);
	        return true;
	    }

	    return false;
	}

	function createZws() {
	    return context.document.createTextNode(TEXT_ZWS);
	}

	function checkZws(value) {
	    return REG_ZWS.test(value);
	}

	function textClean(value) {
	    return String(value || '').trim().replace(REG_REPLACE_NON_PRINTABLE, '');
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var raf = __webpack_require__(7);
	var context = __webpack_require__(1);

	var _require = __webpack_require__(10),
	    dispatch = _require.dispatch;

	var _require2 = __webpack_require__(12),
	    EV = _require2.EV;

	/* eslint quotes: 0 */

	var HTML_ESCAPES = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '`': '&#96;'
	};

	var HTML_UNESCAPES = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'",
	    '&#96;': '`'
	};

	var REG_ESCAPED_HTML = /&(?:amp|lt|gt|quot|#39|#96);/g;
	var REG_UNESCAPED_HTML = /[&<>"'`]/g;
	var REG_HAS_ESCAPED_HTML = RegExp(REG_ESCAPED_HTML.source);
	var REG_HAS_UNESCAPED_HTML = RegExp(REG_UNESCAPED_HTML.source);
	var REG_IE = /Trident|Edge/;
	var REG_MOBILE_IE = /IEMobile/;

	exports.getSelection = function (nodeEditor) {
	    var selection = context.getSelection();

	    if (selection && selection.anchorNode && nodeEditor.compareDocumentPosition(selection.anchorNode) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
	        return selection;
	    }
	};

	exports.correctSelection = function (selection) {
	    var endNode = selection.focusNode;
	    var endOffset = selection.focusOffset;
	    var startNode = selection.anchorNode;
	    var startOffset = selection.anchorOffset;
	    var revert = false;

	    if (startNode === endNode) {
	        startOffset = Math.min(selection.anchorOffset, selection.focusOffset);
	        endOffset = Math.max(selection.anchorOffset, selection.focusOffset);
	        revert = selection.anchorOffset > selection.focusOffset;
	    } else {
	        var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
	        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
	            startNode = selection.focusNode;
	            startOffset = selection.focusOffset;
	            endNode = selection.anchorNode;
	            endOffset = selection.anchorOffset;
	            revert = true;
	        }
	    }

	    return { startNode: startNode, endNode: endNode, startOffset: startOffset, endOffset: endOffset, revert: revert };
	};

	exports.throttle = function (callback, runContext) {
	    var throttle = 0;
	    var animationCallback = function animationCallback() {
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
	}();

	exports.isIE = function () {
	    return REG_IE.test(context.navigator.userAgent);
	}();

	exports.isMobileIE = function () {
	    return REG_MOBILE_IE.test(context.navigator.userAgent);
	}();

	exports.ready = function () {
	    var elements = [];
	    var ready = false;
	    var lock = false;

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
	}();

	function unescapeHtmlChar(chr) {
	    return HTML_UNESCAPES[chr];
	}

	function escapeHtmlChar(chr) {
	    return HTML_ESCAPES[chr];
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(8)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/**
	 * @module x-bubbles/events
	 */

	var context = __webpack_require__(1);
	var CustomEventCommon = __webpack_require__(11);

	var _require = __webpack_require__(12),
	    PROPS = _require.PROPS;

	exports.scrollX = scrollX;
	exports.scrollY = scrollY;
	exports.dispatch = dispatch;

	exports.keyCode = function (event) {
	    return event.charCode || event.keyCode;
	};

	exports.metaKey = function (event) {
	    return event.ctrlKey || event.metaKey;
	};

	exports.pageX = function (event) {
	    return event.pageX === null && event.clientX !== null ? event.clientX + scrollX() : event.pageX;
	};

	exports.pageY = function (event) {
	    return event.pageY === null && event.clientY !== null ? event.clientY + scrollY() : event.pageY;
	};

	exports.one = function (target, eventName, callback) {
	    toggleEvent(target, eventName, callback, true, false, true);
	};

	exports.on = function (target, eventName, callback) {
	    toggleEvent(target, eventName, callback);
	};

	exports.off = function (target, eventName, callback) {
	    toggleEvent(target, eventName, callback, false);
	};

	exports.oneLocal = function (target, eventName, callback) {
	    toggleEvent(target, eventName, callback, true, true, true);
	};

	exports.onLocal = function (target, eventName, callback) {
	    toggleEvent(target, eventName, callback, true, true);
	};

	exports.offLocal = function (target, eventName, callback) {
	    toggleEvent(target, eventName, callback, false, true);
	};

	exports.prevent = function (event) {
	    event.cancelBubble = true;
	    event.returnValue = false;
	    event.stopImmediatePropagation();
	    event.stopPropagation();
	    event.preventDefault();
	    return false;
	};

	exports.proxyLocal = function (event) {
	    dispatchLocalEvent(event.currentTarget, event);
	};

	function scrollX() {
	    var html = context.document.documentElement;
	    var body = context.document.body;
	    return (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
	}

	function scrollY() {
	    var html = context.document.documentElement;
	    var body = context.document.body;
	    return (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
	}

	/**
	 * Designer events.
	 *
	 * @example
	 * const { Custom } = require('event');
	 *
	 * new Custom('custom-event', {
	 *     bubbles: true,
	 *     cancelable: true,
	 *     detail: { data: '123' }
	 * })
	 *
	 * @alias module:x-bubbles/event~Custom
	 * @constructor
	 */
	var Custom = function () {
	    if (typeof context.CustomEvent === 'function') {
	        return context.CustomEvent;
	    }

	    return CustomEventCommon;
	}();

	/**
	 * Dispatch event.
	 *
	 * @example
	 * const { dispatch } = require('event');
	 * dispatch(node, 'custom-event', {
	 *     bubbles: true,
	 *     cancelable: true,
	 *     detail: { data: '123' }
	 * })
	 *
	 * @alias module:x-bubbles/event.dispatch
	 * @param {HTMLElement} element node events
	 * @param {string} name event name
	 * @param {Object} params the event parameters
	 * @param {boolean} [params.bubbles=false]
	 * @param {boolean} [params.cancelable=false]
	 * @param {*} [params.detail]
	 */
	function dispatch(element, name) {
	    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    element.dispatchEvent(new Custom(name, params));
	}

	function dispatchLocalEvent(element, event) {
	    var callbacks = element[PROPS.LOCAL_EVENTS] && element[PROPS.LOCAL_EVENTS][event.type] || [];
	    var sharedData = {};

	    for (var i = 0; i < callbacks.length; i++) {
	        if (event.immediatePropagationStopped) {
	            break;
	        }

	        callbacks[i](event, sharedData);
	    }
	}

	function oneCallback(element, eventName, callback) {
	    return function _callback(event) {
	        element.removeEventListener(eventName, _callback);
	        callback(event);
	    };
	}

	function getEventHandlersQueue(element, eventName) {
	    if (!element[PROPS.LOCAL_EVENTS]) {
	        element[PROPS.LOCAL_EVENTS] = {};
	    }

	    if (!element[PROPS.LOCAL_EVENTS][eventName]) {
	        element[PROPS.LOCAL_EVENTS][eventName] = [];
	    }

	    return element[PROPS.LOCAL_EVENTS][eventName];
	}

	var EV_ACTIONS = {
	    addLocalEventListener: function addLocalEventListener(element, eventName, callback) {
	        getEventHandlersQueue(element, eventName).push(callback);
	    },

	    removeLocalEventListener: function removeLocalEventListener(element, eventName, callback) {
	        var callbacks = element[PROPS.LOCAL_EVENTS] && element[PROPS.LOCAL_EVENTS][eventName] || [];
	        var i = 0;

	        while (i < callbacks.length) {
	            if (callbacks[i] === callback) {
	                callbacks.splice(i, 1);
	            } else {
	                i++;
	            }
	        }
	    },

	    addEventListener: function addEventListener(element, eventName, callback) {
	        element.addEventListener(eventName, callback);
	    },

	    removeEventListener: function removeEventListener(element, eventName, callback) {
	        element.removeEventListener(eventName, callback);
	    }
	};

	function toggleEvent(element, eventName, userCallback) {
	    var isSet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
	    var isLocal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	    var isOne = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	    var events = userCallback ? _defineProperty({}, eventName, userCallback) : eventName;
	    var action = '' + (isSet ? 'add' : 'remove') + (isLocal ? 'Local' : '') + 'EventListener';

	    for (var name in events) {
	        var callback = isOne ? oneCallback(element, name, events[name]) : events[name];
	        EV_ACTIONS[action](element, name, callback);
	    }
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);

	/**
	 * @constant {Document}
	 * @private
	 */
	var doc = context.document;

	/**
	 * @constant {Object}
	 * @private
	 */
	var protoEvent = context.Event.prototype;

	var issetCustomEvent = false;

	try {
	    issetCustomEvent = Boolean(doc.createEvent('CustomEvent'));
	} catch (e) {}
	// do nothing


	/**
	 * The original function "stopImmediatePropagation"
	 * @constant {function}
	 * @private
	 */
	var stopImmediatePropagation = protoEvent.stopImmediatePropagation;

	/**
	 * Override function to set properties "immediatePropagationStopped"
	 */
	protoEvent.stopImmediatePropagation = function () {
	    this.immediatePropagationStopped = true;

	    if (stopImmediatePropagation) {
	        stopImmediatePropagation.call(this);
	    } else {
	        this.stopPropagation();
	    }
	};

	var CustomEventCommon = function () {
	    if (issetCustomEvent) {
	        return function (eventName, params) {
	            params = params || {};

	            var bubbles = Boolean(params.bubbles);
	            var cancelable = Boolean(params.cancelable);
	            var evt = doc.createEvent('CustomEvent');

	            evt.initCustomEvent(eventName, bubbles, cancelable, params.detail);

	            return evt;
	        };
	    }

	    return function (eventName, params) {
	        params = params || {};

	        var bubbles = Boolean(params.bubbles);
	        var cancelable = Boolean(params.cancelable);
	        var evt = doc.createEvent('Event');

	        evt.initEvent(eventName, bubbles, cancelable);
	        evt.detail = params.detail;

	        return evt;
	    };
	}();

	CustomEventCommon.prototype = protoEvent;

	module.exports = CustomEventCommon;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	exports.KEY = {
	    a: 65,
	    Backspace: 8,
	    Bottom: 40,
	    c: 67,
	    Cmd: 91,
	    Comma: 44, // ,
	    Delete: 46,
	    Enter: 13, // Enter
	    Esc: 27,
	    Left: 37,
	    Right: 39,
	    Semicolon: 59, // ;
	    Space: 32,
	    Tab: 9,
	    Top: 38,
	    x: 88
	};

	exports.CLS = {
	    DRAGSTART: 'drag',
	    DROPZONE: 'dropzone'
	};

	exports.EV = {
	    BEFORE_REMOVE: 'before-remove',
	    BUBBLE_EDIT: 'bubble-edit',
	    BUBBLE_INPUT: 'bubble-input',
	    CHANGE: 'change',
	    DRAGEND: 'dragend',
	    DRAGENTER: 'dragenter',
	    DRAGLEAVE: 'dragleave',
	    DRAGSTART: 'dragstart',
	    DROP: 'drop',
	    READY: 'x-bubbles-ready'
	};

	exports.PROPS = {
	    BUBBLE_VALUE: '__bubble_value__',
	    CLICK_TIME: '__click_time__',
	    LOCAL_EVENTS: '__events__',
	    LOCK_COPY: '__lock_copy__',
	    OPTIONS: '__options__'
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @module x-bubbles/cursor
	 */

	var context = __webpack_require__(1);
	var text = __webpack_require__(5);
	var select = __webpack_require__(14);
	var utils = __webpack_require__(6);

	exports.restore = restore;
	exports.restoreBasis = restoreBasis;

	/**
	 * Reset the cursor position to the end of the input field.
	 * This action is forbidden in the IE Mobile because it
	 * causes a browser crash. There is still no workaround.
	 * @alias module:x-bubbles/cursor.restore
	 * @param {HTMLElement} nodeSet
	 */
	function restore(nodeSet) {
	    if (!utils.isMobileIE) {
	        select.clear(nodeSet);
	        var basis = restoreBasis(nodeSet);
	        var selection = context.getSelection();
	        selection.removeAllRanges();
	        selection.collapse(basis, 1);
	    }
	}

	/**
	 * The creation of the fake text at the end childNodes
	 * @alias module:x-bubbles/cursor.restoreBasis
	 * @param {HTMLElement} nodeSet
	 * @returns {HTMLTextElement} fake text node
	 */
	function restoreBasis(nodeSet) {
	    var fakeText = text.createZws();

	    if (nodeSet.hasChildNodes()) {
	        var lastNode = nodeSet.childNodes[nodeSet.childNodes.length - 1];

	        if (lastNode.isEqualNode(fakeText)) {
	            fakeText = lastNode;
	        } else {
	            nodeSet.appendChild(fakeText);
	        }
	    } else {
	        nodeSet.appendChild(fakeText);
	    }

	    return fakeText;
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);
	var bubble = __webpack_require__(4);
	var bubbleset = __webpack_require__(3);

	var slice = Array.prototype.slice;
	var PATH_SELECTED = '[bubble][selected]';
	var PATH_NOT_SELECTED = '[bubble]:not([selected])';

	exports.all = all;
	exports.add = add;
	exports.clear = clear;
	exports.get = get;
	exports.uniq = uniq;
	exports.head = head;
	exports.last = last;
	exports.has = has;
	exports.range = range;
	exports.toggleUniq = toggleUniq;

	function range(node) {
	    if (!bubble.isBubbleNode(node)) {
	        return;
	    }

	    var set = node.parentNode;
	    var list = get(set);

	    if (!list.length) {
	        uniq(node);
	        return;
	    }

	    clear(set);

	    var headList = list[0];
	    var lastList = list[list.length - 1];

	    if (headList === lastList || !set.startRangeSelect) {
	        set.startRangeSelect = headList;
	    }

	    var fromNode = void 0;
	    var toNode = void 0;
	    var position = node.compareDocumentPosition(set.startRangeSelect);

	    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
	        fromNode = set.startRangeSelect;
	        toNode = node;
	    } else {
	        fromNode = node;
	        toNode = set.startRangeSelect;
	    }

	    if (fromNode && toNode) {
	        var item = fromNode;

	        while (item) {
	            if (!setSelected(item)) {
	                break;
	            }

	            if (item === toNode) {
	                break;
	            }

	            item = item.nextSibling;
	        }

	        bubble.bubbling(set);
	    }
	}

	function all(nodeSet) {
	    slice.call(nodeSet.querySelectorAll(PATH_NOT_SELECTED)).forEach(function (item) {
	        return setSelected(item);
	    });
	    nodeSet.startRangeSelect = nodeSet.querySelector(PATH_SELECTED);

	    bubble.bubbling(nodeSet);

	    var selection = context.getSelection();
	    selection && selection.removeAllRanges();
	}

	function has(nodeSet) {
	    return Boolean(nodeSet.querySelector(PATH_SELECTED));
	}

	function head(set) {
	    return get(set)[0];
	}

	function last(set) {
	    var list = get(set);
	    return list[list.length - 1];
	}

	function get(nodeSet) {
	    return slice.call(nodeSet.querySelectorAll(PATH_SELECTED));
	}

	function clear(nodeSet) {
	    get(nodeSet).forEach(function (item) {
	        return item.removeAttribute('selected');
	    });
	}

	function add(node) {
	    if (setSelected(node)) {
	        var nodeSet = bubbleset.closestNodeSet(node);

	        nodeSet.startRangeSelect = node;
	        // ???
	        bubble.bubbling(nodeSet);

	        return true;
	    }

	    return false;
	}

	function uniq(node) {
	    if (!bubble.isBubbleNode(node)) {
	        return false;
	    }

	    var nodeSet = bubbleset.closestNodeSet(node);
	    var selection = context.getSelection();

	    selection && selection.removeAllRanges();
	    clear(nodeSet);

	    return add(node);
	}

	function toggleUniq(node) {
	    if (isSelected(node)) {
	        var nodeSet = bubbleset.closestNodeSet(node);

	        if (get(nodeSet).length === 1) {
	            return removeSelected(node);
	        }
	    }

	    return uniq(node);
	}

	function isSelected(node) {
	    return bubble.isBubbleNode(node) && node.hasAttribute('selected') || false;
	}

	function setSelected(node) {
	    if (bubble.isBubbleNode(node)) {
	        node.setAttribute('selected', '');
	        return true;
	    }

	    return false;
	}

	function removeSelected(node) {
	    if (bubble.isBubbleNode(node)) {
	        node.removeAttribute('selected');
	        return true;
	    }

	    return false;
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var native = __webpack_require__(16);
	var mouse = __webpack_require__(19);

	var _require = __webpack_require__(6),
	    canUseDrag = _require.canUseDrag;

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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);
	var select = __webpack_require__(14);
	var bubbleset = __webpack_require__(3);
	var events = __webpack_require__(10);

	var _require = __webpack_require__(12),
	    CLS = _require.CLS;

	var _require2 = __webpack_require__(17),
	    getDragImage = _require2.getDragImage,
	    onDropSuccess = _require2.onDropSuccess,
	    DRAG_IMG = _require2.DRAG_IMG;

	var EVENTS = {
	    dragend: onDragend,
	    dragenter: onDragenter,
	    dragleave: onDragleave,
	    dragover: onDragover,
	    dragstart: onDragstart,
	    drop: onDrop
	};

	var currentDragSet = null;

	exports.init = function (nodeSet) {
	    events.on(nodeSet, EVENTS);
	};

	exports.destroy = function (nodeSet) {
	    events.off(nodeSet, EVENTS);
	};

	function onDragstart(event) {
	    event.stopPropagation();

	    var nodeSet = bubbleset.closestNodeSet(event.target);
	    var nodeBubble = bubbleset.closestNodeBubble(event.target);

	    if (!nodeSet || !nodeBubble) {
	        event.preventDefault();
	        return;
	    }

	    var selection = context.getSelection();
	    selection && selection.removeAllRanges();

	    currentDragSet = nodeSet;
	    nodeSet.classList.add(CLS.DRAGSTART);
	    select.add(nodeBubble);

	    event.dataTransfer.effectAllowed = 'move';
	    event.dataTransfer.setData('text/plain', '');

	    var list = select.get(currentDragSet);

	    if (list.length > 1) {
	        event.dataTransfer.setDragImage(getDragImage(), DRAG_IMG.w, DRAG_IMG.h);
	    }
	}

	function onDrop(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    if (!currentDragSet) {
	        return;
	    }

	    var nodeSet = bubbleset.closestNodeSet(event.target);

	    if (!nodeSet || nodeSet === currentDragSet) {
	        return;
	    }

	    var checkBubbleDrop = nodeSet.options('checkBubbleDrop');

	    var list = select.get(currentDragSet);

	    if (list.length && checkBubbleDrop(list)) {
	        bubbleset.moveBubbles(currentDragSet, nodeSet, list);
	        context.setTimeout(onDropSuccess, 0, currentDragSet, nodeSet);
	    }
	}

	function onDragover(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    if (!currentDragSet) {
	        return;
	    }

	    event.dataTransfer.dropEffect = 'move';
	}

	function onDragenter(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    if (!currentDragSet) {
	        return;
	    }

	    var nodeSet = bubbleset.closestNodeSet(event.target);
	    if (nodeSet && nodeSet !== currentDragSet) {
	        nodeSet.classList.add(CLS.DROPZONE);
	    }
	}

	function onDragleave(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    if (!currentDragSet) {
	        return;
	    }

	    var nodeSet = bubbleset.closestNodeSet(event.target);
	    if (nodeSet && nodeSet !== currentDragSet) {
	        nodeSet.classList.remove(CLS.DROPZONE);
	    }
	}

	function onDragend(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    if (!currentDragSet) {
	        return;
	    }

	    currentDragSet.classList.remove(CLS.DRAGSTART);

	    var nodeSet = bubbleset.closestNodeSet(event.target);

	    if (nodeSet && nodeSet !== currentDragSet) {
	        nodeSet.classList.remove(CLS.DROPZONE);
	    }

	    currentDragSet = null;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DRAG_IMG = { w: 16, h: 16 };

	var dragImage = null;

	exports.DRAG_IMG = DRAG_IMG;

	exports.getDragImage = function () {
	    if (!dragImage) {
	        dragImage = new Image();
	        dragImage.src = __webpack_require__(18);
	    }

	    return dragImage;
	};

	exports.onDropSuccess = function (fromNodeSet, toNodeSet) {
	    fromNodeSet.fireChange();
	    toNodeSet.focus();
	    toNodeSet.fireChange();
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAVCAMAAAAw/0MlAAABblBMVEUAAABOXIZJWIKCkbeNnMKMmsJNW4VNW4VWZY57ibFHV4KVpMxRYImCkLh9jbpgcJ1fcJ1JWoaZqdNUZpaHmMaVpdJIWolTZJKHmMZEV4iXqNdkdqhjdal2iLx2ib2Knc6PodNJXpJJXpNOYpdpfLKCk8JPYpdofLNugblugrqUptdZdLdZd8Nfeb93js1+ksuGm9SGm9VHaLhJarxKZqxKbL9La7pNbr9Pb71Ucr1Wbag/XqU/X6pAVopffMdjf8ZphMpwicx2js9BW51CWZN/ldCBl9KCmNNFYKRFZbGJndWOodVKX5RKX5ZKYJdWdcNXbKJYdL1KYJtAVYpaeMVJXpJKbMBgebpjeLBjf8VLYp5kd65kgMlofLRog8log8tJYqBth8xugrpviMtNabBxi851jc8/X6t3i8BOaK56kdB9lNFOaa5Ob8FPY5qBl9NGXJODmNOEmdNQbrpRcsJUb7RGXJSTptmUptiUp9kfFguNAAAAK3RSTlMAJCQkJDw8P0JCRUVubpaWlpmZwMDAw8nJzMzV29vb7e3t7fDw+Pn5+fn8jndhZAAAAQhJREFUeF6tz2VXwgAYBtBnhBKKkgoGKPY2urvT7u7ujn/vtsM5fN/e+w8uJEaLa+HvR7Zfl8WILo293Qq8vykQaLXtGnRoPcH6i1L1oEcLidpde6BQc6shslXvaVSHIdD7S9c0Sv5+ACbfFRXftBoYuzijUry1AXPHJ1QK5349pvYOqeSPfCaM8Dkq/EFxHAMst0mDY3cL89Clkis0kqmd/CxgvUt8Ukg8rub4UYCZicTiT0rFY5HnNY4dBNC32GiGwtFt+aLhULOx9CWMdRAMbVXK6cyNfJl0ubL8IYytEDHe0/XX7IZ82e/9S3HsZSDpmSQZT/SiQ+UgGDtU6DKYnYrGTrMBon97+TS1J80efgAAAABJRU5ErkJggg=="

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var context = __webpack_require__(1);
	var events = __webpack_require__(10);
	var utils = __webpack_require__(6);
	var select = __webpack_require__(14);
	var bubbleset = __webpack_require__(3);
	var Modernizr = __webpack_require__(20);

	var _require = __webpack_require__(12),
	    CLS = _require.CLS,
	    EV = _require.EV;

	var _require2 = __webpack_require__(17),
	    getDragImage = _require2.getDragImage,
	    onDropSuccess = _require2.onDropSuccess,
	    DRAG_IMG = _require2.DRAG_IMG;

	var currentDragSet = null;
	var currentMoveSet = null;
	var currentDragElement = null;

	exports.init = function (nodeSet) {
	    events.on(nodeSet, 'mousedown', onMousedown);
	};

	exports.destroy = function (nodeSet) {
	    events.off(nodeSet, 'mousedown', onMousedown);
	};

	function onMousedown(event) {
	    var nodeBubble = bubbleset.closestNodeBubble(event.target);
	    if (!nodeBubble) {
	        return;
	    }

	    var nodeSet = bubbleset.closestNodeSet(event.target);
	    if (!nodeSet) {
	        return;
	    }

	    event.preventDefault();
	    nodeSet.focus();

	    var drag = nodeSet.__drag__ = {
	        nodeBubble: nodeBubble,
	        nodeOffsetX: event.offsetX,
	        nodeOffsetY: event.offsetY,
	        onMousemove: utils.throttle(onMousemove.bind(this, nodeSet)),
	        onMouseup: onMouseup.bind(this, nodeSet),
	        onScroll: utils.throttle(onScroll.bind(this, nodeSet)),
	        x: 0,
	        y: 0
	    };

	    currentDragSet = null;
	    currentMoveSet = null;
	    currentDragElement = null;

	    events.one(document, 'mouseup', drag.onMouseup);
	    events.on(document, 'mousemove', drag.onMousemove);
	    events.on(document, 'scroll', drag.onScroll);
	}

	function onMouseup(dragSet, event) {
	    var drag = dragSet.__drag__;
	    if (!drag) {
	        return;
	    }

	    events.off(document, 'mousemove', drag.onMousemove);
	    events.off(document, 'scroll', drag.onScroll);
	    delete dragSet.__drag__;

	    if (currentDragElement) {
	        currentDragElement.parentNode && currentDragElement.parentNode.removeChild(currentDragElement);
	        currentDragElement = null;
	    }

	    if (currentMoveSet) {
	        var _ = currentMoveSet;
	        currentMoveSet = null;

	        _.classList.remove(CLS.DROPZONE);
	        events.dispatch(_, EV.DRAGLEAVE, { bubbles: false, cancelable: false });
	    }

	    if (currentDragSet) {
	        var nodeSet = bubbleset.closestNodeSet(event.target);

	        if (nodeSet && nodeSet !== currentDragSet) {
	            var list = select.get(currentDragSet);
	            var checkBubbleDrop = nodeSet.options('checkBubbleDrop');

	            if (list.length && checkBubbleDrop(list)) {
	                bubbleset.moveBubbles(currentDragSet, nodeSet, list);
	                context.setTimeout(onDropSuccess, 0, currentDragSet, nodeSet);
	            }
	        }

	        var _2 = currentDragSet;
	        currentDragSet = null;

	        _2.classList.remove(CLS.DRAGSTART);
	        events.dispatch(_2, EV.DROP, { bubbles: false, cancelable: false });
	        events.dispatch(_2, EV.DRAGEND, { bubbles: false, cancelable: false });
	    }
	}

	function onMousemove(dragSet) {
	    var drag = dragSet.__drag__;
	    if (!drag) {
	        return;
	    }

	    if (!currentDragSet) {
	        var selection = context.getSelection();
	        selection && selection.removeAllRanges();

	        currentDragSet = dragSet;
	        currentDragSet.classList.add(CLS.DRAGSTART);
	        select.add(drag.nodeBubble);

	        var moveElement = void 0;

	        var list = select.get(currentDragSet);

	        if (list.length === 1) {
	            moveElement = drag.nodeBubble.cloneNode(true);
	        }

	        if (!moveElement) {
	            moveElement = getDragImage();
	            drag.nodeOffsetX = DRAG_IMG.w;
	            drag.nodeOffsetY = DRAG_IMG.h;
	        }

	        currentDragElement = document.body.appendChild(document.createElement('div'));
	        currentDragElement.style.cssText = 'position:absolute;z-index:9999;pointer-events:none;top:0;left:0;';
	        currentDragElement.appendChild(moveElement);

	        events.dispatch(currentDragSet, EV.DRAGSTART, { bubbles: false, cancelable: false });
	    }

	    drag.x = event.clientX;
	    drag.y = event.clientY;
	    onScroll(dragSet);

	    var nodeSet = bubbleset.closestNodeSet(event.target);
	    if (nodeSet && nodeSet !== currentDragSet) {
	        if (currentMoveSet && currentMoveSet !== nodeSet) {
	            currentMoveSet.classList.remove(CLS.DROPZONE);
	            nodeSet.classList.add(CLS.DROPZONE);
	            currentMoveSet = nodeSet;
	            events.dispatch(currentMoveSet, EV.DRAGENTER, { bubbles: false, cancelable: false });
	        } else if (!currentMoveSet) {
	            nodeSet.classList.add(CLS.DROPZONE);
	            currentMoveSet = nodeSet;
	            events.dispatch(currentMoveSet, EV.DRAGENTER, { bubbles: false, cancelable: false });
	        }
	    } else if (currentMoveSet) {
	        var _ = currentMoveSet;
	        currentMoveSet = null;

	        _.classList.remove(CLS.DROPZONE);
	        events.dispatch(_, EV.DRAGLEAVE, { bubbles: false, cancelable: false });
	    }
	}

	function onScroll(dragSet) {
	    var drag = dragSet.__drag__;
	    if (!drag || !currentDragElement) {
	        return;
	    }

	    var x = drag.x - drag.nodeOffsetX + events.scrollX();
	    var y = drag.y - drag.nodeOffsetY + events.scrollY();

	    if (Modernizr.csstransforms3d) {
	        currentDragElement.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
	    } else if (Modernizr.csstransforms) {
	        currentDragElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
	    } else {
	        currentDragElement.style.top = y + 'px';
	        currentDragElement.style.left = x + 'px';
	    }
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = Modernizr;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);

	var _require = __webpack_require__(12),
	    PROPS = _require.PROPS;

	/**
	 * @param {Event} event
	 * @returns {?boolean}
	 */


	module.exports = function (event) {
	    if (event.currentTarget[PROPS.LOCK_COPY]) {
	        return events.prevent(event);
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);
	var bubbleset = __webpack_require__(3);

	var _require = __webpack_require__(12),
	    PROPS = _require.PROPS;

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 * @param {HTMLElement} [sharedData.nodeBubble]
	 * @param {boolean} [sharedData.isDblclick]
	 * @returns {?boolean}
	 */


	module.exports = function (event, sharedData) {
	    var nodeEditor = bubbleset.closestNodeSet(event.target);
	    if (!nodeEditor) {
	        return events.prevent(event);
	    }

	    sharedData.nodeEditor = nodeEditor;
	    sharedData.nodeBubble = bubbleset.closestNodeBubble(event.target);
	    sharedData.isDblclick = false;

	    if (sharedData.nodeBubble) {
	        var clickTime = Date.now();
	        sharedData.isDblclick = nodeEditor[PROPS.CLICK_TIME] && clickTime - nodeEditor[PROPS.CLICK_TIME] < 200;

	        nodeEditor[PROPS.CLICK_TIME] = clickTime;
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var raf = __webpack_require__(7);
	var context = __webpack_require__(1);
	var events = __webpack_require__(10);

	var _require = __webpack_require__(12),
	    PROPS = _require.PROPS;

	/**
	 * @param {Event} event
	 * @returns {?boolean}
	 */


	module.exports = function (event) {
	    var nodeEditor = event.currentTarget;
	    if (nodeEditor[PROPS.LOCK_COPY]) {
	        events.prevent(event);
	        delete nodeEditor[PROPS.LOCK_COPY];

	        // Safary 10 не сбрасывает курсор без задержки
	        raf(function () {
	            var selection = context.getSelection();
	            selection && selection.removeAllRanges();
	        });

	        return false;
	    }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(6);
	var events = __webpack_require__(10);

	var _require = __webpack_require__(12),
	    KEY = _require.KEY;

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */


	module.exports = function (event, sharedData) {
	    var code = events.keyCode(event);
	    sharedData.nodeEditor = event.currentTarget;

	    switch (code) {
	        case KEY.Left:
	        case KEY.Right:
	        case KEY.Delete:
	        case KEY.Backspace:
	            event.preventDefault();
	            sharedData.selection = utils.getSelection(event.currentTarget);
	            break;
	    }
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bubble = __webpack_require__(4);

	/**
	 * @param {Event} event
	 */
	module.exports = function (event) {
	  bubble.bubbling(event.currentTarget);
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);
	var bubble = __webpack_require__(4);
	var cursor = __webpack_require__(13);
	var utils = __webpack_require__(6);

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {HTMLElement} sharedData.nodeEditor
	 * @param {HTMLElement} [sharedData.nodeBubble]
	 * @param {boolean} sharedData.isDblclick
	 */
	module.exports = function (event, sharedData) {
	    var nodeEditor = sharedData.nodeEditor;
	    var nodeBubble = sharedData.nodeBubble;
	    var isDblclick = sharedData.isDblclick;

	    if (nodeBubble) {
	        if (isDblclick) {
	            if (!event.shiftKey && !events.metaKey(event)) {
	                bubble.edit(nodeEditor, nodeBubble);
	            }
	        } else if (!nodeEditor.options('selection')) {
	            bubble.bubbling(nodeEditor);
	            cursor.restore(nodeEditor);
	        }
	    } else {
	        var selection = utils.getSelection(nodeEditor);

	        if (!selection || selection.anchorNode.nodeType !== Node.TEXT_NODE) {
	            cursor.restore(nodeEditor);
	        }
	    }
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var cursor = __webpack_require__(13);

	/**
	 * @param {Event} event
	 */
	module.exports = function (event) {
	  cursor.restore(event.currentTarget);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);
	var bubble = __webpack_require__(4);
	var cursor = __webpack_require__(13);
	var text = __webpack_require__(5);
	var bubbleset = __webpack_require__(3);

	var _require = __webpack_require__(12),
	    KEY = _require.KEY;

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isTextSelectAll]
	 * @param {boolean} [sharedData.isEmptyLeft]
	 * @param {boolean} [sharedData.isEmptyRight]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */


	module.exports = function (event, sharedData) {
	    var code = events.keyCode(event);
	    var metaKey = events.metaKey(event);

	    switch (code) {
	        case KEY.Esc:
	            event.preventDefault();
	            bubble.bubbling(sharedData.nodeEditor);
	            cursor.restore(sharedData.nodeEditor);
	            break;

	        case KEY.Backspace:
	            onBackspace(event, sharedData);
	            break;

	        case KEY.Delete:
	            onDelete(event, sharedData);
	            break;

	        case KEY.Left:
	            onArrowLeft(event, sharedData);
	            break;

	        case KEY.Right:
	            onArrowRight(event, sharedData);
	            break;

	        case KEY.a:
	            if (metaKey) {
	                event.preventDefault();
	                sharedData.isTextSelectAll = text.selectAll(null, sharedData.nodeEditor);
	            }
	            break;
	    }
	};

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyLeft]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onBackspace(event, sharedData) {
	    var selection = sharedData.selection;
	    if (!selection) {
	        return;
	    }

	    var nodeEditor = sharedData.nodeEditor;

	    if (!selection.isCollapsed || text.arrowLeft(selection, true)) {
	        text.remove(selection);
	        nodeEditor.fireInput();
	    } else if (!nodeEditor.options('selection')) {
	        var nodeBubble = bubbleset.findBubbleLeft(selection);

	        if (nodeBubble) {
	            bubbleset.removeBubbles(nodeEditor, [nodeBubble]);
	            nodeEditor.fireChange();
	        }
	    } else {
	        sharedData.isEmptyLeft = true;
	    }
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyRight]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onDelete(event, sharedData) {
	    var selection = sharedData.selection;
	    if (!selection) {
	        return;
	    }

	    var nodeEditor = sharedData.nodeEditor;

	    if (!selection.isCollapsed || text.arrowRight(selection, true)) {
	        text.remove(selection);
	        nodeEditor.fireInput();
	    } else if (!nodeEditor.options('selection')) {
	        var nodeBubble = bubbleset.findBubbleRight(selection);

	        if (nodeBubble) {
	            bubbleset.removeBubbles(nodeEditor, [nodeBubble]);
	            nodeEditor.fireChange();
	        }
	    } else {
	        sharedData.isEmptyRight = true;
	    }
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyLeft]
	 * @param {Selection} [sharedData.selection]
	 */
	function onArrowLeft(event, sharedData) {
	    sharedData.isEmptyLeft = !text.arrowLeft(sharedData.selection, event.shiftKey);
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyRight]
	 * @param {Selection} [sharedData.selection]
	 */
	function onArrowRight(event, sharedData) {
	    sharedData.isEmptyRight = !text.arrowRight(sharedData.selection, event.shiftKey);
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);
	var bubble = __webpack_require__(4);
	var cursor = __webpack_require__(13);

	var _require = __webpack_require__(12),
	    KEY = _require.KEY;

	/**
	 * @param {Event} event
	 */


	module.exports = function (event) {
	    var code = events.keyCode(event);
	    var nodeEditor = event.currentTarget;

	    if (code === KEY.Enter) {
	        event.preventDefault();
	        if (!nodeEditor.options('disableControls')) {
	            bubble.bubbling(nodeEditor);
	            cursor.restore(nodeEditor);
	        }
	    } else {
	        var separator = nodeEditor.options('separator');
	        if (separator && separator.test(String.fromCharCode(code))) {
	            var separatorCond = nodeEditor.options('separatorCond');

	            if (!separatorCond || separatorCond(nodeEditor.inputValue)) {
	                event.preventDefault();
	                bubble.bubbling(nodeEditor);
	                cursor.restore(nodeEditor);
	            }
	        }
	    }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);

	var _require = __webpack_require__(12),
	    KEY = _require.KEY;

	/**
	 * @param {Event} event
	 */


	module.exports = function (event) {
	    var nodeEditor = event.currentTarget;
	    var code = events.keyCode(event);
	    var isPrintableChar = event.key ? event.key.length === 1 : (code > 47 || code === KEY.Space || code === KEY.Backspace) && code !== KEY.Cmd;

	    if (isPrintableChar) {
	        nodeEditor.fireInput();
	    }
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var raf = __webpack_require__(7);
	var context = __webpack_require__(1);
	var bubble = __webpack_require__(4);
	var cursor = __webpack_require__(13);
	var text = __webpack_require__(5);

	var _require = __webpack_require__(6),
	    isIE = _require.isIE;

	module.exports = function (event) {
	    event.preventDefault();
	    var nodeEditor = event.currentTarget;

	    if (context.clipboardData && context.clipboardData.getData) {
	        onPasteSuccess(nodeEditor, context.clipboardData.getData('Text'));
	    } else if (event.clipboardData) {
	        var contentType = 'text/plain';
	        var clipboardData = event.clipboardData;
	        var data = clipboardData.getData && clipboardData.getData(contentType);

	        if (!onPasteSuccess(nodeEditor, data) && clipboardData.items) {
	            Array.prototype.slice.call(clipboardData.items).filter(function (item) {
	                return item.kind === 'string' && item.type === contentType;
	            }).some(function (item) {
	                item.getAsString(function (dataText) {
	                    onPasteSuccess(nodeEditor, dataText);
	                });

	                return true;
	            });
	        }
	    }
	};

	function onPasteSuccess(nodeEditor, dataText) {
	    var checkBubblePaste = nodeEditor.options('checkBubblePaste');
	    var selection = context.getSelection();
	    var isBubbling = dataText && selection.isCollapsed && !nodeEditor.inputValue ? checkBubblePaste(dataText) : false;

	    if (text.replaceString(dataText, selection)) {
	        if (isBubbling) {
	            if (isIE) {
	                raf(function () {
	                    return onReplaceSuccess(nodeEditor);
	                });
	            } else {
	                onReplaceSuccess(nodeEditor);
	            }
	        } else {
	            nodeEditor.fireInput();
	        }

	        return true;
	    }

	    return false;
	}

	function onReplaceSuccess(nodeEditor) {
	    bubble.bubbling(nodeEditor);
	    nodeEditor.focus();
	    raf(function () {
	        return cursor.restore(nodeEditor);
	    });
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var select = __webpack_require__(14);

	/**
	 * @param {Event} event
	 */
	module.exports = function (event) {
	  select.clear(event.currentTarget);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);
	var select = __webpack_require__(14);

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {HTMLElement} sharedData.nodeEditor
	 * @param {HTMLElement} [sharedData.nodeBubble]
	 * @param {boolean} sharedData.isDblclick
	 */
	module.exports = function (event, sharedData) {
	    var nodeEditor = sharedData.nodeEditor;
	    var nodeBubble = sharedData.nodeBubble;
	    var isDblclick = sharedData.isDblclick;

	    if (nodeBubble) {
	        if (events.metaKey(event)) {
	            select.add(nodeBubble);
	        } else if (event.shiftKey) {
	            if (!nodeEditor.startRangeSelect) {
	                select.uniq(nodeBubble);
	            } else {
	                select.range(nodeBubble);
	            }
	        } else if (!isDblclick) {
	            select.toggleUniq(nodeBubble);
	        }
	    } else {
	        select.clear(nodeEditor);
	    }
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var raf = __webpack_require__(7);
	var events = __webpack_require__(10);
	var utils = __webpack_require__(6);
	var bubble = __webpack_require__(4);
	var select = __webpack_require__(14);
	var bubbleset = __webpack_require__(3);
	var cursor = __webpack_require__(13);

	var _require = __webpack_require__(12),
	    KEY = _require.KEY,
	    PROPS = _require.PROPS;

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isTextSelectAll]
	 * @param {boolean} [sharedData.isEmptyLeft]
	 * @param {boolean} [sharedData.isEmptyRight]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */


	module.exports = function (event, sharedData) {
	    var code = events.keyCode(event);
	    var metaKey = events.metaKey(event);

	    switch (code) {
	        case KEY.Backspace:
	            onBackspace(event, sharedData);
	            break;

	        case KEY.Delete:
	            onDelete(event, sharedData);
	            break;

	        case KEY.Left:
	            onArrowLeft(event, sharedData);
	            break;

	        case KEY.Right:
	            onArrowRight(event, sharedData);
	            break;

	        // курсор в начало списка
	        case KEY.Top:
	            event.preventDefault();
	            onTop(event, sharedData);
	            break;

	        // курсор в конец списка
	        case KEY.Bottom:
	            event.preventDefault();
	            onBottom(event, sharedData);
	            break;

	        case KEY.a:
	            if (metaKey && !sharedData.isTextSelectAll) {
	                event.preventDefault();
	                select.all(sharedData.nodeEditor);
	            }
	            break;

	        case KEY.c:
	            metaKey && copyBubbles(sharedData.nodeEditor);
	            break;

	        case KEY.x:
	            metaKey && copyBubbles(sharedData.nodeEditor, function () {
	                return onDelete(event, sharedData);
	            });
	            break;
	    }
	};

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onTop(event, sharedData) {
	    var nodeEditor = sharedData.nodeEditor;
	    if (nodeEditor.options('disableControls')) {
	        return;
	    }

	    var nodeBubble = bubbleset.headBubble(nodeEditor);
	    nodeBubble && select.uniq(nodeBubble);
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onBottom(event, sharedData) {
	    var nodeEditor = sharedData.nodeEditor;
	    if (nodeEditor.options('disableControls')) {
	        return;
	    }

	    if (select.has(nodeEditor)) {
	        cursor.restore(nodeEditor);
	    }
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyLeft]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onBackspace(event, sharedData) {
	    var nodeEditor = sharedData.nodeEditor;
	    var selection = sharedData.selection;

	    if (selection) {
	        if (sharedData.isEmptyLeft) {
	            var nodeBubble = bubbleset.findBubbleLeft(selection);
	            nodeBubble && select.uniq(nodeBubble);
	        }
	    } else if (!removeBubbles(nodeEditor)) {
	        nodeEditor.focus();
	        // без задержки не восстанавливает курсор
	        raf(function () {
	            return cursor.restore(nodeEditor);
	        });
	    }
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyRight]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onDelete(event, sharedData) {
	    var nodeEditor = sharedData.nodeEditor;
	    var selection = sharedData.selection;

	    if (selection) {
	        if (sharedData.isEmptyRight) {
	            var nodeBubble = bubbleset.findBubbleRight(selection);
	            nodeBubble && select.uniq(nodeBubble);
	        }
	    } else if (!removeBubbles(nodeEditor, true)) {
	        nodeEditor.focus();
	        // без задержки не восстанавливает курсор
	        raf(function () {
	            return cursor.restore(nodeEditor);
	        });
	    }
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyLeft]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onArrowLeft(event, sharedData) {
	    var selection = sharedData.selection;

	    if (selection) {
	        if (sharedData.isEmptyLeft) {
	            var nodeBubble = bubbleset.findBubbleLeft(selection);
	            nodeBubble && select.uniq(nodeBubble);
	        }
	    } else {
	        var nodeEditor = sharedData.nodeEditor;
	        var list = select.get(nodeEditor);
	        var begin = list.length > 1 && list[0] === nodeEditor.startRangeSelect ? list[list.length - 1] : list[0];

	        var node = bubbleset.prevBubble(begin);

	        if (node) {
	            if (event.shiftKey) {
	                select.range(node);
	            } else {
	                select.uniq(node);
	            }
	        }
	    }
	}

	/**
	 * @param {Event} event
	 * @param {Object} sharedData
	 * @param {boolean} [sharedData.isEmptyRight]
	 * @param {Selection} [sharedData.selection]
	 * @param {HTMLElement} [sharedData.nodeEditor]
	 */
	function onArrowRight(event, sharedData) {
	    var selection = sharedData.selection;

	    if (selection) {
	        if (sharedData.isEmptyRight) {
	            var nodeBubble = bubbleset.findBubbleRight(selection);
	            nodeBubble && select.uniq(nodeBubble);
	        }
	    } else {
	        var nodeEditor = sharedData.nodeEditor;
	        var list = select.get(nodeEditor);
	        var begin = list.length > 1 && list[list.length - 1] === nodeEditor.startRangeSelect ? list[0] : list[list.length - 1];

	        var node = bubbleset.nextBubble(begin);

	        if (node) {
	            if (event.shiftKey) {
	                select.range(node);
	            } else {
	                select.uniq(node);
	            }

	            // } else if (begin && begin.nextSibling && begin.nextSibling.nodeType === Node.TEXT_NODE) {
	            //     select.clear(nodeEditor);
	            //     selection.collapse(begin.nextSibling, 0);
	        } else {
	            cursor.restore(nodeEditor);
	        }
	    }
	}

	function removeBubbles(nodeEditor) {
	    var removeFromRight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	    var list = select.get(nodeEditor);
	    if (!list.length) {
	        return false;
	    }

	    var firstBubble = list[0].previousSibling;
	    var secondBubble = list[list.length - 1].nextSibling;

	    if (removeFromRight) {
	        var _ = firstBubble;
	        firstBubble = secondBubble;
	        secondBubble = _;
	    }

	    bubbleset.removeBubbles(nodeEditor, list);

	    if (bubble.isBubbleNode(firstBubble)) {
	        select.uniq(firstBubble);
	    } else if (bubble.isBubbleNode(secondBubble)) {
	        select.uniq(secondBubble);
	    } else {
	        nodeEditor.focus();
	        // без задержки не восстанавливает курсор
	        raf(function () {
	            return cursor.restore(nodeEditor);
	        });
	    }

	    nodeEditor.fireChange();
	    return true;
	}

	function copyBubbles(nodeEditor) {
	    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

	    var selection = utils.getSelection(nodeEditor);
	    if (selection) {
	        return false;
	    }

	    var list = select.get(nodeEditor);
	    if (!list.length) {
	        return false;
	    }

	    var bubbleCopy = nodeEditor.options('bubbleCopy');
	    var value = bubbleCopy(list);

	    if (!value) {
	        return false;
	    }

	    nodeEditor[PROPS.LOCK_COPY] = true;

	    var target = nodeEditor.ownerDocument.createElement('input');
	    target.value = value;
	    target.style.cssText = '\n        position: absolute;\n        left: -9999px;\n        width: 1px;\n        height: 1px;\n        margin: 0;\n        padding: 0;\n        border: none;';

	    nodeEditor.parentNode.appendChild(target);

	    events.one(target, {
	        keyup: function keyup() {
	            return nodeEditor.focus();
	        },
	        blur: function blur() {
	            target && target.parentNode && target.parentNode.removeChild(target);
	            raf(callback);
	        }
	    });

	    target.select();
	    return true;
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var events = __webpack_require__(10);
	var utils = __webpack_require__(6);
	var bubble = __webpack_require__(4);
	var select = __webpack_require__(14);

	var _require = __webpack_require__(12),
	    KEY = _require.KEY;

	/**
	 * @param {Event} event
	 */


	module.exports = function (event) {
	    var code = events.keyCode(event);
	    var nodeEditor = event.currentTarget;

	    if (code === KEY.Enter) {
	        event.preventDefault();
	        if (!nodeEditor.options('disableControls')) {
	            editBubbleKeyboardEvent(nodeEditor);
	        }
	    } else if (code === KEY.Space) {
	        if (editBubbleKeyboardEvent(nodeEditor)) {
	            event.preventDefault();
	        }
	    }
	};

	function editBubbleKeyboardEvent(nodeEditor) {
	    var selection = utils.getSelection(nodeEditor);

	    if (!selection || !selection.rangeCount) {
	        var list = select.get(nodeEditor);

	        if (list.length === 1) {
	            return bubble.edit(nodeEditor, list[0]);
	        }
	    }

	    return false;
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var context = __webpack_require__(1);

	var _require = __webpack_require__(12),
	    PROPS = _require.PROPS;

	var REG_STRREG = /\/(.+)\/([gimy]{0,3})/i;

	var OPTIONS = {
	    begining: ['reg', null, 'begining'],
	    bubbleCopy: ['func', function (list) {
	        return list.map(function (item) {
	            return item.innerHTML;
	        }).join(', ');
	    }, 'bubble-copy'],
	    bubbleDeformation: ['func', function () {}, 'bubble-deformation'],
	    bubbleFormation: ['func', function () {}, 'bubble-formation'],
	    checkBubblePaste: ['func', function () {
	        return true;
	    }, 'check-bubble-paste'],
	    classBubble: ['str', 'bubble', 'class-bubble'],
	    disableControls: ['bool', false, 'disable-controls'],
	    draggable: ['bool', true, 'draggable'],
	    checkBubbleDrop: ['func', function () {
	        return true;
	    }, 'check-bubble-drop'],
	    ending: ['reg', null, 'ending'], // /\@ya\.ru/g
	    selection: ['bool', true, 'selection'],
	    separator: ['reg', /[,;]/, 'separator'],
	    separatorCond: ['func', null, 'separator-cond'],
	    tokenizer: ['func', null, 'tokenizer']
	};

	var OPTIONS_PREPARE = {
	    func: function func(value) {
	        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        switch (type) {
	            case 'string':
	                return new Function('context', 'return context.' + value + ';')(context);

	            case 'function':
	                return value;
	        }
	    },
	    bool: function bool(value) {
	        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        switch (type) {
	            case 'string':
	                return value === 'true' || value === 'on';

	            case 'boolean':
	                return value;
	        }
	    },
	    noop: function noop(value) {
	        return value;
	    },
	    reg: function reg(value) {
	        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        switch (type) {
	            case 'string':
	                if (value) {
	                    var match = value.match(REG_STRREG);
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
	    str: function str(value) {
	        if (typeof value !== 'undefined') {
	            return value ? String(value) : '';
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
	module.exports = function (node) {
	    var value = arguments.length <= 1 ? undefined : arguments[1];

	    if (value) {
	        if (!node[PROPS.OPTIONS]) {
	            reinitOptions(node);
	        }

	        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
	            var optionsObj = value;

	            Object.keys(optionsObj).forEach(function (optionName) {
	                node[PROPS.OPTIONS][optionName] = optionsObj[optionName];
	            });

	            prepareOptions(node[PROPS.OPTIONS]);

	            return;
	        }

	        var optionName = value;
	        var optionValue = arguments.length <= 2 ? undefined : arguments[2];

	        if (typeof optionValue !== 'undefined') {
	            node[PROPS.OPTIONS][optionName] = optionValue;
	            prepareOptions(node[PROPS.OPTIONS]);
	        } else {
	            return node[PROPS.OPTIONS][optionName];
	        }
	    } else {
	        reinitOptions(node);
	    }
	};

	function reinitOptions(node) {
	    var options = node[PROPS.OPTIONS] = node[PROPS.OPTIONS] || {};

	    for (var optionName in OPTIONS) {
	        var attrName = 'data-' + OPTIONS[optionName][2];
	        if (node.hasAttribute(attrName)) {
	            options[optionName] = node.getAttribute(attrName);
	        }
	    }

	    prepareOptions(options);
	}

	function prepareOptions(options) {
	    for (var name in OPTIONS) {
	        var _OPTIONS$name = _slicedToArray(OPTIONS[name], 2),
	            type = _OPTIONS$name[0],
	            def = _OPTIONS$name[1];

	        options[name] = OPTIONS_PREPARE[type](options[name]);
	        if (typeof options[name] === 'undefined') {
	            options[name] = def;
	        }
	    }
	}

/***/ }
/******/ ]);