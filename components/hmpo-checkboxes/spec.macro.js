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
                'my-input': 'a'
            }
        };
    });

    it('renders with id', () => {
        const $ = render('hmpoCheckboxes', { id: 'my-input' }, locals);
        const $component = $('.govuk-checkboxes__input');
        expect($component.attr('id')).to.equal('my-input-1');
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
        const $ = render('hmpoCheckboxes', { id: 'my-input' }, locals);

        const $component = $('.govuk-checkboxes__input');
        expect($component.attr('id')).to.equal('my-input');
        expect($component.attr('checked')).to.equal('checked');
    });

    it('renders with legend, labels and hint', () => {
        const $ = render('hmpoCheckboxes', { id: 'my-input' }, locals);

        const $legend = $('.govuk-fieldset__legend');
        expect($legend.text().trim()).to.equal('fields.my-input.legend');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('fields.my-input.hint');

        const $label = $('.govuk-label').first();
        expect($label.text().trim()).to.equal('fields.my-input.items.a.label');
    });
});
