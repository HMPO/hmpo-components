'use strict';

describe('hmpoCookieBanner', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoCookieBanner', ctx: true, params: {
            title: 'Test',
            text: 'my text <br>',
            accept: 'Accept',
            preferences: 'Preferences',
            acceptHref: 'AcceptURL',
            preferencesHref: 'PreferencesURL'
        } });

        expect(cleanHtml($('.hmpo-cookie-banner__title'))).to.equal('Test');
        expect(cleanHtml($('.hmpo-cookie-banner__text'))).to.equal('my text &lt;br&gt;');
        expect(cleanHtml($('#cookie-banner-accept'))).to.equal('Accept');
        expect(cleanHtml($('#cookie-banner-preferences'))).to.equal('Preferences');
        expect($('#cookie-banner-accept').attr('href')).to.equal('AcceptURL');
        expect($('#cookie-banner-preferences').attr('href')).to.equal('PreferencesURL');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoCookieBanner', ctx: true, params: {
            title: 'Test',
            html: 'my text <br>',
            accept: 'Accept',
            preferences: 'Preferences',
            acceptHref: 'AcceptURL',
            preferencesHref: 'PreferencesURL'
        } });

        expect(cleanHtml($('.hmpo-cookie-banner__title'))).to.equal('Test');
        expect(cleanHtml($('.hmpo-cookie-banner__text'))).to.equal('my text <br>');
        expect(cleanHtml($('#cookie-banner-accept'))).to.equal('Accept');
        expect(cleanHtml($('#cookie-banner-preferences'))).to.equal('Preferences');
        expect($('#cookie-banner-accept').attr('href')).to.equal('AcceptURL');
        expect($('#cookie-banner-preferences').attr('href')).to.equal('PreferencesURL');
    });
});
