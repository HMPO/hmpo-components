'use strict';

describe('hmpoCookieBanner', () => {
    it('renders with text', () => {
        const $ = render('hmpoCookieBanner', { text: 'my text <br>' });

        const $component = $('.hmpo-cookie-banner .hmpo-cookie-banner__message');
        expect($component.html()).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render('hmpoCookieBanner', { html: 'my text <br>' });

        const $component = $('.hmpo-cookie-banner .hmpo-cookie-banner__message');
        expect($component.html()).to.equal('my text <br>');
    });
});
