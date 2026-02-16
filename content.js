chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PRODUCT_NAME") {
    const textEl = document.getElementById("productTitle");
    const text = textEl ? textEl.textContent : "";
    sendResponse({ value: text });
    return; //indicate async response
  }

  if (message.type === "GET_SELLER_NAME") {
    const el=document.querySelectorAll('[id^="aod-offer-soldBy"] .a-fixed-left-grid .a-fixed-left-grid-inner .a-fixed-left-grid-col.a-col-right a');
    sellerName=el[1].textContent;
    sendResponse({ value: sellerName });
    return;
  }
  if (message.type === "GET_SELLER_RATING") {
    // Amazon sometimes uses dynamic IDs; match the first rating-count span we find
    const el = document.querySelectorAll('[id^="seller-rating-count-"] span');
    const text = el[1] ? el[1].textContent.trim() : '';

    const ratings = text.match(/\((\d+)\s+ratings\)/);
    const percentage = text.match(/(\d+)%\s+positive/);

    const ratingsCount = ratings ? parseInt(ratings[1], 10) : null;
    const ratingPercentage = percentage ? parseInt(percentage[1], 10) : null;
    
    sendResponse({value:[ratingsCount, ratingPercentage]});
    return;
  }
});
