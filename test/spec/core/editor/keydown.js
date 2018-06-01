'use strict';

const constants = require('../../../../src/core/constant');
const events = require('../../../../src/core/events');
const text = require('../../../../src/core/text');
const bubbleset = require('../../../../src/core/bubbleset');

const keydownHandler = require('../../../../src/core/editor/keydown');

describe('events/editor/keydown', function () {
    beforeEach(function () {
        this.sinon.stub(events, 'keyCode');
        this.sinon.stub(events, 'metaKey');

        this.event = {
            preventDefault: this.sinon.stub()
        };

        this.nodeEditor = {
            fireChange: this.sinon.stub(),
            fireInput: this.sinon.stub(),
            test: 1
        };

        this.sinon.stub(bubbleset, 'removeBubbles');

        this.sinon.stub(text, 'remove');
        this.sinon.stub(text, 'hasNear');
    });

    describe('Shift+Home keydown', function () {
        beforeEach(function() {
            this.sinon.stub(constants.KEY, 'Home', 'Home');
            this.sinon.stub(text, 'selectFromCursorToStrBegin');
        });

        it(
            'Если нажали Shift+Home, должен отменить дефолтное поведение и вызвать' +
            ' text.selectFromCursorToStrBegin c правильными параметрами',
            function () {
                events.keyCode.returns('Home');

                keydownHandler(Object.assign({ shiftKey: true }, this.event), { nodeEditor: this.nodeEditor });

                expect(this.event.preventDefault).have.callCount(1);
                expect(text.selectFromCursorToStrBegin).have.callCount(1);
                expect(text.selectFromCursorToStrBegin).to.have.been.calledWithExactly(null, this.nodeEditor);
            }
        );

        it('Если нажали Home, ничего не должен делать', function () {
            events.keyCode.returns('Home');

            keydownHandler(this.event, { nodeEditor: this.nodeEditor });

            expect(this.event.preventDefault).have.callCount(0);
            expect(text.selectFromCursorToStrBegin).have.callCount(0);
        });
    });

    describe('Delete keydown', function () {
        beforeEach(function () {
            this.sinon.stub(constants.KEY, 'Delete', 'Delete');
            this.sinon.stub(text, 'arrowRight');
            this.sinon.stub(bubbleset, 'findBubbleRight');

            events.keyCode.returns('Delete');
        });

        it(
            'Если есть текст справа, то должен стереть текст, после чего должен ничего не делать, если текст останется',
            function () {
                const selection = { test: 'selection' };

                text.arrowRight.withArgs(selection, true).returns(true);
                text.hasNear.withArgs(selection).returns(true);

                keydownHandler(this.event, { nodeEditor: this.nodeEditor, selection });

                expect(text.remove).have.callCount(1);
                expect(text.remove).to.have.been.calledWithExactly(selection);
                expect(this.nodeEditor.fireInput).have.callCount(1);
                expect(this.nodeEditor.fireChange).have.callCount(0);
            }
        );

        it(
            'Если есть текст справа, то должен стереть текст, после чего должен сгенерировать событие change, ' +
            'если текста не останется',
            function () {
                const selection = { test: 'selection' };

                text.arrowRight.withArgs(selection, true).returns(true);
                text.hasNear.withArgs(selection).returns(false);

                keydownHandler(this.event, { nodeEditor: this.nodeEditor, selection });

                expect(text.remove).have.callCount(1);
                expect(text.remove).to.have.been.calledWithExactly(selection);
                expect(this.nodeEditor.fireInput).have.callCount(1);
                expect(this.nodeEditor.fireChange).have.callCount(1);
            }
        );
    });

    describe('Backspace keydown', function () {
        beforeEach(function () {
            this.sinon.stub(constants.KEY, 'Backspace', 'Backspace');
            this.sinon.stub(text, 'arrowLeft');
            this.sinon.stub(bubbleset, 'findBubbleLeft');

            events.keyCode.returns('Backspace');
        });

        it(
            'Если есть текст слева, то должен стереть текст, после чего должен ничего не делать, если текст останется',
            function () {
                const selection = { test: 'selection' };

                text.arrowLeft.withArgs(selection, true).returns(true);
                text.hasNear.withArgs(selection).returns(true);

                keydownHandler(this.event, { nodeEditor: this.nodeEditor, selection });

                expect(text.remove).have.callCount(1);
                expect(text.remove).to.have.been.calledWithExactly(selection);
                expect(this.nodeEditor.fireInput).have.callCount(1);
                expect(this.nodeEditor.fireChange).have.callCount(0);
            }
        );

        it(
            'Если есть текст слева, то должен стереть текст, после чего должен сгенерировать событие change, ' +
            'если текста не останется',
            function () {
                const selection = { test: 'selection' };

                text.arrowLeft.withArgs(selection, true).returns(true);
                text.hasNear.withArgs(selection).returns(false);

                keydownHandler(this.event, { nodeEditor: this.nodeEditor, selection });

                expect(text.remove).have.callCount(1);
                expect(text.remove).to.have.been.calledWithExactly(selection);
                expect(this.nodeEditor.fireInput).have.callCount(1);
                expect(this.nodeEditor.fireChange).have.callCount(1);
            }
        );
    });
});
