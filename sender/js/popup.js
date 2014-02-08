var msgSource = {
    'cs' : 'YoukuCast-Content-Script',
    'bg' : 'YoukuCast-Background',
    'popup' : 'YoukuCast-Popup',
    'sender' : 'YoukuCast-Sender',
    'receiver': 'YoukuCast-Receiver'
};

var allVideoList = {};
var bgPage = chrome.extension.getBackgroundPage();

recvMessage = function(response, sender, callback) {
    console.log(response);
    if (!response) {
        return;
    }
    if (response['type'] == 'log') {
        console.log('[Youku Cast] ' + response['msg']);
    } else if (response['type'] == 'request-video-list') {
        getVideoList(function(list) {
            msg = {
                'source': msgSource['popup'],
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
                (function() {
                    var tab = tabList[id];
                    chrome.tabs.sendMessage(tab.id, {
                        'source': msgSource['popup'],
                        'type': 'request-video-list'
                    }, function(response) {
                        if (!response || response['source'] != msgSource['cs']
                            || response['type'] != 'video-list') {
                            callback([], null);
                            return;
                        } else {
                            callback(response['video-list'], tab);
                        }
                    });
                }());
            }
        }
    );
};

convertTimeToString = function(sec) {
    if (sec < 0) {
        return null;
    }
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec / 60) % 60;
    var s = Math.floor(sec) % 60;
    hstr = (h == 0) ? '' : ((h < 10 ? '0' : '') + h.toString() + ':');
    mstr = ((m < 10) ? '0' : '') + m.toString() + ':';
    sstr = ((s < 10) ? '0' : '') + s.toString();
    return hstr + mstr + sstr;
};

updatePlayerStatus = function() {
    if (!bgPage.session) {
        $('.device').empty().append('未检测到设备');
    }
    if (!bgPage.session || !bgPage.currentMedia) {
        $('.now-playing-text').empty().append('正在播放：无视频');
        $('.jp-play').show();
        $('.jp-pause').hide();
        $('.jp-current-time').empty().append('00:00');
        $('.jp-duration').empty().append('00:00');
        $('.jp-play-bar').css('width', '0%');
    } else {
        // TODO: fill in proper status
    }
};

fillVideoTab = function(node, videoInfo) {
    if (!videoInfo || !node) {
        return null;
    }
    var title = videoInfo['title'] || '无标题';
    if (title.length > 13) {
        title = title.substring(0, 13);
    }

    var link = videoInfo['link'] || '';
    var thumbnail = videoInfo['thumbnail'] || '../img/default_thumb.jpg';

    var duration = parseInt(videoInfo['duration']) || 0;
    duration = convertTimeToString(duration);

    var source = videoInfo['source-tab'].title || '未知网页';
    if (source.length > 8) {
        source = source.substring(0, 8) + '...';
    }
    source = '来源：' + source;

    var description = videoInfo['description'] || '暂无介绍';
    if (description.length > 45) {
        description = description.substring(0, 45) + '...';
    }

    node.find('.thumb-img').attr('style', 
                                 'background-image: url(\'' + thumbnail + '\')');
    node.find('.title').append(title);
    node.find('.description').append(description);
    node.find('.duration').append(duration);
    node.find('.source').append(source);
    node.find('.video-anchor').attr('video-id', videoInfo['id']);

    return node;
};

genVideoTab = function(videoInfo) {
    var thumbNode = $('<div>').addClass('thumb').append(
                        $('<span>').addClass('thumb-img'));
    var infoNode = $('<div>').addClass('info');
    var titleNode = $('<span>').addClass('title');
    var descNode = $('<span>').addClass('description');
    var duraNode = $('<span>').addClass('duration');
    var sourceNode = $('<span>').addClass('source');
    // TODO: origin website (e.g. Youku, Tudou, etc.)

    var topDiv = $('<div>').addClass('video-top')
                           .append(titleNode).append(descNode);
    var botDiv = $('<div>').addClass('video-bottom')
                           .append(sourceNode).append(duraNode);
    infoNode.append(topDiv).append(botDiv);

    var container = $('<div>').addClass('video').append(
                        $('<a>').addClass('video-anchor')
                                .attr('href', '#')
                                .append(thumbNode).append(infoNode));
    return fillVideoTab(container, videoInfo);
};

onUpdateVideoTab = function() {
    var api = $('.scrollable').data('scrollable');
    var index = (api.getSize() == 0) ? 0 : (api.getIndex() + 1);
    $('.page-text').text(index + '/' + api.getSize());
}

queryVideoInfo = function(vid, tab, callback) {
    if (!vid || !tab) {
        callback(null);
        return;
    }
    var url = 'https://openapi.youku.com/v2/videos/show_basic.json';
    $.get(url, {
        'client_id': ID_INFO['YOUKU_APP_ID'],
        'video_id': vid
    }, function(data) {
        if (!data) {
            callback(null);
            return;
        }
        data['source-tab'] = tab;
        getYoukuMp4Url(vid, function(url) {
            data['html5-link'] = url;
            callback(data);
        });
    }).fail(function() {
        callback(null);
    });
};

refresh = function() {
    getVideoList(function(videoList, tab) {
        allVideoList = {};
        $('.scrollable > .items').empty();
        for (var vid in videoList) {
            queryVideoInfo(videoList[vid], tab, function(videoInfo) {
                console.log('[Youku Cast] Video collected: ');
                console.log(videoInfo);
                allVideoList[videoInfo['id']] = videoInfo;
                $('.scrollable').data('scrollable').addItem(genVideoTab(videoInfo));
            })
        }
    });
}

init = function() {
    refresh();
    updatePlayerStatus();
};

$(document).ready(function() {
    $('.scrollable').scrollable({
        onSeek: onUpdateVideoTab,
        onAddItem: onUpdateVideoTab
    });
    $(document).on('click', '.video-anchor', function(){
        var videoInfo = allVideoList[$(this).attr('video-id')];
        console.log('[Youku Cast] Video clicked for casting: ');
        console.log(videoInfo);
        bgPage.loadMedia(videoInfo);
    });
    $('#refresh-button').click(refresh);

    setTimeout(updatePlayerStatus, 1000);
    init();
});

/*
 * Chrome CSP does not allow executing inline scripts, even
 * javascript:void(0) that are commonly used as dummy commands
 * for customized anchors. Hereby this is used for them.
 */
void_func = function() {
    // Do nothing
};