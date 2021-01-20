browser.runtime.getBackgroundPage().then(onBackgroundGet);
let background;

function onBackgroundGet(bg) {
    background = bg;
    updatePopup();
}

function clearPopup() {
    document.body.innerHTML = "";
}

function updatePopup() {
    let urls = background.urls;
    // We assume the HTML of body is empty here
    if(Object.keys(urls).length === 0) {
        let p = document.createElement("p");
        p.innerHTML = "No new PDF detected yet";
        document.body.appendChild(p);
    } else {
        if(Object.keys(urls).length > 1) {
            let button = document.createElement("button");
            button.innerHTML = "Download All";
            button.addEventListener("click", function() {download(null, null)});
            document.body.appendChild(button);
        }
        let list = document.createElement("ul");
        for(let key of Object.keys(urls)) {
            let item = document.createElement("li");
            item.appendChild(document.createTextNode(urls[key]));
            item.addEventListener("click", function () {download(key, urls[key])});
            list.appendChild(item);
        }
        document.body.appendChild(list);
    }
}

function download(url, name) {
    if(url === null) {
        for(let key of Object.keys(background.urls)) {
            browser.downloads.download(
                {url: key, filename: background.urls[key]}
            ).then(function () {downloadCallback(key)});
        }
    } else {
        browser.downloads.download({url: url, filename: name}).then(function () {downloadCallback(url)});
    }
    clearPopup();
    updatePopup();
}

function downloadCallback(url) {
    delete background.urls[url];
    clearPopup();
    updatePopup();
}
