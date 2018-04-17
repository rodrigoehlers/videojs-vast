// Are we on mobile?
if (new MobileDetect(window.navigator.userAgent).mobile()) window.VM_MOBILE_FLAG = true;

// Default videojs initialization options
const DEFAULT_VIDEOJS = {
  controls: true,
  // Always mute on mobile
  muted: window.VM_MOBILE_FLAG,
  sources: [{
    src: '/vast/video.mp4',
    type: 'video/mp4'
  }],
  responsive: true,
  aspectRatio: '16:9',
  verbosity: 4
};

// Hijack the console to mirror its logs
if (window.console && console) {
  for (let prop in console) {
    if (typeof console[prop] === 'function') {
      const original = console[prop];
        console[prop] = function () {
          logger(arguments);
          original.apply(this, arguments)
        }
    }
  }
}

// Log only player and plugin events
function logger(args) {
  let message = '';
  if (args [0] === 'VIDEOJS:') {
    message += '<span class="time">' +
      getCurrentTimeSring() +
      ' - </span><span class="player-log">' +
      args[1] + '</span>';
  } else {
    message += '<span class="time">' +
      getCurrentTimeSring() +
      '</span> - <span class="plugin-log">' +
      args[1] + '</span>';
  }
  if (message.length) $('#clog').append('<li>' + message + '</li>');
}


function onPlayerReady() {
  // Add VAST plugin to videojs
  this.vastClient({
    // VAST url, use default if not set
    adTagUrl: window.VAST_URL ? window.VAST_URL : "/vast/vast.xml",
    // Always play the AD
    playAdAlways: true,
    // Wait 10 seconds before timing out
    adCancelTimeout: 10000
  });

  // Autoplay after ad has loaded
  if (window.VM_MOBILE_FLAG) this.play();

  setupEventLogs(this);
}

function params() {
  const url = new URL(document.URL);
  VAST_URL = url.searchParams.get('vast');
}

function setup() {
  $('#title').append(' - ' + (window.VM_MOBILE_FLAG ? 'Mobile' : 'Desktop'));
  $('#nvast').val(window.VAST_URL ? window.VAST_URL : '');
  listeners();
}

function listeners() {
  $($('input')[0]).on('keyup', event => {
    const { target, keyCode } = event;
    const { value } = target;
    if (keyCode === 13) {
      history.pushState(null, null, (value.length ? '/?vast=' + encodeURIComponent(value) : '/'));
      window.location = (value.length ? '/?vast=' + encodeURIComponent(value): '/');
    }
    event.preventDefault();
  });
}



$(() => {
  params();
  setup();
  const player = videojs('video-id', DEFAULT_VIDEOJS, onPlayerReady);
});
