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
                    },
                    'my-input-reveals': {
                        items: ['a', 'b', 'c']
                    },
                    'my-input-divider': {
                        items: ['a', { divider: 'test'}, 'c', { divider: true }, 'd', {divider: true, key: 'my.key'}, 'e']
                    }
                }
            },
            values: {
                'my-input': 'b'
            }
        };
    });

    it('renders with id', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'my-input'}, ctx: true}, locals);
        const $component = $('.govuk-fieldset');
        expect($component.attr('id')).to.equal('my-input-fieldset');
    });

    it('renders with legend and hint', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'my-input'}, ctx: true}, locals);

        const $legend = $('.govuk-fieldset__legend');
        expect($legend.text().trim()).to.equal('fields.my-input.label');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('Hint text');
    });

    it('renders items with ids and labels', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'my-input'}, ctx: true}, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('name')).to.equal('my-input');
        expect($item1.attr('value')).to.equal('a');
        expect($item1.attr('id')).to.equal('my-input');
        expect($item1.attr('checked')).to.be.undefined;
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('fields.my-input.items.a.label');
        expect($itemlabel1.attr('id')).to.equal('my-input-a-label');

        const $item2 = $('.govuk-radios__input').eq(1);
        expect($item2.attr('name')).to.equal('my-input');
        expect($item2.attr('value')).to.equal('b');
        expect($item2.attr('id')).to.equal('my-input-b');
        expect($item2.attr('checked')).to.equal('checked');
        const $itemlabel2 = $('.govuk-radios__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('fields.my-input.items.b.label');
        expect($itemlabel2.attr('id')).to.equal('my-input-b-label');
    });

    it('renders merged items from options and params', () => {
        locals.options.fields['my-input'].items = [
            { value: 1 },
            'a',
            { value: true, text: 'boolean'  }
        ];
        let paramItems = {
            '1': { text: 'one' },
            'a': { text: 'alpha' }
        };
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'my-input', items: paramItems}, ctx: true}, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('value')).to.equal('1');
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('one');

        const $item2 = $('.govuk-radios__input').eq(1);
        expect($item2.attr('value')).to.equal('a');
        const $itemlabel2 = $('.govuk-radios__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('alpha');

        const $item3 = $('.govuk-radios__input').eq(2);
        expect($item3.attr('value')).to.equal('true');
        const $itemlabel3 = $('.govuk-radios__label').eq(2);
        expect($itemlabel3.text().trim()).to.equal('boolean');
    });

    it('renders merged items from options with params as an array', () => {
        locals.options.fields['my-input'].items = [
            { value: 1 },
            'a',
            { value: true, text: 'boolean'  }
        ];
        let paramItems = [
            { value: '1', text: 'one' },
            { value: 'a', text: 'alpha' }
        ];
        const $ = render({component: 'hmpoRadios', params: {id: 'my-input', items: paramItems}, ctx: true}, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('value')).to.equal('1');
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('one');

        const $item2 = $('.govuk-radios__input').eq(1);
        expect($item2.attr('value')).to.equal('a');
        const $itemlabel2 = $('.govuk-radios__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('alpha');

        const $item3 = $('.govuk-radios__input').eq(2);
        expect($item3.attr('value')).to.equal('true');
        const $itemlabel3 = $('.govuk-radios__label').eq(2);
        expect($itemlabel3.text().trim()).to.equal('boolean');
    });

    it('renders default items', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'default-input'}, ctx: true}, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('value')).to.equal('true');
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('fields.default-input.items.true.label');

        const $item2 = $('.govuk-radios__input').eq(1);
        expect($item2.attr('value')).to.equal('false');
        const $itemlabel2 = $('.govuk-radios__label').eq(1);
        expect($itemlabel2.text().trim()).to.equal('fields.default-input.items.false.label');
    });

    it('renders items with conditionals', () => {
        const $ = render.withLocale({
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
        const $ = render.withLocale({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true, conditionals: {
                    a: {id: 'a', html: 'a <b>first</b>'},
                    b: {id: 'b', html: 'b <b>second</b>', classes: 'anotherclass'},
                    c: {html: 'b <b>third</b>'}
                }
            }
        }, locals);

        // conditionals should not be inside radio group
        const $radiosControl = $('div[data-module=govuk-radios]');
        $radiosControl.find('.govuk-radios__conditional').length.should.equal(0);

        const $item1 = $('.govuk-radios__conditional').eq(0);
        expect($item1.attr('id')).to.equal('a');
        expect($item1.attr('class')).to.equal('govuk-radios__conditional');
        expect(cleanHtml($item1)).to.equal('a <b>first</b>');
        const $item2 = $('.govuk-radios__conditional').eq(1);
        expect($item2.attr('id')).to.equal('b');
        expect($item2.attr('class')).to.equal('govuk-radios__conditional anotherclass');
        expect(cleanHtml($item2)).to.equal('b <b>second</b>');
        const $item3 = $('.govuk-radios__conditional').eq(2);
        expect($item3.attr('id')).to.equal('conditional-my-input-c');
        expect($item3.attr('class')).to.equal('govuk-radios__conditional');
        expect(cleanHtml($item3)).to.equal('b <b>third</b>');
    });

    it('renders items with conditionals from localisation', () => {
        const $ = render.withLocale({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input-reveals', conditionals: {
                    a: {id: 'a', html: 'a <b>first</b>'}
                }
            }
        }, locals);

        $('.govuk-radios__conditional').length.should.equal(2);

        const $item1 = $('.govuk-radios__conditional').eq(0);
        expect(cleanHtml($item1)).to.equal('a <b>first</b>');
        const $item2 = $('.govuk-radios__conditional').eq(1);
        expect(cleanHtml($item2)).to.equal('<p>second</p>');
    });

    it('renders items with inline conditionals with no html', () => {
        const $ = render.withLocale({
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
        const $ = render.withLocale({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true,  conditionals: {
                    a: {id: 'a', html: 'a <b>string</b>'},
                    b: {id: 'a'}
                }, multiConditional: true
            }
        }, locals);
        const $radiosControl = $('div[data-module=govuk-radios]');
        const multiConditional = $radiosControl.attr('data-multi-conditional');
        expect(multiConditional).to.equal('true');
    });

    it('renders items with conditionals without inset', () => {
        const $ = render.withLocale({
            component: 'hmpoRadios', ctx: true, params: {
                id: 'my-input', inline: true, conditionals: {
                    a: {id: 'a', html: 'a <b>first</b>', removeInset: true},
                    b: {id: 'b', html: 'b <b>second</b>', removeInset: true, classes: 'anotherclass' }
                }
            }
        }, locals);

        const $item1 = $('#a');
        expect($item1.attr('class')).to.equal('govuk-radios__conditional govuk-radios__removeInset');
        expect(cleanHtml($item1)).to.equal('a <b>first</b>');
        const $item2 = $('#b');
        expect($item2.attr('class')).to.equal('govuk-radios__conditional govuk-radios__removeInset anotherclass');
        expect(cleanHtml($item2)).to.equal('b <b>second</b>');
    });

    it('renders radio buttons with header', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'my-input', isPageHeading: true}, ctx: true}, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading">fields.my-input.label</h1>');
    });

    it('renders radio buttons with header attributes', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'legendtest', isPageHeading: true, legend: { attributes: { 'data-test': 'test value' }}}, ctx: true}, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading"><span data-test="test value">Legend text</span></h1>');
    });

    it('renders radio buttons with header label localisation instead of legend when legend is not present', () => {
        const $ = render.withLocale({ component: 'hmpoRadios', params: {id: 'labeltest', isPageHeading: true, label: { attributes: { 'data-test': 'test value' }}}, ctx: true}, locals);
        const $legend = $('.govuk-fieldset__legend');
        expect($legend.attr('class')).to.equal('govuk-fieldset__legend govuk-fieldset__legend--l');
        expect(cleanHtml($legend)).to.equal('<h1 class="govuk-fieldset__heading"><span data-test="test value">Label text</span></h1>');
    });

    it('renders radio buttons with localised dividers', () => {
        const $ = render.withLocale({component: 'hmpoRadios', params: {id: 'my-input-divider', isPageHeading: true}, ctx: true}, locals);

        const $item1 = $('.govuk-radios__input').eq(0);
        expect($item1.attr('value')).to.equal('a');
        const $itemlabel1 = $('.govuk-radios__label').eq(0);
        expect($itemlabel1.text().trim()).to.equal('fields.my-input-divider.items.a.label');

        const $div1 = $('.govuk-radios__divider').eq(0);
        expect($div1.text().trim()).to.equal('test');

        const $div2 = $('.govuk-radios__divider').eq(1);
        expect($div2.text().trim()).to.equal('fields.my-input-divider.divider.label');

        const $div3 = $('.govuk-radios__divider').eq(2);
        expect($div3.text().trim()).to.equal('my.key');

    });

});
