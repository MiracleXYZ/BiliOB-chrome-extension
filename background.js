chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contentScriptQuery == 'queryInfo') {
      var url = `https://www.biliob.com/api/author/${request.itemId}`;
      fetch(url).then((response) => {
        return response.json()
      }).then((data) => sendResponse(data)).catch((error) => {
        sendResponse({})
      })
      return true;
    }
  }
);