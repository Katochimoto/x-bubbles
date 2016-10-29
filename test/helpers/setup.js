require('../../src/index');

(function () {
    const Promise = require('es6-promise').Promise;

    function clearTestContext(context) {
        if (!context || typeof context !== 'object') {
            return;
        }

        for (var property in context) {
            if (context.hasOwnProperty(property)) {
                delete context[ property ];
            }
        }
    }

    beforeEach(function () {
        this.sinon = sinon.sandbox.create();
        this.webcomponentsready = function () {
            return new Promise(resolve => {
                setTimeout(resolve, 100);
            });
        };
    });

    afterEach(function () {
        this.sinon.restore();
        clearTestContext(this);
    });

}());
