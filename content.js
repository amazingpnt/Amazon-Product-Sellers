chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.type==="GET_VIDEO_TITLE"){
        const videoTitle=document.querySelector("#title h1 yt-formatted-string").textContent;
        sendResponse({value:videoTitle});
    }
});