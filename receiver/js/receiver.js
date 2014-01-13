
$('document').ready(function() {
    var vid = $.url().param('vid');
    $('#video-player').attr('controls', 'controls')
                      .attr('autoplay', 'autoplay')
                      .attr('height', 720)
                      .attr('width', 1280);
    getYoukuMp4Url(vid, function(url) {
        $('#video-player').attr('src', url);
    });
});