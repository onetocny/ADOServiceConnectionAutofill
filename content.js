const scPageRegex = /^https:\/\/dev\.azure\.com\/+$/i; // todo specify the sc url here
const observerOptions = {
    subtree: true,
    childList: true,
};
const mo = new MutationObserver(onDocumentMutation);

observe();

function observe()
{
    mo.observe(document, observerOptions);
}

function onDocumentMutation()
{    
    if (!scPageRegex.test(window.location.href))
    {
        return; //we are not at PR detail page
    }


    
    mo.disconnect();
    


    observe();
}

function log(message)
{
    console.log("[SCAutofillExt] " + message);
}
