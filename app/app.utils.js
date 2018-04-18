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

// PLAYER STUFF

// Default videojs initialization options
const DEFAULT_VIDEOJS = {
  controls: true,
  muted: true,
  sources: [{
    src: '/vast/video.mp4',
    type: 'video/mp4'
  }],
  responsive: true,
  aspectRatio: '16:9',
  verbosity: 4
};

function onPlayerReady() {
  // TODO: Again because initialization options don't seem to work..
  this.muted(true);
  // Add VAST plugin to videojs
  this.vastClient({
    // VAST url, use default if not set
    adTagUrl: window.VAST_URL ? window.VAST_URL : "/vast/vast.xml",
    // Always play the AD
    playAdAlways: true,
    // Wait 10 seconds before timing out
    adCancelTimeout: 10000
  });

  // Setup all event logs -> app.utils.js
  setupEventLogs(this);

  // Autoplay after ad has loaded
  if (window.VM_MOBILE_FLAG) {
    // TODO: One time doesn't seem to be enough..
    this.play();
    this.play();
  }
}

function setupEventLogs(player) {
  // FIRST FRAME (KORMO)
  player.on('firstplay', () => {
    videojs.log('\'first-play\'');
    player.quartile = 0;
  });
  // player.on('vast.firstPlay', () => console.log('VAST', '\'first-play\''));

  player.on('vast.adStart', () => {
    player.ad = true;
    console.log('VAST', '\'ad-start\'')
  });

  // PLAY (KORMO) AD PLAY (KORMO)
  player.on('play', () => {
    if (player.ad) {
      console.log('VAST', '\'ad-play\'');
    } else videojs.log('\'play\'');
  });
  // PAUSE (KORMO) AD PAUSE (KORMO)
  player.on('pause', () => {
    if (player.ad) {
      console.log('VAST', '\'ad-pause\'');
    } else videojs.log('\'pause\'');
  });

  // CLICK (KORMO)
  // IMPRESSION (KORMO)
  // AD CLICK (KORMO)
  // AD IMPRESSION (KORMO)
  // DISPLAY CLICK (KORMO)

  // TIME (KORMO) COULD ALSO BE USED FOR QUARTILE WITH VIDEO LENGTH
  // ALSO FOR AD TIME (KORMO)
  player.on('timeupdate', () => {
    const length = player.duration();
    const remaining = player.remainingTime();
    const current = length - remaining;
    const quartile = length / 4;

    if (current > (quartile * player.quartile)) {
      if (player.ad) {
        console.log('VAST', '\'ad-quartile ' + (++player.quartile) + '\'');
      } else videojs.log('\'quartile ' + (++player.quartile) + '\'');
    }
  });

  // FULLSCREEN
  player.on('fullscreenchange', () => {
    if (player.ad) {
      console.log('VAST', '\'ad-fullscreen-change\'');
    } else videojs.log('\'fullscreen-change\'')
  });

  // ERROR (KORMO)
  player.on('vast.adError', () => console.log('VAST', '\'ad-error\''));

  // AD COMPLETE (KORMO)
  player.on('vast.contentStart', () => {
    player.ad = false;
    console.log('VAST', '\'ad-complete\'');
  });

  // COMPLETE (KORMO)
  // player.on('vast.contentEnd', () => console.log('VAST', '\'content-end\''));
  // player.on('ended', () => videojs.log('\'ended\''));

  // READY (KORMO)
  videojs.log('\'ready\'');

  // OPTIONAL
  // player.on('vast.adsCancel', () => console.log('VAST', '\'ad-cancel\''));
  // player.on('vast.reset', () => console.log('VAST', '\'vast-reset\''));
  // player.on('vast.adSkip', () => console.log('VAST', '\'ad-skip\''));
}
