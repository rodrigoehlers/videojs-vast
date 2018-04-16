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
    src: '/video.mp4',
    type: 'video/mp4'
  }]
};

function onPlayerReady() {
  videojs.log('Player ready.');
  this.on('ended', () => videojs.log('Video ended.'));

  this.vastClient({
    adTagUrl: "/vast/vast.xml",
    playAdAlways: true
  });
}

$(() => {
  const customOptions = {};
  const player = videojs('video-id', Object.assign(DEFAULT_OPTIONS, customOptions), onPlayerReady);
});
