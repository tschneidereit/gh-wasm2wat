/**
 * Navigation callback invoked after a tab is navigated to a .wasm file on
 * GitHub using `History.pushState()`.
 *
 * To avoid loading the wasm renderer into every GitHub global, the
 * `"content_scripts"` key in `manifest.json` only matches GitHub URLs ending
 * on ".wasm". For in-app navigation, a message is sent to the content script.
 * If that message fails to be sent, that means that the content script hasn't
 * been loaded yet, so we load it.
 */
function showWasmSource({tabId, frameId}) {
    browser.tabs.sendMessage(tabId, "show wasm", (...args) => {
        if (args.length === 0) {
            browser.tabs.executeScript(tabId, { file: "/libwabt.js", frameId },
                () => browser.tabs.executeScript(tabId, { file: "/show-wasm-wat.js", frameId }));
        }
    });
}

browser.webNavigation.onHistoryStateUpdated.addListener(showWasmSource, {
    url: [{ hostEquals: "github.com", pathSuffix: ".wasm" }]
});
