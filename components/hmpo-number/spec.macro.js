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
        const $ = render('hmpoNumber', { id: 'my-input' }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders with number pattern', () => {
        const $ = render('hmpoNumber', { id: 'my-input' }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('pattern')).to.equal('[0-9]');
    });
});
