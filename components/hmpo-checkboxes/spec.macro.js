'use strict';

describe('hmpoCheckboxes', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        items: [ 'a', 'b', 'c' ]
                    }
                }
            },
            values: {
                'my-input': ['a', 'c']
            }
        };
    });

    it('renders with id', () => {
        const $ = render({ component: 'hmpoCheckboxes', params: { id: 'my-input' }, ctx: true }, locals);
        const $component = $('.govuk-fieldset');
        expect($component.attr('id')).to.equal('my-input-fieldset');
    });

    it('renders single checkbox with id', () => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required'
                    }
                }
            },
            values: {
                'my-input': true
            }
        };
        const $ = render({ component: 'hmpoCheckboxes', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-checkboxes__input');
        expect($component.attr('name')).to.equal('my-input');
        expect($component.attr('value')).to.equal('true');
        expect($component.attr('id')).to.equal('my-input');
        expect($component.attr('checked')).to.equal('checked');
        const $componentlabel = $('.govuk-checkboxes__label');
        expect($componentlabel.text().trim()).to.equal('[fields.my-input.label]');
        expect($componentlabel.attr('id')).to.equal('my-input-label');
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.length).to.equal(0);
    });

    it('renders single checkbox with custom value', () => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required'
                    }
                }
            },
            values: {
                'my-input': true
            }
        };
        const $ = render({ component: 'hmpoCheckboxes', params: { id: 'my-input', value: 'foobar' }, ctx: true }, locals);

        const $component = $('.govuk-checkboxes__input');
        expect($component.attr('name')).to.equal('my-input');
        expect($component.attr('value')).to.equal('foobar');
    });

    it('renders with legend and hint', () => {
        const $ = render({ component: 'hmpoCheckboxes', params: { id: 'my-input' }, ctx: true }, locals);

        const $legend = $('.govuk-fieldset__legend');
        expect($legend.text().trim()).to.equal('[fields.my-input.legend]');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('renders items with ids, names, and and labels', () => {
        const $ = render({ component: 'hmpoCheckboxes', params: { id: 'my-input' }, ctx: true }, locals);

        const $item1 = $('.govuk-checkboxes__input').eq(0);
        expect($item1.attr('name')).to.equal('my-input');
        expect($item1.attr('value')).to.equal('a');
        expect($item1.attr('id')).to.equal('my-input');
        expect($item1.attr('checked')).to.equal('checked');
        const $itemlabel1 = $('.govuk-checkboxes__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('[fields.my-input.items.a.label]');
        expect($itemlabel1.attr('id')).to.equal('my-input-label');

        const $item2 = $('.govuk-checkboxes__input').eq(1);
        expect($item2.attr('name')).to.equal('my-input');
        expect($item2.attr('value')).to.equal('b');
        expect($item2.attr('id')).to.equal('my-input-b');
        expect($item2.attr('checked')).to.be.undefined;
        const $itemlabel2 = $('.govuk-checkboxes__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('[fields.my-input.items.b.label]');
        expect($itemlabel2.attr('id')).to.equal('my-input-b-label');
    });

    it('renders radio buttons with header', () => {
        const $ = render({ component: 'hmpoCheckboxes', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading">[fields.my-input.legend]</h1>');
    });
});
