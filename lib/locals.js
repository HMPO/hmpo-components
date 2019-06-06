'use strict';

module.exports = {
    middleware(app, env) {
        return (req, res, next) => {
            Object.assign(res.locals, app.locals);
            res.locals.render = (value, context) => {
                if (Array.isArray(value)) {
                    return value.map(item => res.locals.render(item, context));
                }
                if (value && typeof value === 'object') {
                    let result = {};
                    for (var key in value) {
                        if (value.hasOwnProperty(key)) {
                            result[key] = res.locals.render(value[key], context);
                        }
                    }
                    return result;
                }
                value = String(value);
                if (value.indexOf('{{') === -1 && value.indexOf('{%') === -1) return value;
                return env.renderString(String(value), context || res.locals);
            },
            res.locals.translate = (key, options) => {
                options = options || {};
                let txt = req.translate ? req.translate(key, options) : key;
                if (txt === false || txt === undefined || txt === null) return;
                if (options.noRender) return txt;
                return res.locals.render(txt, options.context);
            };
            res.locals.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], res.locals) : res.locals;
            next();
        };
    }
};
