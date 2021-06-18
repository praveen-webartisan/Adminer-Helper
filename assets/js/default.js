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

	var sqlScript = e.target.closest(".div-code").dataset.sqlScript;

	collectSavedSQLScriptsFromBGScript(function (response) {
		if(typeof(response) != "undefined") {
			var i = response.indexOf(sqlScript);

			if(i > -1) {
				response.splice(i, 1);
			}

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
			response.forEach(function (sqlScript, i) {
				var contentDiv = document.createElement("div");
				contentDiv.classList.add("div-code");
				contentDiv.dataset.sqlScript = sqlScript;

				var pre = document.createElement("pre");
				var code = document.createElement("code");

				code.textContent = sqlScript;
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

				sqlScriptsList.appendChild(contentDiv);
			});
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

	refreshSQLScriptsList();
}

defaultPopupInit();