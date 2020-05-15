let values = {
  files: chrome.extension.getURL('manifest.json').replace('manifest.json', ''),
  version: chrome.runtime.getManifest().version
};
var settings = document.createElement('script');
settings.type = "text/javascript";
settings.innerHTML = `var biliob_settings = JSON.parse(\`${JSON.stringify(values)}\`);`;
document.getElementsByTagName('head')[0].appendChild(settings);

var script = document.createElement('script');
script.type = "text/javascript";
script.src = chrome.extension.getURL('live_count/index.js');
document.getElementsByTagName('head')[0].appendChild(script);

