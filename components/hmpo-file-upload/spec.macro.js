'use strict';

describe('hmpoFileUpload', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-upload': {
                        validate: 'required'
                    }
                }
            }
        };
    });

    it('renders with id', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload' }, ctx: true }, locals);

        const $component = $('.govuk-file-upload');
        expect($component.attr('id')).to.equal('my-upload');
        expect($component.attr('name')).to.equal('my-upload');
        expect($component.attr('type')).to.equal('file');
    });

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        expect($label.text().trim()).to.equal('[fields.my-upload.label]');
        expect($label.attr('id')).to.equal('my-upload-label');
        expect($label.attr('for')).to.equal('my-upload');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('[fields.my-upload.hint]');
    });

    it('renders the input with aria-labelledby so it keeps an accessible name once JS renames its id', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload' }, ctx: true }, locals);

        const $component = $('.govuk-file-upload');
        expect($component.attr('aria-labelledby')).to.equal('my-upload-label');
    });

    it('does not render hint if there is no localisation', () => {
        locals.translate = sinon.stub();
        locals.translate.returnsArg(0);
        locals.translate.withArgs('fields.my-upload.hint').returns(undefined);

        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload' }, ctx: true }, locals);

        const $hint = $('.govuk-hint');
        expect($hint.length).to.equal(0);
    });

    it('renders error message if available', () => {
        locals.errors = {
            'my-upload': { key: 'my-upload', type: 'validator' }
        };

        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload' }, ctx: true }, locals);

        const $component = $('#my-upload-error');
        expect($component.text().trim()).to.equal('[govuk.error]: [fields.my-upload.validation.validator]');
    });

    it('renders label as header', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload', isPageHeading: true }, ctx: true }, locals);

        const $label = $('h1 .govuk-label');
        expect($label.attr('class')).to.equal('govuk-label govuk-label--l');
    });

    it('renders with extra classes', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload', classes: 'test' }, ctx: true }, locals);

        const $component = $('.govuk-file-upload');
        expect($component.attr('class')).to.equal('govuk-file-upload test');
    });

    it('renders with custom attributes', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload', attributes: { accept: 'image/jpeg,image/png' } }, ctx: true }, locals);

        const $component = $('.govuk-file-upload');
        expect($component.attr('accept')).to.equal('image/jpeg,image/png');
    });

    it('renders with javascript enhancement by default', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload' }, ctx: true }, locals);

        expect($('[data-module="govuk-file-upload"]').length).to.equal(1);
    });

    it('does not render javascript enhancement when javascript is false', () => {
        const $ = render({ component: 'hmpoFileUpload', params: { id: 'my-upload', javascript: false }, ctx: true }, locals);

        expect($('[data-module="govuk-file-upload"]').length).to.equal(0);
    });
});
