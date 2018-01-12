async function showWat() {
    const fileDisplay = document.querySelector(".repository-content .file .blob-wrapper");
    const fileTable = fileDisplay.querySelector("table");
    setTableContent(fileTable, [renderLine("Loading wasm file ...", 0)]);

    await wabt.ready;
    const wasmUrl = document.querySelector("#raw-url").href;
    const response = await fetch(new Request(wasmUrl));
    const contents = new Uint8Array(await response.arrayBuffer());

    const module = wabt.readWasm(contents, {readDebugNames: true});
    module.generateNames();
    module.applyNames();
    const wat = module.toText({ foldExprs: false, inlineExport: true });
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

function checkReady() {
    return !!document.querySelector(".repository-content .file .blob-wrapper");
}

function start() {
    if (checkReady()) {
        observer.disconnect();
        showWat();
        return;
    }

    observer.observe(document, { childList: true, subtree: true });
}

const observer = new MutationObserver(start);

start();
