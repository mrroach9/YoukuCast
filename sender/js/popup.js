var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

var allVideoList = {};

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
                (function() {
                    var tab = tabList[id];
                    chrome.tabs.sendMessage(tab.id, {
                        'source': msgSource['client'],
                        'type': 'request-video-list'
                    }, function(response) {
                        if (!response || response['source'] != msgSource['client']
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

refreshVideoTab = function(node, videoInfo) {
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
                        $('<a>').attr('href', 'javascript:void(0)')
                                .append(thumbNode).append(infoNode));
    return refreshVideoTab(container, videoInfo);
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
                allVideoList[vid] = videoInfo;
                $('.scrollable').data('scrollable').addItem(genVideoTab(videoInfo));
            })
        }
    });
}

$(document).ready(function() {
    $('.scrollable').scrollable({
        onSeek: onUpdateVideoTab,
        onAddItem: onUpdateVideoTab
    });
    $('#refresh-button').click(refresh);
    refresh();
});