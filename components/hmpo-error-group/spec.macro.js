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
        expect($component.attr('class')).to.equal('govuk-form-group hmpo-field-group');
    });

    it('renders with a added class', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {classes: 'test'}, ctx: true});

        const $component = $('div');
        expect($component.attr('class')).to.equal('govuk-form-group hmpo-field-group test');
    });

    it('renders caller children', () => {
        const caller = '<span id="child"></span>';
        const $ = render({ component: 'hmpoErrorGroup', params: {id: 'test-group'}, ctx: true, caller});

        const $children = $('div #child');
        expect($children.length).to.equal(1);
    });

    it('renders with a legend header', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {classes: 'test', legend: {text: 'legend'}}, ctx: true});

        const $component = $('#group-legend');
        expect($component.attr('class')).to.equal('govuk-fieldset__legend--m');
        expect($component.text()).to.equal('legend');
    });

    it('renders with a legend classes', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {classes: 'test', legend: {text: 'legend', classes: 'testLegendClass'}}, ctx: true});

        const $component = $('#group-legend');
        expect($component.attr('class')).to.equal('testLegendClass');
        expect($component.text()).to.equal('legend');
    });

    it('renders with a legend hint', () => {
        const $ = render({ component: 'hmpoErrorGroup', params: {classes: 'test', legend: {hint: { id: 'testHint', classes: 'hintClasses', text: 'hint'}}}, ctx: true});

        const $component = $('#testHint');
        expect($component.attr('class')).to.equal('hintClasses');
        expect($component.text()).to.equal('hint');
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
