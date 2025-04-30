const scUrlFormats = [
    /^https:\/\/dev\.azure\.com\/(\w+)\/\w+\/_settings\/adminservices$/i,
    /^https:\/\/(\w+)\.visualstudio\.com\/\w+\/_settings\/adminservices$/i,
    /^https:\/\/codedev\.ms\/(\w+)\/\w+\/_settings\/adminservices$/i
];

const observerOptions = {
    subtree: true,
    childList: true,
};

(async () => {
    const options = await chrome.storage.sync.get() ?? {};
    const mo = new MutationObserver((_, mo) => onDocumentMutation(options, mo));
    observe(mo);
})();

function observe(mo)
{
    mo.observe(document, observerOptions);
}

function onDocumentMutation(options, mo)
{
    if (!options || !options.jsonData)
    {
        return;
    }
    
    const urlMatch = scUrlFormats
        .map(u => u.exec(window.location.href))
        .find(u => u !== null && u.length > 1);
    
    if (!urlMatch)
    {
        return; // we are not ADO SC page
    }

    const org = urlMatch[1].toLowerCase();
    if (getExcludedOrgs(options).find(o => o === org))
    {
        return; // we are at org that is excluded
    }

    if (!document.querySelector('.endpoints-editor-panel-heading'))
    {
        return; // edit Service Connection dialog is not open
    }

    autofillServiceConnectionDetails(options);

    mo.disconnect();
    observe(mo);
}

function autofillServiceConnectionDetails(options)
{
    try
    {
        const jsonObject = JSON.parse(options.jsonData);
        for (const [key, value] of Object.entries(jsonObject))
        {
            const label = Array.from(document.querySelectorAll('label')).find(lbl => lbl.textContent.trim() === key);
            const inputField = label ? label.nextElementSibling.querySelector('input') : null;

            const initAttributeName = "adoSCAutofillIntialized";

            if (inputField && !!value && !inputField.value && !inputField.getAttribute(initAttributeName)) {
                
                inputField.setAttribute(initAttributeName, true);
                setTimeout(() => {
                    inputField.value = value;
                    inputField.dispatchEvent(new Event("change", { bubbles: true }))
                }, 100);
            }
        }
    }
    catch (e)
    {
        return console.error('Error while assigning default values from extension:', e);
    }
}

function getExcludedOrgs(options)
{
    if (!options || !options.excludedOrgs)
    {
        return [];
    }

    const excludedOrgs = options.excludedOrgs + "";
    return excludedOrgs.split(",").map(o => o.trim().toLowerCase());
}