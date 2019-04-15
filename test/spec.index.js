'use strict';

const filters = require('../lib/filters');
const globals = require('../lib/globals');
const locals = require('../lib/locals');

const index = require('../');

describe('Components', () => {

    describe('setup function', () => {

        let app, env;
        beforeEach(() => {
            app = {
                use: sinon.stub()
            };
            env = {};
            sinon.stub(filters, 'addFilters');
            sinon.stub(globals, 'addGlobals');
            sinon.stub(locals, 'middleware').returns('locals-middleware');
        });

        afterEach(() => {
            filters.addFilters.restore();
            globals.addGlobals.restore();
            locals.middleware.restore();
        });

        it('should be a function', () => {
            index.setup.should.be.a('function');
        });

        it('runs addFilters', () => {
            index.setup(app, env);
            filters.addFilters.should.have.been.calledWithExactly(env);
        });

        it('runs addGlobals', () => {
            index.setup(app, env);
            globals.addGlobals.should.have.been.calledWithExactly(env);
        });
        it('uses locals middleware', () => {
            index.setup(app, env);
            locals.middleware.should.have.been.calledWithExactly(app, env);
            app.use.should.have.been.calledWithExactly('locals-middleware');
        });
    });

    it('exports mixin controllers', () => {
        index.mixins.should.equal(require('../lib/mixins'));
    });

    it('exports the Date mixin controller', () => {
        index.mixins.Date.should.equal(require('../lib/mixins/date'));
    });
});
