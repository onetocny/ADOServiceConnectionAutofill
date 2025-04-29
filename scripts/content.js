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

    const excludeOrgs = getExcludedOrgs(options);
    const urlMatches = scUrlFormats
        .map(u => u.exec(window.location.href))
        .filter(r => r !== null && r.length > 1 && excludeOrgs.every(o => o !== r[1].toLowerCase()));

    if (urlMatches.length === 0)
    {
        return; //we are not at SC page or the org is excluded
    }

    if (!document.querySelector('.endpoints-editor-panel-heading'))
    {
        return; // edit Service Connection dialog is not open
    }

    try {
        const jsonObject = JSON.parse(options.jsonData);
        for (const [key, value] of Object.entries(jsonObject)) {
            console.log("key: " + key + ", value: " + value);
            const label = Array.from(document.querySelectorAll('label')).find(lbl => lbl.textContent.trim() === key);
            const inputField = label ? label.nextElementSibling.querySelector('input') : null;

            const initAttributeName = "adoSCAutofillIntialized";

            if (inputField && !!value && !inputField.value && !inputField.getAttribute(initAttributeName)) {
                inputField.value = value;
                inputField.setAttribute(initAttributeName, true);
                inputField.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    } catch (e) {
        return console.error('Error while assigning default values from extension:', e);
    }


    mo.disconnect();
    observe(mo);
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