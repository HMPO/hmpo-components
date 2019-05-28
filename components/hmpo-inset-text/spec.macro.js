'use strict';

describe('hmpoInsetText', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoInsetText', params: { text: 'my text <br>' } });

        const $component = $('div');
        expect(cleanHtml($component)).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoInsetText', params: { html: 'my text <br>' } });

        const $component = $('div');
        expect(cleanHtml($component)).to.equal('my text <br>');
    });

    it('renders with caller', () => {
        const $ = render({ component: 'hmpoInsetText', params: { html: 'my text <br>' }, caller: '<br>caller text<br>' });

        const $component = $('div');
        expect(cleanHtml($component)).to.equal('<br>caller text<br>');
    });
});
