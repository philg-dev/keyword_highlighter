# Todo

- analyze performance
  - >Query selector all: nodes without children, for each check parent to exclude script and src nodes, then do replacement and on each replacement query only parent or maybe even grab fromHTML result's child elements filtered by span (my highlight)
    >
    >This should even make it unnecessary to check if highlight exists already, but it still needs to be checked somewhere (query maybe) to avoid multiple runs from nesting additional span elements
  - maybe put lists in one big RegExp to improve performance?
    - questionable if that helps or hurts... 
    - creating many small RegExp and iterating over each Term and String separately vs. one big RegExp and one big iteration managed by RegExp engine
    - to use full potential of this method: look into RegExp match groups properly and use match() instead of search() "somehow"
      - to handle multiple matches in a string I need to iterate from the back to the front in order to replace string by highlighted strings with `spans` around them and all that...
- restructure code to avoid unnecessary execution
  - script loads
  - storage access (=> caching)
- make UI pretty
- make or find a nice icon
  - maybe a magnifier with multiple colors per quadrant (make in Inkscape)
- try addon signing process / think about publishing on [AMO](https://addons.mozilla.org/)
- refactor old styles and such that have Tampermonkey artifacts (like the `tm` prefix I use in my TM scripts)
- think about duplicates / terms that are substrings of other terms [see this bug](#bug1)
- key order in loaded settings is different from key order in the code

# Feature ideas

## planned features
- import / export settings from / to JSON
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

# Known issues

## Case: multiple search terms are substrings of each other <a id="bug1"></a>

### Prerequisites:

One list of terms contains a long word e.g. `longSearchTerm` and another list contains a short substring of that e.g.`searchTerm` (ignore case)

### Bugged behavior

- exact behavior may vary depending on the order of lists and the order of terms within those lists
- case a) if the short substring gets highlighted first, it'll end up in a `<span>` element and will technically split up the `longSearchTerm` into different text nodes and therefore the `longSearchTerm` will no longer be found for highlighting
- case b) if the `longSearchTerm` gets highlighted first, then the shorter `searchTerm` within that highlight will noch get highlighted accordingly, since the parent element already contains the `hasHighlight` marker CSS class

### Potential Solution

- provide a warning with a summary of potentially conflicting terms
  - warn about terms that can never be highlighted because of this issue (i.e. `searchTerm` is defined before `longSearchTerm` either within the same list or in a list that is defined in another list before the list that `longSearchTerm` is defined in)

## Case: website has an iFrame that contains search terms

If a website uses an iFrame the search terms in that iFrame are currently not highlighted by the script.
This could probably be fixed by using `allFrames: true` as a parameter for `browser.scripting.executeScript()`.
Think about consequences and find example page.

## Case: using Dark Reader to enable dark mode on a website

When using the "Dark Reader" add-on / webextension the highlights added by this extension might not work in certain configurations. This is especially the case when using "Static" theme generation mode. Some testing with Dark Reader's "Dynamic" theme generation mode showed promising results, but I've had massive performance issues with Dark Reader on non-static theme generation modes in the past.