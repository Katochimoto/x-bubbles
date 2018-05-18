'use strict';

const constants = require('../../../../src/core/constant');
const events = require('../../../../src/core/events');
const text = require('../../../../src/core/text');

const keydownHandler = require('../../../../src/core/editor/keydown');

describe('events/editor/keydown', function () {
    beforeEach(function () {
        this.sinon.stub(constants.KEY, 'Home', 'Home');
        this.sinon.stub(events, 'keyCode');
        this.sinon.stub(events, 'metaKey');
        this.sinon.stub(text, 'selectFromCursorToStrBegin');

        this.event = {
            preventDefault: this.sinon.stub()
        };
    });

    it(
        'Если нажали Shift+Home, должен отменить дефолтное поведение и вызвать' +
        ' text.selectFromCursorToStrBegin c правильными параметрами',
        function () {
            events.keyCode.returns('Home');

            keydownHandler(Object.assign({ shiftKey: true }, this.event), { nodeEditor: { test: 1 } });

            expect(this.event.preventDefault).have.callCount(1);
            expect(text.selectFromCursorToStrBegin).have.callCount(1);
            expect(text.selectFromCursorToStrBegin).to.have.been.calledWithExactly(null, { test: 1 });
        }
    );

    it('Если нажали Home, ничего не должен делать', function () {
        events.keyCode.returns('Home');

        keydownHandler(this.event, { nodeEditor: { test: 1 } });

        expect(this.event.preventDefault).have.callCount(0);
        expect(text.selectFromCursorToStrBegin).have.callCount(0);
    });
});
