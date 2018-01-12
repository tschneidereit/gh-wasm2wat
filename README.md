# GitHub WASM source renderer

A Firefox WebExtension that replaces the best-effort text rendering GitHub does for the WebAssembly [binary format](http://webassembly.github.io/spec/core/binary/index.html) with an on-the-fly generated [text format](http://webassembly.github.io/spec/core/text/index.html) representation of the same file.

While GitHub does syntax highlighting for the WebAssembly text format, it does so on the server, so at least for now the rendered text will not have any highlighting.

## Installation

The extension can be installed from its [addons.mozilla.org listing](https://addons.mozilla.org/en-US/firefox/addon/github-wasm-source-renderer/).

After installation, verify that the extension works as expected by visiting the [demo wasm file](demo/add-two.wasm).

## Building

After changing the [extension source](src/), go to `about:debugging` and load it as a temporary add-on. Once you've verified that everything works as expected, you can bundle it as a zip file. To install it permanently, it has to be turned into a signed extension. At this point, either just send a pull request, or publish your fork on [addons.mozilla.org](https://addons.mozilla.org).
