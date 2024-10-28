# passports-components
Nunjucks components and filters for building gov.uk pages with hmpo-form-wizard

## Installation

```javascript
npm install [--save] hmpo-components;
```

## Usage

```javascript
const path = require('path');
const express = require('express');
const i18n = require('hmpo-i18n');
const hmpoComponents = require('hmpo-template-components');

let views = [
    path.resolve(__dirname, 'views'),
    path.resolve(__dirname, 'node_modules', 'hmpo-components', 'components'),
    path.resolve(__dirname, 'node_modules', 'govuk-frontend'),
    path.resolve(__dirname, 'node_modules', 'govuk-frontend', 'components')
];

let nunjucksEnv = nunjucks.configure(views, { express: app });
i18n.middleware(app);
hmpoComponents.setup(app, nunjucksEnv);

app.set('view engine', 'html');

app.use(function (req, res) {
    res.render('mytemplate');
});
```

If rendering as part of an HMPO controller's middleware chain then the field configuration will automatically be set to `res.locals.options.fields` by the controller, and will be loaded from here by the components

## Translation

Translation is performed using a `req.translate` local function, for example as provided by [hmpo-i18n](https://npmjs.com/package/hmpo-i18n)

## Components

Components can be called as macros:
```
{% from "hmpo-input/macro.njk" import hmpoInput %}
{% from "hmpo-submit/macro.njk" import hmpoSubmit %}

{{ hmpoInput(ctx, { id: "fieldId" }) }}
{{ hmpoSubmit(ctx, { key: "textKey" }) }}
```

### Available form wizard components:
```
hmpoForm(ctx, params)
hmpoErrorGroup(ctx, params)
hmpoAutoSubmit(ctx, params)
hmpoSubmit(ctx, params)
hmpoCharacterCount(ctx, params)
hmpoCheckboxes(ctx, params);
hmpoDate(ctx, params)
hmpoNumber(ctx, params)
hmpoPhone(ctx, params)
hmpoRadios(ctx, params)
hmpoSelect(ctx, params)
hmpoText(ctx, params)
hmpoTextarea(ctx, params)
hmpoWordCount(ctx,params)
```

### Field parameters
Most govuk-frontend parameters can be specified in the fields config, or supplied to the component directly.
Label, hint, and legend text is loaded from localisation using a default key structure unless overridden.

- `label.key`: overridden label key.
- `legend.key`: overridden legend key.
- `hint.key`: overridden hint key
- `items`: Array of select box, radio, or checkbox options, or an Array of govuk item objects.
- `legend`: Applicable to `radio` button controls, which are wrapped in a HTML `fieldset` with a `legend` element.

### Other available components:
```
hmpoCircleStep(params);
hmpoCircleStepList(params);
hmpoClose(params);
hmpoCookieBanner(params);
hmpoDetails(params)
hmpoFlashCard(params)
hmpoFooter(params)
hmpoInsetText(params)
hmpoPrintPage(params)
hmpoSidebar(params)
hmpoWarningText(params)
```

## Deprecated form wizard components
```
hmpoCharsLeft(ctx, params)
```

### Helper and formatting components:
```
hmpoHtml(obj)
```

## Using hmpoCharacterCount and hmpoWordCount
hmpoCharacterCount will be replacing hmpoCharsLeft however for backwards compatability it will still be remaining. When using hmpoCharacterCount you will need specify a maxlength validator for the component in fields.js whereas for hmpoWordCount you will need to specify a maxwords validator. An example can be found below. 

```
'my-character-count': {
        ...
        validate: [
            ...,
            { type: 'maxlength', arguments: 10 }
        ]
    },
'my-word-count': {
        ...
        validate: [
            ...,
            { type: 'maxwords', arguments: 10 }
        ]
    },
```
You may also want to add a translation for the component and that can be found below. You will need to keep %{count} as this is used by the govuk frontend component to parse the character/word count:

```
"my-character-count": {
     ...
     "maxlength": "You can only enter up to {{maxlength}} characters" - required by default

     (The keys bellow will allow translation of the hint text. %{count} is parsed by gds to show dynamic count)

     "textareaDescriptionText": "Enter up to %{count} characters" - shown, instead of dynamic count, to the user if javascript is disabled,
     "charactersUnderLimitText": {
        "one": "you have one char left" - shown when user has one characters left
        "other": "you have %{count} characters left" - shown when user has n characters left

      } - shown to user when they have n characters remaining
      "charactersAtLimitText": "you have 0 characters remaining" - shown when user has no characters left
      "charactersOverLimitText": {
        "one": "you have entered 1 character too many " - shown when user has one character over the limit
        "other": "you have %{count} characters too many" - shown when user has n. characters over the limit

     } - shown to user when they have exceed number of allowed characters     
  },
"my-word-count": {
     ...
     "maxlength": "You can only enter up to {{maxlength}} words" - required by default

     (The keys bellow will allow translation of the hint text. %{count} is parsed by gds to show dynamic count)

     "textareaDescriptionText": "Enter up to %{count} chars" - shown, instead of dynamic count, to the user if javascript is disabled,
     "wordUnderLimitText": {
        "one": "you have one word left" - shown when user has one word left
        "other": "you have %{count} wrods left" - shown when user has n words left

      } - shown to user when they have n words remaining
      "wordsAtLimitText": "you have 0 words remaining" - shown when user has no words left
      "wordsOverLimitText": {
        "one": "you have entered one word too many " - shown when user has one word over the limit
        "other": "you have %{count} words too many" - shown when user has n. words over the limit

     } - shown to user when they have exceed number of allowed words     
  }
```

## Filters

```
translate
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
filter
add
```

### `date` filter

Dates should be provided a a format that moment can decode, such as ISO String format, moment object, or epoch milliseconds.
```
{{ "2017-06-03T12:34:56.000Z" | date }}
3 June 2017
```

A moment format can be supplied. The default format is D MMMM YYYY.
```
{{ "2017-06-3T12:34:56.000Z" | date("DD MMM YYYY HH:MMa") }}
03 Jun 2017 12:34pm
```

### `time` filter

The time formatter wraps a formatted time to correct for GDS standard:
```
{{ "3:00pm" | time }}
3pm

{{ "11 May 2017 at 12:00pm" | time }}
11 May 2017 at midday

{{ "12:00am" | time }}
Midnight
```

Options can be provided to only do transforms for midday, midnight, or shortened time:
```
{{ "12:00pm" | time({ short: true, midnight: true, midnight: false }) }}
12pm
```

## Controller mixins

Use the controller mixins to extend the base wizard controller:
```
const BaseController = require('hmpo-form-wizard').Controller;
const DateControllerMixin = require('hmpo-components').mixins.Date;

const DateController = DateControllerMixin(BaseController);

class MyController extends DateController {    
}
```

## DateController mixin

The `DateController` mixin adds day, month, and year fields for a YYYY-MM-DD date field so the `hmpoDate` component can be validated and processed properly.

The date field must use the `date` validator to use this functionality.

Additional validation errors can be produced and need localisation, for example:

```
"validation": {
    "date": "Enter a complete {{name}}",
    "date-year": "Enter a valid year",
    "date-month": "Enter a valid month",
    "date-day": "Enter a valid day",

    "required-day": "Enter a complete {{name}}",
    "required-month": "Enter a complete {{name}}",
    "required-year": "Enter a complete {{name}}",

    "numeric-year": "Enter a year using numbers only",
    "numeric-month": "Enter a month using numbers only",
    "numeric-day": "Enter a day using numbers only"
}
```

## Breaking changes

### 3.0.0

- The error summary now links to the form field causing the error instead of the error text div. You can add a `field` parameter to custom errors to an error to override the link.
- The first item in a set of radio buttons or checkboxes will now have the id set to _fieldname_ instead of _fieldname_-_value_.

### 5.0.0

- This version should only be used with govuk-frontend >= 4. See the govuk-frontend changelog for other breaking changes.
- Summary lists have the hmpo styling by default. this can be turned off with a css variable `$hmpo-summary-list: false;`
- The hmpo small font styling is applied by default. This can be changed using the css variable `$hmpo-text-size: "big";`
