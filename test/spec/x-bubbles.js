const context = require('../../src/context');
const { EV } = require('../../src/core/constant');
const Promise = require('es6-promise').Promise;

describe('x-bubbles ->', function () {
    beforeEach(function () {
        this.selection = window.getSelection();
        this.selection.removeAllRanges();
        this.buffer = document.createElement('div', { is: 'x-bubbles' });
    });

    afterEach(function () {
        this.buffer && this.buffer.parentNode && this.buffer.parentNode.removeChild(this.buffer);
    });

    describe('создание элемента ->', function () {
        it('после вставки в DOM должен создать баблы по содержимому', function () {
            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                expect(this.buffer.items.length).to.be.eql(2);
            });
        });

        it('должен добавить свойство contenteditable=true', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                expect(this.buffer.getAttribute('contenteditable')).to.be.eql('true');
            });
        });
    });

    describe('.setContent', function () {
        it('должен создать набор яблов по переданному тексту', function () {
            document.body.appendChild(this.buffer);

            this.buffer.setContent('bubble1,bubble2');

            return this.webcomponentsready().then(() => {
                expect(this.buffer.items.length).to.be.eql(2);
            });
        });

        it('должен удалить предыдущий набор баблов', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setContent('bubble1,bubble2');

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        expect(event.currentTarget.items.length).to.be.eql(1);
                        expect(event.currentTarget.items[0].innerText).to.be.eql('bubble3');
                        resolve();
                    });

                    expect(this.buffer.items.length).to.be.eql(2);
                    this.buffer.setContent('bubble3');
                });
            });
        });
    });

    describe('#removeBubble', function () {
        it('должен создать событие CHANGE и не создавать BUBBLE_INPUT', function () {
            const spyChange = this.sinon.spy();
            const spyInput = this.sinon.spy();

            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            this.buffer.addEventListener(EV.CHANGE, spyChange);
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    expect(spyChange.callCount).to.be.eql(1);
                    expect(this.buffer.removeBubble(this.buffer.items[0])).to.be.eql(true);

                    setTimeout(() => {
                        expect(spyChange.callCount).to.be.eql(2);
                        expect(spyInput.callCount).to.be.eql(0);
                        resolve();
                    }, 100);
                });
            });
        });

        it('не должен удалить, если передаем узел бабла, не содержащийся в сете', function () {
            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                expect(this.buffer.removeBubble(document.createElement('div'))).to.be.eql(false);
            });
        });
    });

    describe('#addBubble', function () {
        it('должен создать событие CHANGE и BUBBLE_INPUT', function () {
            const spyChange = this.sinon.spy();
            const spyInput = this.sinon.spy();

            this.buffer.addEventListener(EV.CHANGE, spyChange);
            this.buffer.addEventListener(EV.BUBBLE_INPUT, spyInput);
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        expect(spyChange.callCount).to.be.eql(1, 'вызов CHANGE');
                        expect(spyInput.callCount).to.be.eql(1, 'вызов BUBBLE_INPUT');
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1')).to.be.eql(true, 'true в случае успешного добавления');
                });
            });
        });

        it('должно подставить в содержимое бабла текст, переданный первым аргументом', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];
                        expect(nodeBubble.innerText).to.be.eql('bubble1');
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1')).to.be.eql(true);
                });
            });
        });

        it('должен добавить data атрибуты, переданные вторым аргументом', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];
                        expect(nodeBubble.getAttribute('data-test1')).to.be.eql('asd');
                        expect(nodeBubble.getAttribute('data-test2')).to.be.eql('qwe');
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1', {
                        test1: 'asd',
                        test2: 'qwe'
                    })).to.be.eql(true);
                });
            });
        });

        it('значения data атрибутов должны кодироваться', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];
                        expect(nodeBubble.getAttribute('data-test1')).to.be.eql('&gt;&amp;&quot;&#39;&#96;&lt;');
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1', { test1: '>&"\'`<' })).to.be.eql(true);
                });
            });
        });

        it('атрибут без значения не добавляется', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];
                        expect(nodeBubble.hasAttribute('data-test1')).not.to.be.ok;
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1', { test1: '' })).to.be.eql(true);
                });
            });
        });

        it('должен добавить класс, указаный в атрибуте data-class-bubble баблсета', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-class-bubble', 'bubbleclass');

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];
                        expect(nodeBubble.className).to.be.eql('bubbleclass');
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1')).to.be.eql(true);
                });
            });
        });

        it('не должен добавить класс, если ничего не указано', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-class-bubble', '');

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];
                        expect(nodeBubble.hasAttribute('class')).not.to.be.ok;
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1')).to.be.eql(true);
                });
            });
        });

        it('не должен добавить атрибут draggable для бабла, если указано data-draggable="false" для баблсета', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-draggable', 'false');

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    this.buffer.addEventListener(EV.CHANGE, function _onChange(event) {
                        event.currentTarget.removeEventListener(EV.CHANGE, _onChange);
                        const nodeBubble = event.currentTarget.items[0];

                        expect(nodeBubble.hasAttribute('draggable')).not.to.be.ok;
                        resolve();
                    });

                    expect(this.buffer.addBubble('bubble1')).to.be.eql(true);
                });
            });
        });
    });

    describe('#editBubble', function () {
        it('должен создать текстовый узел из бабла', function () {
            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    expect(this.buffer.editBubble(this.buffer.items[0])).to.be.eql(true);

                    setTimeout(() => {
                        expect(this.selection.anchorNode.nodeType).to.be.eql(Node.TEXT_NODE);
                        expect(this.selection.focusNode.nodeType).to.be.eql(Node.TEXT_NODE);
                        resolve();
                    }, 100);
                });
            });
        });

        it('должен выделить содержимое созданного текстового узла', function () {
            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                return new Promise(resolve => {
                    expect(this.buffer.editBubble(this.buffer.items[0])).to.be.eql(true);

                    setTimeout(() => {
                        expect(this.selection.isCollapsed).not.to.be.ok;
                        expect(this.selection.toString()).to.be.eql('bubble1');
                        resolve();
                    }, 100);
                });
            });
        });

        it('не должен запустить редактирование, если передаем узел бабла, не содержащийся в сете', function () {
            this.buffer.appendChild(document.createTextNode('bubble1,bubble2'));
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                expect(this.buffer.editBubble(document.createElement('div'))).to.be.eql(false);
            });
        });
    });

    describe('#options', function () {
        it('draggable по умолчанию true', function () {
            document.body.appendChild(this.buffer);

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('draggable')).to.be.eql(true);
            });
        });

        it('bubbleDeformation по умолчанию function() {}', function () {
            const func = function () {};
            document.body.appendChild(this.buffer);
            this.buffer.options('bubbleDeformation', func);

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('bubbleDeformation')).to.be.eql(func);
            });
        });

        it('bubbleDeformation строку преобразовывает в функцию', function () {
            context.testBubbleDeformation = function () {};
            document.body.appendChild(this.buffer);
            this.buffer.options('bubbleDeformation', 'testBubbleDeformation');

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('bubbleDeformation')).to.be.eql(context.testBubbleDeformation);
            });
        });

        it('data атрибут draggable должен быть преобразован в параметр true -> true', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-draggable', 'true');

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('draggable')).to.be.eql(true);
            });
        });

        it('data атрибут draggable должен быть преобразован в параметр on -> true', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-draggable', 'on');

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('draggable')).to.be.eql(true);
            });
        });

        it('data атрибут draggable должен быть преобразован в параметр off -> false', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-draggable', 'off');

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('draggable')).to.be.eql(false);
            });
        });

        it('data атрибут draggable должен быть преобразован в параметр false -> false', function () {
            document.body.appendChild(this.buffer);
            this.buffer.setAttribute('data-draggable', 'false');

            return this.webcomponentsready().then(() => {
                expect(this.buffer.options('draggable')).to.be.eql(false);
            });
        });
    });
});
