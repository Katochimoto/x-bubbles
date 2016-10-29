const Promise = require('es6-promise').Promise;
const context = require('../../src/context');

describe('editor ->', function () {
    beforeEach(function () {
        this.selection = window.getSelection();
        this.selection.removeAllRanges();
        this.buffer = document.createElement('div', 'x-bubbles');
    });

    afterEach(function () {
        this.buffer && this.buffer.parentNode && this.buffer.parentNode.removeChild(this.buffer);
    });

    describe('click ->', function () {
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

                    const event = new Event('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });

                    this.buffer.dispatchEvent(event);
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
                        const event = new Event('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });

                        bubble.dispatchEvent(event);
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

                            bubble.dispatchEvent(new Event('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true
                            }));
                        });

                        bubble.dispatchEvent(new Event('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        }));
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
