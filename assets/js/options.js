function addNewWebSite()
{
	document.getElementById("errAddWebsite").innerHTML = "";

	const websitePattern = /^(http)(s)?\:\/\/([0-9a-zA-Z\.\-]+\/?){0,}$/;
	var website = document.getElementById("txtAddWebsite").value;

	if(website && websitePattern.test(website)) {
		addWebsite(website, function () {
			loadWebsitesList();
		});
	} else {
		document.getElementById("errAddWebsite").innerHTML = "Invalid website";
	}
}

function onWebsitesListItemClicked(e)
{
	var url = e.target.dataset.url;

	if(typeof(url) != "undefined") {
		window.location.href = url;
	}
}

function onWebsiteItemDeleteClicked(e)
{
	e.preventDefault();
	e.stopPropagation();

	var website = e.target.closest("li").dataset.url;

	refreshAddedWebsites(function (websites) {
		var i = websites.indexOf(website);

		if(i > -1) {
			websites.splice(i, 1);
		}

		updateWebsitesList(websites, loadWebsitesList);
	});
}

function loadWebsitesList()
{
	var websitesList = document.getElementById("websitesList");
		websitesList.innerHTML = "";

	addedWebsites.forEach(function (website, i) {
		var li = document.createElement("li");
			li.dataset.url = website;
			li.innerHTML = website;

		li.addEventListener("click", onWebsitesListItemClicked);

		var div = document.createElement("div");
		var deleteElem = document.createElement("a");

		deleteElem.innerHTML = "&#128465;";

		deleteElem.addEventListener("click", onWebsiteItemDeleteClicked);

		div.appendChild(deleteElem);

		li.appendChild(div);

		websitesList.appendChild(li);
	});

	document.getElementById("txtAddWebsite").value = "";
}

document.getElementById("txtAddWebsite").addEventListener("keyup", function (e) {
	if(e.keyCode == 13) {
		addNewWebSite();
	}
});

document.getElementById("btnAddWebsite").addEventListener("click", function (e) {
	addNewWebSite();
});

refreshAddedWebsites(loadWebsitesList);

