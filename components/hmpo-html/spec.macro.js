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

    it('renders headers', () => {
        const html = [
            'First <b>string</b>',
            '# Not header',
            '## Second header',
            'Second <b>string</b>',
            '### Third header',
            '#### Fourth header',
            [
                'First <b>item</b>',
                'Second <b>item</b>',
                '# Not header',
                '## Not header',
                [
                    '## Bullet header',
                    'Bullet text'
                ]
            ]
        ];
        const $ = render({ component: 'hmpoHtml', params: html });

        const result = cleanHtml($('body'));
        expect(result).to.equal(
            '<p>First <b>string</b></p>' +
            '<p># Not header</p>' +
            '<h2>Second header</h2>' +
            '<p>Second <b>string</b></p>' +
            '<h3>Third header</h3>' +
            '<h4>Fourth header</h4>' +
            '<ul class="govuk-list govuk-list--bullet">' +
                '<li>First <b>item</b></li>' +
                '<li>Second <b>item</b></li>' +
                '<li># Not header</li>' +
                '<li>## Not header</li>' +
                '<li>' +
                    '<h2>Bullet header</h2>' +
                    '<p>Bullet text</p>' +
                '</li>' +
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

    it('filters out empty items', () => {
        const html = [
            'First <b>string</b>',
            '',
            null,
            undefined,
            'Second <b>string</b>',
            [
                'First <b>item</b>',
                '',
                null,
                undefined,
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
});
