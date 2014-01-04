initializeApi = function() {
    console.log('Initializing API');
    if (!cast_api) {
        cast_api = new cast.Api();
        cast_api.addReceiverListener('ba9523d3-a6e6-405a-a036-3bf13d76f759', onReceiverList);
    }
};

onReceiverList = function(list) {
    console.log('Receiver list:');
    console.log(list);
};

var cast_api;
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

