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

    it('renders items with conditionals', () => {
        const $ = render('hmpoRadios', { id: 'my-input', conditionals: {
            a: 'a <b>string</b>',
            b: { html: 'b <b>object</b>' }
        } }, locals);

        const $item1 = $('.govuk-radios__conditional').eq(0);
        expect($item1.html()).to.equal('a <b>string</b>');

        const $item2 = $('.govuk-radios__conditional').eq(1);
        expect($item2.html()).to.equal('b <b>object</b>');
    });

    it('renders radio buttons with header', () => {
        const $ = render('hmpoRadios', { id: 'my-input', isPageHeading: true }, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect($legend.html()).to.equal('<h1 class="govuk-fieldset__heading">fields.my-input.legend</h1>');
    });

});
