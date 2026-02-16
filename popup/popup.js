
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PRODUCT_NAME" }, (response) => {
    const nameEl = document.getElementById("productName");
    nameEl.textContent += response && response.value ? response.value : "";
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "GET_SELLER_NAME" }, (response) => {
    const sellerEl = document.getElementById("sellerName");
    sellerEl.textContent += response && response.value ? response.value : "";
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "GET_SELLER_RATING" }, (response) => {
    const sellerCount = document.getElementById("sellerCount");
    const sellerPercentage = document.getElementById("sellerPercentage");

    sellerCount.textContent += response && response.value[0] ? response.value[0] : "";
    sellerPercentage.textContent += response && response.value[1] ? response.value[1] : "";

  });
});

