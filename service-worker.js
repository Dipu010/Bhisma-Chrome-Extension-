const count_Shorts=new Set();

chrome.tabs.onUpdated.addListener((tabID,tab)=>{
    if(tab.url && tab.url.includes("youtube.com/shorts")){
        const queryParameters=tab.url.split("shorts/")[1];
        //const urlParams= new URLSearchParams(queryParameters)
        count_Shorts.add(queryParameters);
        chrome.storage.local.set({ "CountShortsYT": count_Shorts }).then(() => {
            console.log("Value is set");
          });
        console.log(count_Shorts);

        if(count_Shorts.size>=3){
            chrome.tabs.sendMessage(tabID,{
                type:"BLOCK_YT_SHORTS",
                message:"You are in focus mode"

            })
            toggleMuteState(tabID)
        }
    }
})


async function toggleMuteState(tabId) {
    const tab = await chrome.tabs.get(tabId);
    const muted = !tab.mutedInfo.muted;
    await chrome.tabs.update(tabId, {muted});
    console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
  }