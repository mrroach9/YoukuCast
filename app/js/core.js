var cast_api = null;
var receiver_list = [];
var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

initializeApi = function() {
    console.log('[Youku Cast] Initializing cast API...');
    if (!cast_api) {
        cast_api = new cast.Api();
        cast_api.addReceiverListener(ID_INFO['CAST_APP_ID'], onReceiverList);
    }
};

onReceiverList = function(list) {
    console.log('[Youku Cast] Receivers list: ' + JSON.stringify(list));
    receiver_list = list;
};

launch = function(receiver, videoInfo) {
    if (!videoInfo || !receiver) {
        return;
    }
    var request = new window.cast.LaunchRequest(ID_INFO['CAST_APP_ID'], receiver);
    request.parameters = {
        'vid': videoInfo['vid']
    };
    request.description = new window.cast.LaunchDescription();
    request.description.text = videoInfo['title'];
    request.description.url = videoInfo['link'];
    cast_api.launch(request, onLaunch);
};

dummyLaunch = function() {
    launch(receiver_list[0], {
        'vid': 'XNjU2MjIzOTQw',
        'title': '神探夏洛克 第三季 02',
        'link': 'http://v.youku.com/v_show/id_XNjU2MjIzOTQw.html'
    });
};

$(document).ready(function() {
    console.log('[Youku Cast] App script loaded.');

    if (window.cast && window.cast.isAvailable) {
        initializeApi();
    } else {
        window.addEventListener('message', function(event) {
            if (event.source === window && event.data &&
                event.data.source === 'CastApi' &&
                event.data.event === 'Hello') {
                initializeApi();
            }
        });
    }
});
