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
