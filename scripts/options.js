const jsonInput = document.getElementById('jsonInput');
const saveButton = document.getElementById('saveButton');
const formatButton = document.getElementById('formatButton');
const successMessage = document.getElementById('successMessage');
const copyExampleButton = document.getElementById('copyExampleButton');
const exampleJson = document.getElementById('exampleJson');

// Enable save button when input is changed
jsonInput.addEventListener('input', function() {
    saveButton.disabled = false;
});

// Save JSON and show success message
saveButton.addEventListener('click', function() {
    const jsonString = jsonInput.value;
    try {
        const jsonObject = JSON.parse(jsonString);
        chrome.storage.sync.set({ jsonData: jsonString }, function() {
            console.log('JSON is saved:', jsonObject);
            saveButton.disabled = true;
            showSuccessMessage();
        });
    } catch (e) {
        console.error('Invalid JSON:', e);
    }
});

// Format JSON in the input field
formatButton.addEventListener('click', function() {
    try {
        const jsonObject = JSON.parse(jsonInput.value);
        jsonInput.value = JSON.stringify(jsonObject, null, 2);
    } catch (e) {
        console.error('Invalid JSON:', e);
    }
});

// Show success message and fade out after 2 seconds
function showSuccessMessage() {
    successMessage.classList.add('visible');
    setTimeout(() => {
        successMessage.classList.remove('visible');
    }, 2000);
};

// Copy example JSON to clipboard
copyExampleButton.addEventListener('click', function() {
    navigator.clipboard.writeText(exampleJson.textContent).then(() => {
        console.log('Example JSON copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy example JSON:', err);
    });
});

// Load the saved JSON when the options page is opened
window.onload = function() {
    chrome.storage.sync.get('jsonData', function(data) {
        if (data.jsonData) {
            jsonInput.value = data.jsonData;
        }
    });
};