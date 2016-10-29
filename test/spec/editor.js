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
        it('после вставки в DOM должен создать баблы по содержимому', function () {
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
    });
});
