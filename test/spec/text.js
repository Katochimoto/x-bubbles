const testable = require('../../src/core/text');
const context = require('../../src/context');

describe('text', function () {
    beforeEach(function () {
        this.selection = context.getSelection();
        this.selection.removeAllRanges();
        this.buffer = document.body.appendChild(document.createElement('div'));
    });

    afterEach(function () {
        this.buffer && this.buffer.parentNode.removeChild(this.buffer);
    });

    describe('#arrowLeft', function () {
        it('должен сдвинуть курсор на 1 позицию влево', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('123'));

            var range = document.createRange();
            range.setStart(t1, 2);
            range.setEnd(t1, 2);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(1);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('должен схлопнуть выделение слева', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('1'));

            var range = document.createRange();
            range.setStart(t1, 0);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(0);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('при достижении конца надо, выделить начало следующей текстовой ноды', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('1'));
            var t2 = this.buffer.appendChild(document.createTextNode('2'));

            var range = document.createRange();
            range.setStart(t2, 0);
            range.setEnd(t2, 0);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(0);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('непечатный символ в тексте пропускается', function () {
            var zwsText = testable.createZws();
            var t1 = this.buffer.appendChild(document.createTextNode('1' + zwsText.nodeValue + '2'));

            var range = document.createRange();
            range.setStart(t1, 2);
            range.setEnd(t1, 2);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(0);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('непечатные символы пропускаются в конце и начале нод', function () {
            var zwsText = testable.createZws();
            var t1 = this.buffer.appendChild(document.createTextNode('1' + zwsText.nodeValue + zwsText.nodeValue));
            var t2 = this.buffer.appendChild(document.createTextNode(zwsText.nodeValue + zwsText.nodeValue + '2'));

            var range = document.createRange();
            range.setStart(t2, 2);
            range.setEnd(t2, 2);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(0);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('при достижении конца текста возвращается false и селект не меняется', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('1'));

            var range = document.createRange();
            range.setStart(t1, 0);
            range.setEnd(t1, 0);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(0);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(false);
        });

        it('достижение конца считается, если после идут ноды и/или текст с непечатными символами', function () {
            var zwsText = testable.createZws();
            this.buffer.appendChild(document.createTextNode(zwsText.nodeValue + zwsText.nodeValue));
            var t1 = this.buffer.appendChild(document.createTextNode(zwsText.nodeValue + zwsText.nodeValue + '2'));

            var range = document.createRange();
            range.setStart(t1, 2);
            range.setEnd(t1, 2);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(2);
            expect(this.selection.anchorNode).to.be.eql(t1);
            expect(res).to.be.eql(false);
        });

        it('если выделен не текст, то селект не изменяется и возвращается false', function () {
            var t1 = this.buffer.appendChild(document.createElement('div'));
            var t2 = this.buffer.appendChild(document.createElement('div'));

            var range = document.createRange();
            range.setStart(t1, 0);
            range.setEnd(t2, 0);

            this.selection.addRange(range);

            var res = testable.arrowLeft(this.selection);

            expect(this.selection.anchorOffset).to.be.eql(0, 'начало выделения имеет смещение 0');
            expect(this.selection.anchorNode).to.be.eql(document.body, 'начало выделения содержит body');
            expect(res).to.be.eql(false);
        });
    });

    describe('#arrowRight', function () {
        it('должен сдвинуть курсор на 1 позицию вправо', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('123'));

            var range = document.createRange();
            range.setStart(t1, 0);
            range.setEnd(t1, 0);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(1);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('должен схлопнуть выделение справа', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('1'));

            var range = document.createRange();
            range.setStart(t1, 0);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(1);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('выделение налево должен схлопнуть справа если нод больше', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('12345'));
            var t2 = this.buffer.appendChild(document.createTextNode('67890'));

            var range = document.createRange();
            range.setStart(t2, 2);
            range.setEnd(t1, 3);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(4);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('выделение налево должен схлопнуть справа если нод больше', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('12345'));

            var range = document.createRange();
            range.setStart(t1, 4);
            range.setEnd(t1, 3);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(4);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('при достижении конца надо, выделить начало следующей текстовой ноды', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('1'));
            var t2 = this.buffer.appendChild(document.createTextNode('2'));

            var range = document.createRange();
            range.setStart(t1, 1);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(1);
            expect(this.selection.focusNode).to.be.eql(t2);
            expect(res).to.be.eql(true);
        });

        it('непечатный символ в тексте пропускается', function () {
            var zwsText = testable.createZws();
            var t1 = this.buffer.appendChild(document.createTextNode('1' + zwsText.nodeValue + '2'));

            var range = document.createRange();
            range.setStart(t1, 1);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(3);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(true);
        });

        it('непечатные символы пропускаются в конце и начале нод', function () {
            var zwsText = testable.createZws();
            var t1 = this.buffer.appendChild(document.createTextNode('1' + zwsText.nodeValue + zwsText.nodeValue));
            var t2 = this.buffer.appendChild(document.createTextNode(zwsText.nodeValue + zwsText.nodeValue + '2'));

            var range = document.createRange();
            range.setStart(t1, 1);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(3);
            expect(this.selection.focusNode).to.be.eql(t2);
            expect(res).to.be.eql(true);
        });

        it('при достижении конца текста возвращается false и селект не меняется', function () {
            var t1 = this.buffer.appendChild(document.createTextNode('1'));

            var range = document.createRange();
            range.setStart(t1, 1);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(1);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(false);
        });

        it('достижение конца считается, если после идут ноды и/или текст с непечатными символами', function () {
            var zwsText = testable.createZws();
            var t1 = this.buffer.appendChild(document.createTextNode('1' + zwsText.nodeValue + zwsText.nodeValue));
            this.buffer.appendChild(document.createTextNode(zwsText.nodeValue + zwsText.nodeValue));

            var range = document.createRange();
            range.setStart(t1, 1);
            range.setEnd(t1, 1);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(1);
            expect(this.selection.focusNode).to.be.eql(t1);
            expect(res).to.be.eql(false);
        });

        it('если выделен не текст, то селект не изменяется и возвращается false', function () {
            var t1 = this.buffer.appendChild(document.createElement('div'));
            var t2 = this.buffer.appendChild(document.createElement('div'));

            var range = document.createRange();
            range.setStart(t1, 0);
            range.setEnd(t2, 0);

            this.selection.addRange(range);

            var res = testable.arrowRight(this.selection);

            expect(this.selection.focusOffset).to.be.eql(0, 'конец выделения имеет смещение 0');
            expect(this.selection.focusNode).to.be.eql(document.body, 'конец выделения содержит body');
            expect(res).to.be.eql(false);
        });
    });

    describe('findTextBorderNode', function () {
        it('Если cursorNode не передана, то функция должна вернуть null', function () {
            expect(testable.findTextBorderNode()).to.equal(null);
        });

        it('Если cursorNode имеет nodeType не равнй Node.TEXT_NODE, то функция должна вернуть null', function () {
            expect(testable.findTextBorderNode({ nodeType: 'test' })).to.equal(null);
        });

        it('Должна вернуть последний текстовый узел слева, если mode="begin"', function () {
            const cursorNode = {
                nodeType: Node.TEXT_NODE,
                test: 1,
                previousSibling: {
                    nodeType: Node.TEXT_NODE,
                    test: 2,
                    previousSibling: {
                        nodeType: Node.TEXT_NODE,
                        test: 3,
                        previousSibling: {
                            nodeType: 'not_text_node',
                            test: 4
                        }
                    }
                }
            };

            expect(testable.findTextBorderNode(cursorNode, 'begin')).to.eql({
                nodeType: Node.TEXT_NODE,
                test: 3,
                previousSibling: {
                    nodeType: 'not_text_node',
                    test: 4
                }
            });
        });

        it('Должна вернуть последний текстовый узел справа, если mode="end"', function () {
            const cursorNode = {
                nodeType: Node.TEXT_NODE,
                test: 1,
                nextSibling: {
                    nodeType: Node.TEXT_NODE,
                    test: 2,
                    nextSibling: {
                        nodeType: Node.TEXT_NODE,
                        test: 3,
                        nextSibling: {
                            nodeType: 'not_text_node',
                            test: 4
                        }
                    }
                }
            };

            expect(testable.findTextBorderNode(cursorNode)).to.eql({
                nodeType: Node.TEXT_NODE,
                test: 3,
                nextSibling: {
                    nodeType: 'not_text_node',
                    test: 4
                }
            });
        });
    });

    describe('selectFromCursorToStrBegin', function () {
        beforeEach(function () {
            this.findTextBorderNode = this.sinon.stub();
            this.setTextSelection = this.sinon.stub();

            testable.__set__('findTextBorderNode', this.findTextBorderNode);
            testable.__set__('setTextSelection', this.setTextSelection);

            this.sinon.stub(context, 'getSelection');
        });

        it('Если нет selection, то должна вернуть false', function() {
            expect(testable.selectFromCursorToStrBegin(null, [ '[bubble]', '[bubble]' ])).to.equal(false);
        });

        it('Если у selection нет anchorNode, то должна вернуть false', function() {
            expect(testable.selectFromCursorToStrBegin({}, [ '[bubble]', '[bubble]' ])).to.equal(false);
        });

        it('Если у selection anchorNode не текстовая нода, то должна вернуть false', function() {
            expect(testable.selectFromCursorToStrBegin({ anchorNode: {} }, [ '[bubble]', '[bubble]' ])).to.equal(false);
        });

        it(
            'Если передан selection с anchorNode текстовой нодой, ' +
            'то должна вызвать findTextBorderNode и setTextSelection c правильными параметрами',
            function () {
                const fromNode = { nodeType: Node.TEXT_NODE, test: 1 };
                const toNode = { nodeType: Node.TEXT_NODE, test: 2 };
                const selection = { anchorNode: toNode, anchorOffset: 10 };
                const nodeset = [ '[bubble]', '[bubble]' ];

                this.findTextBorderNode.returns(fromNode);

                testable.selectFromCursorToStrBegin(selection, nodeset);

                expect(this.findTextBorderNode).have.callCount(1);
                expect(this.findTextBorderNode).to.have.been.calledWithExactly(toNode, 'begin');
                expect(this.setTextSelection).have.callCount(1);
                expect(this.setTextSelection).to.have.been.calledWithExactly(
                    selection,
                    { node: fromNode, offset: 0 },
                    { node: toNode, offset: 10 },
                    nodeset
                );
            }
        );

        it(
            'Если текущий selection имеет текстовую ноду anchorNode, ' +
            'то должна вызвать findTextBorderNode и setTextSelection c правильными параметрами',
            function () {
                const fromNode = { nodeType: Node.TEXT_NODE, test: 1 };
                const toNode = { nodeType: Node.TEXT_NODE, test: 2 };
                const selection = { anchorNode: toNode, anchorOffset: 10 };
                const nodeset = [ '[bubble]', '[bubble]' ];

                context.getSelection.returns(selection);
                this.findTextBorderNode.returns(fromNode);

                testable.selectFromCursorToStrBegin(null, nodeset);

                expect(this.findTextBorderNode).have.callCount(1);
                expect(this.findTextBorderNode).to.have.been.calledWithExactly(toNode, 'begin');
                expect(this.setTextSelection).have.callCount(1);
                expect(this.setTextSelection).to.have.been.calledWithExactly(
                    selection,
                    { node: fromNode, offset: 0 },
                    { node: toNode, offset: 10 },
                    nodeset
                );
            }
        );
    });

    describe('selectAll', function () {
        beforeEach(function () {
            this.findTextBorderNode = this.sinon.stub();
            this.setTextSelection = this.sinon.stub();

            testable.__set__('findTextBorderNode', this.findTextBorderNode);
            testable.__set__('setTextSelection', this.setTextSelection);

            this.sinon.stub(context, 'getSelection');
        });

        it('Если нет selection, то должна вернуть false', function() {
            expect(testable.selectAll(null, [ '[bubble]', '[bubble]' ])).to.equal(false);
        });

        it('Если у selection нет anchorNode, то должна вернуть false', function() {
            expect(testable.selectAll({}, [ '[bubble]', '[bubble]' ])).to.equal(false);
        });

        it('Если у selection anchorNode не текстовая нода, то должна вернуть false', function() {
            expect(testable.selectAll({ anchorNode: {} }, [ '[bubble]', '[bubble]' ])).to.equal(false);
        });

        it(
            'Если передан selection с anchorNode текстовой нодой, ' +
            'то должна вызвать findTextBorderNode и setTextSelection c правильными параметрами',
            function () {
                const fromNode = { nodeType: Node.TEXT_NODE, test: 1 };
                const toNode = { nodeType: Node.TEXT_NODE, test: 2, nodeValue: '1234567890' };
                const selectionNode = { nodeType: Node.TEXT_NODE, test: 3 };
                const selection = { anchorNode: selectionNode };
                const nodeset = [ '[bubble]', '[bubble]' ];

                this.findTextBorderNode
                    .withArgs(selectionNode, 'begin').returns(fromNode)
                    .withArgs(selectionNode, 'end').returns(toNode);

                testable.selectAll(selection, nodeset);

                expect(this.findTextBorderNode).have.callCount(2);
                expect(this.findTextBorderNode).to.have.been.calledWithExactly(selectionNode, 'begin');
                expect(this.findTextBorderNode).to.have.been.calledWithExactly(selectionNode, 'end');
                expect(this.setTextSelection).have.callCount(1);
                expect(this.setTextSelection).to.have.been.calledWithExactly(
                    selection,
                    { node: fromNode, offset: 0 },
                    { node: toNode, offset: 10 },
                    nodeset
                );
            }
        );

        it(
            'Если текущий selection имеет текстовую ноду anchorNode, ' +
            'то должна вызвать findTextBorderNode и setTextSelection c правильными параметрами',
            function () {
                const fromNode = { nodeType: Node.TEXT_NODE, test: 1 };
                const toNode = { nodeType: Node.TEXT_NODE, test: 2, nodeValue: '1234567890' };
                const selectionNode = { nodeType: Node.TEXT_NODE, test: 3 };
                const selection = { anchorNode: selectionNode };
                const nodeset = [ '[bubble]', '[bubble]' ];

                context.getSelection.returns(selection);

                this.findTextBorderNode
                    .withArgs(selectionNode, 'begin').returns(fromNode)
                    .withArgs(selectionNode, 'end').returns(toNode);

                testable.selectAll(selection, nodeset);

                expect(this.findTextBorderNode).have.callCount(2);
                expect(this.findTextBorderNode).to.have.been.calledWithExactly(selectionNode, 'begin');
                expect(this.findTextBorderNode).to.have.been.calledWithExactly(selectionNode, 'end');
                expect(this.setTextSelection).have.callCount(1);
                expect(this.setTextSelection).to.have.been.calledWithExactly(
                    selection,
                    { node: fromNode, offset: 0 },
                    { node: toNode, offset: 10 },
                    nodeset
                );
            }
        );
    });

    describe('hasNear', function () {
        beforeEach(function () {
            this.rangeSetStart = this.sinon.stub();
            this.rangeSetEnd = this.sinon.stub();
            this.rangeToString = this.sinon.stub();

            this.findTextBorderNode = this.sinon.stub();
            this.createRange = this.sinon.stub().returns({
                setStart: this.rangeSetStart,
                setEnd: this.rangeSetEnd,
                toString: this.rangeToString
            });

            this.textClean = this.sinon.stub();

            testable.__set__('findTextBorderNode', this.findTextBorderNode);
            testable.__set__('textClean', this.textClean);

            this.sinon.stub(context, 'getSelection');
            this.sinon.stub(context.document, 'createRange', this.createRange);

            this.fromNode = { nodeType: Node.TEXT_NODE, test: 1 };
            this.toNode = { nodeType: Node.TEXT_NODE, test: 2, nodeValue: '1234567890' };

            this.selectionNode = { nodeType: Node.TEXT_NODE, test: 3 };
            this.selection = { anchorNode: this.selectionNode };
        });

        it('Если нет selection, то должна вернуть false', function() {
            expect(testable.hasNear(null)).to.equal(false);
        });

        it('Если у selection нет anchorNode, то должна вернуть false', function() {
            expect(testable.hasNear({})).to.equal(false);
        });

        it('Если у selection anchorNode не текстовая нода, то должна вернуть false', function() {
            expect(testable.hasNear({ anchorNode: {} })).to.equal(false);
        });

        it('Должна вызвать findTextBorderNode c правильными параметрами и правильно формировать range', function() {
            this.findTextBorderNode
                .withArgs(this.selectionNode, 'begin').returns(this.fromNode)
                .withArgs(this.selectionNode, 'end').returns(this.toNode);

            this.rangeToString.returns('toString');

            testable.hasNear(this.selection);

            expect(this.findTextBorderNode).have.callCount(2);
            expect(this.findTextBorderNode).to.have.been.calledWithExactly(this.selectionNode, 'begin');
            expect(this.findTextBorderNode).to.have.been.calledWithExactly(this.selectionNode, 'end');
            expect(this.rangeSetStart).to.have.been.calledWithExactly(this.fromNode, 0);
            expect(this.rangeSetEnd).to.have.been.calledWithExactly(this.toNode, 10);
            expect(this.textClean).have.callCount(1);
            expect(this.textClean).to.have.been.calledWithExactly('toString');
        });

        it('Должна вернуть false, если нет текста', function() {
            this.findTextBorderNode
                .withArgs(this.selectionNode, 'begin').returns(this.fromNode)
                .withArgs(this.selectionNode, 'end').returns(this.toNode);

            this.textClean.returns('');

            expect(testable.hasNear(this.selection)).to.equal(false);
        });

        it('Должна вернуть true, если текст есть', function() {
            this.findTextBorderNode
                .withArgs(this.selectionNode, 'begin').returns(this.fromNode)
                .withArgs(this.selectionNode, 'end').returns(this.toNode);

            this.textClean.returns('has text');

            expect(testable.hasNear(this.selection)).to.equal(true);
        });
    });
});
