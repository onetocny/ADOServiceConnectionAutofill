const scPageRegex = /^https:\/\/dev\.azure\.com\/+$/i; // todo specify the sc url here
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
    log("Hello from extension");


    if (!scPageRegex.test(window.location.href))
    {

        return; //we are not at SC page
    }

    if(!document.querySelector('.endpoints-editor-panel-heading'))
    {
        return; // edit/create Service Connection dialog is not open
    }

    // todo find service reference input and fill in the value if it is not filled already

    mo.disconnect();
    observe();
}

function log(message)
{
    console.log("[SCAutofillExt] " + message);
}
