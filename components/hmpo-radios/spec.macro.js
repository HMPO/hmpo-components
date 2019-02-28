'use strict';

describe('hmpoRadios', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required',
                        items: [ 'a', 'b', 'c' ]
                    }
                }
            },
            values: {
                'my-input': 'b'
            }
        };
    });

    it('renders with id', () => {
        const $ = render('hmpoRadios', { id: 'my-input' }, locals);
        const $component = $('.govuk-fieldset');
        expect($component.attr('id')).to.equal('my-input-fieldset');
    });

    it('renders with legend and hint', () => {
        const $ = render('hmpoRadios', { id: 'my-input' }, locals);

        const $legend = $('.govuk-fieldset__legend');
        expect($legend.text().trim()).to.equal('fields.my-input.legend');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('fields.my-input.hint');
    });

    it('renders items with ids and labels', () => {
        const $ = render('hmpoRadios', { id: 'my-input' }, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('name')).to.equal('my-input');
        expect($item1.attr('value')).to.equal('a');
        expect($item1.attr('checked')).to.be.undefined;
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('fields.my-input.items.a.label');

        const $item2 = $('.govuk-radios__input').eq(1);
        expect($item2.attr('name')).to.equal('my-input');
        expect($item2.attr('value')).to.equal('b');
        expect($item2.attr('checked')).to.equal('checked');
        const $itemlabel2 = $('.govuk-radios__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('fields.my-input.items.b.label');
    });

});
