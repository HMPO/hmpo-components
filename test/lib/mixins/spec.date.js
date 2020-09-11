'use strict';

const DateMixin = require('../../../lib/mixins/date');
const _ = require('underscore');

describe('Date Mixin', () => {

    let BaseController, Controller, instance;
    let req, res, next, callback;
    let clock;
    let options;

    beforeEach(() => {
        options = {
            route: '/index',
            template: 'index',
            fields: {
                'date1': {
                    autocomplete: 'mydate',
                    validate: [
                        'required',
                        'date'
                    ]
                },
                'date2': {
                    autocomplete: 'off',
                    validate: 'date'
                },
                'date2-year': {
                    autocomplete: 'mycomplete',
                    validate: 'part-validator'
                },
                'town': {},
                'country': {}
            }
        };

        req = {
            form: {
                options
            },
            sessionModel: {
                get: sinon.stub()
            }
        };
        res = {};
        next = sinon.stub();
        callback = sinon.stub();

        BaseController = class {};
        Controller = DateMixin(BaseController);
        instance = new Controller();
        instance.Error = class {
            constructor(key, options) {
                this.key = key;
                _.extend(this, options);
            }
        };

        clock = sinon.useFakeTimers(1425918611263); // approx. 2015-03-09T16:30:00Z;
    });

    afterEach(() => {
        clock.restore();
    });

    it('exports a function', () => {
        DateMixin.should.be.a('function');
    });

    it('should extend the BaseControllerr', () => {
        instance.should.be.an.instanceOf(BaseController);
    });

    describe('configure', () => {
        beforeEach(() => {
            BaseController.prototype.configure = sinon.stub();
            instance.configureDateField = sinon.stub();
        });

        it('should set a list of date fields by usage of date validator', () =>{
            instance.configure(req, res, next);
            options.dateFields.should.eql(['date1', 'date2']);
        });

        it('should run configureDateField for each date field', () =>{
            instance.configure(req, res, next);
            instance.configureDateField.should.have.been.calledTwice;
            instance.configureDateField.should.have.been.calledWithExactly(req, 'date1');
            instance.configureDateField.should.have.been.calledWithExactly(req, 'date2');
        });

        it('should call the super configure method', () =>{
            instance.configure(req, res, next);
            BaseController.prototype.configure.should.have.been.calledWithExactly(req, res, next);
        });
    });

    describe('configureDateField', () => {
        it('should add date part fields for date field', () => {
            instance.configureDateField(req, 'date1');
            req.form.options.fields.should.contain.all.keys([
                'date1-day',
                'date1-month',
                'date1-year'
            ]);
        });

        it('should prepend date part validators to date part field', () => {
            instance.configureDateField(req, 'date2');
            req.form.options.fields['date2-year'].validate.should.eql([
                'numeric',
                'date-year',
                'part-validator'
            ]);
        });

        it('should prepend required validator if the date field is required', () => {
            instance.configureDateField(req, 'date1');
            req.form.options.fields['date1-year'].validate.should.eql([
                'required',
                'numeric',
                'date-year'
            ]);
        });

        it('should set the errorGroup to the date field', () => {
            instance.configureDateField(req, 'date1');
            req.form.options.fields['date1-year'].errorGroup.should.equal('date1');
        });

        it('should set the autocomplete values of the parent date field', () => {
            instance.configureDateField(req, 'date1');
            req.form.options.fields['date1-day'].autocomplete.should.equal('mydate-day');
            req.form.options.fields['date1-month'].autocomplete.should.equal('mydate-month');
            req.form.options.fields['date1-year'].autocomplete.should.equal('mydate-year');
        });

        it('should override the autocomplete values specific part configs', () => {
            instance.configureDateField(req, 'date2');
            req.form.options.fields['date2-day'].autocomplete.should.equal('off');
            req.form.options.fields['date2-month'].autocomplete.should.equal('off');
            req.form.options.fields['date2-year'].autocomplete.should.equal('mycomplete');
        });
    });

    describe('getValues', () => {
        beforeEach(() => {
            options.dateFields = ['date1', 'date2'];
            BaseController.prototype.getValues = sinon.stub().yields(null, {
                'date1': '1980-04-23',
                'date2': '2017-10-04'
            });
        });

        it('should parse out date values if no raw values are present', () => {
            req.sessionModel.get.withArgs('errorValues').returns(undefined);
            instance.getValues(req, res, callback);
            callback.should.have.been.calledWithExactly(null, {
                'date1': '1980-04-23',
                'date1-day': '23',
                'date1-month': '04',
                'date1-year': '1980',
                'date2': '2017-10-04',
                'date2-day': '04',
                'date2-month': '10',
                'date2-year': '2017'
            });
        });

        it('should use raw values if present instead of using date values', () => {
            req.sessionModel.get.withArgs('errorValues').returns({
                'date1-day-raw': '1',
                'date1-month-raw': '1',
                'date1-year-raw': '1900'
            });
            options.dateFields = ['date1'];
            BaseController.prototype.getValues.yields(null, {
                'date1': '1980-04-23',
            });
            instance.getValues(req, res, callback);
            callback.should.have.been.calledWithExactly(null, {
                'date1': '1980-04-23',
                'date1-day': '1',
                'date1-month': '1',
                'date1-year': '1900',
            });
        });

        it('should not populate blank date values with defaults', () => {
            options.dateFields = ['date1'];
            BaseController.prototype.getValues.yields(null, {
                'date1': '1980--'
            });
            instance.getValues(req, res, callback);
            callback.should.have.been.calledWithExactly(null, {
                'date1': '1980--',
                'date1-day': '',
                'date1-month': '',
                'date1-year': '1980'
            });
        });

        it('should not populate parts of no valud exists', () => {
            options.dateFields = ['date1'];
            BaseController.prototype.getValues.yields(null, {});
            instance.getValues(req, res, callback);
            callback.should.have.been.calledWithExactly(null, {});
        });

        it('should call callback once in case of error', () => {
            let err = new Error('msg');
            BaseController.prototype.getValues.yields(err);
            instance.getValues(req, res, callback);
            callback.should.have.been.calledOnce;
            callback.should.have.been.calledWithExactly(err);
        });

    });

    describe('process', () => {
        beforeEach(() => {
            options.dateFields =  ['date1', 'date2'];
            BaseController.prototype.process = sinon.stub();
            instance.processDateField = sinon.stub();
        });

        it('should run processDateField for each date field', () =>{
            instance.process(req, res, next);
            instance.processDateField.should.have.been.calledTwice;
            instance.processDateField.should.have.been.calledWithExactly(req, 'date1');
            instance.processDateField.should.have.been.calledWithExactly(req, 'date2');
        });

        it('should call the super process method', () =>{
            instance.process(req, res, next);
            BaseController.prototype.process.should.have.been.calledWithExactly(req, res, next);
        });
    });

    describe('processDateField', () => {
        beforeEach(() => {
            req.form.values = {
                'date1-day': '24',
                'date1-month': '10',
                'date1-year': '1982'
            };
        });

        it('should use separate input fields for year, month and day', () => {
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1982-10-24');
        });

        it('should pad date day with leading zero if required', () => {
            req.form.values['date1-day'] = '1';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1982-10-01');
        });

        it('should pad date month with leading zero if required', () => {
            req.form.values['date1-month'] = '1';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1982-01-24');
        });

        it('should leave blank sections of date blank for validation', () => {
            // moment would fill in missing values with 01/0001 respectively
            req.form.values['date1-day'] = '';
            req.form.values['date1-month'] = '';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1982--');
        });

        it('should leave field blank if no values are entered', () => {
            req.form.values['date1-day'] = '';
            req.form.values['date1-month'] = '';
            req.form.values['date1-year'] = '';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('');
        });

        it('should default day to "01" if field is set up as "inexact"', () => {
            options.fields['date1'].inexact = true;
            req.form.values['date1-day'] = '';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1982-10-01');
        });

        it('should handle two digit years', () => {
            req.form.values['date1-year'] = '14';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('2014-10-24');

            req.form.values['date1-year'] = '16';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1916-10-24');
        });

        it('supports offset option when expanding two digit year values', () => {
            options.fields['date1'].offset = 20;

            req.form.values['date1-year'] = '34';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('2034-10-24');

            req.form.values['date1-year'] = '36';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('1936-10-24');
        });

        it('should leave field blank if set as inexact and no month or year values are entered', () => {
            options.fields['date1'].inexact = true;
            req.form.values['date1-month'] = '';
            req.form.values['date1-year'] = '';
            instance.processDateField(req, 'date1');
            req.form.values['date1'].should.equal('');
        });

        it('should set the raw values for day, month, and year', () => {
            req.form.values['date1-day'] = '01';
            req.form.values['date1-month'] = '02';
            req.form.values['date1-year'] = '1900';
            instance.processDateField(req, 'date1');
            req.form.values['date1-day-raw'].should.equal('01');
            req.form.values['date1-month-raw'].should.equal('02');
            req.form.values['date1-year-raw'].should.equal('1900');
        });
    });

    describe('validateFields', () => {
        let errors;

        beforeEach(() => {
            errors = {};
            options.dateFields =  ['date1', 'date2'];
            BaseController.prototype.validateFields = sinon.stub().yields(errors);
            instance.validateDateField = sinon.stub();
        });

        it('should call the super validateFields method', () =>{
            instance.validateFields(req, res, next);
            BaseController.prototype.validateFields.should.have.been.calledWithExactly(req, res, sinon.match.func);
        });

        it('should run validateDateField for each date field', () =>{
            instance.validateFields(req, res, next);
            instance.validateDateField.should.have.been.calledTwice;
            instance.validateDateField.should.have.been.calledWithExactly(req, 'date1', errors);
            instance.validateDateField.should.have.been.calledWithExactly(req, 'date2', errors);
        });

        it('should call the super validateFields method', () => {
            instance.validateFields(req, res, next);
            BaseController.prototype.validateFields.should.have.been.calledWithExactly(req, res, sinon.match.func);
        });
    });

    describe('validateDateField', () => {
        let errors;

        beforeEach(function () {
            errors = {};
            req.form.values = {
                'date1': '2017-01-02'
            };
        });

        it('should not validate if the field is empty - this should be handled by a required validator', () => {
            req.form.values = {};
            errors = {};

            instance.validateDateField(req, 'date1', errors);

            errors.should.eql({});
        });

        describe('sets required error if the parts have required errors', () => {

            it('should create a new error if the day is missing', () => {
                errors = {
                    'other': { type: 'required'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'required'}
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('required-day');
                errors['date1'].field.should.equal('date1-day');
            });

            it('should create the first part required error if the day and month are missing', () => {
                errors = {
                    'other': { type: 'required'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'required'},
                    'date1-month': { errorGroup: 'date1', type: 'required'}
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('required-day');
                errors['date1'].field.should.equal('date1-day');
            });

            it('should create a new required error if all three parts are missing', () => {
                errors = {
                    'other': { type: 'other'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'required'},
                    'date1-month': { errorGroup: 'date1', type: 'required'},
                    'date1-year': { errorGroup: 'date1', type: 'required'}
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('required');
                errors['date1'].field.should.equal('date1-day');
            });

            it('should create a new required error if inexact and the month and year parts are missing', () => {
                errors = {
                    'other': { type: 'other'},
                    'date1': { type: 'original' },
                    'date1-month': { errorGroup: 'date1', type: 'required'},
                    'date1-year': { errorGroup: 'date1', type: 'required'}
                };

                options.fields['date1'].inexact = true;

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('required');
                errors['date1'].field.should.equal('date1-day');
            });
        });

        describe('sets numeric error if the parts have numeric errors', () => {

            it('should leaving existing error if the value is empty', () => {
                errors = {
                    'other': { type: 'numeric'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'numeric'}
                };
                req.form.values['date1']= '';

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('original');
            });

            it('should create a new error if letters are used in the day', () => {
                errors = {
                    'other': { type: 'other'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'numeric'}
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('numeric-day');
                errors['date1'].field.should.equal('date1-day');
            });

            it('should create a new error if letters are used in the month', () => {
                errors = {
                    'other': { type: 'other'},
                    'date1': { type: 'original' },
                    'date1-month': { errorGroup: 'date1', type: 'numeric'}
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('numeric-month');
                errors['date1'].field.should.equal('date1-month');
            });

            it('should create a new error if letters are used in multiple parts of the date', () => {
                errors = {
                    'other': { type: 'other'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'numeric'},
                    'date1-month': { errorGroup: 'date1', type: 'numeric'},
                    'date1-year': { errorGroup: 'date1', type: 'numeric'}
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('numeric');
                errors['date1'].field.should.equal('date1-day');
            });

            it('should not set a date field error if an error is not numeric', () => {
                errors = {
                    'other': { type: 'other'},
                    'date1': { type: 'original' },
                    'date1-day': { errorGroup: 'date1', type: 'other' }
                };

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].type.should.equal('original');
            });

            it('should not create a new error if date is not a valid format (eg if year is missing)', () => {
                req.form.values['date1'] = '-10-22';

                instance.validateDateField(req, 'date1', errors);

                errors.should.eql({});
            });
        });

        describe('checks validity of numerical values in date fields', () => {
            it('should creates a new error if the day number is invalid for the month', () => {
                req.form.values['date1'] = '1970-02-30';

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].should.eql(new instance.Error(
                    'date1-day',
                    { type: 'date-day', errorGroup: 'date1' },
                    req));
                errors['date1-day'].should.eql(new instance.Error(
                    'date1-day',
                    { type: 'date-day', errorGroup: 'date1' },
                    req));
            });

            it('should create a new error if the day number is invalid', () => {
                req.form.values['date1'] = '1970-11-33';

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].should.eql(new instance.Error(
                    'date1-day',
                    { type: 'date-day', errorGroup: 'date1' },
                    req));
                errors['date1-day'].should.eql(new instance.Error(
                    'date1-day',
                    { type: 'date-day', errorGroup: 'date1' },
                    req));
            });

            it('should create a new error if the month number is invalid', () => {
                req.form.values['date1'] = '1970-13-22';

                instance.validateDateField(req, 'date1', errors);

                errors['date1'].should.eql(new instance.Error(
                    'date1-month',
                    { type: 'date-month', errorGroup: 'date1' },
                    req));
                errors['date1-month'].should.eql(new instance.Error(
                    'date1-month',
                    { type: 'date-month', errorGroup: 'date1' },
                    req));
            });

            it('should not create a new error if moment doesnt report year day or month', () => {
                req.form.values['date1'] = '2017-10-22';

                instance.validateDateField(req, 'date1', errors);

                errors.should.eql({});
            });
        });
    });

    describe('saveValues', () => {
        beforeEach(() => {
            BaseController.prototype.saveValues = sinon.stub();
            options.dateFields = ['date1', 'date2'];
            req.form.values = {
                'date1': '1900-02-01',
                'date1-day': '01',
                'date1-month': '02',
                'date1-year': '1900',
                'date1-day-raw': '01',
                'date1-month-raw': '02',
                'date1-year-raw': '1900',
                'date2': '2019-02-01',
                'date2-day': '01',
                'date2-month': '02',
                'date2-year': '2019',
                'date2-day-raw': '01',
                'date2-month-raw': '02',
                'date2-year-raw': '2019',
                'other': 'value'
            };
        });

        it('should remove the parts and raw parts of each date field', () =>{
            instance.saveValues(req, res, next);
            req.form.values.should.eql({
                'date1': '1900-02-01',
                'date2': '2019-02-01',
                'other': 'value'
            });
        });

        it('should call the super saveValues method', () =>{
            instance.saveValues(req, res, next);
            BaseController.prototype.saveValues.should.have.been.calledWithExactly(req, res, next);
        });
    });

});
