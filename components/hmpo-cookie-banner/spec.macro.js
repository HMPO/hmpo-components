'use strict';

describe('hmpoCookieBanner', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoCookieBanner', params: { text: 'my text <br>' } });

        const $component = $('.hmpo-cookie-banner .hmpo-cookie-banner__message');
        expect(cleanHtml($component)).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoCookieBanner', params: { html: 'my text <br>' } });

        const $component = $('.hmpo-cookie-banner .hmpo-cookie-banner__message');
        expect(cleanHtml($component)).to.equal('my text <br>');
    });
});
