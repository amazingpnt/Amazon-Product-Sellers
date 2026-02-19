chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
  if(message.type==="GET_PRODUCT_NAME") {
    const textEl=document.getElementById("productTitle");
    const text=textEl? textEl.textContent:"";
    sendResponse({value:text});
    return;
  }

  if(message.type==="GET_ALL_SELLERS") {
    const sellerElements=document.querySelectorAll('[id^="aod-offer-soldBy"] .a-fixed-left-grid .a-fixed-left-grid-inner .a-fixed-left-grid-col.a-col-right a');
    const ratingElements=document.querySelectorAll('[id^="seller-rating-count-"] span');
    
    let sellers=[];
    
    // Loop through all sellers
    for(let i=0; i<sellerElements.length; i++){
      const name=sellerElements[i]? sellerElements[i].textContent.trim():"";
      const ratingText=ratingElements[i]? ratingElements[i].textContent.trim():'';
      
      const ratingsMatch=ratingText.match(/(\d+)\s+ratings/);
      const percentageMatch=ratingText.match(/(\d+)%\s+positive/);
      
      const ratingsCount=ratingsMatch? parseInt(ratingsMatch[1], 10): null;
      const ratingPercentage=percentageMatch? parseInt(percentageMatch[1], 10): null;
      
      sellers.push({
        name: name,
        ratingsCount: ratingsCount,
        ratingPercentage: ratingPercentage
      });
    }
    
    sendResponse({value:sellers});
    return;
  }
  if(message.type==="SCROLL_TO_SELLER"){
    const sellerIndex=message.sellerIndex;
    const sellerElements=document.querySelectorAll('[id^="aod-offer-soldBy"]');
    sellerElements[sellerIndex].scrollIntoView({behavior:"smooth", block:"start"});
    }
  }
);
