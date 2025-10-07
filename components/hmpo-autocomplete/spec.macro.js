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

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        const $hint = $('.govuk-hint');

        expect($label.text().trim()).to.equal('[fields.my-input.label]');
        expect($label.attr('id')).to.equal('my-input-label');

        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('renders label as header', () => {
        const $ = render({ component: 'hmpoAutocomplete', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('h1 .govuk-label');
        expect($label.attr('class')).to.equal('govuk-label govuk-label--l');
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

    it('renders items with gven names and labels', () => {
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
