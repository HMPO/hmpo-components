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


    });
});
