// Track tab and tab group history
let tabGroupHistory = [];

// Initialize storage on extension startup
chrome.runtime.onStartup.addListener(async () => {
  await loadHistory();
});

chrome.runtime.onInstalled.addListener(async () => {
  await loadHistory();
});

// Load existing history from storage
async function loadHistory() {
  try {
    const result = await chrome.storage.local.get(['tabGroupHistory']);
    tabGroupHistory = result.tabGroupHistory || [];
  } catch (error) {
    console.error('Error loading history:', error);
    tabGroupHistory = [];
  }
}

// Save history to storage
async function saveHistory() {
  try {
    await chrome.storage.local.set({ tabGroupHistory });
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

// Add event to history
function addToHistory(event) {
  const timestamp = new Date().toISOString();
  tabGroupHistory.unshift({ ...event, timestamp });
  
  // Keep only last 1000 events to prevent storage bloat
  if (tabGroupHistory.length > 1000) {
    tabGroupHistory = tabGroupHistory.slice(0, 1000);
  }
  
  saveHistory();
}

// Get tab group info
async function getTabGroupInfo(groupId) {
  if (groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    return { title: 'No Group', color: 'grey' };
  }
  
  try {
    const group = await chrome.tabGroups.get(groupId);
    return {
      title: group.title || `Group ${groupId}`,
      color: group.color
    };
  } catch (error) {
    return { title: 'Unknown Group', color: 'grey' };
  }
}

// Tab created event
chrome.tabs.onCreated.addListener(async (tab) => {
  const groupInfo = await getTabGroupInfo(tab.groupId);
  
  addToHistory({
    type: 'tab_created',
    tabId: tab.id,
    url: tab.url,
    title: tab.title || 'Loading...',
    groupId: tab.groupId,
    groupTitle: groupInfo.title,
    groupColor: groupInfo.color
  });
});

// Tab removed event
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  // Get tab info before it's removed (from our history if available)
  const recentTabEvent = tabGroupHistory.find(event => 
    event.tabId === tabId && 
    (event.type === 'tab_created' || event.type === 'tab_updated')
  );
  
  addToHistory({
    type: 'tab_closed',
    tabId: tabId,
    url: recentTabEvent?.url || 'Unknown',
    title: recentTabEvent?.title || 'Unknown',
    groupId: recentTabEvent?.groupId || chrome.tabGroups.TAB_GROUP_ID_NONE,
    groupTitle: recentTabEvent?.groupTitle || 'No Group',
    groupColor: recentTabEvent?.groupColor || 'grey'
  });
});

// Tab updated event (to track title and URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.title || changeInfo.url) {
    const groupInfo = await getTabGroupInfo(tab.groupId);
    
    addToHistory({
      type: 'tab_updated',
      tabId: tab.id,
      url: tab.url,
      title: tab.title || 'Loading...',
      groupId: tab.groupId,
      groupTitle: groupInfo.title,
      groupColor: groupInfo.color,
      changes: changeInfo
    });
  }
});

// Tab group created event
chrome.tabGroups.onCreated.addListener((group) => {
  addToHistory({
    type: 'group_created',
    groupId: group.id,
    groupTitle: group.title || `Group ${group.id}`,
    groupColor: group.color
  });
});

// Tab group removed event
chrome.tabGroups.onRemoved.addListener((group) => {
  addToHistory({
    type: 'group_removed',
    groupId: group.id,
    groupTitle: group.title || `Group ${group.id}`,
    groupColor: group.color
  });
});

// Tab group updated event
chrome.tabGroups.onUpdated.addListener((group) => {
  addToHistory({
    type: 'group_updated',
    groupId: group.id,
    groupTitle: group.title || `Group ${group.id}`,
    groupColor: group.color
  });
});

// Tab attached to group
chrome.tabs.onAttached.addListener(async (tabId, attachInfo) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    const groupInfo = await getTabGroupInfo(tab.groupId);
    
    addToHistory({
      type: 'tab_attached_to_group',
      tabId: tabId,
      url: tab.url,
      title: tab.title || 'Loading...',
      groupId: tab.groupId,
      groupTitle: groupInfo.title,
      groupColor: groupInfo.color
    });
  } catch (error) {
    console.error('Error handling tab attach:', error);
  }
});

// Tab detached from group
chrome.tabs.onDetached.addListener(async (tabId, detachInfo) => {
  // Get recent tab info from history
  const recentTabEvent = tabGroupHistory.find(event => 
    event.tabId === tabId && 
    (event.type === 'tab_created' || event.type === 'tab_updated' || event.type === 'tab_attached_to_group')
  );
  
  addToHistory({
    type: 'tab_detached_from_group',
    tabId: tabId,
    url: recentTabEvent?.url || 'Unknown',
    title: recentTabEvent?.title || 'Unknown',
    groupId: recentTabEvent?.groupId || chrome.tabGroups.TAB_GROUP_ID_NONE,
    groupTitle: recentTabEvent?.groupTitle || 'Unknown Group',
    groupColor: recentTabEvent?.groupColor || 'grey'
  });
});

// Initialize history on startup
loadHistory();