'use strict';

describe('hmpoWarningText', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoWarningText', params: { text: 'my text <br>' } });

        const $component = $('strong');
        expect(cleanHtml($component)).to.equal('<span class="govuk-warning-text__assistive">Warning</span>my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoWarningText', params: { html: 'my text <br>' } });

        const $component = $('strong');
        expect(cleanHtml($component)).to.equal('<span class="govuk-warning-text__assistive">Warning</span>my text <br>');
    });

    it('renders with caller', () => {
        const $ = render({ component: 'hmpoWarningText', params: { html: 'my text <br>' }, caller: '<br>caller text<br>' });

        const $component = $('strong');
        expect(cleanHtml($component)).to.equal('<span class="govuk-warning-text__assistive">Warning</span><br>caller text<br>');
    });
});
