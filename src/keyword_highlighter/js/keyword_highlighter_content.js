/**
 * Wrapped in anonymous function to work in an inner scope.
 * This avoids re-declaration of const
 */
(function () {
    "use strict";
    console.debug(
        "keyword_highlighter_content.js - injecting content script now..."
    );

    /**
     * Utility function to create a DOM element from an HTML string.
     * As found here: https://stackoverflow.com/a/35385518
     * Slightly adapted to my needs.
     *
     * @param {String} HTML representing a single element.
     * @param {Boolean} trim flag representing whether or not to trim input whitespace, defaults to true.
     * @param {Boolean} forceReturnNodeList flag representing whether or not to return a NodeList even when only one node is created, defaults to false.
     * @return {Element | HTMLCollection | null}
     */
    const fromHTML = function (html, trim = true, forceReturnNodeList = false) {
        // Process the HTML string.
        html = trim ? html.trim() : html;
        if (!html) return null;

        // Then set up a new template element.
        const template = document.createElement("template");
        template.innerHTML = html;
        // using childNodes instead of children because children doesn't contain pure text nodes for some reason (tested on Firefox v124.0b2)
        const result = template.content.childNodes;

        // Then return either an HTMLElement or HTMLCollection,
        // based on whether the input HTML had one or more roots.
        if (!forceReturnNodeList && result.length === 1) return result[0];
        return result;
    };

    const positiveCss = "tm-highlight-positive";
    const negativeCss = "tm-highlight-negative";
    const hasHighlightCss = "tm-has-highlight";

    const var_positiveTerms = "positiveTerms";
    const var_negativeTerms = "negativeTerms";

    let settings = null;

    /**
     * Limit amount of highlights in order to avoid infinit
     */
    const maxHighlightedTerms = 2000;
    const warningAmount = 200;
    var highlightsCount = 0;
    var traverseCalls = 0;

    const traverseNodes = function (curNodes) {
        traverseCalls++;
        if (highlightsCount > maxHighlightedTerms) {
            console.debug(
                "Maximum amount of highlights reached! Check for potential infinite loops."
            );
            return;
        }

        if (!curNodes) return;
        for (var curNode of curNodes) {
            if (curNode.nodeType === 3) {
                // text nodes
                // search for terms to highlight
                markTerm(curNode, settings[var_positiveTerms], positiveCss);
                markTerm(curNode, settings[var_negativeTerms], negativeCss);
                // add highlight IF NOT HIGHLIGHTED ALREADY
                continue;
            }
            // recurse one level deeper
            traverseNodes([...curNode.childNodes]);
        }
    };

    const markTerm = function (textNode, terms, cssClass) {
        // skip orphaned nodes that are still in traversal after manipulating a sibling
        if (!textNode || !textNode.parentElement) {
            /*
            console.debug(`Orphaned or empty node while handling ${cssClass}: ${node}`)
            console.debug(node)
            */
            return;
        }

        var currentText = textNode.textContent;
        if (!currentText) {
            return;
        }

        // ignore text nodes that are children of node types STYLE or SCRIPT
        if (
            ["SCRIPT", "STYLE"].includes(
                textNode.parentElement.nodeName.toUpperCase()
            )
        ) {
            return;
        }

        for (var t of terms) {
            // skip empty strings (might occur in case of empty terms list)
            if (!t || !t.trim()) continue;
            var myRegExp = new RegExp(t, "i");

            var pos = currentText?.search(myRegExp);
            // if not found, try next term
            if (pos < 0) continue;

            var matchParent = textNode.parentElement;

            // ignores span elements that already have been added as a highlight
            if (!matchParent.classList.contains(hasHighlightCss)) {
                // do the actual highlighter marking
                highlightsCount++;
                if (
                    highlightsCount % 10 === 0 &&
                    highlightsCount > warningAmount
                ) {
                    console.debug(matchParent);
                    console.debug(
                        "current highlightsCount: " + highlightsCount
                    );
                }
                if (highlightsCount > maxHighlightedTerms) {
                    console.debug(
                        "Maximum amount of highlights reached! Check for potential infinite loops."
                    );
                    return;
                }

                // console.debug(`Highlighting term "${t}" node with text: ${textNode.nodeValue}`)
                var newTextHTML =
                    currentText.slice(0, pos) + // text before match
                    `<span class="${cssClass} ${hasHighlightCss}">` +
                    currentText.slice(pos, pos + t.length) + // match itself to preserve capitalization
                    "</span>" +
                    currentText.slice(pos + t.length); // text after match
                var newNodes = fromHTML(newTextHTML, false, true);
                textNode.replaceWith(...newNodes);
                // setting innerHTML of parent element invalidates references in the old child node (especially corrupts the parentElement ref)
                // Traversing all new child nodes (again) to avoid needing multiple passes over the entire DOM tree
                traverseNodes([...matchParent.childNodes]);
                return; // have to return because of dirty node reference
            }
        }
    };

    const performHighlighting = async function () {
        console.debug("performHighlighting!");
        settings = await browser.runtime.sendMessage({
            message: "getSettings",
        });
        console.debug(
            "performHighlighting - Settings received! New Settings are:"
        );
        console.debug(JSON.stringify(settings));
        highlightsCount = 0;
        traverseCalls = 0;
        var startTime = window.performance.now();
        traverseNodes([...document.body.childNodes]);
        var endTime = window.performance.now();
        console.debug(
            "performHighlighting - Time elapsed to finish multiPassTraverse() " +
                (endTime - startTime) * 1000 +
                " microseconds."
        );
        console.debug(
            `performHighlighting - Number of traverse calls to finish ${highlightsCount} highlights: ${traverseCalls}`
        );
    };

    // adds basic CSS in order to be able to properly display the settings panel
    var customCss = document.createElement("style");
    customCss.innerHTML = `
    /* BEGIN highlight styles */
    span.${positiveCss} {
        color: black;
        background: lime;
    }

    span.${negativeCss} {
        color: white;
        background: #ff4000;
    }
    /* END highlight styles */
    `;

    document.body.append(customCss);

    performHighlighting();
})();
