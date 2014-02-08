// The content script searches the document and finds all 
// embedded video player widgets. If any player found, 
// their infos and an ack message will be sent to the
// popup page.
// Author: Mr.Roach
// Date Created: 01/01/2014

var msgSource = {
    'client' : 'YoukuCast-Client',
    'app' : 'YoukuCast-App',
    'server': 'YoukuCast-Server'
};

// object->param[name=movie|src, value=...]
//       ->embed[type='application/x-shockwave-flash', src=...]
matchYoukuType1 = function(node) {
    var paramUrl = node.find('param[name="movie"]').attr('value') ||
                   node.find('param[name="src"]').attr('value');
    var embedUrl = node.find('embed[type="application/x-shockwave-flash"]').attr('src');
    if (!paramUrl && !embedUrl) {
        return null;
    } else if (paramUrl && embedUrl) {
        if (paramUrl == embedUrl) {
            return extractYoukuVideoID(paramUrl);
        } else {
            return null;
        }
    } else {
        return extractYoukuVideoID(paramUrl || embedUrl);
    }
    return null;
};

// object[type='application/x-shockwave-flash' data=...]
//       ->param[name=movie, value=...]
//       ->param[name=flashVars, value=...]
matchYoukuType2 = function(node) {
    if (node.attr('type') != 'application/x-shockwave-flash') {
        return null;
    }
    var objUrl = node.attr('data');
    var addrUrl = node.find('param[name="movie"]').attr('value') ||
                  node.find('param[name="src"]').attr('value');
    var param = node.find('param[name="flashvars"]').attr('value') || ' ';
    if (!objUrl || !addrUrl || objUrl != addrUrl) {
        return null;
    }
    return extractYoukuVideoID(addrUrl + '?' + param);
};

extractYoukuVideoID = function(str) {
    if (!str) {
        return null;
    }
    var re1 = new RegExp(/.*youku\.com.*VideoIDS\=([A-Za-z0-9]+)\&.*/g);
    var re2 = new RegExp(/.*youku\.com.*sid\/([A-Za-z0-9]+).*/g);
    var result = re1.exec(str) || re2.exec(str);
    if (!result) {
        return null;
    }
    return result[1];
};

onReceiveMessage = function(msg, sender, callback) {
    if (!msg || !sender || msg['source'] != msgSource['client']) {
        callback(null);
        return;
    }
    if (msg['type'] == 'request-video-list') {
        onRequestVideoList(callback);
    }
}

onRequestVideoList = function(callback) {
    videoList = [];
    $('object').each(function(e) {
        videoID = null || matchYoukuType1($(this)) || matchYoukuType2($(this));
        if (videoID) {
            videoList.push(videoID);
        }
    });
    console.log('[Youku Cast][Client] Video list: ');
    console.log('[Youku Cast][Client] \t' + videoList);
    callback({
        'source': msgSource['client'],
        'type': 'video-list',
        'video-list': videoList
    });
};

$(document).ready(function() {
    console.log('[Youku Cast][Client] Content script loaded.');
    chrome.runtime.onMessage.addListener(onReceiveMessage);
});

