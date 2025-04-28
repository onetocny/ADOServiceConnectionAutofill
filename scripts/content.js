const scPageRegexNewFormat = /^https:\/\/dev\.azure\.com\/\w+\/\w+\/_settings\/adminservices$/i;
const scPageRegexOldFormat = /^https:\/\/\w+\.visualstudio\.com\/\w+\/_settings\/adminservices$/i;

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
    if (!scPageRegexNewFormat.test(href) && !scPageRegexOldFormat.test(href))
    {
        return; //we are not at SC page
    }

    if(!document.querySelector('.endpoints-editor-panel-heading'))
    {
        return; // edit/create Service Connection dialog is not open
    }

    // todo find service reference input and fill in the value if it is not filled already
    log("here");
    const label = Array.from(document.querySelectorAll('label')).find(lbl => lbl.textContent.trim() === 'Service Management Reference (optional)');
    const serviceReferenceInput = label ? label.nextElementSibling.querySelector('input') : null;

    log('Label found: ' + label);
    if (!label)
    {
        log("Missing label element.")
        return;
    }
    
    log('Service reference input found: ' + serviceReferenceInput);

    mo.disconnect();
    observe();
}

function log(message)
{
    console.log("[SCAutofillExt] " + message);
}
