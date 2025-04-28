document.getElementById('saveButton').addEventListener('click', function() {
    // log("Save button clicked");
    const value = document.getElementById('settingInput').value;
    chrome.storage.sync.set({ settingValue: value }, function() {
        console.log('Value is saved:', value);
    });
    // log("Saved value: " + value);
});