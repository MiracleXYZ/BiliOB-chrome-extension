// Saves options to chrome.storage
function save_options() {
  var manual = document.getElementById('manual').checked;
  chrome.storage.sync.set({
    manual: manual
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = '已保存';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    manual: false
  }, function(items) {
    document.getElementById('manual').checked = items.manual;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);