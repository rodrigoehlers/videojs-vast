// Disable built in Google Analytics
window.HELP_IMPROVE_VIDEOJS = false;

function getCurrentTimeSring() {
  const timestamp = new Date();
  let m = timestamp.getMilliseconds() + '';
  while(m.length < 3) {
    m = '0' + m;
  }

  return `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}.${m}`;
}

function setupEventLogs(player) {
  player.on('firstplay', () => videojs.log('\'firstplay\''));
  player.on('play', () => videojs.log('\'play\''));
  player.on('pause', () => videojs.log('\'pause\''));
  player.on('ended', () => videojs.log('\'ended\''));
  videojs.log('\'ready\'');

  player.on('vast.firstPlay', () => console.log('VAST', '\'first-play\''));
  player.on('vast.adStart', () => console.log('VAST', '\'ad-start\''));
  player.on('vast.adSkip', () => console.log('VAST', '\'ad-skip\''));
  player.on('vast.adError', () => console.log('VAST', '\'ad-error\''));
  player.on('vast.adsCancel', () => console.log('VAST', '\'ad-cancel\''));
  player.on('vast.contentStart', () => console.log('VAST', '\'content-start\''));
  player.on('vast.contentEnd', () => console.log('VAST', '\'content-end\''));
  player.on('vast.reset', () => console.log('VAST', '\'reset\''));
}
