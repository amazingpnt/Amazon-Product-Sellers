chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PRODUCT_NAME") {
    const textEl = document.getElementById("productTitle");
    const text = textEl ? textEl.textContent : "";
    sendResponse({ value: text });
    return; //indicate async response
  }

  if (message.type === "GET_SELLER_NAME") {
    const link = document.querySelector('div[style*="float:left"] > a');
    let seller = "";
    if (link) {
      const aria = link.getAttribute('aria-label');
      if (aria) {
        seller = aria.split('.')[0];
      }
    }
    sendResponse({ value: seller });
    return;
  }
  if (message.type === "GET_SELLER_RATING") {
    // Amazon sometimes uses dynamic IDs; match the first rating-count span we find
    const el = document.querySelector('[id^="seller-rating-count-"] span');
    const text = el ? el.textContent.trim() : '';

    const ratings = text.match(/\((\d+)\s+ratings\)/);
    const percentage = text.match(/(\d+)%\s+positive/);

    const ratingsCount = ratings ? parseInt(ratings[1], 10) : null;
    const ratingPercentage = percentage ? parseInt(percentage[1], 10) : null;
    
    sendResponse({value:[ratingsCount, ratingPercentage]});
    return;
  }
});
