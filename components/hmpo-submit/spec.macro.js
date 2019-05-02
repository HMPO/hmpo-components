'use strict';

describe('hmpoSubmit', () => {
    let locals;

    beforeEach(() => {
        locals = {};
    });

    it('renders with localisation text', () => {
        const $ = render('hmpoSubmit', { key: 'myButtonTextKey' }, locals);
        const $component = $('.govuk-button');
        expect($component.text()).to.contain('buttons.myButtonTextKey');
    });

    it('renders with id', () => {
        const $ = render('hmpoSubmit', { id: 'myid' }, locals);
        const $component = $('.govuk-button');
        expect($component.attr('id')).to.equal('myid');
        expect($component.attr('name')).to.equal('myid');
    });
});
