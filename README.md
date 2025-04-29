# ADO Service Connection Autofill

A Chrome extension to automatically fill Azure DevOps service connection details.

## Features

- Supports multiple URL formats:
  - `https://dev.azure.com/{organization}/{project}/_settings/adminservices`
  - `https://{organization}.visualstudio.com/{project}/_settings/adminservices`
  - `https://codedev.ms/{organization}/{project}/_settings/adminservices`
- Automatically detects and fills input fields in the "Edit Service Connection" dialog.
- Allows users to configure default values for input fields via a JSON settings page.
- Supports excluding specific organizations from autofill.

## Installation

1. Clone this repository.
2. Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click "Load unpacked" and select the repository folder.

## Usage

1. Navigate to one of the supported Azure DevOps service connection settings pages.
2. Open the "Edit Service Connection" dialog.
3. The extension will automatically fill in the input fields based on the configured settings, unless the organization is excluded.

## Configuration

### JSON Settings

1. Open the extension's options page by right-clicking the extension icon and selecting "Options."
2. Enter a JSON object with key-value pairs where:
   - The key is the label of the input field (e.g., "Service Management Reference (optional)").
   - The value is the default value to autofill.
3. Click "Save" to store the settings.

### Excluded Organizations

1. In the options page, enter a comma-separated list of organization names to exclude from autofill.
2. Click "Save" to store the excluded organizations.

### Example JSON Configuration

```json
{
  "Service Management Reference (optional)": "426d0e47-2bce-484a-a1e2-2d307b51f8e2",
  "Service Connection Name": "My Service Connection"
}
```

### Example Excluded Organizations

```
mseng, msdata, msazure
```

## Development Notes

- The extension uses a `MutationObserver` to detect changes in the DOM and trigger autofill logic.
- Input fields are only filled if they are empty and have not been previously initialized by the extension.
- The extension supports Chrome's `chrome.storage.sync` API to persist user settings and excluded organizations across devices.
- Organizations specified in the excluded list are ignored during autofill.
