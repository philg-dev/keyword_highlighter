# Skim Reader
A browser add-on that lets you highlight all occurrences of user defined terms on a website.

Potential usage scenarios that I could think of:
- Studying
- Recruiting (skimming candidate profiles for skills etc.)
- Job search (skimming job offers for skills, benefits etc.)
- Shopping (comparing article descriptions, reviews)
- Dating sites (red & green flags on user profiles)
- etc.

# Permissions granted to this add-on

## `storage` 

Needed to store the user defined set of terms to the browser's local storage in order for the terms to stay available throughout browser restarts.
Required by [browser.storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage), in particular:
- `browser.storage.local.get`
- `browser.storage.local.set`

## `scripting`

Needed to inject the custom content script that is responsible to highlight the terms on the website by manipulating the website's DOM accordingly.
Required by [`browser.scripting.executeScript`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript)

## `activeTab`

Needed to inject the custom content script into the currently active tab upon the user's explicit interaction with the add-on.
Required by [`browser.scripting.executeScript`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript)

Since this add-on explicitly is meant to work only on explicit user interaction in the currently active tab, the add-on **does not need** any `host_permissions`. For the same reason the **full** `tabs` permission is also not needed.

# User data

The user specified terms will exclusively be stored locally in the browser storage and will never be transmitted by the add-on to any remote servers.
All usage of the data is strictly for the purpose of highlighting terms on the website in the currently active tab.

The add-on does not access or collect any data about the browser or active tabs other than the tab ID.

// TODO: look at [Additional Privacy Protocols](https://extensionworkshop.com/documentation/publish/add-on-policies/)
// TODO: provide add on functionality to clear stored data

# Technical details

## Content Script functionality

In order to highlight the user specified terms in the currently active tab, the script will recursively traverse the DOM and add a `<span>` element with a style around any matched terms.

Unless the user explicitly uses the button in the add-on's browser action, the content script will not get injected and therefore not cause any performance impact. 

Since some websites have extremely large DOM trees and since the user can define a large amount of terms to highlight, the traversal of the entire DOM might take some time. In my use cases it took up to 50 milliseconds in some cases with fairly large pages and roughly 30~50 different terms to highlight.

# Distribution

// TODO get addon signed for self-distribution on https://addons.mozilla.org/en-US/developers/