
$('document').ready(function() {
    var vid = $.url().param('vid') || 'XNjU2MjI4MTQ4';
    $('#video-player').attr('controls', 'controls')
                      .attr('autoplay', 'autoplay');
    $('#log').append($('<p>').text('vid: ' + vid));
    $('#log').append($('<p>').text('This Page: ' + window.location.href));
    getYoukuMp4Url(vid, function(url) {
        $('#video-player').attr('src', url);
        $('#log').append($('<p>').text('url: ' + url));
    });
});