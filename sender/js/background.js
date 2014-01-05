// The only work that background script does is to accept requests 
// from content scripts, containing video player widgets' information
// that were filtered out from the page, notifying a page action to
// show.
// Author: Mr.Roach
// Date Created: 01/01/2014

onRequest = function(request, sender, sendResponse) {
    console.log('[Youku Cast] New video player detected.');
    console.log('[Youku Cast] \tVideo ID: ', request['video-id']);
    console.log('[Youku Cast] \tTab ID: ', sender.tab.id);
    console.log('[Youku Cast] \tTab Title: ', sender.tab.title);

    chrome.pageAction.show(sender.tab.id);
    if (!localStorage[sender.tab.id]) {        
        localStorage[sender.tab.id] = '[]';
    }
    videoIdList = JSON.parse(localStorage[sender.tab.id]);
    videoIdList.push(request['video-id']);
    localStorage[sender.tab.id] = JSON.stringify(videoIdList);
    sendResponse({});
};

console.log('[Youku Cast] Background script loaded.');
localStorage.clear();
chrome.extension.onRequest.addListener(onRequest);

