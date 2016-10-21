const testable = require('../../src/index');
const { EV } = require('../../src/core/constant');
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

            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(this.buffer.items.length).to.be.eql(2);
                    resolve();
                }, 0);
            });
        });

        it('должен добавить свойство contenteditable=true', function () {
            this.buffer = document.body.appendChild(document.createElement('div', {
                is: 'x-bubbles'
            }));

            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(this.buffer.getAttribute('contenteditable')).to.be.eql('true');
                    resolve();
                }, 0);
            });
        });
    });

    describe('#removeBubble', function () {
        it('должен создать событие CHANGE и не создавать BUBBLE_INPUT', function () {
            const spyChange = this.sinon.spy();
            const spyInput = this.sinon.spy();

            this.buffer = document.createElement('div', { is: 'x-bubbles' });
            this.buffer.addEventListener(EV.CHANGE, spyChange);

            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(this.buffer.removeBubble(this.buffer.items[0])).to.be.eql(true);

                    setTimeout(() => {
                        expect(spyChange.callCount).to.be.equal(1);
                        expect(spyInput.callCount).to.be.equal(0);
                        resolve();
                    }, 0);
                }, 0);
            });
        });
    });

    describe('#addBubble', function () {
        it('должен создать событие CHANGE и BUBBLE_INPUT', function () {
            const spyChange = this.sinon.spy();
            const spyInput = this.sinon.spy();

            this.buffer = document.createElement('div', { is: 'x-bubbles' });
            this.buffer.addEventListener(EV.CHANGE, spyChange);
            this.buffer.addEventListener(EV.BUBBLE_INPUT, spyInput);
            document.body.appendChild(this.buffer);

            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(this.buffer.addBubble('bubbke1')).to.be.eql(true);

                    setTimeout(() => {
                        expect(spyChange.callCount).to.be.equal(1);
                        expect(spyInput.callCount).to.be.equal(1);
                        resolve();
                    }, 0);
                }, 0);
            });
        });
    });
});
