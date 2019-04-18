'use strict';

const locals = require('../../lib/locals');

describe('Locals', () => {
    describe('middleware', () => {
        let app, env, req, res, next;

        beforeEach(() => {
            app = {
                locals: { appLocal: true }
            };
            env = {
                renderString: sinon.stub().returns('rendered')
            };
            req = {
                translate: sinon.stub().returns('translated')
            };
            res = {
                locals: {
                    foo: {
                        bar: 'baz'
                    }
                }
            };
            next = sinon.stub();
        });

        it('is a function', () => {
            locals.middleware.should.be.a('function');
        });

        it('returns a function', () => {
            locals.middleware(app, env).should.be.a('function');
        });

        it('adds app.locals into res.locals', () => {
            locals.middleware(app, env)(req, res, next);
            res.locals.should.contain.key('appLocal');
        });

        it('calls next', () => {
            locals.middleware(app, env)(req, res, next);
            next.should.have.been.calledWithExactly();
        });

        describe('translate', () => {
            it('is a function', () => {
                locals.middleware(app, env)(req, res, next);
                res.locals.translate.should.be.a('function');
            });

            it('runs req.translate', () => {
                let options = {};
                locals.middleware(app, env)(req, res, next);
                res.locals.translate('key', options);
                req.translate.should.have.been.calledWithExactly('key', options);
            });

            it('renders the result', () => {
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key', {});
                env.renderString.should.have.been.calledWithExactly('translated', res.locals);
                result.should.equal('rendered');
            });

            it('should not render if noRender option is supplied', () => {
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key', { noRender: true });
                env.renderString.should.not.have.been.called;
                result.should.equal('translated');
            });

            it('returns key if no translation function is available', () => {
                req.translate = null;
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key', { noRender: true });
                result.should.equal('key');
            });

            it('returns undefined if no translation is available', () => {
                req.translate.returns(null);
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key');
                expect(result).to.be.undefined;
            });

        });

        describe('ctx', () => {
            it('is a function', () => {
                locals.middleware(app, env)(req, res, next);
                res.locals.ctx.should.be.a('function');
            });

            it('should return locals object', () => {
                locals.middleware(app, env)(req, res, next);
                res.locals.ctx().should.equal(res.locals);
            });

            it('should look up value in locals object', () => {
                locals.middleware(app, env)(req, res, next);
                res.locals.ctx('foo.bar').should.equal('baz');
            });
        });
    });
});
