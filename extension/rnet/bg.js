//rNet background script
(function () {
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

    var self = {
        //Get saved setting and initialize GUI items
        init: function () {
            chrome.storage.sync.get({
                activate: true,
                contextmenu: true,
                contextmenuActivate: true
            }, function (items) {
                self.updateContextMenu(items);
            });

            chrome.runtime.onInstalled.addListener(self.onInstalled);
            chrome.runtime.onMessage.addListener(self.onMessageReceived);
        },

        //On first install
        onInstalled: function (details) {
        },

        //On message received
        onMessageReceived: function (message, sender, sendResponse) {

            //Option page saved
            if (message.type == "options") {
                self.updateContextMenu(message.items);
            }
            else if (message.type == "extensions") {
                self.openExtensions();
            }
            if (typeof (sendResponse) == "function")
                sendResponse();
        },

        //Update GUI
        updateContextMenu: function (items) {
            if (items.contextmenu && items.activate) {
                chrome.contextMenus.create({
                    "id": "contextMenuNCaze",
                    "title": "Ativar/Desativar nCazé",
                    "contexts": ["page"]
                });

                chrome.contextMenus.onClicked.addListener((info) => {
                    if(info.menuItemId == "contextMenuNCaze") {
                        self.openOptions();
                    }
                })

            } else {
                chrome.contextMenus.remove("contextMenuNCaze");
            }
        },

        //Opens the options tab
        openOptions: function () {
            var optionsUrl = chrome.runtime.getURL('rNet/options/options.html');
            self.openUrl(optionsUrl);

        },

        openUrl: function (url) {
            chrome.tabs.query({ url: url }, function (tabs) {
                if (tabs.length) {
                    chrome.tabs.update(tabs[0].id, { active: true });
                    chrome.windows.update(tabs[0].windowId, { focused: true });
                } else {
                    chrome.tabs.create({ url: url });
                }
            });
        }
    };

    self.init();

})();