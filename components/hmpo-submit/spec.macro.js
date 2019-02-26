'use strict';

describe('hmpoSubmit', () => {
    let locals;

    beforeEach(() => {
        locals = {};
    });

    it('renders with id', () => {
        const $ = render('hmpoSubmit', { key: 'myButtonTextKey' }, locals);
        const $component = $('.govuk-button');
        expect($component.text()).to.contain('buttons.myButtonTextKey');
    });
});
