function createSellerElements(sellers) {
  const container = document.getElementById("sellers");
  container.innerHTML = ""; // Clear existing content
  
  sellers.forEach((seller, i) => {
    const div = document.createElement("div");
    div.className = "seller-item";
    
    div.innerHTML = `
      <span class="seller-name">Seller: ${seller.name}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="seller-rating">${seller.ratingsCount} ratings</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="seller-percentage">${seller.ratingPercentage}% positive</span>
    `;
    
    container.appendChild(div);
  });
}

// reusable helper that queries the active tab and sends the provided message
function queryActiveTab(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  });
}

// Fetch product name
queryActiveTab({ type: "GET_PRODUCT_NAME" }, (response) => {
  const productName = document.getElementById("productName");
  if (response && response.value) {
    productName.textContent = "Product name: " + response.value;
  }
});

// Fetch all sellers data
queryActiveTab({ type: "GET_ALL_SELLERS" }, (response) => {
  const sellers = response && response.value ? response.value : [];
  console.log("Fetched sellers:", sellers);
  
  if (sellers.length > 0) {
    createSellerElements(sellers);
  } else {
    console.warn("No sellers found");
  }
});

