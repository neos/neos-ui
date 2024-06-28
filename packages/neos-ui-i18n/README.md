# @neos-project/neos-ui-i18n

> I18n utilities for Neos CMS UI.

This package connects Flow's Internationalization (I18n) framework with the Neos UI.

In Flow, translations are organized in [XLIFF](http://en.wikipedia.org/wiki/XLIFF) files that are stored in the `Resources/Private/Translations/`-folder of each Flow package.

The Neos UI does not load all translation files at once, but only those that have been made discoverable explicitly via settings:
```yaml
Neos:
  Neos:
    userInterface:
      translation:
        autoInclude:
          'Neos.Neos.Ui':
            - Error
            - Main
            // ...
          'Vendor.Package':
            - Main
            // ...
```

At the beginning of the UI bootstrapping process, translations are loaded from an enpoint (see: [`\Neos\Neos\Controller\Backend\BackendController->xliffAsJsonAction()`](https://neos.github.io/neos/9.0/Neos/Neos/Controller/Backend/BackendController.html#method_xliffAsJsonAction)) and are available afterwards via the `translate` function exposed by this package.

## API

### `translate`

```typescript
function translate(
    fullyQualifiedTranslationAddressAsString: string,
    fallback: string | [string, string],
    parameters: Parameters = [],
    quantity: number = 0
): string;
```

`translate` will use the given translation address to look up a translation from the ones that are currently available (see: [`initializeI18n`](#initializeI18n)).

To understand how the translation address maps onto the translations stored in XLIFF files, let's take a look at the structure of the address:
```
"Neos.Neos.Ui:Main:errorBoundary.title"
 └────┬─────┘ └─┬┘ └───────────┬─────┘
  Package Key  Source Name  trans-unit ID
```

Each translation address consists of three Parts, one identifying the package (Package Key), one identifying the XLIFF file (Source Name), and one identifying the translation itself within the XLIFF file (trans-unit ID).

Together with the currently set `Locale`, Package Key and Source Name identify the exact XLIFF file for translation thusly:
```
resource://{Package Key}/Private/Translations/{Locale}/{Source Name}.xlf
```

So, the address `Neos.Neos.Ui:Main:errorBoundary.title` would lead us to:
```
resource://Neos.Neos.Ui/Private/Translations/de/Main.xlf
```

Within the XLIFF-file, the trans-unit ID identifies the exact translation to be used:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file original="" product-name="Neos.Neos.Ui" source-language="en" target-language="de" datatype="plaintext">
    <body>
      <!-- ... -->
      <!--              ↓ This is the one             -->
      <trans-unit id="errorBoundary.title" xml:space="preserve">
        <source>Sorry, but the Neos UI could not recover from this error.</source>
        <target>Es tut uns leid, aber die Neos Benutzeroberfläche konnte von diesem Fehler nicht wiederhergestellt werden.</target>
      </trans-unit>
      <!-- ... -->
    </body>
  </file>
</xliff>
```

If no translation can be found, `translate` will return the given `fallback` string.

Translations (and fallbacks) may contain placeholders, like:
```
All changes from workspace "{0}" have been discarded.
```

Placeholders may be numerically indexed (like the one above), or indexed by name, like:
```
Copy {source} to {target}
```

For numerically indexed placeholders, you can pass an array of strings to the `parameters` argument of `translate`. For named parameters, you can pass an object with string values and keys identifying the parameters.

Translations may also have plural forms. `translate` uses the [`Intl` Web API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) to pick the currect plural form for the current `Locale` based on the given `quantity`.

Fallbacks can also provide plural forms, but will always treated as if we're in locale `en-US`, so you can only provide two different plural forms.

#### Arguments

| Name | Description |
|-|-|
| `fullyQualifiedTranslationAddressAsString` | The translation address for the translation to use, e.g.: `"Neos.Neos.Ui:Main:errorBoundary.title"` |
| `fallback` | The string to return, if no translation can be found under the given address. If a tuple of two strings is passed here, these will be treated as singular and plural forms of the translation. |
| `parameters` | Values to replace placeholders in the translation with. This can be passed as an array of strings (to replace numerically indexed placeholders) or as a `Record<string, string>` (to replace named placeholders) |
| `quantity` | The quantity is used to determine which plural form (if any) to use for the translation |

#### Examples

##### Translation without placeholders or plural forms

```typescript
translate('Neos.Neos.Ui:Main:insert', 'insert');
// output (en): "insert"
```

##### Translation with a numerically indexed placeholder

```typescript
translate(
  'Neos.Neos:Main:workspaces.allChangesInWorkspaceHaveBeenDiscarded',
  'All changes from workspace "{0}" have been discarded.',
  ['user-admin']
);

// output (en): All changes from workspace "user-admin" have been discarded.
```

##### Translation with a named placeholder

```typescript
translate(
  'Neos.Neos.Ui:Main:deleteXNodes',
  'Delete {amount} nodes',
  {amount: 12}
);

// output (en): "Delete 12 nodes"
```

##### Translations with placeholders and plural forms

```typescript
translate(
  'Neos.Neos.Ui:Main:changesPublished',
  ['Published {0} change to "{1}".', 'Published {0} changes to "{1}".']
  [1, "live"],
  1
);
// output (en): "Published 1 change to "live"."

translate(
  'Neos.Neos.Ui:Main:changesPublished',
  ['Published {0} change to "{1}".', 'Published {0} changes to "{1}".']
  [20],
  20
);
// output (en): "Published 20 changes to "live"."
```

### `initializeI18n`

```typescript
async function initializeI18n(): Promise<void>;
```

> [!NOTE]
> Usually you won't have to call this function yourself. The Neos UI will
> set up I18n automatically.

This function loads the translations from the translations endpoint and makes them available globally. It must be run exactly once before any call to `translate`.

The exact URL of the translations endpoint is discoverd via the DOM. The document needs to have a link tag with the id `neos-ui-uri:/neos/xliff.json`, with the following attributes:
```html
<link
  id="neos-ui-uri:/neos/xliff.json"
  href="https://mysite.example/neos/xliff.json?locale=de-DE"
  data-locale="de-DE"
  data-locale-plural-rules="one,other"
>
```

The `ApplicationView` PHP class takes care of rendering this tag.

### `setupI18n`

```typescript
function setupI18n(
    localeIdentifier: string,
    pluralRulesAsString: string,
    translations: TranslationsDTO
): void;
```

This function can be used in unit tests to set up I18n.

#### Arguments

| Name | Description |
|-|-|
| `localeIdentifier` | A valid [Unicode Language Identifier](https://www.unicode.org/reports/tr35/#unicode-language-identifier), e.g.: `de-DE`, `en-US`, `ar-EG`, ... |
| `pluralRulesAsString` | A comma-separated list of [Language Plural Rules](http://www.unicode.org/reports/tr35/#Language_Plural_Rules) matching the locale specified by `localeIdentifier`. Here, the output of [`\Neos\Flow\I18n\Cldr\Reader\PluralsReader->getPluralForms()`](https://neos.github.io/flow/9.0/Neos/Flow/I18n/Cldr/Reader/PluralsReader.html#method_getPluralForms) is expected, e.g.: `one,other` for `de-DE`, or `zero,one,two,few,many` for `ar-EG` |
| `translations` | The XLIFF translations in their JSON-serialized form |

##### `TranslationsDTO`

```typescript
type TranslationsDTO = {
  [serializedPackageKey: string]: {
    [serializedSourceName: string]: {
      [serializedTransUnitId: string]: string | string[]
    }
  }
}
```

The `TranslationDTO` is the payload of the response from the translations endpoint (see: [`\Neos\Neos\Controller\Backend\BackendController->xliffAsJsonAction()`](https://neos.github.io/neos/9.0/Neos/Neos/Controller/Backend/BackendController.html#method_xliffAsJsonAction)).

###### Example:

```jsonc
{
  "Neos_Neos_Ui": { // <- Package Key with "_" instead of "."
    "Main": { // <- Source name with "_" instead of "."

      // Example without plural forms
      "errorBoundary_title": // <- trans-unit ID with "_" instead of "."
        "Sorry, but the Neos UI could not recover from this error.",

      // Example with plural forms
      "changesDiscarded": [ // <- trans-unit ID with "_" instead of "."
        "Discarded {0} change.",
        "Discarded {0} changes."
      ]
    }
  }
}
```

### `teardownI18n`

```typescript
function teardownI18n(): void;
```

This function must be used in unit tests to clean up when `setupI18n` has been used.
