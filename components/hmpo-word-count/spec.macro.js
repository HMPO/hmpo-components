'use strict';

describe('hmpoWordCount', () => {
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
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $label = $('.govuk-label');
        const $hint = $('.govuk-hint');

        expect($label.text().trim()).to.equal('[fields.my-input.label]');
        expect($label.attr('id')).to.equal('my-input-label');
        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('does not render extra hint if there is no localisatio, but will render character count hint', () => {
        locals.translate = sinon.stub();
        locals.translate.returnsArg(0);
        locals.translate.withArgs('fields.my-input.hint').returns(undefined);

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $label = $('.govuk-label');
        const $hint = $('.govuk-hint');

        expect($label.text().trim()).to.equal('fields.my-input.label');
        expect($label.attr('id')).to.equal('my-input-label');
        expect($hint.length).to.equal(1);
    });

    it('renders with value', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.text()).to.equal('abc123');
    });

    it('renders with aria-required=false if validator is not required', () => {
        locals.options.fields['my-input'].validate = undefined;

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.attr('aria-required')).to.equal('false');
    });

    it('renders with no aria-required if validator is required', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.attr('aria-required')).to.be.undefined;
    });

    it('renders with no aria-required if validators contains required', () => {
        locals.options.fields['my-input'].validate = [ 'required' ];

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.attr('aria-required')).to.be.undefined;
    });

    it('renders with no aria-required if validators contains required validator object', () => {
        locals.options.fields['my-input'].validate = [ { type: 'required' } ];

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.attr('aria-required')).to.be.undefined;
    });

    it('renders with max-words from validator', () => {
        const maxwords = 5;
        locals.options.fields['my-input'].validate = [ { type: 'maxwords', arguments: maxwords } ];

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', maxwords: maxwords }, ctx: true }, locals);
        const $component = $('.govuk-character-count__message');
        const countMessage = $component.text();

        expect(countMessage).to.contain(maxwords);
        expect(countMessage).to.contain('words');
    });

    it('renders with max-words from validator array', () => {
        const maxwords = 5;
        locals.options.fields['my-input'].validate = [ { type: 'maxwords', arguments: [ maxwords ] } ];

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', maxwords: maxwords }, ctx: true }, locals);
        const $component = $('.govuk-character-count__message');
        const countMessage = $component.text();

        expect(countMessage).to.contain(maxwords);
        expect(countMessage).to.contain('words');
    });


    it('renders with errorValue if available', () => {
        locals.errorValues = {
            'my-input': 'def456'
        };

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-textarea');

        expect($component.text()).to.equal('def456');
    });

    it('renders error message if available', () => {
        locals.errors = {
            'my-input': { key: 'my-input', type: 'validator' }
        };

        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('#my-input-error');

        expect($component.text().trim()).to.equal('[govuk.error]: [fields.my-input.validation.validator]');
    });

    it('renders label as header', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('h1 .govuk-label');

        expect($label.attr('class')).to.equal('govuk-label govuk-label--l');
    });

    it('renders with nopaste', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', isPageHeading: true, noPaste: true }, ctx: true }, locals);
        const $label = $('.govuk-textarea');

        expect($label.attr('class')).to.equal('govuk-textarea govuk-js-character-count govuk-!-width-three-quarters js-nopaste');
    });

    it('renders with no extra classes', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('.govuk-textarea');

        expect($label.attr('class')).to.equal('govuk-textarea govuk-js-character-count govuk-!-width-three-quarters');
    });

    it('renders with extra classes', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', isPageHeading: true, classes: 'test' }, ctx: true }, locals);
        const $label = $('.govuk-textarea');

        expect($label.attr('class')).to.equal('govuk-textarea govuk-js-character-count test');
    });

    it('renders with extra classes and noPaste', () => {
        const $ = render({ component: 'hmpoWordCount', params: { id: 'my-input', isPageHeading: true, classes: 'test', noPaste: true }, ctx: true }, locals);
        const $label = $('.govuk-textarea');

        expect($label.attr('class')).to.equal('govuk-textarea govuk-js-character-count test js-nopaste');
    });

});
