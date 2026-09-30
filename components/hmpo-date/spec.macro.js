'use strict';

describe('hmpoDate', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required',
                        showMultipleErrors: true
                    }
                }
            }
        };
    });

    it('renders inputs with ids and names', () => {
        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);

        const $day = $('.govuk-input').eq(0);
        expect($day.attr('id')).to.equal('my-input-day');
        expect($day.attr('name')).to.equal('my-input-day');
        expect($day.attr('type')).to.equal('text');
        expect($day.attr('maxlength')).to.equal('2');
        const $month = $('.govuk-input').eq(1);
        expect($month.attr('id')).to.equal('my-input-month');
        expect($month.attr('name')).to.equal('my-input-month');
        expect($month.attr('type')).to.equal('text');
        expect($month.attr('maxlength')).to.equal('2');
        const $year = $('.govuk-input').eq(2);
        expect($year.attr('id')).to.equal('my-input-year');
        expect($year.attr('name')).to.equal('my-input-year');
        expect($year.attr('type')).to.equal('text');
        expect($year.attr('maxlength')).to.equal('4');
    });

    it('sets id on fieldset', () => {
        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);
        const $fieldset = $('.govuk-fieldset');
        expect($fieldset.attr('id')).to.equal('my-input-fieldset');
    });

    it('renders legend as header', () => {
        const $ = render({ component: 'hmpoDate', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading">[fields.my-input.legend]</h1>');
    });

    it('renders with header label localisation instead of legend when legend is not present', () => {
        const $ = render.withLocale({ component: 'hmpoDate', params: {id: 'labeltest', isPageHeading: true, label: { attributes: { 'data-test': 'test value' }}}, ctx: true}, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading"><span data-test="test value">Label text</span></h1>');
    });

    it('renders all child validation errors', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'required-year',
                field: 'my-input-year',
                errorGroup: 'my-input'
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'date-month',
                field: 'my-input-month',
                errorGroup: 'my-input'
            },
            'my-input-year': {
                key: 'my-input-year',
                type: 'required',
                field: 'my-input-year',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);
        const $errors = $('.govuk-error-message');

        expect($errors).to.have.length(2);
        expect($errors.eq(0).attr('id')).to.equal('my-input-month-error');
        expect($errors.eq(1).attr('id')).to.equal('my-input-year-error');
        expect($('.govuk-fieldset').attr('aria-describedby')).to.equal('my-input-hint my-input-month-error my-input-year-error');
        expect($('#my-input-month').hasClass('govuk-input--error')).to.equal(true);
        expect($('#my-input-year').hasClass('govuk-input--error')).to.equal(true);
    });

    it('renders only the parent error unless showMultipleErrors is enabled', () => {
        delete locals.options.fields['my-input'].showMultipleErrors;
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'required-year',
                field: 'my-input-year',
                errorGroup: 'my-input'
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'date-month',
                field: 'my-input-month',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('.govuk-error-message')).to.have.length(1);
        expect($('.govuk-error-message').attr('id')).to.equal('my-input-error');
    });

    it('renders only the aggregate error for an all-empty required date', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'required',
                errorGroup: 'my-input',
                aggregate: true
            },
            'my-input-day': {
                key: 'my-input-day',
                type: 'required',
                field: 'my-input-day',
                errorGroup: 'my-input'
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'required',
                field: 'my-input-month',
                errorGroup: 'my-input'
            },
            'my-input-year': {
                key: 'my-input-year',
                type: 'required',
                field: 'my-input-year',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('.govuk-error-message')).to.have.length(1);
        expect($('.govuk-error-message').attr('id')).to.equal('my-input-error');
    });

    it('renders a parent validation error without child errors in the fieldset', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'custom-date-validation',
                errorGroup: 'my-input',
                aggregate: true
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);
        const $fieldset = $('.govuk-fieldset');

        expect($fieldset.find('.govuk-error-message')).to.have.length(1);
        expect($fieldset.find('.govuk-error-message').attr('id')).to.equal('my-input-error');
    });

    it('renders only the aggregate error when all date parts fail validation', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'date',
                field: 'my-input-day',
                errorGroup: 'my-input',
                aggregate: true
            },
            'my-input-day': {
                key: 'my-input-day',
                type: 'date-day',
                field: 'my-input-day',
                errorGroup: 'my-input'
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'date-month',
                field: 'my-input-month',
                errorGroup: 'my-input'
            },
            'my-input-year': {
                key: 'my-input-year',
                type: 'date-year',
                field: 'my-input-year',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('.govuk-error-message')).to.have.length(1);
        expect($('.govuk-error-message').attr('id')).to.equal('my-input-error');
        expect($('#my-input-day').hasClass('govuk-input--error')).to.equal(true);
        expect($('#my-input-month').hasClass('govuk-input--error')).to.equal(true);
        expect($('#my-input-year').hasClass('govuk-input--error')).to.equal(true);
    });

    it('styles both inexact date inputs for an aggregate numeric error', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'numeric',
                field: 'my-input-month',
                errorGroup: 'my-input',
                aggregate: true
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'numeric-month',
                field: 'my-input-month',
                errorGroup: 'my-input'
            },
            'my-input-year': {
                key: 'my-input-year',
                type: 'numeric-year',
                field: 'my-input-year',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input', inexact: true }, ctx: true }, locals);

        expect($('.govuk-error-message')).to.have.length(1);
        expect($('.govuk-error-message').attr('id')).to.equal('my-input-error');
        expect($('#my-input-month').hasClass('govuk-input--error')).to.equal(true);
        expect($('#my-input-year').hasClass('govuk-input--error')).to.equal(true);
    });

    it('renders only the aggregate error when all date parts fail numeric validation', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'numeric',
                field: 'my-input-day',
                errorGroup: 'my-input',
                aggregate: true
            },
            'my-input-day': {
                key: 'my-input-day',
                type: 'numeric-day',
                field: 'my-input-day',
                errorGroup: 'my-input'
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'numeric-month',
                field: 'my-input-month',
                errorGroup: 'my-input'
            },
            'my-input-year': {
                key: 'my-input-year',
                type: 'numeric-year',
                field: 'my-input-year',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('.govuk-error-message')).to.have.length(1);
        expect($('.govuk-error-message').attr('id')).to.equal('my-input-error');
        expect($('#my-input-day').hasClass('govuk-input--error')).to.equal(true);
        expect($('#my-input-month').hasClass('govuk-input--error')).to.equal(true);
        expect($('#my-input-year').hasClass('govuk-input--error')).to.equal(true);
    });

    it('prefers child errors over a parent error for each date part', () => {
        locals.errors = {
            'my-input': {
                key: 'my-input',
                type: 'numeric-year',
                field: 'my-input-day',
                errorGroup: 'my-input'
            },
            'my-input-day': {
                key: 'my-input-day',
                type: 'numeric-day',
                field: 'my-input-day',
                errorGroup: 'my-input'
            },
            'my-input-month': {
                key: 'my-input-month',
                type: 'numeric-month',
                field: 'my-input-month',
                errorGroup: 'my-input'
            },
            'my-input-year': {
                key: 'my-input-year',
                type: 'numeric-year',
                field: 'my-input-year',
                errorGroup: 'my-input'
            }
        };

        const $ = render({ component: 'hmpoDate', params: { id: 'my-input' }, ctx: true }, locals);
        const $errors = $('.govuk-error-message');

        expect($errors).to.have.length(3);
        expect($errors.eq(0).attr('id')).to.equal('my-input-day-error');
        expect($errors.eq(1).attr('id')).to.equal('my-input-month-error');
        expect($errors.eq(2).attr('id')).to.equal('my-input-year-error');
    });

});
