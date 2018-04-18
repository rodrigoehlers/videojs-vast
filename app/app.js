// Are we on mobile?
if (new MobileDetect(window.navigator.userAgent).mobile()) window.VM_MOBILE_FLAG = true;

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
  if (args [0] === 'VIDEOJS:') {
    let message = '<span class="time">' +
      getCurrentTimeSring() +
      ' - </span><span class="player-log">' +
      args[1] + '</span>';
      $('#player-log').append('<li>' + message + '</li>');
  } else if (args[0] === 'VAST'){
    message = '<span class="time">' +
      getCurrentTimeSring() +
      '</span> - <span class="plugin-log">' +
      args[1] + '</span>';
      $('#plugin-log').append('<li>' + message + '</li>');
  }
}

// UI / UX STUFF

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
