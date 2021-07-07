function onWebsiteItemClicked(e)
{
	var url = e.target.dataset.url;

	if(typeof(url) != "undefined") {
		chrome.tabs.create({
			url: url
		});
	}
}

function collectSavedSQLScriptsFromBGScript(callback)
{
	chrome.runtime.sendMessage({ action: "get-sql-scripts" }, function (response) {
		if(typeof(callback) == "function") {
			callback(response);
		}
	});
}

function updateSavedSQLScriptsUsingBGScript(sqlScriptsList, callback)
{
	chrome.runtime.sendMessage({ action: "save-sql-scripts", "sqlScripts": sqlScriptsList }, function (response) {
		if(typeof(callback) == "function") {
			callback(response);
		}
	});
}

function onSQLScriptDeleteClicked(e)
{
	e.preventDefault();
	e.stopPropagation();

	var queryIndexToRemove = e.target.closest(".div-code").dataset.queryIndex;

	collectSavedSQLScriptsFromBGScript(function (response) {
		if(typeof(response) != "undefined") {
			response.splice(queryIndexToRemove, 1);

			updateSavedSQLScriptsUsingBGScript(response, refreshSQLScriptsList);
		}
	});
}

function refreshSQLScriptsList()
{
	collectSavedSQLScriptsFromBGScript(function (response) {
		var sqlScriptsList = document.getElementById("sqlScriptsList");
			sqlScriptsList.innerHTML = "";

		if(typeof(response) != "undefined") {
			var sqlScripts = response;
			var sqlScriptsCount = sqlScripts.length;

			for(var i = (sqlScriptsCount - 1); i >= 0; i--) {
				sqlScript = sqlScripts[i];

				var contentDiv = document.createElement("div");
				contentDiv.classList.add("div-code");
				contentDiv.dataset.queryIndex = i;

				var pre = document.createElement("pre");
				var code = document.createElement("code");

				code.textContent = sqlScript.query;
				code.classList.add("language-sql");

				pre.appendChild(code);

				contentDiv.appendChild(pre);

				var actionsDiv = document.createElement("div");
				actionsDiv.classList.add("div-actions");

				// delete button
				var btnDelete = document.createElement("a");
				btnDelete.classList.add("text-danger");

				btnDelete.setAttribute("href", "javascript:void(0);");
				btnDelete.setAttribute("title", "Delete");

				btnDelete.addEventListener("click", onSQLScriptDeleteClicked);

				btnDelete.innerHTML = "&times;";

				actionsDiv.appendChild(btnDelete);

				contentDiv.appendChild(actionsDiv);

				if(typeof(sqlScript.dateTime) != "undefined") {
					var metaDiv = document.createElement("div");
					metaDiv.classList.add("div-meta");

					var dateTimeSpan = document.createElement("span");
					dateTimeSpan.textContent = sqlScript.dateTime;

					metaDiv.appendChild(dateTimeSpan);

					if(typeof(sqlScript.website) != "undefined") {
						var websiteLink = document.createElement("a");
						websiteLink.textContent = sqlScript.website;
						websiteLink.setAttribute("href", sqlScript.website);

						metaDiv.appendChild(document.createElement("br"));
						metaDiv.appendChild(websiteLink);
					}

					contentDiv.appendChild(metaDiv);
				}

				sqlScriptsList.appendChild(contentDiv);
			}
		}

		Prism.highlightAll();
	});
}

async function defaultPopupInit()
{
	document.getElementById("btnAddWebsitePage").addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();

		if(chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL("options.html"));
		}
	});

	window.addEventListener("click", function(e) {
		if(e.target.tagName.toLowerCase() == "a" && e.target.href !== undefined) {
			chrome.tabs.create({
				url:e.target.href
			});
		}
	});

	refreshSQLScriptsList();
}

defaultPopupInit();