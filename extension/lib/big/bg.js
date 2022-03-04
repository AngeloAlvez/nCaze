chrome.webRequest.onHeadersReceived.addListener(
  function (info) {
      var headers = info.responseHeaders;
      for (var i = headers.length - 1; i >= 0; --i) {
          var header = headers[i].name.toLowerCase();
          if (header == 'content-security-policy') {
              headers.splice(i, 1); // Remove header
          }
      }
      return { responseHeaders: headers };
  },
  { urls: ['*://*/*'] }, ['blocking', 'responseHeaders']
);