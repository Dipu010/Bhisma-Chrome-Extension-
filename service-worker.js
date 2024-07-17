const count_Shorts = new Set();

const UserEntryData = new Map();

const User_TimeSpent_Data = new Set();
let db;

let lastUrl = null;
const request = indexedDB.open("myTestDatabase", 1);

request.onerror = (event) => {
  console.error("Why didn't you allow my web app to use IndexedDB?!", event.target.error);
};

request.onupgradeneeded = (event) => {
  db = request.result;
  console.log("Database created or upgraded:", db);
  if (!db.objectStoreNames.contains('counters')) {
    const objectStore = db.createObjectStore("counters", { keyPath: "name" });
    console.log("Object store 'counters' created successfully"+objectStore);
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Database opened successfully:", db);
  // resetCountToZero();
  
};

function resetCountToZero() {
  const transaction = db.transaction("counters", "readwrite");
  const objectStore = transaction.objectStore("counters");

  const request = objectStore.get("shortsCount");

  request.onsuccess = function (event) {
    if (event.target.result === undefined) {
      objectStore.add({ name: "shortsCount", value: 0 });
      console.log("Initial count set to 0");
    } else {
      objectStore.put({ name: "shortsCount", value: 0 });
      console.log("Count reset to 0");
    }
  };

  request.onerror = function (event) {
    console.error("Unable to retrieve data from database!", event);
  };
}

const incrementShortsCount = async(tabId)=> {
  // Ensure the database is available

  const transaction = db.transaction(["counters"], "readwrite");
  const objectStore = transaction.objectStore("counters");

  const request = objectStore.get("shortsCount");

  request.onsuccess = async function (event) {
    let cnt = event.target.result.value;
    console.log("cnt=" + cnt);
    cnt++;
    if (cnt >= 3) {
      chrome.tabs.update({ url: "https://www.youtube.com/" })
      const tab = await getTab();
      console.log(tab);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert("You are in focus mode")
        }
      });
    }
    else objectStore.put({ name: "shortsCount", value: cnt });
  };

  request.onerror = function (event) {
    console.error("Unable to retrieve data from database!", event);
  };
}

chrome.tabs.onUpdated.addListener((tabID, tab) => {
  if (tab.url && tab.url.includes("youtube.com/shorts")) {
    if (lastUrl !== tab.url) {
      lastUrl = tab.url;
      incrementShortsCount();
    }
  } else if (tab.url) {
        StoreDataEntry();
  }
});

chrome.tabs.onActivated.addListener(getAllTabs)

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
      time: getTime(),
    };
    if(currentTab.title!=="New Tab" && currentTab.url!=="https://www.youtube.com/")
        UserEntryData.set(currentTab.url,data);
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
      if(tab.active==false && UserEntryData.has(tab.url)){
            let url=tab.url;
            console.log(UserEntryData.get(tab.url))
            let time_spent=getTimeDifference( UserEntryData.get(tab.url).time);

            User_TimeSpent_Data.add({url,time_spent});
            UserEntryData.delete(tab.url);
      }
    });

    console.log(User_TimeSpent_Data)
  });
}

function getTime() {
  const now = new Date();
  return now;
}



  
  function getTimeDifference(userTime) {
        const currentTime=getTime();

        return (currentTime-userTime)/(1000*60);

  }