function createSellerElements(sellers){
  const container=document.getElementById("sellers");
  
  // Calculate score for each seller: (positive ratings+1)/(total ratings+2)
  const sellersWithScore=sellers.map((seller, index)=>{
    const positiveRatings=(seller.ratingPercentage*seller.ratingsCount)/100;
    const score = (positiveRatings+1)/(seller.ratingsCount+2);
    return { ...seller, score, originalIndex:index};
  });
  
  // Sort by descending score (best seller first)
  sellersWithScore.sort((a, b)=>b.score-a.score);
  
  // Display sellers
  sellersWithScore.forEach((seller, i)=>{
    const div=document.createElement("div");
    div.className="seller-item";
    div.addEventListener("mouseenter", ()=>div.classList.add("hover"));
    div.addEventListener("mouseleave", ()=>div.classList.remove("hover"));
    div.addEventListener("click", ()=>{
      queryActiveTab({type:"SCROLL_TO_SELLER", sellerIndex:seller.originalIndex}); 
      window.close();
    });
    
    const badge=(i===0)? '<span style="background-color: gold; padding: 2px 6px; border-radius: 3px; font-weight: bold;">⭐ BEST</span> ': '';
    
    div.innerHTML=`
      ${badge}
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
  chrome.tabs.query({active:true, currentWindow:true },(tabs)=>{
    if (!tabs || !tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  });
}

// Fetch product name
queryActiveTab({type:"GET_PRODUCT_NAME"}, (response)=>{
  const productName=document.getElementById("productName");
  if(response && response.value){
    productName.textContent="Product name: "+response.value;
  }
});

//Request all sellers data from content.js
queryActiveTab({type:"GET_ALL_SELLERS"}, (response)=>{
  const sellers=response && response.value? response.value: [];
  console.log("Fetched sellers:", sellers);
  
  if(sellers.length>0){
    createSellerElements(sellers);
  }else{
    console.warn("No sellers found");
  }
});

