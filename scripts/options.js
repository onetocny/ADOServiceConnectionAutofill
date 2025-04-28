document.getElementById('saveButton').addEventListener('click', function() {
    const jsonString = document.getElementById('jsonInput').value;
    try {
        const jsonObject = JSON.parse(jsonString);
        chrome.storage.sync.set({ jsonData: jsonString }, function() {
        });
    } catch (e) {
        console.error('Invalid JSON:', e);
    }
});

// Load the saved JSON when the options page is opened
window.onload = function() {
    chrome.storage.sync.get('jsonData', function(data) {
        if (data.jsonData) {
            document.getElementById('jsonInput').value = data.jsonData;
        }
    });
};