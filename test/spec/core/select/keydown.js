'use strict';

const constants = require('../../../../src/core/constant');
const events = require('../../../../src/core/events');
const select = require('../../../../src/core/select');
const keydownHandler = require('../../../../src/core/select/keydown');

describe('events/select/keydown', function () {
    beforeEach(function () {
        this.sinon.stub(constants.KEY, 'Home', 'Home');
        this.sinon.stub(events, 'keyCode');
        this.sinon.stub(events, 'metaKey');
        this.sinon.stub(select, 'allLeft');
        this.sinon.stub(select, 'has');

        select.has.withArgs({ test: 1 }).returns(true);

        this.event = {
            preventDefault: this.sinon.stub()
        };
    });

    it('Если нажали Home, то должен ничего не делать', function () {
        events.keyCode.returns('Home');

        keydownHandler(this.event, { nodeEditor: { test: 1 } });

        expect(this.event.preventDefault).have.callCount(0);
        expect(select.allLeft).have.callCount(0);
    });

    it('Если нажали Shift+Home и isTextSelectedFromBeginToCursor = true, то должен ничего не делать', function () {
        events.keyCode.returns('Home');

        keydownHandler(
            Object.assign({ shiftKey: true }, this.event),
            { nodeEditor: { test: 1 }, isTextSelectedFromBeginToCursor: true }
        );

        expect(this.event.preventDefault).have.callCount(0);
        expect(select.allLeft).have.callCount(0);
    });

    it('Если нажали Shift+Home и ни один бабл не выделен, то должен ничего не делать', function () {
        events.keyCode.returns('Home');
        select.has.withArgs({ test: 1 }).returns(false);

        keydownHandler(this.event, { nodeEditor: { test: 1 }, isTextSelectedFromBeginToCursor: false });

        expect(this.event.preventDefault).have.callCount(0);
        expect(select.allLeft).have.callCount(0);
    });

    it(
        'Если нажали Shift+Home, есть выделенные баблы и isTextSelectedFromBeginToCursor = false, ' +
        'должен отменить дефолтное поведение и вызвать select.allLeft c правильными параметрами',
        function () {
            events.keyCode.returns('Home');

            keydownHandler(
                Object.assign({ shiftKey: true }, this.event),
                { nodeEditor: { test: 1 }, isTextSelectedFromBeginToCursor: false }
            );

            expect(this.event.preventDefault).have.callCount(1);
            expect(select.allLeft).have.callCount(1);
            expect(select.allLeft).to.have.been.calledWithExactly({ test: 1 });
        }
    );
});
