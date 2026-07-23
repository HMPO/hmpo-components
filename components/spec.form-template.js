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
                },
                field2: {
                    content: 'content below the field'
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
                    },
                    field3: {
                        type: 'number',
                        dependent: { field: 'field1', value: true }
                    },
                    field4: {
                        type: 'checkboxes',
                        dependent: { field: 'field1', value: false }
                    },
                    groupField: {
                        type: 'group'
                    },
                    groupField1: {
                        type: 'text',
                        group: 'groupField'
                    },
                    groupField2: {
                        type: 'text',
                        group: 'groupField'
                    }
                }
            }
        };

        const $ = render({ template: 'form-template.njk' }, locals);
        expect(cleanHtml($('title'))).to.equal('Field One – [govuk.serviceName] – GOV.UK');
        expect(cleanHtml($('h1'))).to.equal('Field One');
        expect($('input#field1').attr('type')).to.equal('radio');
        expect($('div#conditional-field1').attr('class')).to.equal('govuk-radios__conditional govuk-radios__conditional--hidden');
        expect($('div#conditional-field1 input#field2').attr('type')).to.equal('text');
        expect(cleanHtml($('div#conditional-field1 p'))).to.equal('content below the field');
        expect($('div#conditional-field1 input#field3').attr('type')).to.equal('number');
        expect($('input#field1-false').attr('type')).to.equal('radio');
        expect($('div#conditional-field1-false input#field4').attr('type')).to.equal('checkbox');
        expect($('div#groupField input#groupField1').attr('type')).to.equal('text');
        expect($('div#groupField input#groupField2').attr('type')).to.equal('text');
    });

    it('sets multipart encoding when file-upload fields are present', () => {
        const locale = {
            fields: {
                uploadDocument: {
                    label: 'Upload a document'
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
                route: '/upload-route',
                fields: {
                    uploadDocument: {
                        type: 'file-upload'
                    }
                }
            }
        };

        const $ = render({ template: 'form-template.njk' }, locals);
        expect($('form').attr('enctype')).to.equal('multipart/form-data');
        expect($('input#uploadDocument').attr('type')).to.equal('file');
        expect($('label[for="uploadDocument"]').attr('class')).to.equal('govuk-label govuk-label--l');
        expect($('label[for="uploadDocument"]').attr('id')).to.equal('uploadDocument-label');
        expect($('input#uploadDocument').attr('aria-labelledby')).to.equal('uploadDocument-label');
    });

    it('supports custom file-upload label classes from field config', () => {
        const locale = {
            fields: {
                uploadDocument: {
                    label: 'Upload a document'
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
                route: '/upload-route',
                fields: {
                    uploadDocument: {
                        type: 'file-upload',
                        label: {
                            classes: 'govuk-label--m'
                        }
                    }
                }
            }
        };

        const $ = render({ template: 'form-template.njk' }, locals);
        expect($('label[for="uploadDocument"]').attr('class')).to.equal('govuk-label govuk-label--m');
    });
});
