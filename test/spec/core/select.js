'use strict';

const select = require('../../../src/core/select');
const bubble = require('../../../src/core/bubble');
const bubbleset = require('../../../src/core/bubbleset');
const context = require('../../../src/context');

describe('core/select', function () {
    describe('allLeft', function () {
        beforeEach(function () {
            this.last = this.sinon.stub();
            this.setSelected = this.sinon.stub();

            select.__set__('last', this.last);
            select.__set__('setSelected', this.setSelected);

            this.sinon.stub(bubble, 'bubbling');
            this.sinon.stub(bubbleset, 'prevBubble');
            this.sinon.stub(context, 'getSelection');
        });

        it('Если нет выбранных баблов, то долна ничего не делать', function () {
            select.allLeft({});

            expect(this.last).have.callCount(1);
            expect(bubbleset.prevBubble).have.callCount(0);
            expect(bubble.bubbling).have.callCount(0);
            expect(context.getSelection).have.callCount(0);
        });

        it('Если есть выбранный бабл, то должна пометить все баблы левее выбранными', function () {
            const nodeset = { querySelector: this.sinon.stub().returns({ test: 1 }) };

            this.last.returns({ test: 'lastSelected' });

            bubbleset.prevBubble
                .onCall(0).returns({ test: 2 })
                .onCall(1).returns({ test: 3 })
                .onCall(2).returns({ test: 4 });

            select.allLeft(nodeset);

            expect(bubbleset.prevBubble).have.callCount(4);
            expect(this.setSelected).have.callCount(3);
            expect(this.setSelected).to.have.been.calledWithExactly({ test: 2 });
            expect(this.setSelected).to.have.been.calledWithExactly({ test: 3 });
            expect(this.setSelected).to.have.been.calledWithExactly({ test: 4 });
            expect(nodeset.querySelector).have.callCount(1);
        });

        it('Если есть выбранный бабл, то должна запустить баблинг и стереть ренджи selection', function () {
            const nodeset = { querySelector: this.sinon.stub().returns({ test: 1 }) };
            const selection = { removeAllRanges: this.sinon.stub() };


            this.last.returns({ test: 'lastSelected' });
            context.getSelection.returns(selection);

            select.allLeft(nodeset);

            expect(bubble.bubbling).have.callCount(1);
            expect(bubble.bubbling).to.have.been.calledWithExactly(nodeset);
            expect(context.getSelection).have.callCount(1);
            expect(selection.removeAllRanges).have.callCount(1);
        });
    });
});
