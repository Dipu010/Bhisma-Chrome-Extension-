const count_Shorts = new Set();

const UserEntryData = new Set();

const User_TimeSpent_Data = new Set();

chrome.tabs.onUpdated.addListener((tabID, tab) => {
  if (tab.url && tab.url.includes("youtube.com/shorts")) {
    const queryParameters = tab.url.split("shorts/")[1];
    //const urlParams= new URLSearchParams(queryParameters)
    count_Shorts.add(queryParameters);
    console.log(count_Shorts);
    if (count_Shorts.size >= 3) {
      blockYTShorts();
    }
  } else if (tab.url) {
        StoreDataEntry();
  }
});

async function blockYTShorts() {
  chrome.tabs.update({ url: "https://www.youtube.com/" });
  const tab = await getTab();
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      alert("You are in focus mode");
    },
  });
}



async function StoreDataEntry(){
    let currentTab =await getTab();
    console.log(currentTab)
    const data = {
      url: currentTab.url,
      time: getTime(),
    };
    if(currentTab.title!=="New Tab" && currentTab.url!=="https://www.youtube.com/")
        UserEntryData.add(data);
    console.log(UserEntryData);
}

async function toggleMuteState(tabId) {
  const tab = await chrome.tabs.get(tabId);
  const muted = !tab.mutedInfo.muted;
  await chrome.tabs.update(tabId, { muted });
  console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
}

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return (tab);
}

function getAllTabs() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      console.log(tab);
    });
  });
}

function getTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const timeString = `${hours}:${minutes}`;
  return timeString;
}
