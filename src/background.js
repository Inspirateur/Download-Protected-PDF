console.log("bonjour");
var urls = {}

browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequestEvent,
    {urls: ["<all_urls>"]},
);

function onBeforeRequestEvent(request) {
    if(request.url.endsWith(".pdf")) {
        let name = request.url.substring(request.url.lastIndexOf('/') + 1)
        urls[request.url] = name;
        console.log(name);
    }
}
