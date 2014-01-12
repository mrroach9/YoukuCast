
$('document').ready(function() {
    player = new YKU.Player('youkuplayer',{
        client_id: ID_INFO['YOUKU_APP_ID'],
        vid: $.url().param('vid'),
        autoplay: true,
        show_related: false,
        events:{
            onPlayerReady: function(){},
            onPlayStart: function(){},
            onPlayEnd: function(){}
        }
    });
});