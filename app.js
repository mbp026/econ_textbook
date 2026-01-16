// PDF.js configuration
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
} else {
    console.error('PDF.js library not loaded');
}

// State management
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let chapters = [];
let pdfText = [];
let bookmarkedPage = null;

// DOM elements
const uploadPrompt = document.getElementById('uploadPrompt');
const reader = document.getElementById('reader');
const pdfUpload = document.getElementById('pdfUpload');
const uploadBtn = document.getElementById('uploadBtn');
const uploadPromptBtn = document.getElementById('uploadPromptBtn');
const textContent = document.getElementById('textContent');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const gotoBookmarkBtn = document.getElementById('gotoBookmarkBtn');
const clearBookmarkBtn = document.getElementById('clearBookmark');
const chapterList = document.getElementById('chapterList');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const toggleSidebar = document.getElementById('toggleSidebar');
const reopenSidebar = document.getElementById('reopenSidebar');
const vocabularyTooltip = document.getElementById('vocabularyTooltip');
const pageJumpInput = document.getElementById('pageJump');
const pageJumpBtn = document.getElementById('pageJumpBtn');
const aiSearchInput = document.getElementById('aiSearchInput');
const aiSearchBtn = document.getElementById('aiSearchBtn');
const aiModal = document.getElementById('aiModal');
const aiResponse = document.getElementById('aiResponse');
const closeAiModal = document.getElementById('closeAiModal');

// Load bookmark from localStorage
function loadBookmark() {
    const saved = localStorage.getItem('textbookBookmark');
    if (saved) {
        bookmarkedPage = parseInt(saved);
        return bookmarkedPage;
    }
    return null;
}

// Save bookmark to localStorage
function saveBookmark(page) {
    bookmarkedPage = page;
    localStorage.setItem('textbookBookmark', page.toString());
    showNotification('Bookmark saved!');
    updateChapterList();

    // Show the "Go to Bookmark" button
    if (gotoBookmarkBtn) {
        gotoBookmarkBtn.style.display = 'inline-block';
    }
}

// Clear bookmark
function clearBookmark() {
    bookmarkedPage = null;
    localStorage.removeItem('textbookBookmark');
    showNotification('Bookmark cleared!');
    updateChapterList();

    // Hide the "Go to Bookmark" button
    if (gotoBookmarkBtn) {
        gotoBookmarkBtn.style.display = 'none';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event listeners for upload
uploadBtn.addEventListener('click', () => pdfUpload.click());
uploadPromptBtn.addEventListener('click', () => pdfUpload.click());
pdfUpload.addEventListener('change', handleFileUpload);

// Handle PDF upload
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        alert('Please select a valid PDF file');
        return;
    }

    uploadPrompt.style.display = 'none';
    reader.style.display = 'flex';

    // Show progress indicator
    chapterList.innerHTML = `
        <div class="loading">
            <div>Loading PDF...</div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div id="progressText">0%</div>
        </div>
    `;

    try {
        // Check if PDF.js is loaded
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js library failed to load. Please refresh the page and try again.');
        }

        const arrayBuffer = await file.arrayBuffer();

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true
        });

        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        totalPagesSpan.textContent = totalPages;

        // Quick scan of first 50 pages for chapter detection (much faster)
        await quickScanForChapters();

        // Load bookmark if exists
        const bookmark = loadBookmark();
        if (bookmark && bookmark <= totalPages) {
            currentPage = bookmark;
            gotoBookmarkBtn.style.display = 'inline-block';
            showNotification('Restored to bookmarked page');
        }

        // Display first or bookmarked page
        await displayPage(currentPage);
        updateChapterList();

        chapterList.innerHTML = '';
        updateChapterList();

        // Update page jump max
        updatePageJumpMax();

        showNotification('PDF loaded successfully!');
    } catch (error) {
        console.error('Error loading PDF:', error);
        let errorMessage = 'Error loading PDF: ';

        if (error.message) {
            errorMessage += error.message;
        } else if (error.name === 'InvalidPDFException') {
            errorMessage += 'The file appears to be corrupted or not a valid PDF.';
        } else if (error.name === 'MissingPDFException') {
            errorMessage += 'The PDF file could not be found.';
        } else if (error.name === 'UnexpectedResponseException') {
            errorMessage += 'There was an unexpected error reading the PDF.';
        } else {
            errorMessage += 'Please make sure the file is a valid PDF and try again.';
        }

        alert(errorMessage);
        uploadPrompt.style.display = 'flex';
        reader.style.display = 'none';
    }
}

// Load chapters from config - use manual chapter configuration
async function quickScanForChapters() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    pdfText = []; // Initialize array
    chapters = [];

    if (progressText) progressText.textContent = 'Loading chapter structure...';

    // Add title page
    chapters.push({
        title: 'Title Page',
        page: 1
    });

    // Load chapters from CONFIG (defined in config.js)
    if (typeof CONFIG !== 'undefined' && CONFIG.CHAPTERS) {
        CONFIG.CHAPTERS.forEach(ch => {
            if (ch.startPage <= totalPages) {
                chapters.push({
                    title: `Chapter ${ch.chapter}: ${ch.title}`,
                    page: ch.startPage,
                    endPage: ch.endPage
                });
            }
        });

        if (progressFill) {
            progressFill.style.width = '100%';
        }
        if (progressText) {
            progressText.textContent = `Loaded ${chapters.length - 1} chapters`;
        }
    }

    // If no chapters from config, fall back to page ranges
    if (chapters.length <= 1) {
        createPageRangeChapters();
    }
}

// Extract chapters from table of contents text
function extractChaptersFromTOC(tocText) {
    const lines = tocText.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Look for patterns like "Chapter 1: Title ... 25" or "1 Title ... 25"
        const patterns = [
            /^(?:Chapter\s+)?(\d+)[:\.\s]+(.+?)\s+\.{2,}\s*(\d+)$/i,
            /^(?:Chapter\s+)?(\d+)[:\.\s]+(.+?)\s+(\d+)$/i,
            /^(\d+)\.\s+(.+?)\s+\.{2,}\s*(\d+)$/,
            /^Chapter\s+(\d+)[:\s]+(.+?)\s+(\d+)$/i,
        ];

        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
                const chapterNum = match[1];
                let chapterTitle = match[2].trim();
                const pageNum = parseInt(match[3]);

                // Clean up title (remove excessive dots or spaces)
                chapterTitle = chapterTitle.replace(/\.{2,}/g, '').trim();

                if (pageNum > 0 && pageNum <= totalPages && chapterTitle.length > 2) {
                    const isDuplicate = chapters.some(ch =>
                        ch.page === pageNum || ch.title.includes(chapterTitle)
                    );

                    if (!isDuplicate) {
                        chapters.push({
                            title: `Chapter ${chapterNum}: ${chapterTitle}`,
                            page: pageNum
                        });
                    }
                    break;
                }
            }
        }
    }
}

// Detect chapter on a single page
function detectChapterOnPage(text, pageNum) {
    const chapterPatterns = [
        /^Chapter\s+(\d+|[IVXLCDM]+)[:\s\-\.]+(.+)/im,
        /^(\d+)\.\s+([A-Z][A-Za-z\s]{3,50})/m,
        /CHAPTER\s+(\d+|[IVXLCDM]+)[:\s]+(.*)/i,
        /^Unit\s+(\d+)[:\s\-\.]+(.+)/im,
        /^Part\s+(\d+|[IVXLCDM]+)[:\s\-\.]+(.+)/im,
    ];

    const lines = text.split(/\n/);

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.length > 100) continue; // Skip long lines

        for (const pattern of chapterPatterns) {
            const match = trimmedLine.match(pattern);
            if (match) {
                const chapterNum = match[1];
                const chapterTitle = match[2] ? match[2].trim() : '';
                const fullTitle = chapterTitle
                    ? `Chapter ${chapterNum}: ${chapterTitle}`
                    : `Chapter ${chapterNum}`;

                // Avoid duplicates
                const isDuplicate = chapters.some(ch =>
                    ch.page === pageNum || ch.title === fullTitle
                );

                if (!isDuplicate) {
                    chapters.push({
                        title: fullTitle,
                        page: pageNum
                    });
                    return; // Found a chapter, move to next page
                }
            }
        }
    }
}

// Create page range chapters as fallback
function createPageRangeChapters() {
    chapters = [];
    const pagesPerChapter = Math.ceil(totalPages / 10);
    for (let i = 0; i < totalPages; i += pagesPerChapter) {
        const start = i + 1;
        const end = Math.min(i + pagesPerChapter, totalPages);
        chapters.push({
            title: `Pages ${start}-${end}`,
            page: start
        });
    }
}


// Update chapter list in sidebar
function updateChapterList() {
    if (chapters.length === 0) {
        chapterList.innerHTML = '<div class="loading">No chapters detected</div>';
        return;
    }

    chapterList.innerHTML = '';
    chapters.forEach((chapter, index) => {
        const item = document.createElement('div');
        item.className = 'chapter-item';
        item.textContent = chapter.title;

        // Highlight current chapter
        if (currentPage >= chapter.page &&
            (index === chapters.length - 1 || currentPage < chapters[index + 1].page)) {
            item.classList.add('active');
        }

        // Mark bookmarked chapter
        if (bookmarkedPage && bookmarkedPage >= chapter.page &&
            (index === chapters.length - 1 || bookmarkedPage < chapters[index + 1].page)) {
            item.classList.add('bookmarked');
        }

        item.addEventListener('click', () => {
            currentPage = chapter.page;
            displayPage(currentPage);
            updateChapterList();
        });

        chapterList.appendChild(item);
    });
}

// Track which vocab words have been defined
const definedVocabWords = new Set();

// Display page content with images and layout
async function displayPage(pageNum) {
    if (!pdfDoc || pageNum < 1 || pageNum > totalPages) return;

    currentPage = pageNum;
    currentPageSpan.textContent = currentPage;

    // Update button states
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // Show loading indicator
    textContent.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #7f8c8d;">Loading page...</p></div>';

    try {
        const page = await pdfDoc.getPage(pageNum);

        // Get viewport at scale 1.5 for good quality
        const viewport = page.getViewport({ scale: 1.5 });

        // Create canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '900px';
        canvas.style.margin = '0 auto';
        canvas.style.display = 'block';
        canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

        // Render PDF page to canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        // Get text content for vocabulary tooltips
        const textContentObj = await page.getTextContent();
        const pageText = textContentObj.items.map(item => item.str).join(' ');

        // Create a wrapper with canvas and text layer
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.maxWidth = '900px';
        wrapper.style.margin = '0 auto';

        // Add canvas
        wrapper.appendChild(canvas);

        // Create invisible text layer for vocabulary tooltips and text selection
        const textLayer = document.createElement('div');
        textLayer.className = 'text-layer';
        textLayer.style.position = 'absolute';
        textLayer.style.left = '0';
        textLayer.style.top = '0';
        textLayer.style.right = '0';
        textLayer.style.bottom = '0';
        textLayer.style.overflow = 'hidden';
        textLayer.style.opacity = '0.0';
        textLayer.style.lineHeight = '1.0';

        // Render text layer
        await pdfjsLib.renderTextLayer({
            textContentSource: textContentObj,
            container: textLayer,
            viewport: viewport,
            textDivs: []
        }).promise;

        wrapper.appendChild(textLayer);

        // Clear and add to content
        textContent.innerHTML = '';
        textContent.appendChild(wrapper);

        // Add vocabulary tooltips to text layer
        addVocabularyTooltipsToLayer(textLayer);

        // Cache the text
        pdfText[pageNum - 1] = pageText;

    } catch (error) {
        console.error('Error loading page:', error);
        textContent.innerHTML = '<p style="text-align: center; color: #e74c3c;">Error loading page content.</p>';
        return;
    }

    // Update chapter highlighting
    updateChapterList();
}

// Format text for better readability
function formatText(text) {
    // Split into paragraphs
    let formatted = text
        .split(/\n\n+/)
        .filter(p => p.trim().length > 0)
        .map(p => {
            p = p.trim();

            // Detect headings (short lines in uppercase or starting with numbers)
            if (p.length < 100 && (p === p.toUpperCase() || /^(\d+\.|\d+\s)/.test(p))) {
                if (p.length < 50) {
                    return `<h2>${p}</h2>`;
                } else {
                    return `<h3>${p}</h3>`;
                }
            }

            return `<p>${p}</p>`;
        })
        .join('');

    return formatted || '<p>No text content available for this page.</p>';
}

// Add vocabulary tooltips to text layer (only first occurrence per word)
function addVocabularyTooltipsToLayer(textLayer) {
    // Find all text spans in the layer
    const textSpans = textLayer.querySelectorAll('span');

    // Sort terms by length (longest first) to avoid partial matches
    const terms = Object.keys(vocabLookup).sort((a, b) => b.length - a.length);

    textSpans.forEach(span => {
        const text = span.textContent.trim().toLowerCase();

        // Check if this text matches any vocabulary term
        for (const term of terms) {
            if (text === term.toLowerCase() || text.includes(term.toLowerCase())) {
                // Only add tooltip if this word hasn't been defined yet
                if (!definedVocabWords.has(term.toLowerCase())) {
                    span.classList.add('vocab-word');
                    span.setAttribute('data-term', term);
                    span.style.opacity = '1';
                    span.style.color = '#3498db';
                    span.style.fontWeight = '600';
                    span.style.cursor = 'help';
                    span.style.borderBottom = '2px dotted #3498db';
                    span.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';

                    // Add event listeners
                    span.addEventListener('mouseenter', showTooltip);
                    span.addEventListener('mouseleave', hideTooltip);

                    // Mark this word as defined
                    definedVocabWords.add(term.toLowerCase());
                    break;
                }
            }
        }
    });
}

// Legacy function for text-based rendering (kept for compatibility)
function addVocabularyTooltips() {
    const content = textContent.innerHTML;
    let modifiedContent = content;

    // Sort terms by length (longest first) to avoid partial matches
    const terms = Object.keys(vocabLookup).sort((a, b) => b.length - a.length);

    terms.forEach(term => {
        // Only highlight if not already defined
        if (!definedVocabWords.has(term.toLowerCase())) {
            // Create a regex that matches the term as a whole word (case-insensitive)
            const regex = new RegExp(`\\b(${term})\\b`, 'i');

            if (regex.test(modifiedContent)) {
                modifiedContent = modifiedContent.replace(regex, (match) => {
                    definedVocabWords.add(term.toLowerCase());
                    return `<span class="vocab-word" data-term="${term}">${match}</span>`;
                });
            }
        }
    });

    textContent.innerHTML = modifiedContent;

    // Add hover event listeners
    document.querySelectorAll('.vocab-word').forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

// Show vocabulary tooltip
function showTooltip(e) {
    const term = e.target.dataset.term.toLowerCase();
    const definition = vocabLookup[term];

    if (definition) {
        vocabularyTooltip.textContent = definition;
        vocabularyTooltip.style.display = 'block';

        const rect = e.target.getBoundingClientRect();
        vocabularyTooltip.style.left = rect.left + 'px';
        vocabularyTooltip.style.top = (rect.bottom + 10) + 'px';
    }
}

// Hide vocabulary tooltip
function hideTooltip() {
    vocabularyTooltip.style.display = 'none';
}

// Navigation controls
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
});

// Bookmark functionality
bookmarkBtn.addEventListener('click', () => {
    saveBookmark(currentPage);
});

clearBookmarkBtn.addEventListener('click', clearBookmark);

// Sidebar toggle - separate controls for desktop and mobile
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
});

toggleSidebar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        toggleSidebar.textContent = '←';
        reopenSidebar.style.display = 'none';
    } else {
        sidebar.classList.add('collapsed');
        toggleSidebar.textContent = '→';
        reopenSidebar.style.display = 'block';
    }
});

// Reopen sidebar button
reopenSidebar.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.remove('collapsed');
    toggleSidebar.textContent = '←';
    reopenSidebar.style.display = 'none';
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Page jump functionality
pageJumpBtn.addEventListener('click', () => {
    const pageNum = parseInt(pageJumpInput.value);
    if (pageNum && pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        displayPage(currentPage);
        pageJumpInput.value = '';
    } else {
        alert(`Please enter a page number between 1 and ${totalPages}`);
    }
});

// Allow Enter key in page jump input
pageJumpInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        pageJumpBtn.click();
    }
});

// Update page jump max attribute when PDF loads
function updatePageJumpMax() {
    if (pageJumpInput) {
        pageJumpInput.max = totalPages;
    }
}

// Go to bookmark button
gotoBookmarkBtn.addEventListener('click', () => {
    if (bookmarkedPage && bookmarkedPage <= totalPages) {
        currentPage = bookmarkedPage;
        displayPage(currentPage);
        showNotification('Jumped to bookmarked page!');
    }
});

// Show/hide goto bookmark button on load
if (bookmarkedPage) {
    gotoBookmarkBtn.style.display = 'inline-block';
}

// AI Search functionality
aiSearchBtn.addEventListener('click', handleAISearch);

aiSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAISearch();
    }
});

closeAiModal.addEventListener('click', () => {
    aiModal.style.display = 'none';
});

// Close modal when clicking outside
aiModal.addEventListener('click', (e) => {
    if (e.target === aiModal) {
        aiModal.style.display = 'none';
    }
});

async function handleAISearch() {
    const query = aiSearchInput.value.trim();

    if (!query) {
        alert('Please enter a question');
        return;
    }

    // Get API key from localStorage
    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        aiModal.style.display = 'flex';
        aiResponse.innerHTML = `
            <div class="ai-error">
                <p><strong>⚠️ API Key Required</strong></p>
                <p>Please set your Google Gemini API key in localStorage.</p>
                <p style="margin-top: 15px; font-size: 0.9rem;">Open your browser console and run:</p>
                <code style="display: block; background: #f5f5f5; padding: 10px; margin-top: 10px; border-radius: 5px;">
                    localStorage.setItem('gemini_api_key', 'YOUR_API_KEY');
                </code>
                <p style="margin-top: 10px; font-size: 0.85rem;">Get your API key from: <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
            </div>
        `;
        return;
    }

    // Show modal with loading state
    aiModal.style.display = 'flex';
    aiResponse.innerHTML = `
        <div class="ai-loading">
            <div class="spinner"></div>
            <p>Thinking...</p>
        </div>
    `;

    try {
        // Get context from current page if PDF is loaded
        let context = '';
        if (pdfDoc && pdfText[currentPage - 1]) {
            context = pdfText[currentPage - 1];
        }

        // Call Gemini 2.0 Flash API
        const response = await callGeminiAPI(query, context, apiKey);

        // Display the response
        aiResponse.innerHTML = `
            <div class="ai-success">
                <h4>📘 Economics AI Tutor</h4>
                ${formatAIResponse(response)}
            </div>
        `;

    } catch (error) {
        console.error('AI search error:', error);

        // Provide specific feedback based on error type
        let errorHTML = '';

        if (error.message.includes('quota') || error.message.includes('rate limit')) {
            errorHTML = `
                <div class="ai-error">
                    <p><strong>⏱️ Rate Limit Reached</strong></p>
                    <p>${error.message}</p>
                    <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                        <p style="margin: 0; font-size: 0.9rem;"><strong>💡 Tips:</strong></p>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 0.85rem;">
                            <li>Google's free tier has daily limits</li>
                            <li>Wait 1-2 minutes and try again</li>
                            <li>Consider upgrading to a paid tier for higher limits</li>
                            <li>Verify your API key is from a project with billing enabled</li>
                        </ul>
                    </div>
                </div>
            `;
        } else if (error.message.includes('Invalid API key')) {
            errorHTML = `
                <div class="ai-error">
                    <p><strong>🔑 Invalid API Key</strong></p>
                    <p>${error.message}</p>
                    <div style="margin-top: 15px;">
                        <p style="font-size: 0.9rem;">To set your API key:</p>
                        <code style="display: block; background: #f5f5f5; padding: 10px; margin-top: 10px; border-radius: 5px;">
                            localStorage.setItem('gemini_api_key', 'YOUR_API_KEY');
                        </code>
                        <p style="margin-top: 10px; font-size: 0.85rem;">Get your key: <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
                    </div>
                </div>
            `;
        } else if (error.message.includes('Network error')) {
            errorHTML = `
                <div class="ai-error">
                    <p><strong>🌐 Connection Error</strong></p>
                    <p>${error.message}</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Please check your internet connection and try again.</p>
                </div>
            `;
        } else {
            errorHTML = `
                <div class="ai-error">
                    <p><strong>❌ Error</strong></p>
                    <p>${error.message}</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Please try again or check your API configuration.</p>
                </div>
            `;
        }

        aiResponse.innerHTML = errorHTML;
    }
}

async function callGeminiAPI(query, context, apiKey, retryCount = 0) {
    const MAX_RETRIES = 3;
    const BASE_DELAY = 2000; // 2 seconds base delay

    const prompt = context
        ? `You are an economics tutor helping a student understand their textbook. Answer the question clearly and concisely using the provided context when relevant.

Context from current page:
${context.substring(0, 2000)}

Question: ${query}

Provide a clear, educational response formatted with proper paragraphs.`
        : `You are an economics tutor. Answer this economics question clearly and concisely:

Question: ${query}`;

    try {
        // Using gemini-1.5-flash-latest with v1beta API for better compatibility
        // Note: v1beta is required for newer models. v1 only supports older models.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || 'API request failed';

            // Handle rate limit (429) or quota exceeded (429)
            if (response.status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
                if (retryCount < MAX_RETRIES) {
                    // Extract retry delay from error message if available
                    const retryMatch = errorMessage.match(/retry.*?(\d+)\s*second/i);
                    const suggestedDelay = retryMatch ? parseInt(retryMatch[1]) * 1000 : null;

                    // Exponential backoff: 2s, 4s, 8s (or use suggested delay)
                    const delay = suggestedDelay || (BASE_DELAY * Math.pow(2, retryCount));

                    // Update UI with retry message
                    aiResponse.innerHTML = `
                        <div class="ai-loading">
                            <div class="spinner"></div>
                            <p>⏳ System busy, retrying in ${Math.ceil(delay / 1000)} seconds...</p>
                            <p style="font-size: 0.85rem; margin-top: 10px;">Attempt ${retryCount + 1} of ${MAX_RETRIES}</p>
                        </div>
                    `;

                    // Wait and retry
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return callGeminiAPI(query, context, apiKey, retryCount + 1);
                } else {
                    throw new Error(`Rate limit exceeded. Please wait a few minutes and try again. The free tier has usage limits.`);
                }
            }

            // Handle invalid API key
            if (response.status === 400 && errorMessage.includes('API_KEY_INVALID')) {
                throw new Error('Invalid API key. Please check your API key in localStorage.');
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Validate response structure
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Unexpected API response format');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        // Network errors or other exceptions
        if (error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

function formatAIResponse(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    return `<p>${formatted}</p>`;
}

// Debug utility: List available models for your API key
// Run this in the browser console to see which models you have access to:
// listAvailableModels()
async function listAvailableModels() {
    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        console.error('No API key found. Set it first: localStorage.setItem("gemini_api_key", "YOUR_KEY")');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error('Error fetching models:', response.status, response.statusText);
            return;
        }

        const data = await response.json();

        console.log('=== Available Gemini Models ===');
        console.log('Total models:', data.models?.length || 0);
        console.log('\nModels that support generateContent:');

        const generateContentModels = data.models?.filter(model =>
            model.supportedGenerationMethods?.includes('generateContent')
        ) || [];

        generateContentModels.forEach(model => {
            console.log(`\n📘 ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Description: ${model.description}`);
            console.log(`   Input Token Limit: ${model.inputTokenLimit?.toLocaleString() || 'N/A'}`);
            console.log(`   Output Token Limit: ${model.outputTokenLimit?.toLocaleString() || 'N/A'}`);
            console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        });

        console.log('\n=== Recommended Models for This App ===');
        console.log('✅ gemini-1.5-flash-latest - Fast, free tier friendly');
        console.log('✅ gemini-1.5-pro-latest - More capable, higher quality');
        console.log('✅ gemini-2.0-flash-exp - Experimental, newest features');

        return generateContentModels;
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

// Make the function available globally for console use
window.listAvailableModels = listAvailableModels;
