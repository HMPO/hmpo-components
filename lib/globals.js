'use strict';

const debug = require('debug')('hmpo:components:globals');
const deepCloneMerge = require('deep-clone-merge');

let globals = {
    hmpoGetParams(ctx, params, ...base) {
        let options = params && ctx('options.fields.' + params.id);
        return deepCloneMerge(
            {},
            ...base,
            options,
            params
        );
    },

    hmpoGetValidator(ctx, params, type) {
        if (!params.validate) return;
        if (params.validate === type) return { type };
        if (!Array.isArray(params.validate)) return;
        if (params.validate.contains(type)) return { type };
        let validator = params.validate.filter(v => v.type === type)[0];
        if (!validator) return;
        return {
            type,
            arguments: Array.isArray(validator.arguments) ?
                arguments : validator.arguments ?
                    [ validator.arguments ] : []
        };
    },

    hmpoGetAttributes(ctx, params, attributes) {
        return Object.assign(
            {},
            params.attributes,
            attributes
        );
    },

    hmpoGetValidatorAttribute(ctx, params, type, value) {
        let validator = globals.hmpoGetValidator(ctx, params, type);
        if (!validator) return;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return validator.arguments[value];
        return 'true';
    },

    hmpoGetItems(ctx, params, value, required) {
        let translate = ctx('translate');
        let items = params.items || params.options || [];
        let contentKey = 'fields.' + (params.contentKey || params.id);
        let placeholder = params.placeholder;
        if (placeholder === true) placeholder = { value: '' };
        if (placeholder) {
            let key = placeholder.key || contentKey + '.placeholder';
            placeholder.text = translate(key, { default: ' ' });
            if (required) placeholder.disabled = true;
            if (value === undefined) placeholder.selected = true;
            items = [ placeholder ].concat(items);
        }
        items = items.map(item => {
            if (typeof item === 'string') item = { value: item };
            if (!item.text && !item.html && !item.label) {
                let key = item.key || contentKey + '.items.' + item.value + '.label';
                item.html = item.text = translate(key);
            }
            if (!item.name) item.name = params.id;
            if (item.value !== undefined) {
                if (Array.isArray(value) && value.contains(item.value)) item.selected = item.checked = true;
                if (value === item.value) item.selected = item.checked = true;
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
                if (optional && options.html === false) return undefined;
            }
        }
        debug('hmpoGetOptions', params, type, options);
        return options;
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
                key: 'fields.' + contentkey,
                label: translate('fields.' + contentkey + '.label').toLowerCase(),
                legend: translate('fields.' + contentkey + '.legend').toLowerCase()
            },
            error.args
        );

        return translate(keys, { context, self: false });
    },

    hmpoGetError(ctx, params) {
        let error = ctx('errors.' + params.id);
        if (!error) {
            // if this field is part of a group and the group has a group error style this field as an error
            let fieldErrorGroup = ctx('options.fields.' + params.id + '.errorGroup');
            let errorGroupError = fieldErrorGroup && ctx('errors.' + fieldErrorGroup);
            if (errorGroupError && !errorGroupError.errorGroup) return true;
            return;
        }

        let govukError = {
            id: params.id + '-error',
            text: globals.hmpoBuildErrorMessage(ctx, error)
        };
        debug('hmpoGetError', params, error, govukError);
        return govukError;
    },

    hmpoGetErrorSummary(ctx) {
        var errors = ctx('errorlist');
        if (!errors) return;
        let errorSummary = [];
        for (let error of errors) {
            errorSummary.push({
                href: '#' + error.key + '-error',
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
