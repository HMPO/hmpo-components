'use strict';

describe('hmpoHtml', () => {
    it('renders string paragraph', () => {
        const html = 'Single <b>string</b>';
        const $ = render({ component: 'hmpoHtml', params: html });

        const result = cleanHtml($('body'));
        expect(result).to.equal('<p>Single <b>string</b></p>');
    });

    it('renders an array of paragraphs', () => {
        const html = [
            'First <b>string</b>',
            'Second <b>string</b>'
        ];
        const $ = render({ component: 'hmpoHtml', params: html });

        const result = cleanHtml($('body'));
        expect(result).to.equal(
            '<p>First <b>string</b></p>' +
            '<p>Second <b>string</b></p>'
        );
    });

    it('renders bullets', () => {
        const html = [
            'First <b>string</b>',
            'Second <b>string</b>',
            [
                'First <b>item</b>',
                'Second <b>item</b>'
            ]
        ];
        const $ = render({ component: 'hmpoHtml', params: html });

        const result = cleanHtml($('body'));
        expect(result).to.equal(
            '<p>First <b>string</b></p>' +
            '<p>Second <b>string</b></p>' +
            '<ul class="govuk-list govuk-list--bullet">' +
                '<li>First <b>item</b></li>' +
                '<li>Second <b>item</b></li>' +
            '</ul>'
        );
    });

    it('renders custom ids and classes', () => {
        const html = [
            { 'id1': 'First <b>string</b>' },
            'Second <b>string</b>',
            { id: 'alist', classes: 'list class', items: [
                { 'id2': 'First <b>item</b>' },
                'Second <b>item</b>'
            ]}
        ];
        const $ = render({ component: 'hmpoHtml', params: html });

        const result = cleanHtml($('body'));
        expect(result).to.equal(
            '<p id="id1">First <b>string</b></p>' +
            '<p>Second <b>string</b></p>' +
            '<ul id="alist" class="list class">' +
                '<li id="id2">First <b>item</b></li>' +
                '<li>Second <b>item</b></li>' +
            '</ul>'
        );
    });
});
