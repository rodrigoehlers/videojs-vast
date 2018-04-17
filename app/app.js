// Disable built in Google Analytics
window.HELP_IMPROVE_VIDEOJS = false;

// Desktop or mobile userAgent?
// TODO: Check if this is enough
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  window.VM_MOBILE_FLAG = true;
} else {
  window.VM_MOBILE_FLAG = false;
}

// Default videojs options
const DEFAULT_OPTIONS = {
  controls: true,
  // Always mute on mobile
  muted: window.VM_MOBILE_FLAG,
  // Only autoplay on mobile
  autoplay: window.VM_MOBILE_FLAG,
  // Default video
  sources: [{
    src: '/vast/video.mp4',
    type: 'video/mp4'
  }],
  responsive: true,
  aspectRatio: '16:9'
};

let VAST_URL;

function onPlayerReady() {
  this.on('firstplay', () => videojs.log('\'firstplay\''));
  this.on('play', () => videojs.log('\'play\''));
  this.on('pause', () => videojs.log('\'pause\''));
  this.on('ended', () => videojs.log('\'ended\''));
  videojs.log('\'ready\'');

  this.vastClient({
    adTagUrl: VAST_URL ? VAST_URL : "/vast/vast.xml",
    playAdAlways: true
  });
}

function params() {
  const url = new URL(document.URL);
  VAST_URL = url.searchParams.get('vast');
}

function setup() {
  $('#nvast').val(VAST_URL ? VAST_URL : '');
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

function logger(args) {
  const timestamp = new Date();
  const time = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}.${timestamp.getMilliseconds()}`;
  let message = '';
  if (args [0] === 'VIDEOJS:') {
    message += time + ' - <span class="videojs-log">' + args[0] + ' ' + args[1].toUpperCase() + '</span>';
  }
  if (message.length) $('#clog').append('<li>' + message + '</li>');
}

$(() => {
  params();
  setup();

  if (window.console && console) {
    for (let c in console) {
      if (typeof console[c] === 'function') {
        const cx = console[c]
          console[c] = function () {
            logger(arguments);
            cx.apply(this, arguments)
          }
      }
    }
  }

  const customOptions = {};
  const player = videojs('video-id', Object.assign(DEFAULT_OPTIONS, customOptions), onPlayerReady);
});
