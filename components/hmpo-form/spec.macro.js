'use strict';

describe('hmpoForm', () => {
    let locals;

    beforeEach(() => {
        locals = {
            'csrf-token': 'abcd1234'
        };
    });

    it('renders with default action and method', () => {
        const $ = render('hmpoForm', {}, locals);

        const $component = $('form');
        expect($component.attr('action')).to.equal('');
        expect($component.attr('method')).to.equal('POST');
    });

    it('renders with overridden action and method', () => {
        const $ = render('hmpoForm', { action: '/path', method: 'GET' }, locals);

        const $component = $('form');
        expect($component.attr('action')).to.equal('/path');
        expect($component.attr('method')).to.equal('GET');
    });

    it('renders caller children', () => {
        const children = '<span id="child"></span>';
        const $ = render('hmpoForm', {}, locals, children);

        const $children = $('form #child');
        expect($children.length).to.equal(1);
    });

    it('renders csrf hidden input', () => {
        const $ = render('hmpoForm', {}, locals);

        const $csrf = $('input');
        expect($csrf.attr('type')).to.equal('hidden');
        expect($csrf.attr('name')).to.equal('x-csrf-token');
        expect($csrf.attr('value')).to.equal('abcd1234');
    });

    it('does not render csrf hidden input if no value supplied in locals', () => {
        delete locals['csrf-token'];
        const $ = render('hmpoForm', {}, locals);

        const $csrf = $('input');
        expect($csrf.length).to.equal(0);
    });
});
