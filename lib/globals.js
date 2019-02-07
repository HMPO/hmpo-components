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

    hmpoGetValidator(ctx, params, name) {
        if (!params.validate) return;
        if (params.validate === name) return { name };
        if (!Array.isArray(params.validate)) return;
        if (params.validate.contains(name)) return { name };
        let validator = params.validate.filter(v => v.name === name)[0];
        if (!validator) return;
        return {
            name: validator.name,
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

    hmpoGetValidatorAttribute(ctx, params, name, value) {
        let validator = globals.hmpoGetValidator.call(this, params, name);
        if (!validator) return;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return validator.arguments[value];
        return 'true';
    },

    hmpoGetItems(ctx, params, value) {
        let translate = ctx('translate');
        let items = params.items || params.options || [];
        let contentKey = params.contentKey || 'fields.' + params.id;
        let placeholder = params.placeholder;
        if (placeholder === true) placeholder = { value: '' };
        if (placeholder) {
            let key = placeholder.key || contentKey + '.placeholder';
            placeholder.text = translate(key, { default: ' ' });
            placeholder.disabled = true;
            items = [ placeholder ].concat(items);
        }
        items = items.map(item => {
            if (typeof item === 'string') item = { value: item };
            if (!item.text && !item.html && !item.label) {
                let key = item.key || contentKey + '.items.' + item.value + '.label';
                item.html = item.text = translate(key);
            }
            if (value === item.value) item.selected = item.checked = true;
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
                let contentKey = params.contentKey || 'fields.' + params.id;
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

    hmpoGetError(ctx, params) {
        return ctx('errors.' + params.id);
    },

    hmpoGetErrorSummary(ctx) {
        return ctx('errors');
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
