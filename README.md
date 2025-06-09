# HMPO Components

`hmpo-components` is a collection of nunjucks components, filters and mixins. These reusable UI elements help ensure consistency and accessibility when developing GOV.UK pages with hmpo-form-wizard.

## Installation

```javascript
npm install [--save] hmpo-components;
```


## ESM and Bundler Requirements

**NOTE:**
`hmpo-components` **v8.0.2 and above** uses [GOV.UK Frontend v5+](https://github.com/alphagov/govuk-frontend), which requires [ECMAScript Modules (ESM)](https://nodejs.org/api/esm.html) and a modern JavaScript bundler.

### How to Bundle ESM JavaScript

You must use a JavaScript bundler (such as **Rollup**, **Webpack**, or **Vite**) that supports ESM.
Directly including these modules in `<script>` tags in browsers is **not supported**.

**If your project or its dependencies use a mix of CommonJS (CJS) and ESM modules, you will need to configure Rollup with additional plugins to ensure everything is bundled correctly.**

#### 1. Install dependencies

```bash
npm install govuk-frontend hmpo-components rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-terser
```

#### 2. Example entry file (`assets/javascripts/app.js`)

```js
import { initAll } from 'govuk-frontend';
import 'hmpo-components/all.js';

// ...your custom JS here

initAll();
```

#### 3. Example Rollup config (`rollup.config.mjs`)

```js
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'assets/javascripts/app.js',
  output: {
    file: 'public/javascripts/application.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    terser()
  ],
};
```

#### 4. Add a build script to your `package.json`

```json
"scripts": {
  "build:js": "mkdir -p public/javascripts && rollup -c"
}
```

Build your bundle with:

```bash
npm run build:js
```

#### 5. Include the bundle in your HTML

```html
<script type="module" src="/public/javascripts/application.js"></script>
```

---

> If you previously included scripts directly with `<script>`, you will need to update your build pipeline to use ESM and a bundler.

_For more options and troubleshooting, see the [Rollup documentation](https://rollupjs.org/) and plugin docs._

## Usage

To use `hmpo-components` in your Express app, follow these steps:

### Example Setup

### hmpo-app

`hmpo-app` provides a comprehensive setup for applications, streamlining the configurations process. It includes built-in features such as logging, error handling, and session management, making it easier to get started. Additionally, `hmpo-app` handles the setup and configuration for `hmpo-form-wizard`, which in turn incorporates `hmpo-components` to ensure consistency and accessibility in your forms.

##### Example Setup with hmpo-app

```javascript
const { setup } = require('hmpo-app');
const express = require('express');

const { app, staticRouter, router } = setup({ config: { APP_ROOT: __dirname } });

// Override template file extension from .html to .njk
app.set('view engine', 'njk');

// Mock API to submit data to
staticRouter.use(express.json());
staticRouter.post('/api/submit', (req, res) => {
    console.log(`Mock submit API received data: ${JSON.stringify(req.body, null, 2)}`);
    setTimeout(() => {
        res.json({
            reference: Math.round(100000 + Math.random() * 100000)
        });
    }, 1000);
});

router.use('/eligibility', require('./routes/eligibility'));
router.use('/apply', require('./routes/apply'));
router.get('/', (req, res) => res.redirect('/eligibility'));

app.use(staticRouter);
app.use(router);
app.use(errorRouter);
```

### hmpo-form-wizard

While `hmpo-app` is recommended for its comprehensive setup, you can still use the raw form wizard setup instructions if needed.

```javascript
const hmpoLogger = require('hmpo-logger');
const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const hmpoComponents = require('hmpo-components');
const i18n = require('hmpo-i18n');
const config = require('./config');

const logger = hmpoLogger.config(config.logs).get();

const app = express();

// log access requests
app.use(hmpoLogger.middleware());

// Add routing for static assets
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use('/public/images', express.static(path.resolve(__dirname, 'node_modules', 'hmpo-components', 'assets', 'images')));

// Set up templating engine (Nunjucks)
app.set('view engine', 'html');
const nunjucksEnv = nunjucks.configure([
    path.resolve(__dirname, 'views'),
    path.resolve(__dirname, 'node_modules', 'hmpo-components', 'components'),
    path.resolve(__dirname, 'node_modules', 'govuk-frontend')
], {
    express: app,
    dev: true, // Set to false in production
    noCache: true, // Disable caching in dev
    watch: true // Enable template watching in dev
});

// Set up i18n middleware
i18n.middleware(app, {
    query: 'lang',
    allowedLangs: ['en', 'cy'],
    cookie: { name: 'lang' },
    watch: true,
    baseDir: [
        path.resolve(__dirname),
        path.resolve(__dirname, 'node_modules', 'hmpo-components')
    ]
});

// Initialize hmpo-components
hmpoComponents.setup(app, nunjucksEnv);

// Define a simple route to render a template
app.get('/', (req, res) => res.render('pages/index'));

// Start the server
app.listen(config.port, () => {
    logger.info('App listening on http://localhost::port', { port: config.port });
});
```

If rendering as part of an HMPO controller's middleware chain then the field configuration will automatically be set to `res.locals.options.fields` by the controller, and will be loaded from here by the components.

## Further Usage

For more examples of how to use `hmpo-components`, the `hmpo-app` [example app](https://github.com/HMPO/hmpo-app/blob/master/example/app.js) provides examples of how these components can be integrated within a broader application context.

Additionally, the `hmpo-form-wizard` [example app](https://github.com/HMPO/hmpo-form-wizard/tree/master/example) demonstrates how `hmpo-components` are used within the `hmpo-form-wizard` to render form components on each page of a multi-step form flow.

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

- `hmpoForm(ctx, params, base)`: Renders a form element with configurable attributes and CSRF protection.

- `hmpoErrorGroup(ctx, params)`: Wraps form fields with GOV.UK styling, adding headings, hints, and error mesages for accessibility and consistency.

- `hmpoAutoSubmit(ctx, params)`: Creates an auto-submit form wrapper with a loading spinner, help text, and a fallback manual submit button, using GOV.UK styling and configurable delays.

- `hmpoSubmit(ctx, params, base)`: Generates a submit button with optional text, href link, accessibility attributes, and prevention for double-clicking, ensuring consistent button behaviour in forms.

- `hmpoCharacterCount(ctx, params, base)`: Renders a character count input field by calling the `hmpoTextCount` macro, ensuring users stay within a set character limit.

- `hmpoCheckboxes(ctx, params, base)`: Generates a checkbox group, handling labels, hints, error messages, and optional conditional fields while ensuring accessibility and validation support.

- `hmpoDate(ctx, params, base)`: Generates a date input field, handling day, month, and year inputs with validation, error messages, accessibility attributes, and optional inexact date support.

- `hmpoNumber(ctx, params, base)`: Generates a number input field with numeric input, a pattern attribute for validation, and a width of 10 characters, using the `hmpoText` macro.

- `hmpoPhone(ctx, params, base)`: Generates a phone number input field with a width of 20 characters, `tel` input for phone numbers, and a maximum length of 18 characters, using the `hmpoText` macro.

- `hmpoRadios(ctx, params, base)`: Generates a radio button group, handling labels, hints, error messages, inline display options, and conditional reveal content for certain choices.

- `hmpoSelect(ctx, params, base)`: Generates a dropdown (`<select>`) component, handling labels, hints, error messages, accessibility attributes, required validation, and pre-selected values while ensuring consistency with GOV.UK design standards.

- `hmpoText(ctx, params, base)`: Generates a text input or textarea field, handling labels, prefixes, error messages, accessibility attributes, validation rules, and optional no-past restrictions.

- `hmpoTextarea(ctx, params, base)`: Creates a textarea input by reusing `hmpoText`, setting the input type to `textarea` and applying a `govuk-!-width-three-quarters` class for styling and consistency.

- `hmpoWordCount(ctx, params)`: Renders a text input with a word count limit by reusing `hmpoTextCount`, setting the type to `wordcount`, and applying a `govuk-!-width-three-quarters` class for styling.

- `hmpoField(ctx, params, isPageHeading)`: Dynamically selects and renders the appropriate form component based on the field type, applying GOV.UK styling, handling conditional fields, grouped fields, labels, legends, and error messages.

- `hmpoTextCount(ctx, params)`: Generates a text area with a character or word count limit, applying validation, error messages, accessibility attributes, and custom messages for under, at, and over-limit states.


### Field parameters
Most govuk-frontend parameters can be specified in the fields config, or supplied to the component directly.
Label, hint, and legend text is loaded from localisation using a default key structure unless overridden.

### Common parameters:

- `label.key`: overridden label key.
- `legend.key`: overridden legend key.
- `hint.key`: overridden hint key
- `items`: Array of select box, radio, or checkbox options, or an Array of govuk item objects.
- `legend`: Applicable to `radio` button controls, which are wrapped in a HTML `fieldset` with a `legend` element.

For a comprehensive list of all available parameters, refer to the [GOV.UK Frontend documentation](https://design-system.service.gov.uk/).

### Other available components:

- `hmpoCircleStep(params)`: Generates a numbered step in a list with a circular icon, optional title, and description, allowing custom classes and attributes for styling and accessibility.

- `hmpoCircleStepList(params)`: Generates an ordered list of circular step items using `hmpoCircleStep`, automatically numbering steps and supporting custom classes, attributes, titles, and descriptions.

- `hmpoClose(params)`: Generates a close button using the `govukButton` component, wrapping it in a `<div>` with a `data-module="hmpo-close` attribute for Javascript-based functionality.

- `hmpoCookieBanner(params)`: Generates a cookie banner component with customizable classes, attributes, and a message, ensuring it follows accessibility and SEO best practices with `data-nosnippet`.

- `hmpoDetails(params)`: Renders an expandable details component, allowing for custom content via `params.html` or a passed block using `caller()`.

- `hmpoFlashCard(params)`: Generates a flash card component with optional custom classes, attributes, and content, allowing dynamic content insertion via `params.content` or a passed block using `caller()`.

- `hmpoFooter(params)`: Renders a customizable GOV.UK-style footer, including navigation links, metadata, licensing information, and copyright details, by incorporating `template.njk`.

- `hmpoInsetText(params)`: Generates an inset text component using govukInsetText, allowing for optional custom content via `caller()` or `params.html`.

- `hmpoPrintPage(params)`: Creates a print page link with the text "Print page" (or custom text via `params.html` or `params.text`), and adds a module for triggering print functionality.

- `hmpoSidebar(params)`: Generates a sidebar component with optional custom classes and attributes. The sidebar content is inserted within a nested `hmpo-sidebar__inner` div, which can also accept additional classes.

- `hmpoWarningText(params)`: Generates a warning text component by reusing govukWarningText, allowing custom content to be passed through `params.html` or `caller()`.

## Deprecated form wizard components
```
hmpoCharsLeft(ctx, params)
```

### Helper and formatting components:

- `hmpoHtml(params)`: Renders content as either individual HTML elements (e.g., paragraphs, headers) or as a list, based on the structure of `params`. If the content is a list, it will call `hmpoHtmlList`. If the content is individual items, it uses `hmpoHtmlItem`. The content can include special formatting, like inset text or headers, based on the content structure.

- `hmpoHtmlList(params)`: Generates an unordered list (`<ul>`) where each list item (`<li>`) is rendered by `hmpoHtmlItem`. It accepts `params.items` as the list content and supports custom classes for the list.

- `hmpoHtmlItem(tag, value)`: Renders an individual HTML element (paragraph, header, etc.) based on the provided tag and value. This macro also handles special cases, such as rendering inset text or converting Markdown-style headers to HTML tags.

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

**Messages in the validation object are required by default**

```
"my-character-count": {
     ...
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

     validation: {
        ...
        "maxlength": "You can only enter up to {{maxlength}} characters" - required by default
     }
  },
"my-word-count": {
     ...
     (The keys bellow will allow translation of the hint text. %{count} is parsed by gds to show dynamic count)

     "textareaDescriptionText": "Enter up to %{count} chars" - shown, instead of dynamic count, to the user if javascript is disabled,

     "wordsUnderLimitText": {
        "one": "you have one word left" - shown when user has one word left
        "other": "you have %{count} wrods left" - shown when user has n words left

      } - shown to user when they have n words remaining

      "wordsAtLimitText": "you have 0 words remaining" - shown when user has no words left

      "wordsOverLimitText": {
        "one": "you have entered one word too many " - shown when user has one word over the limit
        "other": "you have %{count} words too many" - shown when user has n. words over the limit

     } - shown to user when they have exceed number of allowed words

     validation: {
        ...
        "maxwords": "You can only enter up to {{maxwords}} words" - required by default
     }
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
