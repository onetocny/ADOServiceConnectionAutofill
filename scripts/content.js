const scUrlFormats = [
    /^https:\/\/dev\.azure\.com\/\w+\/\w+\/_settings\/adminservices$/i,
    /^https:\/\/\w+\.visualstudio\.com\/\w+\/_settings\/adminservices$/i,
    /^https:\/\/codedev\.ms\/\w+\/\w+\/_settings\/adminservices$/i
];

const observerOptions = {
    subtree: true,
    childList: true,
};

// todo check if this is the right and up to date way of how to bind to page events
const mo = new MutationObserver(onDocumentMutation);

observe();

function observe()
{
    mo.observe(document, observerOptions);
}

function onDocumentMutation()
{    
    const href = window.location.href;
    if (!scUrlFormats.some(u => u.test(href)))
    {
        return; //we are not at SC page
    }

    if (!document.querySelector('.endpoints-editor-panel-heading'))
    {
        return; // edit Service Connection dialog is not open
    }

    
    chrome.storage.sync.get('jsonData', function(data) {
        if (data.jsonData) {
            try {
                const jsonObject = JSON.parse(data.jsonData);
                for (const [key, value] of Object.entries(jsonObject)) {
                    console.log("key: " + key + ", value: " + value);
                    const label = Array.from(document.querySelectorAll('label')).find(lbl => lbl.textContent.trim() === key);
                    const inputField = label ? label.nextElementSibling.querySelector('input') : null;
                    if (inputField && !!value && !inputField.value) {
                        inputField.value = value;
                        inputField.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }
            } catch (e) {
                return console.error('Error while assigning default values from extension:', e);
            }
        }
    });

    mo.disconnect();
    observe();
}

function log(message)
{
    console.log("[SCAutofillExt] " + message);
}
