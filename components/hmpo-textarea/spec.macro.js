'use strict';

describe('hmpoTextarea', () => {
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
        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        expect($label.text().trim()).to.equal('[fields.my-input.label]');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('renders with value', () => {
        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.text()).to.equal('abc123');
    });

    it('renders with rows', () => {
        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input', rows: 10 }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.attr('rows')).to.equal('10');
    });

    it('renders with no aria-required if required', () => {
        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.attr('aria-required')).to.be.undefined;
    });

    it('renders with aria-required=false if not required', () => {
        locals.options.fields['my-input'].validate = [];
        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.attr('aria-required')).to.equal('false');
    });

    it('renders with max-length from validator', () => {
        locals.options.fields['my-input'].validate = [ { type: 'maxlength', arguments: 5 } ];

        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.attr('maxlength')).to.equal('5');
    });

    it('renders with errorValue if available', () => {
        locals.errorValues = {
            'my-input': 'def456'
        };

        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-textarea');
        expect($component.text()).to.equal('def456');
    });

    it('renders error message if available', () => {
        locals.errors = {
            'my-input': { key: 'my-input', type: 'validator' }
        };

        const $ = render({ component: 'hmpoTextarea', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('#my-input-error');
        expect($component.text().trim()).to.equal('[govuk.error]: [fields.my-input.validation.validator]');
    });

});
