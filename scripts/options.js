const jsonInput = document.getElementById('jsonInput');
const stringInput = document.getElementById('stringInput');
const saveButton = document.getElementById('saveButton');
const formatButton = document.getElementById('formatButton');
const successMessage = document.getElementById('successMessage');
const copyExampleButton = document.getElementById('copyExampleButton');
const copyExampleStringButton = document.getElementById('copyExampleStringButton');
const exampleJson = document.getElementById('exampleJson');
const exampleString = document.getElementById('exampleString');

// Enable save button when input is changed
jsonInput.addEventListener('input', function() {
    saveButton.disabled = false;
});

stringInput.addEventListener('input', function() {
    saveButton.disabled = false;
});

// Save input and show success message
saveButton.addEventListener('click', function() {
    const orgList = document.getElementById('stringInput').value;
    const jsonString = jsonInput.value;
    try {
        const orgArray = orgList.split(',').map(org => org.trim());
        const jsonObject = JSON.parse(jsonString);

        chrome.storage.sync.set({ 
            excludedOrgs: orgArray, 
            jsonData: jsonString 
        }, function() {
            saveButton.disabled = true;
            showSuccessMessage();
        });
    } catch (e) {
        console.error('Invalid input:', e);
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
    navigator.clipboard.writeText(exampleJson.value.trim()).then(() => {
        console.log('Example JSON copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy example JSON:', err);
    });
});

// Copy example comma-separated list to clipboard
copyExampleStringButton.addEventListener('click', function() {
    navigator.clipboard.writeText(exampleString.value.trim()).then(() => {
        console.log('Example comma-separated list copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy example comma-separated list:', err);
    });
});

// Load the saved JSON when the options page is opened
window.onload = function() {
    chrome.storage.sync.get('jsonData', function(data) {
        if (data.jsonData) {
            jsonInput.value = data.jsonData;
        }
    });
    chrome.storage.sync.get('excludedOrgs', function(data) {
        if (data.excludedOrgs) {
            document.getElementById('stringInput').value = data.excludedOrgs.join(', ');
        }
    });
};