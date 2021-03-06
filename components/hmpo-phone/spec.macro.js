'use strict';

describe('hmpoPhone', () => {
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
        const $ = render({ component: 'hmpoPhone', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('id')).to.equal('my-input');
    });

    it('renders small input with max length', () => {
        const $ = render({ component: 'hmpoPhone', params: { id: 'my-input' }, ctx: true }, locals);

        const $component = $('.govuk-input');
        expect($component.attr('maxlength')).to.equal('18');
        expect($component.attr('class')).to.equal('govuk-input govuk-input--width-20');
    });
});
