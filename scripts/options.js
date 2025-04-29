document.getElementById('saveButton').addEventListener('click', function() {
    const jsonString = document.getElementById('jsonInput').value;
    try {
        // '426d0e47-2bce-484a-a1e2-2d307b51f8e2'
        const jsonObject = JSON.parse(jsonString);
        chrome.storage.sync.set({ jsonData: jsonString }, function() {
        });
    } catch (e) {
        console.error('Invalid JSON:', e);
    }
});

// Load the saved JSON when the options page is opened
window.onload = function() {
    if (!data.jsonData) {
        data.jsonData = '{"Service Management Reference (optional)": "426d0e47-2bce-484a-a1e2-2d307b51f8e2"}';
    }
    chrome.storage.sync.get('jsonData', function(data) {
        if (data.jsonData) {
            document.getElementById('jsonInput').value = data.jsonData;
        }
    });
};