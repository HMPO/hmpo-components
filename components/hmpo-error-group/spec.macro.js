'use strict';

describe('hmpoErrorGroup', () => {
    let locals;

    beforeEach(() => {
        locals = {};
    });

    it('renders with an id', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {id: 'test-group'}, ctx: true });

        const $component = $('div');
        expect($component.attr('id')).to.equal('test-group');
        expect($component.attr('class')).to.equal('govuk-form-group hmpo-error-group');
    });

    it('renders with a added class', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group',
            classes: 'test'
        }, ctx: true});

        const $component = $('div');
        expect($component.attr('class')).to.equal('govuk-form-group hmpo-error-group test');
    });

    it('renders caller children', () => {
        const caller = '<span id="child"></span>';
        const $ = render({ component: 'hmpoErrorGroup', params: {id: 'test-group'}, ctx: true, caller});

        const $children = $('div #child');
        expect($children.length).to.equal(1);
    });

    it('renders with a legend header', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group',
            legend: {
                text: 'legend'
            }
        }, ctx: true});

        const $component = $('#test-group legend');
        expect($component.attr('class')).to.equal('govuk-fieldset__legend');
        expect($component.text().trim()).to.equal('legend');
    });

    it('renders with no fieldset if falsey', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group',
            fieldset: false
        }, ctx: true});

        const $component = $('#test-group legend');
        $component.length.should.equal(0);
    });

    it('renders with a default legend header', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group'
        }, ctx: true});

        const $component = $('#test-group legend');
        expect($component.attr('class')).to.equal('govuk-fieldset__legend');
        expect($component.text().trim()).to.equal('[fields.test-group.legend]');
    });

    it('renders with a hint', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group',
            classes: 'test',
            hint: {
                text: 'hint'
            }
        }, ctx: true});

        const $component = $('#test-group-hint');
        expect($component.text().trim()).to.equal('hint');
    });

    it('renders with a default hint', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group'
        }, ctx: true});

        const $component = $('#test-group-hint');
        expect($component.text().trim()).to.equal('[fields.test-group.hint]');
    });

    it('renders as page heading', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {
            id: 'test-group',
            isPageHeading: true
        }, ctx: true});

        const $component = $('#test-group legend');
        expect(cleanHtml($component)).to.equal('<h1 class="govuk-fieldset__heading">[fields.test-group.legend]</h1>');
    });

    it('renders error group with header label localisation instead of legend when legend is not present', () => {
        const $ = render.withLocale({ component: 'hmpoErrorGroup', params: {
            id: 'labeltest',
            isPageHeading: true,
            label: { attributes: { 'data-test': 'test value' } }
        }, ctx: true});
        const $component = $('#labeltest legend');
        expect(cleanHtml($component)).to.equal('<h1 class="govuk-fieldset__heading"><span data-test="test value">Label text</span></h1>');
    });

    it('renders error message if available', () => {
        locals.errors = {
            'test-group': { key: 'my-input', type: 'validator' }
        };

        const $ = render({ component: 'hmpoErrorGroup', params: { id: 'test-group' }, ctx: true }, locals);

        const $component = $('#test-group-error');
        expect($component.text().trim()).to.equal('[govuk.error]: [fields.my-input.validation.validator]');
    });

});
