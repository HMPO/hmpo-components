'use strict';

describe('hmpoNumber', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                fields: {
                    'my-input': {
                        validate: 'required'
                    }
                }
            }
        };
    });

    it('renders with id', () => {
        const $ = render({ component: 'hmpoNumber', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders with number pattern', () => {
        const $ = render({ component: 'hmpoNumber', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('pattern')).to.equal('[0-9]');
    });
});
