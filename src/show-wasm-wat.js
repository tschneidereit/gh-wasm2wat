const FILE_DISPLAY_SELECTOR = ".repository-content .file .blob-wrapper";

function inspectWasmDisplay() {
    const fileDisplay = document.querySelector(FILE_DISPLAY_SELECTOR);
    if (fileDisplay.wasmDisplayApplied) {
        return;
    }
    fileDisplay.wasmDisplayApplied = true;

    const fileTable = fileDisplay.querySelector("table");

    // GitHub displays a text rendering of very small .wasm files in-line.
    if (fileTable) {
        showWat(fileDisplay, fileTable, document.querySelector("#raw-url").href);
        return;
    }

    // ... whereas files starting at (probably) 1KB aren't displayed at all.
    const image = fileDisplay.querySelector('.image');
    const rawLink = image.querySelector('a');
    const wasmUrl = rawLink.href;
    const sourceLink = document.createElement('a');
    sourceLink.innerText = 'View Source';
    sourceLink.href = '#';
    sourceLink.addEventListener('click', (e) => {
        e.preventDefault();
        const fileTable = document.createElement('table');
        fileTable.className = 'highlight tab-size js-file-line-container';
        fileTable.dataset.tabSize = '4';
        fileDisplay.replaceChild(fileTable, image);
        showWat(fileDisplay, fileTable, document.querySelector("#raw-url").href);
    });
    image.insertBefore(sourceLink, rawLink);
    image.insertBefore(document.createElement('br'), rawLink);
}

async function showWat(fileDisplay, fileTable, wasmUrl) {
    setTableContent(fileTable, [renderLine("Loading wasm file ...", 0)]);

    await wabt.ready;
    const response = await fetch(new Request(wasmUrl));
    const contents = new Uint8Array(await response.arrayBuffer());

    let wat;
    try {
        const module = wabt.readWasm(contents, { readDebugNames: true });
        module.generateNames();
        module.applyNames();
        wat = module.toText({ foldExprs: false, inlineExport: true });
    } catch (e) {
        setTableContent(fileTable, [renderLine("Wasm file too large to display", 0)]);
        return;
    }

    setTableContent(fileTable, wat.split("\n").map(renderLine));
    fileDisplay.className = "blob-wrapper data type-webassembly";
}

function renderLine(content, index) {
    // Line numbers on GitHub are 1-based.
    index++;

    const tr = document.createElement('tr');

    let td = document.createElement('td');
    td.id = "L" + index;
    td.className = "blob-num js-line-number";
    td.dataset.lineNumber = index;
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = "LC" + index;
    td.className = "blob-code blob-code-inner js-file-line";
    td.innerText = content;
    tr.appendChild(td);

    return tr;
}

function setTableContent(table, rows) {
    for (let child; child = table.firstChild;)
        table.removeChild(child);

    const tbody = document.createElement('tbody');
    rows.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
}

const observer = new MutationObserver(startWasmDisplay);
function checkReady() {
    return !!document.querySelector(FILE_DISPLAY_SELECTOR);
}

function startWasmDisplay() {
    if (checkReady()) {
        observer.disconnect();
        inspectWasmDisplay();
        return;
    }

    observer.observe(document, { childList: true, subtree: true });
}

browser.runtime.onMessage.addListener(msg => startWasmDisplay());
startWasmDisplay();
