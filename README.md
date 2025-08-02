# Tab Group History Tracker Chrome Extension

A Chrome extension that records and displays the complete history of tabs opened and closed within tab groups, providing users with detailed tracking of their browsing activity organized by groups.

## 📋 Project Requirements Implemented

### Core Functionality
- ✅ **Tab History Tracking**: Records when tabs are opened and closed
- ✅ **Tab Group Integration**: Tracks tab activity specifically within tab groups
- ✅ **Real-time Monitoring**: Automatically captures events as they happen
- ✅ **Persistent Storage**: History survives browser restarts and sessions

### Advanced Features
- ✅ **Complete Event Coverage**: Tracks 8 different types of tab/group events
- ✅ **Visual Interface**: Clean, modern popup UI for viewing history
- ✅ **Filtering System**: Filter events by type (All/Tabs/Groups)
- ✅ **Group Visualization**: Shows group colors and names
- ✅ **Timestamp Display**: Human-readable relative timestamps
- ✅ **Storage Management**: Automatic cleanup (keeps last 1000 events)

## 🚀 Quick Start

### Installation Steps

1. **Enable Developer Mode**
   ```
   1. Open Chrome browser
   2. Navigate to chrome://extensions/
   3. Toggle "Developer mode" ON (top-right corner)
   ```

2. **Load the Extension**
   ```
   1. Click "Load unpacked" button
   2. Select the project folder containing manifest.json
   3. Extension appears in toolbar and extensions list
   ```

3. **Verify Installation**
   ```
   1. Look for the extension icon in Chrome toolbar
   2. Click the icon to open the history popup
   3. Start browsing to see events being tracked
   ```

## 📁 Project Structure

```
tab-group-history-tracker/
├── manifest.json          # Extension configuration & permissions
├── background.js          # Service worker for event tracking
├── popup.html            # User interface layout
├── popup.js              # Frontend logic & event handling
├── icon16.svg            # Extension icon (SVG format)
├── install_instructions.txt # Quick setup guide
└── README.md             # This documentation
```

## 🔧 Technical Implementation

### Architecture Overview
- **Manifest V3**: Uses latest Chrome extension standard
- **Service Worker**: Background script for continuous event monitoring
- **Popup Interface**: On-demand UI for viewing history
- **Local Storage**: Chrome storage API for data persistence

### Event Types Tracked

| Event Type | Description | Icon | Color |
|------------|-------------|------|-------|
| `tab_created` | New tab opened | + | Green |
| `tab_closed` | Tab closed/removed | × | Red |
| `tab_updated` | Tab title/URL changed | ↻ | Yellow |
| `group_created` | New tab group created | ◉ | Blue |
| `group_removed` | Tab group deleted | ◯ | Purple |
| `group_updated` | Group properties changed | ✎ | Cyan |
| `tab_attached_to_group` | Tab added to group | ↗ | Green |
| `tab_detached_from_group` | Tab removed from group | ↖ | Orange |

### Data Structure

Each tracked event contains:
```javascript
{
  type: 'tab_created',           // Event type
  tabId: 123,                    // Chrome tab ID
  url: 'https://example.com',    // Tab URL
  title: 'Example Site',         // Tab title
  groupId: 456,                  // Group ID (-1 for no group)
  groupTitle: 'Work',            // Group name
  groupColor: 'blue',            // Group color
  timestamp: '2024-01-01T12:00:00.000Z' // ISO timestamp
}
```

## 🎯 Features & Capabilities

### User Interface
- **Popup Dimensions**: 450px width, max 600px height
- **Responsive Design**: Adapts to content length
- **Modern Styling**: GitHub-inspired clean interface
- **Color Coding**: Visual differentiation of event types

### Filtering System
- **All Events**: Shows complete history
- **Tabs Only**: Filters to tab-related events only
- **Groups Only**: Shows group creation/management events

### Storage Management
- **Automatic Cleanup**: Maintains last 1000 events maximum
- **Persistent Data**: Survives browser restarts
- **Real-time Updates**: Popup refreshes automatically
- **Clear Function**: Manual history clearing option

### Performance Features
- **Efficient Storage**: Optimized data structure
- **Event Batching**: Handles rapid tab operations
- **Memory Management**: Prevents storage bloat
- **Error Handling**: Graceful failure recovery

## 🔒 Permissions & Security

### Required Permissions
```json
{
  "tabs": "Access tab information and events",
  "tabGroups": "Monitor tab group operations", 
  "storage": "Store history data locally"
}
```

### Privacy Considerations
- **Local Storage Only**: No data sent to external servers
- **No Network Requests**: Completely offline operation
- **User Control**: Manual history clearing available
- **Chrome Sandbox**: Operates within Chrome's security model

## 🛠️ Development Setup

### Prerequisites
- Chrome Browser (version 88+)
- Developer mode enabled
- Basic understanding of Chrome Extensions

### Local Development
1. **Clone/Download**: Get project files to local directory
2. **Load Extension**: Use Chrome's "Load unpacked" feature
3. **Test Changes**: Reload extension after code modifications
4. **Debug**: Use Chrome DevTools for background script debugging

### Debugging Tools
- **Background Script**: `chrome://extensions/` → Extension details → "Inspect views: background page"
- **Popup Script**: Right-click extension popup → "Inspect"
- **Storage Inspector**: DevTools → Application tab → Storage → Local Storage

## 📊 Usage Examples

### Viewing History
1. Click extension icon in toolbar
2. View chronological list of events
3. Use filter buttons to narrow results
4. Click URLs to revisit pages

### Understanding Events
- **Green events**: Something was created/opened
- **Red events**: Something was closed/removed  
- **Yellow events**: Content was updated/changed
- **Blue/Purple/Cyan**: Group management operations

### Managing Storage
- History automatically maintains reasonable size
- Use "Clear" button to reset all history
- Data persists across browser sessions

## 🔄 Extension Lifecycle

### Installation
1. Extension registers all event listeners
2. Begins tracking immediately
3. Loads any existing history from storage

### Runtime
1. Background service worker monitors all tab/group events
2. Events are processed and stored in real-time
3. Popup displays current history when opened

### Updates
1. Code changes require extension reload
2. History data persists through updates
3. New features activate immediately

## 🐛 Troubleshooting

### Common Issues

**Extension not appearing**
- Verify Developer mode is enabled
- Check for manifest.json errors in Extensions page
- Ensure all required files are present

**Events not tracking**
- Check background script console for errors
- Verify permissions are granted
- Reload extension if service worker stopped

**Popup not loading**
- Check popup.html and popup.js for syntax errors
- Verify file paths in manifest.json
- Clear browser cache and reload extension

**Storage issues**
- Check available storage space
- Clear extension data if corrupted
- Verify storage permissions

### Debug Commands
```javascript
// In background script console:
chrome.storage.local.get(['tabGroupHistory'], console.log);

// Clear storage manually:
chrome.storage.local.clear();

// Check current tabs and groups:
chrome.tabs.query({}, console.log);
chrome.tabGroups.query({}, console.log);
```

## 🔮 Future Enhancements

### Potential Features
- **Export/Import**: Save history to files
- **Search Function**: Find specific tabs/sites
- **Statistics**: Usage analytics and patterns
- **Group Analytics**: Time spent in different groups
- **Keyboard Shortcuts**: Quick access hotkeys
- **Dark Mode**: Alternative color scheme
- **History Limits**: Configurable retention periods

### Technical Improvements
- **IndexedDB**: More sophisticated storage
- **Compression**: Reduce storage footprint
- **Offline Sync**: Cloud backup options
- **Performance**: Optimize for heavy users

## 📝 Version History

### v1.0 (Current)
- Initial release with core functionality
- Complete event tracking for tabs and groups
- Modern popup interface with filtering
- Persistent local storage with automatic cleanup

## 🤝 Contributing

This is a standalone project, but potential improvements include:
- Enhanced UI/UX design
- Additional filtering options
- Export/import functionality
- Performance optimizations

## 📄 License

This project is provided as-is for educational and personal use. No warranty provided.

---

**Author**: AI Assistant  
**Created**: 2024  
**Chrome Extension Manifest**: Version 3  
**Compatibility**: Chrome 88+
