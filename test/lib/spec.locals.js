'use strict';

const locals = require('../../lib/locals');
const nunjucks = require('nunjucks');

describe('Locals', () => {
    describe('middleware', () => {
        let app, env, req, res, next;

        beforeEach(() => {
            app = {
                locals: { appLocal: true }
            };
            env = {};
            req = {
                translate: sinon.stub().returns('translated {{local}}')
            };
            res = {
                locals: {
                    foo: {
                        bar: 'baz'
                    }
                }
            };
            sinon.stub(nunjucks.Template.prototype, 'render').returns('rendered');
            next = sinon.stub();
        });

        afterEach(() => {
            nunjucks.Template.prototype.render.restore();
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
                nunjucks.Template.prototype.render.should.have.been.calledWithExactly(res.locals);
                result.should.equal('rendered');
            });

            it('should not render if noRender option is supplied', () => {
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key', { noRender: true });
                nunjucks.Template.prototype.render.should.not.have.been.called;
                result.should.equal('translated {{local}}');
            });

            it('should not render if no braces are present in the result', () => {
                req.translate.returns('translated');
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key', { noRender: true });
                nunjucks.Template.prototype.render.should.not.have.been.called;
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

            it('returns deep rendered result', () => {
                nunjucks.Template.prototype.render
                    .onCall(0).returns('first')
                    .onCall(1).returns('second')
                    .onCall(2).returns('third')
                    .onCall(3).returns('fourth')
                    .onCall(4).returns('fifth');
                req.translate.returns([
                    'item {{}}',
                    { 'key': 'value {{}}' },
                    [ '{{a}}', '{{b}}', '{{c}}', 'd' ]
                ]);
                locals.middleware(app, env)(req, res, next);
                let result = res.locals.translate('key');
                expect(result).to.deep.equal([
                    'first',
                    {
                        'key': 'second'
                    },
                    [
                        'third',
                        'fourth',
                        'fifth',
                        'd'
                    ]
                ]);
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

    describe('cached templates', () => {
        let app, env, req, res, next, template;

        beforeEach(() => {
            app = {
                locals: { appLocal: true }
            };
            env = nunjucks.configure();
            req = {
                translate: sinon.stub().returns('translated {{local}}')
            };
            res = {
                locals: {
                    local: 'abc',
                    foo: {
                        bar: 'baz'
                    }
                }
            };
            next = sinon.stub();

            template = sinon.spy(nunjucks, 'Template');
        });


        afterEach(() => {
            template.restore();
        });

        it('renders the result from a cached template', () => {
            locals.middleware(app, env)(req, res, next);
            res.locals.translate('key', {});
            res.locals.translate('key', {});

            template.should.have.been.calledOnce;
        });

        it('should not cache the template if noCache is specified', () => {
            locals.middleware(app, env, { noCache: true })(req, res, next);
            res.locals.translate('key', {});
            res.locals.translate('key', {});

            template.should.have.been.calledTwice;
        });
    });
});
