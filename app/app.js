if (new MobileDetect(window.navigator.userAgent).mobile()) window.VM_MOBILE_FLAG = true;

function onPlayerReady() {
  // Add VAST plugin to videojs
  this.vastClient({
    // VAST url, use default if not set
    adTagUrl: window.VAST_URL ? window.VAST_URL : "/vast/vast.xml",
    // Always play the AD
    playAdAlways: true
  });

  // Autoplay after ad has loaded
  if (window.VM_MOBILE_FLAG) this.play();

  this.on('firstplay', () => videojs.log('\'firstplay\''));
  this.on('play', () => videojs.log('\'play\''));
  this.on('pause', () => videojs.log('\'pause\''));
  this.on('ended', () => videojs.log('\'ended\''));
  videojs.log('\'ready\'');
  this.on('vast.adStart', () => console.log('VAST-PLUGIN', 'AD STARTED'));
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

function logger(args) {
  let message = '';
  if (args [0] === 'VIDEOJS:') {
    message += getCurrentTimeSring() + ' - <span class="videojs-log">' + args[0] + ' ' + args[1].toUpperCase() + '</span>';
  } else {
    message += getCurrentTimeSring() + ' - <span class="network-log">' + JSON.stringify(args) + '</span>';
  }
  if (message.length) $('#clog').append('<li>' + message + '</li>');
}

// Default videojs options
const DEFAULT_OPTIONS = {
  controls: true,
  // Always mute on mobile
  muted: window.VM_MOBILE_FLAG,
  // Default video
  sources: [{
    src: '/vast/video.mp4',
    type: 'video/mp4'
  }],
  responsive: true,
  aspectRatio: '16:9',
  verbosity: 4
};


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
