'use strict';

describe('hmpoDetails', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoDetails', params: { text: 'my text <br>' } });

        const $component = $('div');
        expect(cleanHtml($component)).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoDetails', params: { html: 'my text <br>' } });

        const $component = $('div');
        expect(cleanHtml($component)).to.equal('my text <br>');
    });

    it('renders with caller', () => {
        const $ = render({ component: 'hmpoDetails', params: { html: 'my text <br>' }, caller: '<br>caller text<br>' });

        const $component = $('div');
        expect(cleanHtml($component)).to.equal('<br>caller text<br>');
    });
});
