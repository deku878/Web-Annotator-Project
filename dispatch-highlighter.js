const GET_BUTTON_STATUS = "GET_BUTTON_STATUS";
let action, color;
let removeHighlightSwitch = false;
let addHighlightSwitch = false;
chrome.runtime.onMessage.addListener(function (req, res, sendResponse) {
	if (req.action === ADD_HIGHLIGHT) {
		action = req.action;
		color = req.color;
		addHighlightSwitch = !addHighlightSwitch;
		if (addHighlightSwitch) {
			if (removeHighlightSwitch) {
				document.removeEventListener("mouseup", highlightHandler);
				removeHighlightSwitch = !removeHighlightSwitch;
			}
			document.addEventListener("mouseup", highlightHandler);
		} else {
			document.removeEventListener("mouseup", highlightHandler);
		}
		sendResponse({ switch: addHighlightSwitch });
	} else if (req.action === REMOVE_HIGHLIGHT) {
		action = req.action;
		color = req.color;
		removeHighlightSwitch = !removeHighlightSwitch;
		if (removeHighlightSwitch) {
			if (addHighlightSwitch) {
				document.removeEventListener("mouseup", highlightHandler);
				addHighlightSwitch = !addHighlightSwitch;
			}
			document.addEventListener("mouseup", highlightHandler);
		} else {
			document.removeEventListener("mouseup", highlightHandler);
		}
		sendResponse({ switch: removeHighlightSwitch });
	} else if (req.action === GET_BUTTON_STATUS) {
		sendResponse({ addBtn: addHighlightSwitch, remBtn: removeHighlightSwitch });
	}
});

function highlightHandler() {
	console.log("highlight handler with action ", action, "and color ", color);
	const sel = window.getSelection();
	if (sel.isCollapsed) return;
	let popupText = '';
    if (action === ADD_HIGHLIGHT) {
        popupText = prompt("Enter your note here", "");
        if (!popupText) return;
    }
	sel.color = color;
	sel.popupText = popupText;
	selObj = extractFromSel(sel);
	addToStorage(selObj, window.location.href, action);
	highlighter(action, selObj);
	sel.removeAllRanges();
}
