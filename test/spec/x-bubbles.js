const testable = require('../../src/index');
const Promise = require('es6-promise').Promise;

describe('x-bubbles ->', function () {
    beforeEach(function () {
        this.selection = window.getSelection();
        this.selection.removeAllRanges();
    });

    afterEach(function () {
        this.buffer && this.buffer.parentNode.removeChild(this.buffer);
        delete this.buffer;
        delete this.selection;
    });

    describe('создание элемента ->', function () {
        it('после вставки в DOM должен создать баблы по содержимому', function () {
            this.buffer = document.createElement('div', {
                is: 'x-bubbles'
            });

            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            const that = this;
            return new Promise(function(resolve) {
                setTimeout(() => {
                    expect(that.buffer.items.length).to.be.eql(2);
                    resolve();
                }, 0);
            });
        });

        it('должен добавить свойство contenteditable=true', function () {
            this.buffer = document.body.appendChild(document.createElement('div', {
                is: 'x-bubbles'
            }));

            const that = this;
            return new Promise(function(resolve) {
                setTimeout(() => {
                    expect(that.buffer.getAttribute('contenteditable')).to.be.eql('true');
                    resolve();
                }, 0);
            });
        });
    });

    describe('события ->', function () {
        describe('change ->', function () {

        });
    });
});
