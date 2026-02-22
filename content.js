chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
  //List all offers and filter null ones out
  const allOffers=[document.getElementById("aod-pinned-offer")];
  allOffers.push(...document.querySelectorAll("#aod-offer"));
  const offers=allOffers.filter((offer)=>{
      const ratingElement=offer.querySelector('[id^="seller-rating-count-"] span');
      const nameElement=offer.querySelector(
        "#aod-offer-soldBy .a-fixed-left-grid .a-fixed-left-grid-inner .a-fixed-left-grid-col.a-col-right a"
      );
      const ratingText=ratingElement? ratingElement.textContent:"";
      const name=nameElement? nameElement.textContent:"";
      return ratingText && name;
  })
  if(message.type==="GET_PRODUCT_NAME"){
    const textEl=document.getElementById("productTitle");
    const text=textEl? textEl.textContent:"";
    sendResponse({value:text});
    return;
  }

  if(message.type==="GET_ALL_SELLERS"){
    let sellers=[];
    
    //Loop through all sellers
    for(let i=0; i<offers.length; i++){
      const ratingElement=offers[i].querySelector('[id^="seller-rating-count-"] span');
      const nameElement=offers[i].querySelector(
        "#aod-offer-soldBy .a-fixed-left-grid .a-fixed-left-grid-inner .a-fixed-left-grid-col.a-col-right a"
      );
      const ratingText=ratingElement? ratingElement.textContent:"";
      const name=nameElement? nameElement.textContent:"";
      if(ratingText && name){
        const ratingsMatch=ratingText.match(/(\d+)\s+ratings/);
        const percentageMatch=ratingText.match(/(\d+)%\s+positive/);
        const ratingsCount=parseInt(ratingsMatch[1], 10);
        const ratingPercentage=parseInt(percentageMatch[1], 10);

        sellers.push({
          name: name,
          ratingsCount: ratingsCount,
          ratingPercentage: ratingPercentage,
        });
      }
    }
    
    sendResponse({value:sellers});
    return;
  }
  if(message.type==="SCROLL_TO_SELLER"){
    //Scroll to the seller
    const sellerIndex=message.sellerIndex;
    offers[sellerIndex].scrollIntoView({behavior:"smooth", block:"center"});

    //Set background color to red after scrolling
    const sellerContainer=offers[sellerIndex].closest('[id="aod-offer"]')||offers[sellerIndex].closest('[id="aod-pinned-offer"]');
    sellerContainer.style.backgroundColor="red";
    //Reset it after 2 seconds
    setTimeout(()=>{
    sellerContainer.style.backgroundColor="";
    }, 2000);

    }
  }
);
