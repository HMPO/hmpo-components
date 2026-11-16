'use strict';

describe('hmpoAutocomplete', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required',
                        items: [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
                    }
                }
            }
        };
    });

    it('renders with name and id', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('select');

        expect($component.attr('id')).to.equal('my-input');
        expect($component.attr('name')).to.equal('my-input');
    });

    it('marks the select for the bundled autocomplete script', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('select').attr('data-module')).to.equal('autocomplete');
    });

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        const $hint = $('.govuk-hint');

        expect($label.text().trim()).to.equal('[fields.my-input.label]');
        expect($label.attr('id')).to.equal('my-input-label');

        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('associates the label and hint with the select', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('.govuk-label').attr('for')).to.equal($('select').attr('id'));
        expect($('.govuk-hint').attr('id')).to.equal('my-input-hint');
        expect($('select').attr('aria-describedby').split(/\s+/)).to.include('my-input-hint');
    });

    it('omits the hint and its accessibility reference when no translation exists', () => {
        locals.translate = sinon.stub();
        locals.translate.returnsArg(0);
        locals.translate.withArgs('fields.my-input.hint').returns(undefined);

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('.govuk-hint').length).to.equal(0);
        expect($('select').attr('aria-describedby')).to.be.undefined;
    });

    it('renders label as header', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('h1 .govuk-label');
        expect($label.attr('class')).to.equal('govuk-label govuk-label--l');
    });

    it('renders custom label text and classes as a page heading', () => {
        const $ = render({
            component: 'hmpoAutocomplete',
            params: {
                id: 'my-input',
                isPageHeading: true,
                label: { text: 'Country', classes: 'govuk-label--m' }
            },
            ctx: true
        }, locals);

        const $label = $('h1 .govuk-label');
        expect($label.length).to.equal(1);
        expect($label.text().trim()).to.equal('Country');
        expect($label.hasClass('govuk-label--m')).to.be.true;
        expect($label.attr('id')).to.equal('my-input-label');
        expect($label.attr('for')).to.equal('my-input');
    });

    it('renders a custom label without a page heading', () => {
        const $ = render({
            component: 'hmpoAutocomplete',
            params: { id: 'my-input', isPageHeading: false, label: { classes: 'govuk-label--m' } },
            ctx: true
        }, locals);

        expect($('h1').length).to.equal(0);
        expect($('.govuk-label').attr('class')).to.equal('govuk-label govuk-label--m');
    });

    it('renders form group classes', () => {
        const $ = render({
            component: 'hmpoAutocomplete',
            params: { id: 'my-input', formGroup: { classes: 'country-select' } },
            ctx: true
        }, locals);

        expect($('.govuk-form-group').hasClass('country-select')).to.be.true;
    });

    it('disallows an empty option and shows no-options-found feedback by default', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('option').eq(0).attr('disabled')).to.equal('disabled');
        expect($('select').attr('data-show-no-options-found')).to.equal('true');
    });

    it('allows an empty option and disables no-options-found feedback when configured', () => {
        const $ = render({
            component: 'hmpoAutocomplete',
            params: { id: 'my-input', allowEmpty: true, showNoOptionsFound: false },
            ctx: true
        }, locals);

        expect($('option').eq(0).attr('value')).to.equal('');
        expect($('option').eq(0).text().trim()).to.equal('');
        expect($('option').eq(0).attr('disabled')).to.be.undefined;
        expect($('select').attr('data-show-no-options-found')).to.equal('false');
    });

    it('accepts autocomplete options from field configuration', () => {
        Object.assign(locals.options.fields['my-input'], {
            allowEmpty: true,
            showNoOptionsFound: false,
            formGroup: { classes: 'country-select' }
        });

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('option').eq(0).attr('disabled')).to.be.undefined;
        expect($('select').attr('data-show-no-options-found')).to.equal('false');
        expect($('.govuk-form-group').hasClass('country-select')).to.be.true;
    });

    it('prefers explicit autocomplete options over field configuration', () => {
        Object.assign(locals.options.fields['my-input'], {
            allowEmpty: true,
            showNoOptionsFound: false
        });

        const $ = render({
            component: 'hmpoAutocomplete',
            params: { id: 'my-input', allowEmpty: false, showNoOptionsFound: true },
            ctx: true
        }, locals);

        expect($('option').eq(0).attr('disabled')).to.equal('disabled');
        expect($('option').eq(0).text().trim()).to.equal('Select an option');
        expect($('select').attr('data-show-no-options-found')).to.equal('true');
    });

    it('selects a saved value using item text when no item value is provided', () => {
        locals.values = { 'my-input': 'b' };

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('option[value="b"]').attr('selected')).to.equal('selected');
        expect($('option[value="a"]').attr('selected')).to.be.undefined;
    });

    it('selects a saved value using an explicit item value', () => {
        locals.options.fields['my-input'].items = [{ value: 'GB', text: 'United Kingdom' }];
        locals.values = { 'my-input': 'GB' };

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('option[value="GB"]').attr('selected')).to.equal('selected');
        expect($('option[value="GB"]').text().trim()).to.equal('United Kingdom');
    });

    it('prefers the submitted error value over the saved value', () => {
        locals.values = { 'my-input': 'a' };
        locals.errorValues = { 'my-input': 'c' };

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('option[value="c"]').attr('selected')).to.equal('selected');
        expect($('option[value="a"]').attr('selected')).to.be.undefined;
    });

    it('preserves an empty submitted error value rather than restoring the saved value', () => {
        locals.values = { 'my-input': 'b' };
        locals.errorValues = { 'my-input': '' };

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('option[value=""]').attr('selected')).to.equal('selected');
        expect($('option[value="b"]').attr('selected')).to.be.undefined;
    });

    it('renders the error message, styling and accessibility references when an error is present', () => {
        locals.errors = {
            'my-input': { key: 'my-input', type: 'validator' }
        };

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('select');
        expect($('#my-input-error').text().trim()).to.equal('[govuk.error]: [fields.my-input.validation.validator]');
        expect($('.govuk-form-group').hasClass('govuk-form-group--error')).to.be.true;
        expect($component.hasClass('govuk-select--error')).to.be.true;
        expect($component.attr('aria-describedby').split(/\s+/)).to.include.members(['my-input-hint', 'my-input-error']);
    });

    it('renders only the default empty option when no items are configured', () => {
        locals.options.fields['my-input'].items = [];

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        expect($('select').length).to.equal(1);
        expect($('option').length).to.equal(1);
        expect($('option').attr('value')).to.equal('');
        expect($('option').text().trim()).to.equal('Select an option');
        expect($('option').attr('disabled')).to.equal('disabled');
    });

    it('renders items with matching names and labels', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        const $itemDefault = $('option').eq(0);
        expect($itemDefault.attr('value')).to.equal('');
        expect($itemDefault.text().trim()).to.equal('Select an option');

        const $item1 = $('option').eq(1);
        expect($item1.attr('value')).to.equal('a');
        expect($item1.text().trim()).to.equal('a');

        const $item2 = $('option').eq(2);
        expect($item2.attr('value')).to.equal('b');
        expect($item2.text().trim()).to.equal('b');

        const $item3 = $('option').eq(3);
        expect($item3.attr('value')).to.equal('c');
        expect($item3.text().trim()).to.equal('c');
    });

    it('renders items with given names and labels', () => {
        locals.options.fields['my-input'].items = [
            { value: 'a', text: 'x' },
            { value: 'b', text: 'y' },
            { value: 'c', text: 'z' }
        ];

        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input', }, ctx: true }, locals);

        const $itemDefault = $('option').eq(0);
        expect($itemDefault.attr('value')).to.equal('');
        expect($itemDefault.text().trim()).to.equal('Select an option');

        const $item1 = $('option').eq(1);
        expect($item1.attr('value')).to.equal('a');
        expect($item1.text().trim()).to.equal('x');

        const $item2 = $('option').eq(2);
        expect($item2.attr('value')).to.equal('b');
        expect($item2.text().trim()).to.equal('y');

        const $item3 = $('option').eq(3);
        expect($item3.attr('value')).to.equal('c');
        expect($item3.text().trim()).to.equal('z');
    });
});