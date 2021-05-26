'use strict';

describe('form template', () => {
    it('renders', () => {
        const locals = {};
        expect(() => {
            render({ template: 'form-template.njk' }, locals);
        }).to.not.throw();
    });

    it('renders fields', () => {
        const locale = {
            fields: {
                field1: {
                    legend: 'Field One'
                }
            }
        };
        const locals = {
            translate: (key, options = {}) => {
                if (!Array.isArray(key)) key = [ key ];
                const value = key.reduce((val, key) => {
                    if (val !== undefined) return val;
                    return key && key.split('.').reduce((val, part) => val && val[part], locale);
                }, undefined);
                if (value !== undefined) return value;
                if (options.default) return options.default;
                if (options.self === false) return undefined;
                return '[' + key[0] + ']';
            },

            options: {
                route: '/test-route',
                fields: {
                    field1: {
                        type: 'radios',
                        items: [{ value: true }, { value: false }]
                    },
                    field2: {
                        type: 'text',
                        dependent: { field: 'field1', value: true }
                    }
                }
            }
        };

        const $ = render({ template: 'form-template.njk' }, locals);
        expect(cleanHtml($('title'))).to.equal('Field One – [govuk.serviceName] – GOV.UK');
        expect(cleanHtml($('h1'))).to.equal('Field One');
        expect($('input#field1').attr('type')).to.equal('radio');
        expect($('input#field2').attr('type')).to.equal('text');
        expect($('div#conditional-field1').attr('class')).to.equal('govuk-radios__conditional govuk-radios__conditional--hidden');
        expect($('input#field1-false').attr('type')).to.equal('radio');
    });
});
