# Todo

- analyze performance
  - >Query selector all: nodes without children, for each check parent to exclude script and src nodes, then do replacement and on each replacement query only parent or maybe even grab fromHTML result's child elements filtered by span (my highlight)
    >
    >This should even make it unnecessary to check if highlight exists already, but it still needs to be checked somewhere (query maybe) to avoid multiple runs from nesting additional span elements
- restructure code to avoid unnecessary execution
  - script loads
  - storage access (=> caching)
- make UI pretty
- make or find a nice icon
  - maybe a magnifier with multiple colors per quadrant (make in Inkscape)
- try addon signing process / think about publishing on [AMO](https://addons.mozilla.org/)
- refactor old styles and such that have Tampermonkey artifacts (like the `tm` prefix I use in my TM scripts)

# Feature ideas

## planned features
- cleanup operations:
  - storage clear button to remove all data stored by the addon
  - remove active highlights on a page
- dynamic amount of terms lists
  - user defined styles per list
- temporary terms list (not persisted)
  - maybe as a widget in the content script
- jump / cycle through highlights like browser search
  - use methods `element.checkVisibility()` and `element.scrollIntoView()`
- implement "match whole word" mechanics alongside current behavior (only match words that are exactly the search term)
  - useful especially for acronyms which often are randomly part of longer words otherwise
- implement "highlight whole word" (when sub-term matches, highlight entire word for better legibility)
- color picker for custom styles
  - Style css class prefix/postfix use color value
  - Use POSTFIX instead for better performance? Think about use cases that need to query those specific classes


## undecided

- multiple profiles (e.g. job search, studying, etc.)
  - to save sets of highlighted terms for different purposes and keeping up the performance by keeping the sets fairly small
- Highlight counter & position in jump list
- style option for `font-weight: bold`...

## rejected ideas

- Jump list by term makes not much sense, since that's what browser search does already

# TODO: Resources about add-on development and distribution

- [Manifest v2 vs. v3](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
  - [migrating from v2 to v3](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)
- think about a better name... alternative names: keyword highlighter, multi-highlighter, multi-search, skimmer, skim reader, etc.?
- [Build a cross-browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
  - [Polyfill for compatibility with chrome](https://github.com/mozilla/webextension-polyfill)
  - [Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)