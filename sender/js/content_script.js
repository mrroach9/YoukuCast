// The content script searches the document and finds all 
// embedded video player widgets. If any player found, 
// their infos and an ack message will be sent to the
// background script.
// Author: Mr.Roach
// Date Created: 01/01/2014

console.log('Content script loaded.');
// TODO: document filtering and widget info extracting.
chrome.extension.sendRequest({}, function(response) {});
