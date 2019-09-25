'use strict';

describe('hmpoRadios', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required',
                        items: ['a', 'b', 'c']
                    }
                }
            },
            values: {
                'my-input': 'b'
            }
        };
    });

    it('renders with id', () => {
        const $ = render({component: 'hmpoRadios', params: {id: 'my-input'}, ctx: true}, locals);
        const $component = $('.govuk-fieldset');
        expect($component.attr('id')).to.equal('my-input-fieldset');
    });

    it('renders with legend and hint', () => {
        const $ = render({component: 'hmpoRadios', params: {id: 'my-input'}, ctx: true}, locals);

        const $legend = $('.govuk-fieldset__legend');
        expect($legend.text().trim()).to.equal('[fields.my-input.legend]');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('renders items with ids and labels', () => {
        const $ = render({component: 'hmpoRadios', params: {id: 'my-input'}, ctx: true}, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('name')).to.equal('my-input');
        expect($item1.attr('value')).to.equal('a');
        expect($item1.attr('id')).to.equal('my-input-a');
        expect($item1.attr('checked')).to.be.undefined;
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('[fields.my-input.items.a.label]');
        expect($itemlabel1.attr('id')).to.equal('my-input-a-label');

        const $item2 = $('.govuk-radios__input').eq(1);
        expect($item2.attr('name')).to.equal('my-input');
        expect($item2.attr('value')).to.equal('b');
        expect($item2.attr('id')).to.equal('my-input-b');
        expect($item2.attr('checked')).to.equal('checked');
        const $itemlabel2 = $('.govuk-radios__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('[fields.my-input.items.b.label]');
        expect($itemlabel2.attr('id')).to.equal('my-input-b-label');
    });

    it('renders items with conditionals', () => {
        const $ = render({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', conditionals: {
                    a: {id: 'a', html: 'a <b>string</b>'},
                    b: {id: 'b', html: 'b <b>object</b>'}
                }
            }
        }, locals);

        const $item1 = $('.govuk-radios__conditional').eq(0);
        expect(cleanHtml($item1)).to.equal('a <b>string</b>');
        const $item2 = $('.govuk-radios__conditional').eq(1);
        expect(cleanHtml($item2)).to.equal('b <b>object</b>');
    });

    it('renders items with conditionals inline', () => {
        const $ = render({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true, conditionals: {
                    a: {id: 'a', html: 'a <b>first</b>'},
                    b: {id: 'b', html: 'b <b>second</b>', classes: 'anotherclass'}
                }
            }
        }, locals);

        const $radiosControl = $('.radios-with-conditionals').attr('data-module');
        expect($radiosControl).to.equal('govuk-radios');
        const $item1 = $('.govuk-radios__conditional').eq(0);
        expect($item1.attr('id')).to.equal('a');
        expect($item1.attr('class')).to.equal('govuk-inset-text govuk-radios__conditional');
        expect(cleanHtml($item1)).to.equal('a <b>first</b>');
        const $item2 = $('.govuk-radios__conditional').eq(1);
        expect($item2.attr('id')).to.equal('b');
        expect($item2.attr('class')).to.equal('govuk-inset-text govuk-radios__conditional anotherclass');
        expect(cleanHtml($item2)).to.equal('b <b>second</b>');
    });

    it('renders items with inline conditionals with no html', () => {
        const $ = render({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true,  conditionals: {
                    a: {id: 'a', html: 'a <b>string</b>'},
                    b: {id: 'b'}
                }
            }
        }, locals);
        const $items = $('.govuk-radios__conditional');
        $items.length.should.equal(1);
    });

    it('renders items with inline conditionals with multiConditional flag', () => {
        const $ = render({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true,  conditionals: {
                    a: {id: 'a', html: 'a <b>string</b>'},
                    b: {id: 'a'}
                }, multiConditional: true
            }
        }, locals);
        const multiConditional = $('.radios-with-conditionals').attr('data-multi-conditional');
        expect(multiConditional).to.equal('true');
    });

    it('renders items with conditionals without inset', () => {
        const $ = render({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true, conditionals: {
                    a: {id: 'a', html: 'a <b>first</b>', removeInset: true},
                    b: {id: 'b', html: 'b <b>second</b>', removeInset: true, classes: 'anotherclass' }
                }
            }
        }, locals);

        const $radiosControl = $('.radios-with-conditionals').attr('data-module');
        expect($radiosControl).to.equal('govuk-radios');
        const $item1 = $('#a');
        expect($item1.attr('class')).to.equal('govuk-radios__conditional');
        expect(cleanHtml($item1)).to.equal('a <b>first</b>');
        const $item2 = $('#b');
        expect($item2.attr('class')).to.equal('govuk-radios__conditional anotherclass');
        expect(cleanHtml($item2)).to.equal('b <b>second</b>');
    });

    it('renders radio buttons with header', () => {
        const $ = render({component: 'hmpoRadios', params: {id: 'my-input', isPageHeading: true}, ctx: true}, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading">[fields.my-input.legend]</h1>');
    });

});
