// reusable helper that queries the active tab and sends the provided message
function queryActiveTab(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  });
}

/**
 * Perform a request against the content script and populate one or more
 * elements with the result.
 *
 * @param {string} requestType - the message.type to send
 * @param {string[]} tags - list of element IDs to update; if the response value
 *   is an array the items will be matched by index, otherwise the whole value
 *   is used for every tag.
 */
function requestData(requestType, tags, textFormat) {
  queryActiveTab({ type: requestType }, (response) => {
    // determine the base value(s) returned by the content script
    const val = response && response.value !== undefined ? response.value : "";

    tags.forEach((tag, idx) => {
      const el = document.getElementById(tag);
      if (!el) return;

      let text = "";
      if (Array.isArray(val)) {
        text = val[idx] !== undefined ? val[idx] : "";
      } else {
        text = val;
      }
      if(textFormat) el.textContent=text+el.textContent;
      else el.textContent += text;
    });
  });
}

// usage examples
requestData("GET_PRODUCT_NAME", ["productName"], 0);
requestData("GET_SELLER_NAME", ["sellerName"], 0);
requestData("GET_SELLER_RATING", ["sellerCount", "sellerPercentage"], 1);

