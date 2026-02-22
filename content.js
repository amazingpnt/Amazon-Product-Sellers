chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
  const ratingElements=document.querySelectorAll('[id^="seller-rating-count-"] span');
  if(message.type==="GET_PRODUCT_NAME") {
    const textEl=document.getElementById("productTitle");
    const text=textEl? textEl.textContent:"";
    sendResponse({value:text});
    return;
  }

  if(message.type==="GET_ALL_SELLERS"){
    let sellers=[];
    
    //Loop through all sellers
    for(let i=0; i<ratingElements.length; i++){
      const name=ratingElements[i].closest("#aod-offer-soldBy").querySelector(
        ".a-fixed-left-grid .a-fixed-left-grid-inner .a-fixed-left-grid-col.a-col-right a"
      ).textContent;
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
    //Scroll to the seller
    const sellerIndex=message.sellerIndex;
    ratingElements[sellerIndex].scrollIntoView({behavior:"smooth", block:"center"});

    //Set background color to red after scrolling
    const sellerContainer=ratingElements[sellerIndex].closest('[id="aod-offer"]')||ratingElements[sellerIndex].closest('[id="aod-pinned-offer"]');
    sellerContainer.style.backgroundColor="red";
    //Reset it after 2 seconds
    setTimeout(()=>{
    sellerContainer.style.backgroundColor="";
    }, 2000);

    }
  }
);
