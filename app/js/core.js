var cast_api = null;
var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

initializeApi = function() {
    console.log('[Youku Cast] Initializing cast API...');
    if (!cast_api) {
        cast_api = new cast.Api();
        cast_api.addReceiverListener(appID, onReceiverList);
    }
};

onReceiverList = function(list) {
    console.log('[Youku Cast] Receivers list: ' + JSON.stringify(list));
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
    requestVideoList();
});
