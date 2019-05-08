'use strict';

describe('hmpoClose', () => {
    it('renders with text', () => {
        const $ = render('hmpoClose', { text: 'test' });
        const $component = $('button');
        expect($component.html().trim()).to.equal('test');
    });

    it('renders with html', () => {
        const $ = render('hmpoClose', { html: '<b>html</b>' });
        const $component = $('button');
        expect($component.html().trim()).to.equal('<b>html</b>');
    });

    it('renders with default text', () => {
        const $ = render('hmpoClose');
        const $component = $('button');
        expect($component.html().trim()).to.equal('Close');
    });
});
