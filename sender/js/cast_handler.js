/**
 * global variables
 */
var currentMedia = null;
var session = null;

initializeCastApi = function() {
  var sessionRequest = new chrome.cast.SessionRequest(ID_INFO['CAST_APP_ID']);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, 
    onError.bind(this, 'API initialization error.'));
};

onInitSuccess = function() {
  console.log('[Youku Cast] API initialization success.');
};

onError = function(info) {
  console.log('[Youku Cast] ' + info);
};

sessionListener = function(session) {
  console.log('[Youku Cast] New session ID: ' + session.sessionId);
  if (session.media.length != 0) {
    onMediaDiscovered('onRequestSessionSuccess_', session.media[0]);
  }
  session.addMediaListener(onMediaDiscovered.bind(this, 'addMediaListener'));
  session.addUpdateListener(sessionUpdateListener.bind(this));  
};

sessionUpdateListener = function(isAlive) {
  var message = isAlive ? 'Session Updated' : 'Session Removed';
  message += ': ' + session.sessionId;
  console.log('[Youku Cast] ' + message);

  if (!isAlive) {
    session = null;
  }
};

receiverListener = function(e) {
  if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
    console.log('[Youku Cast] Receiver found.');
  } else {
    console.log('[Youku Cast] Receiver list empty.');
  }
};

/**
 * launch app and request session
 */
launchApp = function() {
  console.log('[Youku Cast] Launching app...');
  chrome.cast.requestSession(onRequestSessionSuccess, 
    onError.bind(this, 'Launch app error.'));
};

/**
 * callback on success for requestSession call  
 * @param {Object} e A non-null new session.
 */
onRequestSessionSuccess = function(e) {
  console.log('[Youku Cast] Session request success: ' + e.sessionId);
  session = e;
};

/**
 * stop app/session
 */
stopApp = function() {
  if (!session) {
    return;
  }
  session.stop(onStopAppSuccess, onError.bind(this, 'Stop app error.'));
};

onStopAppSuccess = function() {
  session = null;
  console.log('[Youku Cast] App stopped.');
};

loadMedia = function(videoInfo) {
  if (!session) {
    console.log('[Youku Cast] No session');
    return;
  }
  console.log('[Youku Cast] Loading ' + videoInfo['title'] + '(' + videoInfo['id'] + ')');

  var mediaInfo = new chrome.cast.media.MediaInfo(videoInfo['html5-link']);
  mediaInfo.contentType = 'video/mp4';
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;
  request.currentTime = 0;

  request.customData = {'payload': {
    'title': videoInfo['title'],
    'thumb': videoInfo['thumbnail']
  }};

  session.loadMedia(request,
    onMediaDiscovered.bind(this, 'loadMedia'),
    onError.bind(this, 'Load media error.'));
};

/**
 * callback on success for loading media
 * @param {Object} e A non-null media object
 */
onMediaDiscovered = function(how, media) {
  console.log('[Youku Cast] New media session ID:' + media.mediaSessionId + '(' + how + ')');
  currentMedia = media;
  media.addUpdateListener(onMediaStatusUpdate);
  // TODO: set current media time via currentMedia.currentTime
};

onMediaStatusUpdate = function(isAlive) {
  // TODO: update media status according to currentMedia.currentTime
  // and currentMedia.media.duration.
};

playMedia = function() {
  if (!currentMedia) {
    return;
  }
  currentMedia.play(null,
    onMediaCmdSucc.bind(this, 
      'Playing started for ' + currentMedia.sessionId),
    onError.bind(this, 'Play media error.'));
};

pauseMedia = function() {
  if (!currentMedia) {
    return;
  }
  currentMedia.pause(null,
    onMediaCmdSucc.bind(this, 
      'Playing paused for ' + currentMedia.sessionId),
    onError.bind(this, 'Pause media error.')); 
};

stopMedia = function() {
  if (!currentMedia) { 
    return;
  }
  currentMedia.stop(null,
    onMediaCmdSucc.bind(this, 
      'Stopped ' + currentMedia.sessionId),
    onError.bind(this, 'Stop media error.'));
};

/*
setMediaVolume = function(level, mute) {
  if( !currentMediaSession ) 
    return;

  var volume = new chrome.cast.Volume();
  volume.level = level;
  currentVolume = volume.level;
  volume.muted = mute;
  var request = new chrome.cast.media.VolumeRequest();
  request.volume = volume;
  currentMediaSession.setVolume(request,
    onMediaCmdSucc.bind(this, 'media set-volume done'),
    onError);
};

muteMedia = function(cb) {
  if( cb.checked == true ) {
    document.getElementById('muteText').innerHTML = 'Unmute media';
    setMediaVolume(currentVolume, true);
  }
  else {
    document.getElementById('muteText').innerHTML = 'Mute media';
    setMediaVolume(currentVolume, false);
  }
};

seekMedia = function(pos) {
  console.log('Seeking ' + currentMediaSession.sessionId + ':' +
    currentMediaSession.mediaSessionId + ' to ' + pos + '%');
  var request = new chrome.cast.media.SeekRequest();
  request.currentTime = pos * currentMediaSession.media.duration / 100;
  currentMediaSession.seek(request,
    onMediaCmdSucc.bind(this, 'Media seeking success.'),
    onError);
};
*/

onMediaCmdSucc = function(info) {
  console.log('[Youku Cast] ' + info);
};
