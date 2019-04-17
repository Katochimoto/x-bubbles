const Promise = require('es6-promise').Promise;
const context = require('../../src/context');
const { EV } = require('../../src/core/constant');

describe('editor ->', function () {
    beforeEach(function () {
        this.selection = window.getSelection();
        this.selection.removeAllRanges();
        this.buffer = document.createElement('div', { is: 'x-bubbles' });
    });

    afterEach(function () {
        this.buffer && this.buffer.parentNode && this.buffer.parentNode.removeChild(this.buffer);
    });

    describe('keyup ->', function () {
        beforeEach(function () {
            this.keyup = (node, character) => {
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }

                const code = character.charCodeAt(0);
                const event = new Event('keyup', {
                    view: node.ownerDocument.defaultView,
                    bubbles: true,
                    cancelable: true
                });

                event.keyCode = code;
                event.charCode = code;
                event.key = character;

                const characterNode = node.appendChild(node.ownerDocument.createTextNode(character));

                const range = node.ownerDocument.createRange();
                range.setEndAfter(characterNode);
                range.collapse();

                this.selection.addRange(range);

                node.dispatchEvent(event);
            };
        });

        it('должен создать событие ввода текста если указываем печатный символ', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.BUBBLE_INPUT, function _callback(event) {
                        event.currentTarget.removeEventListener(EV.BUBBLE_INPUT, _callback);
                        expect(event.detail.data).to.be.eql('a');
                        resolve();
                    });

                    this.keyup(this.buffer, 'a');
                });
            });
        });
    });

    describe('click ->', function () {
        beforeEach(function () {
            this.click = function (node) {
                node.dispatchEvent(new Event('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
            };
        });

        it('должен установить курсор в созданный пустой текстовый узел', function () {
            document.body.appendChild(this.buffer);
            const that = this;
            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener('click', function _onClick(event) {
                        event.currentTarget.removeEventListener('click', _onClick);
                        expect(that.selection.anchorNode.nodeType).to.be.eql(3);
                        resolve();
                    });

                    expect(this.selection.anchorNode).to.be.eql(null);

                    this.click(this.buffer);
                });
            });
        });

        describe('клик по баблу', function () {
            it('должен добавить бабл в список выбранных', function () {
                this.buffer.appendChild(document.createTextNode('test'));
                document.body.appendChild(this.buffer);

                return this.webcomponentsready().then(() => {
                    return new Promise(resolve => {
                        this.buffer.addEventListener('click', function _onClick(event) {
                            event.currentTarget.removeEventListener('click', _onClick);
                            expect(bubble.hasAttribute('selected')).to.be.eql(true);
                            resolve();
                        });

                        const bubble = this.buffer.items[0];
                        this.click(bubble);
                    });
                });
            });

            it('повторный клик должен снять выделение', function () {
                this.buffer.appendChild(document.createTextNode('test'));
                document.body.appendChild(this.buffer);

                const that = this;
                return this.webcomponentsready().then(() => {
                    return new Promise(resolve => {
                        const bubble = this.buffer.items[0];

                        this.buffer.addEventListener('click', function _onClick1(event) {
                            event.currentTarget.removeEventListener('click', _onClick1);
                            expect(bubble.hasAttribute('selected')).to.be.eql(true);

                            that.buffer.addEventListener('click', function _onClick2(event) {
                                event.currentTarget.removeEventListener('click', _onClick2);
                                expect(bubble.hasAttribute('selected')).to.be.eql(false);
                                resolve();
                            });

                            setTimeout(() => {
                                that.click(bubble);
                            }, 300);
                        });

                        this.click(bubble);
                    });
                });
            });
        });
    });

    describe('focus ->', function () {
        it('должен установить курсор в созданный пустой текстовый узел', function () {
            document.body.appendChild(this.buffer);
            const that = this;
            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener('focus', function _onFocus(event) {
                        event.currentTarget.removeEventListener('focus', _onFocus);
                        expect(that.selection.anchorNode.nodeType).to.be.eql(3);
                        resolve();
                    });

                    expect(this.selection.anchorNode).to.be.eql(null);
                    this.buffer.focus();
                });
            });
        });
    });

    describe('blur ->', function () {
        it('должен создать бабл при потеле фокуса', function () {
            document.body.appendChild(this.buffer);

            const set = this.buffer;
            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    set.addEventListener('focus', function _onFocus(event) {
                        set.removeEventListener('focus', _onFocus);
                        set.appendChild(document.createTextNode('test'));

                        set.addEventListener('blur', function _onBlur(event) {
                            set.removeEventListener('blur', _onBlur);
                            expect(set.items.length).to.be.eql(1);
                            resolve();
                        });

                        set.dispatchEvent(new Event('blur', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        }));
                    });

                    expect(set.items.length).to.be.eql(0);
                    set.focus();
                });
            });
        });
    });
});
