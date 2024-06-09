(function renderHighlights() {
	url = window.location.href;
	chrome.storage.sync.get("highlightsExt", function (results) {
		highlightsExt = results.highlightsExt;
		if (!highlightsExt[url]) return;
		for (storedObj of highlightsExt[url]) {
			renderHighlight(storedObj);
		}
	});
})();

function renderHighlight(storedObj) {
    try {
        anchor = getNodeFromPath(storedObj.anchorNode);
        focus = getNodeFromPath(storedObj.focusNode);
        node = getNodeFromPath(storedObj.node);
    } catch (err) {
        return;
    }
    if (!anchor || !node || !focus) return;
    focusOffset = storedObj.focusOffset;
    anchorOffset = storedObj.anchorOffset;
    color = storedObj.color;
    popupText = storedObj.popupText;
    action = storedObj.action;
    if (
        anchor.textContent !== storedObj.anchorString ||
        focus.textContent !== storedObj.focusString
    ) {
        return;
    }
    selObj = { anchor, focus, node, focusOffset, anchorOffset, color, popupText };
    highlighter(action, selObj);
}

// CSS to style the popup tooltip
const popupStyle = document.createElement('style');
popupStyle.innerHTML = `
.highlighter-popup[data-popup]:hover:after {
    content: attr(data-popup);
    position: absolute;
    background: #333;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    white-space: pre;
    transform: translateY(-100%);
    z-index: 1000;
}
.highlighter-ext {
    position: relative;
    cursor: pointer;
}
`;
document.head.appendChild(popupStyle);
