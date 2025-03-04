// Save the current tabs into storage
function saveTabs(setName) {
  browser.tabs.query({}).then(tabs => {
    const tabUrls = tabs.map(tab => tab.url);
    let sets = {};
    browser.storage.local.get("tabSets").then(data => {
      sets = data.tabSets || {};
      sets[setName] = tabUrls;
      browser.storage.local.set({ tabSets: sets });
    });
  });
}

// Reopen a saved set of tabs
function openTabSet(setName) {
  browser.storage.local.get("tabSets").then(data => {
    const set = data.tabSets && data.tabSets[setName];
    if (set) {
      set.forEach(url => {
        browser.tabs.create({ url: url });
      });
    }
  });
}

// Example listeners for saving and opening tabs
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "saveTabs") {
    saveTabs(message.setName);
  } else if (message.action === "openTabSet") {
    openTabSet(message.setName);
  }
});
