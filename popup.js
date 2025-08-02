// Popup script for Tab Group History Tracker
let currentFilter = 'all';
let historyData = [];

// Load and display history when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  await loadHistory();
  setupEventListeners();
});

// Load history from storage
async function loadHistory() {
  try {
    const result = await chrome.storage.local.get(['tabGroupHistory']);
    historyData = result.tabGroupHistory || [];
    displayHistory();
  } catch (error) {
    console.error('Error loading history:', error);
    displayNoHistory();
  }
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      displayHistory();
    });
  });

  // Clear history button
  document.getElementById('clearHistory').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all history?')) {
      await clearHistory();
    }
  });
}

// Display history items
function displayHistory() {
  const historyContainer = document.getElementById('history');
  
  if (!historyData || historyData.length === 0) {
    displayNoHistory();
    return;
  }

  // Filter history based on current filter
  const filteredHistory = filterHistory(historyData);
  
  if (filteredHistory.length === 0) {
    historyContainer.innerHTML = '<div class="no-history">No items match the current filter.</div>';
    return;
  }

  // Generate HTML for history items
  const historyHTML = filteredHistory.map(item => createHistoryItemHTML(item)).join('');
  historyContainer.innerHTML = historyHTML;
}

// Filter history based on selected filter
function filterHistory(history) {
  switch (currentFilter) {
    case 'tab':
      return history.filter(item => 
        item.type.includes('tab_') && !item.type.includes('group')
      );
    case 'group':
      return history.filter(item => 
        item.type.includes('group_') || item.type.includes('_group')
      );
    default:
      return history;
  }
}

// Create HTML for a single history item
function createHistoryItemHTML(item) {
  const eventTypeText = getEventTypeText(item.type);
  const iconSymbol = getEventIcon(item.type);
  const timestamp = formatTimestamp(item.timestamp);
  const groupColorClass = getGroupColorClass(item.groupColor);
  
  let titleHTML = '';
  let urlHTML = '';
  let groupHTML = '';

  // Build title and URL based on event type
  if (item.title && item.title !== 'Unknown') {
    titleHTML = `<div class="event-title">${escapeHtml(item.title)}</div>`;
  }
  
  if (item.url && item.url !== 'Unknown' && !item.url.startsWith('chrome://')) {
    urlHTML = `<a href="${escapeHtml(item.url)}" class="event-url" target="_blank">${escapeHtml(truncateUrl(item.url))}</a>`;
  }

  // Build group info
  if (item.groupTitle && item.groupTitle !== 'Unknown Group') {
    const colorDot = item.groupColor ? 
      `<div class="group-color-dot" style="background-color: ${getGroupColorValue(item.groupColor)}"></div>` : '';
    groupHTML = `
      <div class="event-group ${groupColorClass}">
        ${colorDot}
        ${escapeHtml(item.groupTitle)}
      </div>
    `;
  }

  return `
    <div class="history-item">
      <div class="event-icon ${item.type}">${iconSymbol}</div>
      <div class="event-details">
        ${titleHTML}
        <div class="event-meta">${eventTypeText}</div>
        ${urlHTML}
        ${groupHTML}
      </div>
      <div class="timestamp">${timestamp}</div>
    </div>
  `;
}

// Get human-readable event type text
function getEventTypeText(type) {
  const typeMap = {
    'tab_created': 'Tab opened',
    'tab_closed': 'Tab closed',
    'tab_updated': 'Tab updated',
    'group_created': 'Group created',
    'group_removed': 'Group removed',
    'group_updated': 'Group updated',
    'tab_attached_to_group': 'Tab added to group',
    'tab_detached_from_group': 'Tab removed from group'
  };
  return typeMap[type] || type.replace(/_/g, ' ');
}

// Get icon symbol for event type
function getEventIcon(type) {
  const iconMap = {
    'tab_created': '+',
    'tab_closed': '×',
    'tab_updated': '↻',
    'group_created': '◉',
    'group_removed': '◯',
    'group_updated': '✎',
    'tab_attached_to_group': '↗',
    'tab_detached_from_group': '↖'
  };
  return iconMap[type] || '•';
}

// Get CSS class for group color
function getGroupColorClass(color) {
  if (!color) return 'group-grey';
  return `group-${color}`;
}

// Get actual color value for group color
function getGroupColorValue(color) {
  const colorMap = {
    'grey': '#8a8a8a',
    'blue': '#1976d2',
    'red': '#d32f2f',
    'yellow': '#fbc02d',
    'green': '#388e3c',
    'pink': '#c2185b',
    'purple': '#7b1fa2',
    'cyan': '#00acc1',
    'orange': '#f57c00'
  };
  return colorMap[color] || '#8a8a8a';
}

// Format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

// Truncate URL for display
function truncateUrl(url) {
  if (url.length <= 50) return url;
  return url.substring(0, 47) + '...';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Display no history message
function displayNoHistory() {
  const historyContainer = document.getElementById('history');
  historyContainer.innerHTML = '<div class="no-history">No history available yet. Start browsing to see tab activity!</div>';
}

// Clear all history
async function clearHistory() {
  try {
    await chrome.storage.local.set({ tabGroupHistory: [] });
    historyData = [];
    displayNoHistory();
  } catch (error) {
    console.error('Error clearing history:', error);
    alert('Error clearing history. Please try again.');
  }
}

// Listen for storage changes to update in real-time
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.tabGroupHistory) {
    historyData = changes.tabGroupHistory.newValue || [];
    displayHistory();
  }
});