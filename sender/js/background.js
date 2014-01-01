// The only work that background script does is to accept requests 
// from content scripts, containing video player widgets' information
// that were filtered out from the page, notifying a page action to
// show.
// Author: Mr.Roach
// Date Created: 01/01/2014

function onRequest(request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendReponse({});
    // TODO: save sender info and video player info into global map.
}

console.log("[Youku Cast] Background script loaded.");
chrome.extension.onRequest.addListener(onRequest);

