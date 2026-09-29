(function () {
  var element = document.getElementById('dd-rum-config');
  var config;
  try {
    config = JSON.parse(element.textContent);
  } catch (e) {
    return;
  }
  // The live host only: previews, localhost and mirrors report nothing.
  if (!window.DD_RUM || location.hostname !== config.host) return;
  window.DD_RUM.init({
    applicationId: config.applicationId,
    clientToken: config.clientToken,
    site: config.site,
    service: config.service,
    env: 'production',
    version: config.version,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
})();
