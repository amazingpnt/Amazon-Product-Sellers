/**
 * Processes seller data and renders it into a clean, card-based UI.
 * Main Logic: Scores sellers using the Laplace smoothing formula to balance 
 * rating percentage against the volume of ratings.
 */
function createSellerElements(sellers) {
  const container = document.getElementById("sellers");
  container.innerHTML = ""; // Clear existing content

  // 1. Calculate score for each seller: (positive ratings + 1) / (total ratings + 2)
  const sellersWithScore = sellers.map((seller, index) => {
    const positiveRatings = (seller.ratingPercentage * seller.ratingsCount) / 100;
    const score = (positiveRatings + 1) / (seller.ratingsCount + 2);
    return { ...seller, score, originalIndex: index };
  });

  // 2. Sort by descending score (best seller first)
  sellersWithScore.sort((a, b) => b.score - a.score);

  // 3. Display sellers
  sellersWithScore.forEach((seller, i) => {
    const div = document.createElement("div");
    div.className = "seller-item";

    // Functional Click Handler
    div.addEventListener("click", () => {
      queryActiveTab({ type: "SCROLL_TO_SELLER", sellerIndex: seller.originalIndex });
      window.close();
    });

    // Visual Elements: Highlight the top recommendation
    const isBest = i === 0;
    const badge = isBest ? '<span class="badge-best">⭐ Recommended</span>' : '';

    // Modern Card Layout
    // Note: Kept the exact property names (seller.name, seller.price, etc.) from your original code
    div.innerHTML = `
      ${badge}
      <div class="seller-row">
        <span class="seller-name">${seller.name}</span>
        <span class="seller-price">$${seller.price}</span>
      </div>
      <div class="seller-stats">
        <span><strong style="color: #059669;">${seller.ratingPercentage}%</strong> Positive</span>
        <span style="color: #94a3b8;">•</span>
        <span>${seller.ratingsCount.toLocaleString()} ratings</span>
      </div>
    `;

    container.appendChild(div);
  });
}

/**
 * Reusable helper that queries the active tab and sends the provided message.
 * Bridges the gap between the Popup and the Content Script on the page.
 */
function queryActiveTab(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  });
}

/**
 * Initialization: Request sellers data from content.js as soon as the popup opens.
 */
queryActiveTab({ type: "GET_ALL_SELLERS" }, (response) => {
  const sellers = response && response.value ? response.value : [];
  
  if (sellers.length > 0) {
    createSellerElements(sellers);
  } else {
    // Elegant Empty State
    const container = document.getElementById("sellers");
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #64748b;">
        <p style="font-size: 1.5rem; margin-bottom: 8px;">🔍</p>
        <p>No sellers detected on this page.</p>
      </div>
    `;
  }
});