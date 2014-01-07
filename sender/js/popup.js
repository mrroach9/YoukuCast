var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

recvMessage = function(response, sender, callback) {
    console.log(response);
    if (!response || response['source'] != msgSource['app']) {
        return;
    }
    if (response['type'] == 'log') {
        console.log('[Youku Cast][App] ' + response['msg']);
    } else if (response['type'] == 'request-video-list') {
        getVideoList(function(list) {
            msg = {
                'source': msgSource['client'],
                'type': 'video-list',
                'video-ids': list
            };
            console.log(callback);
            callback(msg);
        });
    }
};

getVideoList = function(callback) {
    chrome.tabs.query(
        {
            windowType: 'normal'
        },
        function(tabList) {
            if (!tabList) {
                return;
            }
            for (var id in tabList) {
                var tab = tabList[id];
                chrome.tabs.sendMessage(tab.id, {
                    'source': msgSource['client'],
                    'type': 'request-video-list'
                }, function(response) {
                    if (!response || response['source'] != msgSource['client']
                        || response['type'] != 'video-list') {
                        callback([]);
                        return;
                    } else {
                        callback(response['video-list']);
                    }
                });
            }
        }
    );
};

$(document).ready(function() {
    $('#log-info').empty();
    getVideoList(function(videoList) {
        console.log('[Youku Cast] In Callback');
        console.log('[Youku Cast] ' + videoList);
        for (var vid in videoList) {
            $('#log-info').append('<p>' + videoList[vid] + '</p>');
        }
    });
});