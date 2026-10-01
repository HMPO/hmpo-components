'use strict';

const globals = require('../../lib/globals');
const _ = require('underscore');

describe('Globals', () => {
    describe('addGlbals', () => {
        let env;

        beforeEach(() => {
            env = {
                addGlobal: sinon.stub()
            };
        });

        it('is a function', () => {
            globals.addGlobals.should.be.a('function');
        });

        describe('adds globals to env', () => {
            beforeEach(() => {
                globals.addGlobals(env);
            });

            _.each(globals.globals, (globalItem, name) => {
                it(`global ${name}`, () => {
                    env.addGlobal.should.have.been.calledWithExactly(name, globalItem);
                });
            });
        });
    });

    describe('Global functions', () => {

        describe('isString', () => {
            it('returns true if a string is passed', () => {
                globals.globals.isString('string').should.be.true;
                globals.globals.isString('').should.be.true;
            });
            it('returns false if not a string', () => {
                globals.globals.isString(4).should.be.false;
                globals.globals.isString({}).should.be.false;
                globals.globals.isString([]).should.be.false;
                globals.globals.isString(null).should.be.false;
                globals.globals.isString(true).should.be.false;
            });
        });

        describe('isNumber', () => {
            it('returns true if a number is passed', () => {
                globals.globals.isNumber(0).should.be.true;
                globals.globals.isNumber(4).should.be.true;
            });
            it('returns false if not a number', () => {
                globals.globals.isNumber('4').should.be.false;
                globals.globals.isNumber([]).should.be.false;
                globals.globals.isNumber({}).should.be.false;
                globals.globals.isNumber(null).should.be.false;
                globals.globals.isNumber(true).should.be.false;
            });
        });

        describe('isArray', () => {
            it('returns true if an array is passed', () => {
                globals.globals.isArray([]).should.be.true;
                globals.globals.isArray([1, 2, 3]).should.be.true;
            });
            it('returns false if not a number', () => {
                globals.globals.isArray('string').should.be.false;
                globals.globals.isArray({}).should.be.false;
                globals.globals.isArray(4).should.be.false;
                globals.globals.isArray(null).should.be.false;
                globals.globals.isArray(true).should.be.false;
            });
        });

        describe('isObject', () => {
            it('returns true if an object is passed', () => {
                globals.globals.isObject({}).should.be.true;
                globals.globals.isObject({ foo: 'bar' }).should.be.true;
            });
            it('returns false if not an object', () => {
                globals.globals.isObject('string').should.be.false;
                globals.globals.isObject(4).should.be.false;
                globals.globals.isObject([]).should.be.false;
                globals.globals.isObject(null).should.be.false;
                globals.globals.isObject(true).should.be.false;
            });
        });

        describe('isBoolean', () => {
            it('returns true if an boolean is passed', () => {
                globals.globals.isBoolean(true).should.be.true;
                globals.globals.isBoolean(false).should.be.true;
            });
            it('returns false if not a boolean', () => {
                globals.globals.isBoolean('string').should.be.false;
                globals.globals.isBoolean(4).should.be.false;
                globals.globals.isBoolean([]).should.be.false;
                globals.globals.isBoolean({}).should.be.false;
                globals.globals.isBoolean(null).should.be.false;
            });
        });

        describe('startsWith', () => {
            it('returns true if a string is passed', () => {
                globals.globals.startsWith('string', 'str').should.be.true;
                globals.globals.startsWith('', '').should.be.true;
            });
            it('returns false if not a string', () => {
                globals.globals.startsWith('string', 'ing').should.be.false;
                globals.globals.startsWith({}, 'str').should.be.false;
                globals.globals.startsWith([], 'str').should.be.false;
                globals.globals.startsWith(null, 'str').should.be.false;
                globals.globals.startsWith(true, 'str').should.be.false;
            });
        });

        describe('endsWith', () => {
            it('returns true if a string is passed', () => {
                globals.globals.endsWith('string', 'ing').should.be.true;
                globals.globals.endsWith('', '').should.be.true;
            });
            it('returns false if not a string', () => {
                globals.globals.endsWith('string', 'str').should.be.false;
                globals.globals.endsWith({}, 'str').should.be.false;
                globals.globals.endsWith([], 'str').should.be.false;
                globals.globals.endsWith(null, 'str').should.be.false;
                globals.globals.endsWith(true, 'str').should.be.false;
            });
        });

        describe('substr', () => {
            it('returns sub string if a string is passed', () => {
                globals.globals.substr('string', 0).should.equal('string');
                globals.globals.substr('string', 1, 3).should.equal('tri');
                globals.globals.substr('string', 4).should.equal('ng');
                globals.globals.substr('', 10).should.equal('');
                globals.globals.substr({}, 10).should.equal('');
                globals.globals.substr(false, 10).should.equal('');
                globals.globals.substr([], 10).should.equal('');
                globals.globals.substr(null, 10).should.equal('');
            });
        });

        describe('hmpoTranslateExtraFieldContent returns translation when key exists', () => {
            const context = sinon.stub();

            context.withArgs('translate').returns((key) => {
                return key;
            });
            const fieldKey = 'test';
            const params = {id: 'id'};

            const translation = globals.globals.hmpoTranslateExtraFieldContent(context, params, fieldKey);

            translation.should.equal('fields.id.test');
        });

        describe('hmpoTranslateExtraFieldContent returns undefined when locale doesn\'t exist', () => {
            const context = sinon.stub();

            context.withArgs('translate').returns((key) => {
                return `[${key}]`;
            });
            const fieldKey = 'test';
            const params = {id: 'id'};

            const translation = globals.globals.hmpoTranslateExtraFieldContent(context, params, fieldKey);

            expect(translation).to.be.undefined;
        });

        it('orders grouped date errors by day, month, and year in the error summary', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'required-year', field: 'date-year' };
            const monthError = { key: 'date-month', type: 'date-month', field: 'date-month' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({
                date: groupError,
                'date-month': monthError,
                'date-year': { key: 'date-year', type: 'required', field: 'date-year' }
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(2);
            summary[0].href.should.equal('#date-month');
            summary[1].href.should.equal('#date-year');
        });

        it('includes normalized date-part errors with no child field values', () => {
            const context = sinon.stub();
            const groupError = {
                key: 'applicantPassportDateOfBirth',
                type: 'numeric-month',
                field: 'applicantPassportDateOfBirth-month',
                errorGroup: 'applicantPassportDateOfBirth'
            };
            const monthError = {
                key: 'applicantPassportDateOfBirth-month',
                type: 'numeric-month',
                errorGroup: 'applicantPassportDateOfBirth'
            };
            const yearError = {
                key: 'applicantPassportDateOfBirth-year',
                type: 'numeric-year',
                errorGroup: 'applicantPassportDateOfBirth'
            };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({
                applicantPassportDateOfBirth: groupError,
                'applicantPassportDateOfBirth-month': monthError,
                'applicantPassportDateOfBirth-year': yearError
            });
            context.withArgs('options.dateFields').returns(['applicantPassportDateOfBirth', 'applicantPassportDateOfIssue']);
            context.withArgs('options.fields.applicantPassportDateOfBirth.showMultipleErrors').returns(true);
            context.withArgs('options.fields.applicantPassportDateOfIssue.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(2);
            summary[0].href.should.equal('#applicantPassportDateOfBirth-month');
            summary[1].href.should.equal('#applicantPassportDateOfBirth-year');
        });

        it('prefers date-part errors over the parent error in the error summary', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'numeric-year', field: 'date-day' };
            const dayError = { key: 'date-day', type: 'numeric-day', field: 'date-day' };
            const monthError = { key: 'date-month', type: 'numeric-month', field: 'date-month' };
            const yearError = { key: 'date-year', type: 'numeric-year', field: 'date-year' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({
                date: groupError,
                'date-day': dayError,
                'date-month': monthError,
                'date-year': yearError
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(3);
            summary[0].href.should.equal('#date-day');
            summary[1].href.should.equal('#date-month');
            summary[2].href.should.equal('#date-year');
        });

        it('orders date-part errors by day, month, and year when they are in the error list', () => {
            const context = sinon.stub();
            const dayError = { key: 'date-day', type: 'date-day', field: 'date-day' };
            const monthError = { key: 'date-month', type: 'date-month', field: 'date-month' };

            context.withArgs('errorlist').returns([monthError, dayError]);
            context.withArgs('errors').returns({
                'date-day': dayError,
                'date-month': monthError
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(2);
            summary[0].href.should.equal('#date-day');
            summary[1].href.should.equal('#date-month');
        });

        it('includes custom date validator errors in the error summary', () => {
            const context = sinon.stub();
            const groupError = {
                key: 'marriageDateOfMarriage',
                type: 'after-month',
                field: 'marriageDateOfMarriage'
            };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({ marriageDateOfMarriage: groupError });
            context.withArgs('options.dateFields').returns(['marriageDateOfMarriage']);
            context.withArgs('options.fields.marriageDateOfMarriage.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#marriageDateOfMarriage');
        });

        it('does not duplicate a custom date validator error that targets a date part', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'future', field: 'date-year' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({ date: groupError });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#date-year');
        });

        it('keeps an all-empty required date as one error summary item', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'required' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({
                date: groupError,
                'date-day': { key: 'date-day', type: 'required', field: 'date-day' },
                'date-month': { key: 'date-month', type: 'required', field: 'date-month' },
                'date-year': { key: 'date-year', type: 'required', field: 'date-year' }
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#date');
        });

        it('keeps all date-part validation failures as one error summary item', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'date', field: 'date-day' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({
                date: groupError,
                'date-day': { key: 'date-day', type: 'date-day', field: 'date-day' },
                'date-month': { key: 'date-month', type: 'date-month', field: 'date-month' },
                'date-year': { key: 'date-year', type: 'date-year', field: 'date-year' }
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#date-day');
        });

        it('keeps all inexact date numeric failures as one error summary item', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'numeric', field: 'date-month' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({ date: groupError });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#date-month');
        });

        it('includes an aggregate date error when only child errors are in the error list', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'numeric', field: 'date-month' };
            const monthError = { key: 'date-month', type: 'numeric-month', field: 'date-month' };
            const yearError = { key: 'date-year', type: 'numeric-year', field: 'date-year' };

            context.withArgs('errorlist').returns([monthError, yearError]);
            context.withArgs('errors').returns({
                date: groupError,
                'date-month': monthError,
                'date-year': yearError
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(true);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#date-month');
        });

        it('keeps the existing grouped date error summary unless showMultipleErrors is enabled', () => {
            const context = sinon.stub();
            const groupError = { key: 'date', type: 'required-year', field: 'date-year' };

            context.withArgs('errorlist').returns([groupError]);
            context.withArgs('errors').returns({
                date: groupError,
                'date-month': { key: 'date-month', type: 'date-month', field: 'date-month' }
            });
            context.withArgs('options.dateFields').returns(['date']);
            context.withArgs('options.fields.date.showMultipleErrors').returns(undefined);
            context.withArgs('translate').returns(key => Array.isArray(key) ? key[0] : key);

            const summary = globals.globals.hmpoGetErrorSummary(context);

            summary.should.have.length(1);
            summary[0].href.should.equal('#date-year');
        });
    });
});
