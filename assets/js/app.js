let addedWebsites;

function refreshAddedWebsites(callback)
{
	chrome.storage.sync.get({"adminerWebsites": []}, function (result) {
		addedWebsites = result.adminerWebsites;

		chrome.contextMenus.update("ah-ctxmenu-save-script", {
			documentUrlPatterns: addedWebsites.map(w => ( w + (w[w.length - 1] != "/" ? "/" : "") + "*" )),
		});

		if(typeof(callback) == "function") {
			callback(addedWebsites);
		}
	});
}

function addWebsite(website, callback)
{
	refreshAddedWebsites(function (websites) {
		websites.push(website);

		chrome.storage.sync.set({ "adminerWebsites": websites }, function () {
			refreshAddedWebsites(callback);
		});
	});
}

function updateWebsitesList(websitesList, callback)
{
	chrome.storage.sync.set({ "adminerWebsites": websitesList }, function () {
		refreshAddedWebsites(callback);
	});
}
