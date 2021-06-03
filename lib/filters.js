'use strict';

const debug = require('debug')('hmpo:components:filters');

const path = require('path').posix;
const moment = require('moment');

let filters = {
    currency(input, { currencySymbol = '£', zeroValue, penceToPound } = {}) {
        let value = parseFloat(input);
        if (isNaN(value)) {
            return input;
        } else if (zeroValue !== undefined && value === 0) {
            return zeroValue;
        } else if (penceToPound) {
            value = value / 100;
        }

        if (value % 1 === 0) {
            value = value.toString();
        } else {
            value = value.toFixed(2);
        }
        return currencySymbol + value;
    },

    currencyOrFree(value, options) {
        return filters.currency.call(this, value, Object.assign({ zeroValue: filters.translate.call(this, 'free') }, options));
    },

    date(txt, format = 'D MMMM YYYY', locale = 'en', invalid = '') {
        if (!txt) return invalid;
        let date = moment(txt);
        if (!date.isValid()) return invalid;
        date.locale(locale);
        return date.format(format);
    },

    hyphenate(txt) {
        if (typeof txt !== 'string') return txt;
        return txt.trim().toLowerCase().replace(/\s+/g, '-');
    },

    uppercase(txt) {
        if (typeof txt !== 'string') return txt;
        return txt.toUpperCase();
    },

    lowercase(txt) {
        if (typeof txt !== 'string') return txt;
        return txt.toLowerCase();
    },

    capscase(txt) {
        if (typeof txt !== 'string') return txt;
        return txt.substr(0, 1).toUpperCase() + txt.substr(1);
    },

    camelcase(txt) {
        if (typeof txt !== 'string') return txt;
        return txt
            .toLowerCase()
            .replace(/^[^a-z0-9]+/g, '')
            .replace(/[^a-z0-9]+$/g, '')
            .replace(/[^a-z0-9]+([a-z])/g,
                (_, letter) => letter.toUpperCase());
    },

    possessive(txt, lang = 'en', curly = true) {
        if (typeof txt !== 'string') return txt;
        let apos = curly ? '’' : '\'';
        if (lang === 'en') return txt.slice(-1) === 's' ? txt + apos : txt + apos + 's';
        return txt;
    },

    /**
    * Use on whole sentences
    */
    time(value, { short, midnight, midday } = { short: true, midnight: true, midday: true }) {
        if (midnight) {
            value = value.replace(/12:00am/ig, 'midnight');
            value = value.replace(/^midnight/, 'Midnight');
        }
        if (midday) {
            value = value.replace(/12:00pm/ig, 'midday');
            value = value.replace(/^midday/, 'Midday');
        }
        if (short) {
            value = value.replace(/:00(am|pm)/ig, '$1');
        }
        return value;
    },

    translate(txt, options) {
        return this.ctx.translate ? this.ctx.translate(txt, options) : txt;
    },

    jsonStringify(obj) {
        return JSON.stringify(obj, null, 2);
    },

    url(url) {
        return this.ctx.baseUrl ? path.resolve(this.ctx.baseUrl, url) : url;
    },

    filter(obj, condition) {
        if (!obj) return obj;
        if (Array.isArray(obj)) {
            if (condition === undefined) return obj.filter(i => i);
            else if (typeof condition === 'object') return obj.filter(i => {
                if (!i) return false;
                return Object.keys(condition).filter(key => i[key] === condition[key]).length;
            });
            condition = String(condition);
            return obj.filter(i => i && i[condition]);
        }
        if (typeof obj === 'object') {
            let keys = Object.keys(obj);
            if (condition === undefined) keys = keys.filter(i => obj[i]);
            else if (typeof condition === 'object') keys = keys.filter(i => {
                if (!obj[i]) return false;
                return Object.keys(condition).filter(key => obj[i][key] === condition[key]).length;
            });
            else {
                condition = String(condition);
                keys = keys.filter(i => obj[i] && obj[i][condition]);
            }
            let result = {};
            keys.forEach(key => result[key] = obj[key]);
            return result;
        }
        return obj;
    },

    push(array, item) {
        if (Array.isArray(array)) return [...array, item];
        return array;
    },

    unshift(array, item) {
        if (Array.isArray(array)) return [item, ...array];
        return array;
    },

    add(obj, key, item) {
        if (obj && typeof obj === 'object') return Object.assign({}, obj, { [key]: item });
        return obj;
    },

    delete(obj, key) {
        if (obj && typeof obj === 'object') {
            obj = Object.assign({}, obj);
            delete obj[key];
        }
        return obj;
    }

};

let addFilters = env => {
    debug('adding filters');
    for (let name in filters) env.addFilter(name, filters[name]);
};

module.exports = {
    filters,
    addFilters
};
