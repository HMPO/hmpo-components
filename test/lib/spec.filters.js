'use strict';

const filters = require('../../lib/filters');
const _ = require('underscore');
const moment = require('moment');

describe('Filters', () => {
    describe('addFilters', () => {
        let env;

        beforeEach(() => {
            env = {
                addFilter: sinon.stub()
            };
        });

        it('is a function', () => {
            filters.addFilters.should.be.a('function');
        });

        describe('adds lambdas and values into res.locals', () => {
            beforeEach(() => {
                filters.addFilters(env);
            });

            _.each(filters.filters, (filter, name) => {
                it(`filter ${name}`, () => {
                    env.addFilter.should.have.been.calledWithExactly(name, filter);
                });
            });
        });
    });

    describe('Filter functions', () => {
        let context;

        beforeEach(() => {
            context = {
                ctx: {
                    translate: sinon.stub().returnsArg(0)
                }
            };
        });

        describe('translate', () => {
            it('calls translate passing the given key and options', () => {
                let result = filters.filters.translate.call(context, 'fields.field-1.label', { foo: 'bar' });
                context.ctx.translate.should.have.been.calledOnce.and.calledWithExactly('fields.field-1.label', { foo: 'bar' });
                result.should.equal('fields.field-1.label');
            });

            it('returns key if translate function is not available', () => {
                context.ctx = {};
                let result = filters.filters.translate.call(context, 'fields.field-1.label', { foo: 'bar' });
                result.should.equal('fields.field-1.label');
            });
        });

        describe('date', () => {
            it('formats a date', () => {
                let result = filters.filters.date.call(context, moment('2019-01-02'));
                result.should.equal('2 January 2019');
            });

            it('formats a date with a format', () => {
                let result = filters.filters.date.call(context, moment('2019-01-02'), 'MMM YY');
                result.should.equal('Jan 19');
            });
        });

        describe('time', () => {
            it('changes 12:00am to midnight', () => {
                let result = filters.filters.time.call(context, '26 March 2015 12:00am');
                result.should.equal('26 March 2015 midnight');
            });

            it('changes 12:00pm to midday', () => {
                let result = filters.filters.time.call(context, '26 March 2015 12:00pm');
                result.should.equal('26 March 2015 midday');
            });

            it('changes leading 12:00am to Midnight', () => {
                let result = filters.filters.time.call(context, '12:00am 26 March 2015');
                result.should.equal('Midnight 26 March 2015');
            });

            it('changes leading 12:00pm to Midday', () => {
                let result = filters.filters.time.call(context, '12:00pm 26 March 2015');
                result.should.equal('Midday 26 March 2015');
            });

            it('changes 4:00pm to 4pm', () => {
                let result = filters.filters.time.call(context, '26 March 2015 4:00pm');
                result.should.equal('26 March 2015 4pm');
            });

            it('changes 12:00pm to 12pm if options only specify short', () => {
                let result = filters.filters.time.call(context, '26 March 2015 12:00pm', { short: true });
                result.should.equal('26 March 2015 12pm');
            });

            it('changes 12:00am to 12am if options do not specify midnight', () => {
                let result = filters.filters.time.call(context, '26 March 2015 12:00am', { short: true, midday: true });
                result.should.equal('26 March 2015 12am');
            });

            it('should pass through other time formats', () => {
                let result = filters.filters.time.call(context, '6:30am 26 March 2015');
                result.should.equal('6:30am 26 March 2015');
            });

            it('returns the unchanged time with no options specified', () => {
                let result = filters.filters.time.call(context, '26 March 2015 12:00pm', {});
                result.should.equal('26 March 2015 12:00pm');
            });
        });

        describe('uppercase', () => {
            it('changes text to uppercase', () => {
                let result = filters.filters.uppercase.call(context, 'abcdEFG');
                result.should.equal('ABCDEFG');
            });
        });

        describe('lowercase', () => {
            it('changes text to lowercase', () => {
                let result = filters.filters.lowercase.call(context, 'abcdEFG');
                result.should.equal('abcdefg');
            });
        });

        describe('capscase', () => {
            it('changes text to capscase', () => {
                let result = filters.filters.capscase.call(context, 'abcdef');
                result.should.equal('Abcdef');
            });

            it('capitalisaes only the first word', () => {
                let result = filters.filters.capscase.call(context, 'abc def');
                result.should.equal('Abc def');
            });

            it('does not change capitalisation of other words', () => {
                let result = filters.filters.capscase.call(context, 'abc DEF Hij');
                result.should.equal('Abc DEF Hij');
            });
        });

        describe('currency', () => {
            it('formats whole numbers with no decimal places', () => {
                let result = filters.filters.currency.call(context, 3);
                result.should.equal('£3');
            });

            it('formats 3.50 to two decimal places', () => {
                let result = filters.filters.currency.call(context, 3.50);
                result.should.equal('£3.50');
            });

            it('formats and rounds 3.567 to two decimal places', () => {
                let result = filters.filters.currency.call(context, 3.567);
                result.should.equal('£3.57');
            });

            it('formats whole numbers with custom currency symbol', () => {
                let result = filters.filters.currency.call(context, '3.00', { currencySymbol: '$' });
                result.should.equal('$3');
            });

            it('returns original value if not a number', () => {
                let result = filters.filters.currency.call(context, 'abcd');
                result.should.equal('abcd');
            });
        });

        describe('currencyOrFree', () => {
            it('formats whole numbers with no decimal places', () => {
                let result = filters.filters.currencyOrFree.call(context, '3.00');
                result.should.equal('£3');
            });

            it('returns zero as free', () => {
                let result = filters.filters.currencyOrFree.call(context, '0');
                result.should.equal('free');
            });
        });

        describe('hyphenate', () => {
            it('hyphenates a string with a single whitespace character', () => {
                let result = filters.filters.hyphenate.call(context, 'apple blackberry');
                result.should.equal('apple-blackberry');
            });

            it('hyphenates a string with multiple whitespace characters', () => {
                let result = filters.filters.hyphenate.call(context, 'apple  blackberry   cherry');
                result.should.equal('apple-blackberry-cherry');
            });

        });

        describe('url', () => {
            it('prepends the baseUrl to relative paths', () => {
                context.ctx.baseUrl = '/base';

                let result = filters.filters.url.call(context, './path');
                result.should.equal('/base/path');

                result = filters.filters.url.call(context, 'path');
                result.should.equal('/base/path');
            });

            it('returns path if baseUrl is not set', () => {
                let result = filters.filters.url.call(context, './path');
                result.should.equal('./path');

                result = filters.filters.url.call(context, 'path');
                result.should.equal('path');
            });

            it('does not prepend the baseUrl to absolute paths', () => {
                context.ctx.baseUrl = '/base';
                let result = filters.filters.url.call(context, '/path');
                result.should.equal('/path');
            });
        });

        describe('filter', () => {
            it('returns null if null passed', () => {
                let result = filters.filters.filter(null);
                expect(result).to.be.null;
            });

            it('returns string if string passed', () => {
                let result = filters.filters.filter('test');
                result.should.equal('test');
            });

            it('filters an array by truthy values', () => {
                let result = filters.filters.filter([1, 'string', null, undefined, false, {}, 0]);
                result.should.eql([
                    1,
                    'string',
                    {}
                ]);
            });

            it('filters an array by a string', () => {
                let result = filters.filters.filter([
                    { foo: 'bar', boo: 'baz' },
                    { fiz: 'buz', boo: false },
                    { buz: 'foo' },
                    { },
                    null
                ], 'boo');
                result.should.eql([
                    { foo: 'bar', boo: 'baz' }
                ]);
            });

            it('filters an array by an object of values', () => {
                let result = filters.filters.filter([
                    { foo: 'bar', boo: 'baz' },
                    { fiz: 'buz', boo: false },
                    { buz: 'foo' },
                    { },
                    null
                ], { 'boo': false });
                result.should.eql([
                    { fiz: 'buz', boo: false }
                ]);
            });

            it('filters an object by truthy values', () => {
                let result = filters.filters.filter({
                    first: { foo: 'bar', boo: 'baz' },
                    second: { fiz: 'buz', boo: false },
                    third: { buz: 'foo' },
                    fourth: { },
                    fith: null
                });
                result.should.eql({
                    first: { foo: 'bar', boo: 'baz' },
                    second: { fiz: 'buz', boo: false },
                    third: { buz: 'foo' },
                    fourth: { }
                });
            });

            it('filters an object by a string', () => {
                let result = filters.filters.filter({
                    first: { foo: 'bar', boo: 'baz' },
                    second: { fiz: 'buz', boo: false },
                    third: { buz: 'foo' },
                    fourth: { },
                    fith: null
                }, 'boo');
                result.should.eql({
                    first: { foo: 'bar', boo: 'baz' }
                });
            });

            it('filters an object by an object of values', () => {
                let result = filters.filters.filter({
                    first: { foo: 'bar', boo: 'baz' },
                    second: { fiz: 'buz', boo: false },
                    third: { buz: 'foo' },
                    fourth: { },
                    fith: null
                }, { 'boo': false });
                result.should.eql({
                    second: { fiz: 'buz', boo: false }
                });
            });
        });

        describe('jsonStringify', () => {
            it('returns json stringified object', () => {
                let obj = {
                    foo: { bar: [ 'baz' ] }
                };
                let result = filters.filters.jsonStringify.call(context, obj);
                result.should.equal('{\n  "foo": {\n    "bar": [\n      "baz"\n    ]\n  }\n}');
            });
        });
    });
});
