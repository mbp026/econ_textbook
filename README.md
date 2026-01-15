# Economics Textbook Reader

A polished web application that transforms PDF textbooks into an interactive, enhanced reading experience with full image support, chapter navigation, vocabulary tooltips, and bookmarking.

## ✨ Key Features

### 📊 **Full PDF Rendering with Images & Charts**
- Renders pages exactly as they appear in the PDF
- Preserves all graphs, charts, diagrams, and images
- Maintains original layout and formatting
- High-quality canvas rendering for crisp visuals

### 📚 **Smart Chapter Navigation**
- Automatically extracts chapters from your textbook's table of contents (page 21)
- Sidebar with organized chapter list
- One-click navigation to any chapter
- Highlights your current chapter location
- Toggle sidebar open/closed with arrow buttons

### 🔖 **Persistent Bookmarking**
- Bookmark any page with a single click
- Bookmarks persist across browser sessions (localStorage)
- Visual indicator (📑) shows bookmarked chapters
- Quick return to your saved spot
- Clear bookmark option available

### 📖 **Smart Vocabulary Tooltips**
- Hover over economics terms for instant definitions
- **Each term only highlighted on first occurrence** - no repetitive highlights
- 80+ pre-loaded economics terms
- Includes: scarcity, supply, demand, GDP, inflation, elasticity, monopoly, and more
- Non-intrusive tooltips appear on hover

### 🎨 **Polished Interface**
- Clean, modern design optimized for reading
- Responsive layout for all screen sizes
- Keyboard navigation (arrow keys for pages)
- Progress tracking with page numbers
- Smooth animations and transitions

## 🚀 Getting Started

1. **Open the Application**
   ```
   Open index.html in your web browser
   (Chrome or Edge recommended for best performance)
   ```

2. **Upload Your Textbook**
   - Click "Choose PDF File"
   - Select your economics textbook PDF
   - Wait for the progress bar (scans table of contents on page 21)
   - PDF is processed 100% locally - nothing uploaded to servers

3. **Start Reading**
   - Pages render with all images, graphs, and charts intact
   - Use sidebar to navigate between chapters
   - Click Previous/Next or use arrow keys to turn pages
   - Hover over blue underlined terms for definitions

## 🎯 Usage Tips

### Navigation
- **Arrow Keys**: Navigate pages (← previous, → next)
- **Sidebar Toggle**: Click ← to hide sidebar, → button appears to reopen
- **Chapter Jump**: Click any chapter in sidebar to jump directly
- **Mobile**: Tap ☰ menu icon to open sidebar

### Bookmarking
- Click "📑 Bookmark This Page" in header
- Bookmark saves automatically to browser
- Bookmarked chapter shows 📑 icon in sidebar
- "Clear Bookmark" button in sidebar removes it

### Vocabulary Learning
- Terms highlighted only **once** (first occurrence)
- Blue dotted underline indicates vocabulary term
- Hover mouse over term to see definition
- No clicking needed - just hover and read

## 🛠️ Technical Details

**Technologies:**
- Pure JavaScript (no frameworks)
- PDF.js for rendering
- HTML5 Canvas for page display
- CSS3 for styling
- localStorage for bookmarks

**Performance:**
- Lazy loading: pages load on-demand
- Text caching: visited pages load instantly
- Quick chapter scan (only checks first 50 pages + TOC)
- Optimized for large PDFs (tested with 38MB files)

**Browser Support:**
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- Requires modern browser with Canvas support

## 📝 Customization

### Adding More Vocabulary Terms

Edit `vocabulary.js` and add terms to the dictionary:

```javascript
"your term": "Simple definition here",
"another term": "Another definition here",
```

Terms are case-insensitive and automatically detected in the text.

## 🔒 Privacy

- **100% local processing** - PDF never leaves your computer
- No data sent to servers
- No tracking or analytics
- Bookmarks stored only in your browser's localStorage

## 📁 Project Structure

```
econ-textbook-reader/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── app.js              # Core application logic
├── vocabulary.js       # Economics terms dictionary
└── README.md           # This file
```

## 🐛 Troubleshooting

**PDF won't load?**
- Ensure file is a valid PDF
- Try refreshing the page
- Check browser console for errors
- Large PDFs may take a few seconds

**Sidebar won't reopen?**
- Look for → button on left edge of screen
- Or refresh page to reset

**Vocabulary not showing?**
- Terms only highlight once (by design)
- Reload PDF to reset highlighting
- Check vocabulary.js has the term

**Images not appearing?**
- Refresh browser to reload with new rendering engine
- Ensure JavaScript is enabled
- Try a different browser (Chrome recommended)

## 🎓 Perfect For

- Economics students
- Self-study and review
- Annotating textbooks digitally
- Quick chapter reference
- Vocabulary building
- Distraction-free reading

Enjoy your enhanced reading experience! 📚✨
