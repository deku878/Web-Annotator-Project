const DEFAULT_COLOR = "#fff475";
const DEFAULT_FONT_SIZE = "14px";
const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";

let color = DEFAULT_COLOR;

const tabParams = { active: true, currentWindow: true };

chrome.runtime.onInstalled.addListener(initialiseStorage);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        renderHighlights(tabId);
    }
});
chrome.commands.onCommand.addListener(function (command) {
    kbCmdHandler(command);
});

function initialiseStorage() {
    chrome.storage.sync.get("highlightsExtInit", function (results) {
        if (!results.highlightsExtInit) {
            chrome.storage.sync.set({ highlightsExt: {} });
            chrome.storage.sync.set({ notesExt: {} });
            chrome.storage.sync.set({ highlighterExtInit: true }); // Storage Initialised
            chrome.storage.sync.set({ highlighterExtColor: DEFAULT_COLOR });
            chrome.storage.sync.set({ highlighterExtFontSize: DEFAULT_FONT_SIZE });
        }
    });
}

function renderHighlights(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["render-highlights.js"]
    }, () => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        }
    });
}

function kbCmdHandler(command) {
    if (command === "add-highlight") {
        chrome.tabs.query(tabParams, function (tabs) {
            chrome.storage.sync.get("highlighterExtColor", function (results) {
                color = results.highlighterExtColor;
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: sendMessage,
                    args: [{ action: ADD_HIGHLIGHT, color: color }]
                });
            });
        });
    } else if (command === "remove-highlight") {
        chrome.tabs.query(tabParams, function (tabs) {
            chrome.storage.sync.get("highlighterExtColor", function (results) {
                color = results.highlighterExtColor;
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: sendMessage,
                    args: [{ action: REMOVE_HIGHLIGHT, color: color }]
                });
            });
        });
    }
}

function sendMessage(message) {
    chrome.runtime.sendMessage(message, function (response) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        } else {
            console.log(response);
        }
    });
}


