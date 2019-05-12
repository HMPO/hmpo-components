'use strict';

describe('hmpoClose', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoClose', params: { text: 'test' } });
        const $component = $('button');
        expect(cleanHtml($component)).to.equal('test');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoClose', params: { html: '<b>html</b>' } });
        const $component = $('button');
        expect(cleanHtml($component)).to.equal('<b>html</b>');
    });

    it('renders with default text', () => {
        const $ = render({ component: 'hmpoClose' });
        const $component = $('button');
        expect(cleanHtml($component)).to.equal('Close');
    });
});
