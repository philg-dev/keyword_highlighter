# Todo

- analyze performance
- restructure code to avoid unnecessary execution
  - script loads
  - storage access (=> caching)
- make UI pretty

# Feature ideas

## planned features

- dynamic amount of terms lists
  - user defined styles per list
- temporary terms list (not persisted)
- jump through highlights like browser search
  - use methods `element.checkVisibility()` and `element.scrollIntoView()`

## undecided

- multiple profiles

# TODO: Resources about add-on development and distribution

- [Manifest v2 vs. v3](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
  - [migrating from v2 to v3](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)
- think about a better name... alternative names: keyword highlighter, multi-highlighter, multi-search, skimmer, skim reader, etc.?
- [Build a cross-browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
  - [Polyfill for compatibility with chrome](https://github.com/mozilla/webextension-polyfill)
  - [Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)