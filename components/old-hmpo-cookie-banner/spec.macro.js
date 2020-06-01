'use strict';

describe('oldHmpoCookieBanner', () => {
    it('renders with text', () => {
        const $ = render({ component: 'oldHmpoCookieBanner', params: { text: 'my text <br>' } });

        const $component = $('.hmpo-cookie-banner_o .hmpo-cookie-banner__message_o');
        expect(cleanHtml($component)).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render({ component: 'oldHmpoCookieBanner', params: { html: 'my text <br>' } });

        const $component = $('.hmpo-cookie-banner_o .hmpo-cookie-banner__message_o');
        expect(cleanHtml($component)).to.equal('my text <br>');
    });
});
