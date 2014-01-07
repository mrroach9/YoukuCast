var appID = 'ba9523d3-a6e6-405a-a036-3bf13d76f759';
var extensionID = 'cmmceaghnimannhfgenppicbbidphokp';
var cast_api = null;
var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

initializeApi = function() {
    if (!cast_api) {
        cast_api = new cast.Api();
        cast_api.addReceiverListener(appID, onReceiverList);
    }
};

onReceiverList = function(list) {
    sendLog('Receiver list: ' + JSON.stringify(list));
};

sendMessage = function(obj, callback) {
    chrome.runtime.sendMessage(extensionID, obj, callback);
};

requestVideoList = function() {
    sendMessage({
        'source': msgSource['app'],
        'type': 'request-video-list'
    }, function(response) {
        sendLog('In response callback function:' + JSON.stringify(response));
        if (!response || response['source'] != msgSource['client']) {
            return;
        }
        for (var id in response['video-ids']) {
            $('#log-info').append($('<p>').text(id));
        }
    });
}

sendLog = function(msg) {
    sendMessage({
        'source': msgSource['app'],
        'type': 'log',
        'msg': msg
    }, function(response){});
};

$(document).ready(function() {
    $('#log-info').empty();
    sendLog('Chromecast App loaded.');

    if (window.cast && window.cast.isAvailable) {
        initializeApi();
    }
    // } else {
    //     window.addEventListener('message', function(event) {
    //         if (event.source === window && event.data &&
    //             event.data.source === 'CastApi' &&
    //             event.data.event === 'Hello') {
    //             initializeApi();
    //         }
    //     });
    // }
    requestVideoList();
});
