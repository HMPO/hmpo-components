'use strict';

const debug = require('debug')('hmpo:components:locals');
const nunjucks = require('nunjucks');

module.exports = {
    middleware(app, env, opts) {
        const renderCache = new Map();

        opts = opts || env.opts || {};

        function renderString(value, context, path) {
            value = String(value);
            if (value.indexOf('{{') === -1 && value.indexOf('{%') === -1) return value;
            let tmpl;
            if (!opts.noCache && renderCache.has(value)) {
                debug('get render cache item ', { path, value });
                tmpl = renderCache.get(value);
            } else {
                tmpl = new nunjucks.Template(value, env, 'locale:' + context.htmlLang + ':' + path);
                if (!opts.noCache) {
                    renderCache.set(value, tmpl);
                    debug('set render cache item ', { path, value, newSize: renderCache.size });
                }
            }

            return tmpl.render(context);
        }

        function recursiveRender(value, context, path) {

            if (Array.isArray(value)) {
                return value.map((item, index) => recursiveRender(item, context, path + '.' + index));
            }

            if (value && typeof value === 'object') {
                let result = {};
                for (var key in value) {
                    /* istanbul ignore else */
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        result[key] = recursiveRender(value[key], context, path + '.' + key);
                    }
                }
                return result;
            }

            return renderString(value, context, path);
        }

        return (req, res, next) => {
            Object.assign(res.locals, app.locals);
            res.locals.translate = (key, options) => {
                options = options || {};
                let txt = req.translate ? req.translate(key, options) : key;
                if (txt === false || txt === undefined || txt === null) return;
                if (options.noRender) return txt;
                return recursiveRender(txt, options.context || res.locals, String(key));
            };
            res.locals.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], res.locals) : res.locals;
            next();
        };
    }
};
