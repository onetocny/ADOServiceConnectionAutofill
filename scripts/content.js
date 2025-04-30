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
        return; // we are not at ADO SC page
    }

    const org = urlMatch[1].toLowerCase();
    if (getExcludedOrgs(options).find(o => o === org))
    {
        return; // we are at org that is excluded
    }

    autofillServiceConnectionDetails(options);

    mo.disconnect();
    observe(mo);
}

function autofillServiceConnectionDetails(options)
{
    const labels = Array.from(document.querySelectorAll(".endpoints-editor-panel-container label"));
    if (labels.length < 1)
    {
        return; // there are no labels or panel is not open
    }

    try
    {
        const initAttributeName = "adoSCAutofillIntialized";
        const autofillValues = JSON.parse(options.jsonData);
        for (const [key, value] of Object.entries(autofillValues))
        {
            const label = labels.find(lbl => lbl.textContent.trim() === key);
            const inputField = label ? label.nextElementSibling.querySelector("input") : null;

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
        return console.error("Error while assigning default values from extension:", e);
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