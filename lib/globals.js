'use strict';

const debug = require('debug')('hmpo:components:globals');
const deepCloneMerge = require('deep-clone-merge');
const _ = require('underscore');

let globals = {
    isArray(arr) {
        return Array.isArray(arr);
    },

    isObject(obj) {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    },

    isString(str) {
        return typeof str === 'string';
    },

    isNumber(num) {
        return typeof num === 'number';
    },

    isBoolean(bool) {
        return typeof bool === 'boolean';
    },

    startsWith(str, substr) {
        return typeof str === 'string' && str.startsWith(substr);
    },

    endsWith(str, substr) {
        return typeof str === 'string' && str.endsWith(substr);
    },

    merge(...src) {
        return _.pick(deepCloneMerge(...src), v => v !== undefined);
    },

    set(obj, key, value) {
        return obj[key] = value;
    },

    substr(str, start, length) {
        return typeof str === 'string' ? str.substr(start, length) : '';
    },

    hmpoGetParams(ctx, params, ...base) {
        let options = params && ctx('options.fields.' + params.id);
        let mergedItems = {};
        if (options && options.items && params && params.items) {
            let indexedParamItems = _.isArray(params.items) ? _.indexBy(params.items, 'value') : params.items;
            mergedItems.items = options.items.map(i => {
                if (typeof i !== 'object') i = { value: i };
                return deepCloneMerge(i, indexedParamItems[i.value]);
            });
        }
        return deepCloneMerge(
            ...base,
            options,
            params,
            mergedItems
        );
    },

    hmpoGetValidator(ctx, params, type) {
        if (!params.validate) return;
        if (params.validate === type) return { type };
        if (!Array.isArray(params.validate)) return;
        if (params.validate.includes(type)) return { type };
        let validator = params.validate.filter(v => v.type === type)[0];
        if (!validator) return;
        return {
            type,
            arguments: Array.isArray(validator.arguments) ?
                validator.arguments : validator.arguments ?
                    [ validator.arguments ] : []
        };
    },

    hmpoGetAttributes(ctx, params, attributes) {
        return globals.merge(
            attributes,
            params.attributes
        );
    },

    hmpoGetValidatorAttribute(ctx, params, type, value = true, falseValue = (typeof value === 'boolean' ? false : undefined)) {
        let validator = globals.hmpoGetValidator(ctx, params, type);
        if (!validator) return falseValue;
        if (typeof value === 'number') return validator.arguments[value];
        return value;
    },

    hmpoGetItems(ctx, params, value, required, setIdsBasedOnValues, defaults) {
        let translate = ctx('translate');
        let items = params.items || params.options || defaults || [];
        let conditionals = params.conditionals || {};
        let contentKey = 'fields.' + (params.contentKey || params.id);
        let placeholder = params.placeholder;
        if (placeholder === true) placeholder = { value: '' };
        if (placeholder) {
            let key = placeholder.key || contentKey + '.placeholder';
            placeholder.text = translate(key, { default: ' ' });
            if (required) placeholder.disabled = true;
            if (value === undefined || value === '') placeholder.selected = true;
            items = [ placeholder ].concat(items);
        }
        items = items.map((item, index) => {
            if (typeof item === 'string') item = { value: item };

            if (item.divider) {
                if (typeof item.divider !== 'string') {
                    let key = item.key || [
                        contentKey + '.divider.label',
                        'fields.default.divider.label'
                    ];
                    item.divider = translate(key);
                }
                return item;
            }

            if (!item.text && !item.html) {
                let key = item.key || [
                    contentKey + '.items.' + item.value + '.label',
                    'fields.default.items.' + item.value + '.label'
                ];
                item.html = item.text = translate(key);
            }
            if (!item.name) item.name = params.id;
            if (item.value !== undefined) {
                if (Array.isArray(value) && value.includes(item.value)) item.selected = item.checked = true;
                if (value === item.value) item.selected = item.checked = true;
            }
            let conditional = conditionals[item.value];
            if (conditional) {
                if (!params.inline) {
                    item.conditional = typeof conditional === 'string' ? {html: conditional} : conditional;
                } else if (conditional.id) {
                    item.attributes = item.attributes || {};
                    item.attributes['data-aria-controls'] = conditional.id;
                }
            }
            if (setIdsBasedOnValues) {
                let cleanedValue = String(item.value).replace(/[^a-zA-Z0-9]+/g, '');
                if (cleanedValue) item.id = params.id + '-' + cleanedValue;
            }
            if (item.id) {
                item.label = globals.merge({
                    attributes: { id: item.id + '-label' }
                }, item.label);
            }

            // override id of first item to be field name for accessibility
            if (setIdsBasedOnValues && index === 0) item.id = params.id;

            if (!item.hint || (!item.hint.html && !item.hint.text) ) {
                let key = [
                    contentKey + '.items.' + item.value + '.hint',
                    'fields.default.items.' + item.value + '.hint'
                ];
                const html = translate(key, { self: false });
                if (html) {
                    if (!item.hint) item.hint = {};
                    item.hint.html = html;
                }
            }

            return item;
        });

        debug('hmpoGetItems', params, value, items);
        return items;
    },

    hmpoGetOptions(ctx, params, type, optional = false) {
        let translate = ctx('translate');
        let options = {};
        if (typeof params[type] === 'string') {
            options = {
                text: params[type]
            };
        } else {
            options = Object.assign({}, params[type]);
            if (!options.text && !options.html) {
                let contentKey = 'fields.' + (params.contentKey || params.id);
                let key = options.key || contentKey + '.' + type;
                options.html = translate(key, { self: !optional });
                if (optional && !options.html) return undefined;
            }
        }
        debug('hmpoGetOptions', params, type, options);
        return options;
    },

    hmpoTranslateExtraFieldContent(ctx, params, fieldKey, optional = false) {
        let translate = ctx('translate');
        let contentKey = 'fields.' + (params.contentKey || params.id);
        let key = contentKey + '.' + fieldKey;
        const translation = translate(key, { self: !optional });
        debug('hmpoTranslateExtraFieldContent', params, fieldKey, translation);
        return translation == `[${key}]`? undefined: translation;
    },

    hmpoGetValue(ctx, params) {
        let errorValue = ctx('errorValues.' + params.id);
        return errorValue !== undefined ? errorValue :ctx('values.' + params.id);
    },

    hmpoBuildErrorMessage(ctx, error, header = false) {
        if (error.message) return error.message;
        if (header && error.headerMessage) return error.headerMessage;

        let translate = ctx('translate');

        let contentkey = ctx('options.fields.' + error.key + '.contentKey') || error.key;

        let keys = [];

        if (header) keys.push(
            'fields.' + contentkey + '.validation.' + error.type + '_header',
            'validation.' + contentkey + '.' + error.type + '_header',
            'fields.' + contentkey + '.validation.default_header',
            'validation.' + contentkey + '.default_header'
        );

        if (header && error.errorGroup) keys.push(
            'fields.' + error.errorGroup + '.validation.' + error.type + '_header',
            'validation.' + error.errorGroup + '.' + error.type + '_header',
            'fields.' + error.errorGroup + '.validation.default_header',
            'validation.' + error.errorGroup + '.default_header'
        );

        keys.push(
            'fields.' + contentkey + '.validation.' + error.type,
            'validation.' + contentkey + '.' + error.type,
            'fields.' + contentkey + '.validation.default',
            'validation.' + contentkey + '.default'
        );

        if (error.errorGroup) keys.push(
            'fields.' + error.errorGroup + '.validation.' + error.type,
            'validation.' + error.errorGroup + '.' + error.type,
            'fields.' + error.errorGroup + '.validation.default',
            'validation.' + error.errorGroup + '.default'
        );

        keys.push(
            'validation.' + error.type,
            'validation.default'
        );

        let context = Object.assign(
            {},
            ctx(),
            {
                error,
                key: 'fields.' + contentkey,
                label: translate('fields.' + contentkey + '.label').toLowerCase(),
                legend: translate('fields.' + contentkey + '.legend').toLowerCase(),
                name: translate([
                    'fields.' + contentkey + '.name',
                    'fields.' + contentkey + '.label',
                    'fields.' + contentkey + '.legend'
                ]).toLowerCase()
            },
            error.args
        );

        return translate(keys, { context, self: false });
    },

    hmpoGetError(ctx, params) {
        let error = ctx('errors.' + params.id);

        let translate = ctx('translate');

        // if this field is part of a group and the group has a group error style this field as an error
        let fieldErrorGroup = ctx('options.fields.' + params.id + '.errorGroup');
        if (fieldErrorGroup) {
            if (error) return true;
            let errorGroupError = fieldErrorGroup && ctx('errors.' + fieldErrorGroup);
            if (errorGroupError && !errorGroupError.errorGroup) return true;
            return;
        }

        if (!error) return;

        let govukError = {
            id: params.id + '-error',
            visuallyHiddenText: translate('govuk.error'),
            text: globals.hmpoBuildErrorMessage(ctx, error)
        };
        debug('hmpoGetError', params, error, govukError);
        return govukError;
    },

    hmpoGetErrorSummary(ctx) {
        let errors = ctx('errorlist');
        if (!errors) return;
        let errorSummary = [];
        for (let error of errors) {
            errorSummary.push({
                href: '#' + (error.field || error.key),
                text: globals.hmpoBuildErrorMessage(ctx, error, true)
            });
        }
        debug('hmpoGetErrorSummary', errors, errorSummary);
        return errorSummary;
    }
};

let addGlobals = env => {
    debug('adding globals');
    for (let name in globals) env.addGlobal(name, globals[name]);
};

module.exports = {
    globals,
    addGlobals
};
