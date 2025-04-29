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
        return; // edit/create Service Connection dialog is not open
    }

    const label = Array.from(document.querySelectorAll('label')).find(lbl => lbl.textContent.trim() === 'Service Management Reference (optional)');
    const serviceReferenceInput = label ? label.nextElementSibling.querySelector('input') : null;
    if (serviceReferenceInput && !serviceReferenceInput.value) {
        serviceReferenceInput.value = '426d0e47-2bce-484a-a1e2-2d307b51f8e2';
    }

    mo.disconnect();
    observe();
}

function log(message)
{
    console.log("[SCAutofillExt] " + message);
}
