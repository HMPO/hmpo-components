# passports-template-mixins
A middleware that exposes a series of Mustache mixins on `res.locals` to ease usage of forms, translations, and some other things.

It takes an optional [options object](#options) argument.

## Installation

```javascript
npm install [--save] hmpo-template-mixins;
```

## Usage

```javascript
const express = require('express');
const i18n = require('i18n-future');
const mixins = require('hmpo-template-mixins');

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(i18n.middleware());
app.use(mixins({ sharedTranslationsKey: 'passport.renew' }));

app.use(function (req, res) {
    // NOTE: res.locals.partials has been set.

    res.render('example-template');
});
```

If rendering as part of an HMPO controller's middleware chain then the field configuration will automatically be set to `res.locals.options.fields` by the controller, and will be loaded from here by the mixins.

Alternatively, if not using HMPO controllers, you can explicitly set field configuration with instantiating the middleware by passing a `fields` option. This should not be used for dynamic field configuration.

## Translation

By default any function set to `req.translate` will be used for translation if it exists. For example, that generated using [i18n-future](https://npmjs.com/package/i18n-future) middleware.

## Options

### viewsDirectory

Allows you override the directory that the module checks for partials in - Default: the root of this project

### viewEngine

Allows you to alter the file extension of the templates - Default: 'html'

### sharedTranslationsKey

Prefixes keys for translation - Default: '' (empty string)

### translate

Defines a custom translation method - Default: `req.translate`

## Mustache mixins available

```
t
selected
lowercase
uppercase
capscase
hyphenate
date
time
currency
currencyOrFree
url
select
input-text
input-text-compound
input-text-code
input-number
input-phone
radio-group
checkbox
checkbox-compound
checkbox-required
checkbox-group
input-submit
textarea
input-date
input-date-group
error-group
error-group-end
```

## Field options

- `className`: A string or array of string class names.
- `labelClassName`: A string or array of string class names for the label, hint, and error section.
- `labelTextClassName`: A string or array of string class names for the label text.
- `label`: The intended value of the HTML `label` attribute.
- `type`: The value of the HTML input `type` attribute.
- `required`: Value applied to `aria-required` HTML attribute.
- `hint`: This adds context to the label, which it is a part of, for input text, radio groups and textarea. It is used within the input by aria-describedby for screen readers.
- `hintClassName`: A string or array of string class names for the hint,
- `maxlength`: Applicable to text-based fields and mapped to the `maxlength` HTML attribute.
- `options`: Applicable to HTML `select` and `radio` controls and used to generate the items of either HTML element.
- `selected`: Applicable to `select`, `checkbox`, and `radio` controls. Will render the selected HTML option/element selected or checked.
- `legend`: Applicable to `radio` button controls, which are wrapped in a HTML `fieldset` with a `legend` element.
- `legendClassName`: Applied as a class name to HTML `legend` attribute.
- `toggle`: Can be used to toggle the display of the HTML element with a matching `id`. See [passports-frontend-toolkit](https://github.com/UKHomeOffice/passports-frontend-toolkit/blob/master/assets/javascript/progressive-reveal.js) for details.
- `attributes`: A hash of key/value pairs applicable to a HTML `textarea` field. Each key/value is assigned as an attribute of the `textarea`. For example `spellcheck="true"`.
- `child`: Render a child partial beneath each option in an `optionGroup`. Accepts a custom mustache template string, a custom partial in the format `partials/{your-partial-name}` or a template mixin key which will be rendered within a panel element partial.

## `date` mixin

Dates should be provided to the date lambda in ISO format
```
{{#date}}2017-06-03T12:34:56.000Z{/date}
3 June 2017
```

A moment format can be supplied. The default format is D MMMM YYYY.
```
{{#date}}2017-06-3T12:34:56.000Z|DD MMM YYYY HH:MMa{/date}
03 Jun 2017 12:34pm
```

## `time` mixin

The time formatter wraps a formatted time to correct for GDS standard:
```
{{#time}}3:00pm{{/time}}
3pm

{{#time}}11 May 2017 at 12:00pm{{/time}}
11 May 2017 at midday

{{#time}}12:00am{{/time}}
Midnight
```

Comma separated options can be provided to only do transforms for midday, midnight, or shortened time:
```
{{#time}}12:00pm|short,midnight{{/time}}
12pm
```

