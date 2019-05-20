'use strict';

describe('hmpoSelect', () => {
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

    it('renders with name and id', () => {
        const $ = render({ component: 'hmpoSelect', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('select');
        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders with label and hint', () => {
        const $ = render({ component: 'hmpoSelect', params: { id: 'my-input' }, ctx: true }, locals);

        const $label = $('.govuk-label');
        expect($label.text().trim()).to.equal('[fields.my-input.label]');
        expect($label.attr('id')).to.equal('my-input-label');
        const $hint = $('.govuk-hint');
        expect($hint.text().trim()).to.equal('[fields.my-input.hint]');
    });

    it('renders items with names and labels', () => {
        const $ = render({ component: 'hmpoSelect', params: { id: 'my-input' }, ctx: true }, locals);

        const $item1 = $('option').eq(0);
        expect($item1.attr('value')).to.equal('a');
        expect($item1.attr('selected')).to.be.undefined;
        expect($item1.text().trim()).to.equal('[fields.my-input.items.a.label]');

        const $item2 = $('option').eq(1);
        expect($item2.attr('value')).to.equal('b');
        expect($item2.attr('selected')).to.equal('selected');
        expect($item2.text().trim()).to.equal('[fields.my-input.items.b.label]');
    });

    describe('placeholders', () => {
        it('renders items with a placeholder', () => {
            const $ = render({ component: 'hmpoSelect', params: { id: 'my-input', placeholder: true }, ctx: true }, locals);

            const $placeholder = $('option').eq(0);
            expect($placeholder.attr('value')).to.equal('');
            expect($placeholder.attr('selected')).to.be.undefined;
            expect($placeholder.attr('disabled')).to.equal('disabled');
            expect($placeholder.text().trim()).to.equal('[fields.my-input.placeholder]');

            const $item1 = $('option').eq(1);
            expect($item1.attr('value')).to.equal('a');
            expect($item1.attr('selected')).to.be.undefined;
            expect($item1.text().trim()).to.equal('[fields.my-input.items.a.label]');

            const $item2 = $('option').eq(2);
            expect($item2.attr('value')).to.equal('b');
            expect($item2.attr('selected')).to.equal('selected');
            expect($item2.text().trim()).to.equal('[fields.my-input.items.b.label]');
        });

        it('renders placeholder as not disabled when select is not required to be filled', () => {
            const $ = render({ component: 'hmpoSelect', params: { id: 'my-input', placeholder: true, validate: [] }, ctx: true }, locals);

            const $placeholder = $('option').eq(0);
            expect($placeholder.attr('value')).to.equal('');
            expect($placeholder.attr('selected')).to.be.undefined;
            expect($placeholder.attr('disabled')).to.be.undefined;
            expect($placeholder.text().trim()).to.equal('[fields.my-input.placeholder]');
        });

        it('renders with placeholder selected if value is undefined', () => {
            locals.values['my-input'] = undefined;

            const $ = render({ component: 'hmpoSelect', params: { id: 'my-input', placeholder: true }, ctx: true }, locals);

            const $placeholder = $('option').eq(0);
            expect($placeholder.attr('value')).to.equal('');
            expect($placeholder.attr('selected')).to.equal('selected');
            expect($placeholder.attr('disabled')).to.equal('disabled');
            expect($placeholder.text().trim()).to.equal('[fields.my-input.placeholder]');
        });
    });

    it('renders label as header', () => {
        const $ = render({ component: 'hmpoSelect', params: { id: 'my-input', isPageHeading: true }, ctx: true }, locals);
        const $label = $('h1 .govuk-label');
        expect($label.attr('class')).to.equal('govuk-label govuk-label--l');
    });

});
