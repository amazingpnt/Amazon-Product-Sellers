function requestData(dataType, responseHandler){
    chrome.tabs.query(
        {currentWindow: true},
        (tabs)=>{
            let tab=tabs[0].id;
            chrome.tabs.sendMessage(
                tab, {type:dataType}, responseHandler
            )
        }
    )
}


requestData("GET_VIDEO_TITLE", (response)=>document.getElementById("p").textContent+=response.value)