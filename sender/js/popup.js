var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

recvMessage = function(response, sender, callback) {
    if (!response || response['source'] != msgSource['app']) {
        return;
    }
    if (response['type'] == 'log') {
        console.log('[Youku Cast][App] ' + data['msg']);
    } else if (response['type'] == 'request-video-list') {
        getVideoList(function(list) {
            msg = {
                'source': msgSource['client'],
                'type': 'video-list',
                'video-ids': list
            };
            callback(msg);
        });
    }
};

getVideoList = function(callback) {
    if (!chrome || !chrome.tabs || !localStorage) {
        callback([]);
        return;
    }
    chrome.tabs.query({
        active: true,
    }, function(tab_list) {
        var tab = tab_list[0];
        console.log(tab);
        if (!tab || !localStorage[tab.id]) {
            callback([]);
            return;
        }
        callback($.parseJSON(localStorage[tab.id]));
    });
};

$(document).ready(function() {
    chrome.runtime.onMessageExternal.addListener(recvMessage);
});