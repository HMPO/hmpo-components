'use strict';

describe('hmpoSubmit', () => {
    let locals;

    beforeEach(() => {
        locals = {};
    });

    it('renders with localisation text', () => {
        const $ = render({ component: 'hmpoSubmit', params: { key: 'myButtonTextKey' }, ctx: true }, locals);
        const $component = $('.govuk-button');
        expect($component.text()).to.contain('buttons.myButtonTextKey');
    });

    it('renders with id', () => {
        const $ = render({ component: 'hmpoSubmit', params: { id: 'myid' }, ctx: true }, locals);
        const $component = $('.govuk-button');
        expect($component.attr('id')).to.equal('myid');
        expect($component.attr('name')).to.equal('myid');
    });
    it('renders with button class', () => {
        const $ = render({ component: 'hmpoSubmit', params: { id: 'myid' }, ctx: true }, locals);
        const $component = $('.govuk-button');
        expect($component.attr('class')).to.equal('govuk-button button');
    });
});
