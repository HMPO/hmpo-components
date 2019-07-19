'use strict';

describe('hmpoText', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required'
                    }
                }
            },
            values: {
                'my-input': 'abc123'
            }
        };
    });

    it('renders with id', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        expect($label.text().trim()).to.equal('[fields.my-input.label]');
        expect($label.attr('id')).to.equal('my-input-label');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('does not render hint if there is no localisation', () => {
        locals.translate = sinon.stub();
        locals.translate.returnsArg(0);
        locals.translate.withArgs('fields.my-input.hint').returns(undefined);

        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        expect($label.text().trim()).to.equal('fields.my-input.label');
        expect($label.attr('id')).to.equal('my-input-label');
        const $hint = $('.govuk-hint');
        expect($hint.length).to.equal(0);
    });

    it('renders with value', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('value')).to.equal('abc123');
    });

    it('renders with aria-required', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('aria-required')).to.equal('true');
    });

    it('renders with max-length from validator', () => {
        locals.options.fields['my-input'].validate = [ { type: 'maxlength', arguments: 5 } ];

        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('maxlength')).to.equal('5');
    });

    it('renders with max-length from validator array', () => {
        locals.options.fields['my-input'].validate = [ { type: 'maxlength', arguments: [ 5 ] } ];

        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('maxlength')).to.equal('5');
    });

    it('renders with errorValue if available', () => {
        locals.errorValues = {
            'my-input': 'def456'
        };

        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('value')).to.equal('def456');
    });

    it('renders error message if available', () => {
        locals.errors = {
            'my-input': { key: 'my-input', type: 'validator' }
        };

        const $ = render({ component: 'hmpoText', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('#my-input-error');
        expect($component.text().trim()).to.equal('[govuk.error]: [fields.my-input.validation.validator]');
    });

    it('renders label as header', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('h1 .govuk-label');
        expect($label.attr('class')).to.equal('govuk-label govuk-label--l');
    });

    it('renders with nopaste', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input', isPageHeading: true, noPaste: true }, ctx: true }, locals);
        const $label = $('.govuk-input');
        expect($label.attr('class')).to.equal('govuk-input govuk-!-width-one-half js-nopaste');
    });

    it('renders with no extra classes', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('.govuk-input');
        expect($label.attr('class')).to.equal('govuk-input govuk-!-width-one-half');
    });

    it('renders with extra classes', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input', isPageHeading: true, classes: 'test' }, ctx: true }, locals);
        const $label = $('.govuk-input');
        expect($label.attr('class')).to.equal('govuk-input test');
    });

    it('renders with extra classes and noPaste', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input', isPageHeading: true, classes: 'test', noPaste: true }, ctx: true }, locals);
        const $label = $('.govuk-input');
        expect($label.attr('class')).to.equal('govuk-input test js-nopaste');
    });

    it('renders with noPaste set to false', () => {
        const $ = render({ component: 'hmpoText', params: { id: 'my-input', isPageHeading: true, noPaste: false }, ctx: true }, locals);
        const $label = $('.govuk-input');
        expect($label.attr('class')).to.equal('govuk-input govuk-!-width-one-half');
    });

});
