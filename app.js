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

// Local AI Model - Initialize on page load
let localAI = null;
let aiModelReady = false;

async function initLocalAI() {
    try {
        aiResponse.innerHTML = `
            <div class="ai-loading">
                <div class="spinner"></div>
                <p>Loading AI model (first time may take 1-2 minutes)...</p>
                <p style="font-size: 0.85rem; margin-top: 10px;">Model downloads once and runs locally in your browser</p>
            </div>
        `;
        aiModal.style.display = 'flex';

        // Initialize the summarization pipeline with a small, fast model
        localAI = await window.transformersPipeline('summarization', 'Xenova/distilbart-cnn-6-6');
        aiModelReady = true;

        aiModal.style.display = 'none';
        showNotification('AI model ready! You can now ask questions.');
    } catch (error) {
        console.error('Error loading AI model:', error);
        aiResponse.innerHTML = `
            <div class="ai-error">
                <p><strong>❌ Failed to load AI model</strong></p>
                <p>${error.message}</p>
                <p style="margin-top: 10px; font-size: 0.9rem;">Please refresh the page and try again.</p>
            </div>
        `;
    }
}

// Initialize AI when page loads
window.addEventListener('load', () => {
    // Delay initialization slightly to let PDF.js load first
    setTimeout(initLocalAI, 1000);

    // Try to auto-load textbook.pdf from project folder
    tryLoadDefaultPDF();
});

// Auto-load PDF from project folder if available
async function tryLoadDefaultPDF() {
    try {
        const response = await fetch('textbook.pdf');
        if (!response.ok) {
            console.log('No default textbook.pdf found, showing upload prompt');
            return;
        }

        const arrayBuffer = await response.arrayBuffer();

        // Hide upload prompt and show reader
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

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true
        });

        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        totalPagesSpan.textContent = totalPages;

        // Quick scan for chapters
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

        showNotification('Textbook loaded automatically!');

    } catch (error) {
        console.log('Could not auto-load PDF:', error.message);
        // Keep upload prompt visible (default state)
    }
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

    // Check if AI model is ready
    if (!aiModelReady) {
        aiModal.style.display = 'flex';
        aiResponse.innerHTML = `
            <div class="ai-error">
                <p><strong>⏳ AI Model Still Loading</strong></p>
                <p>The AI model is still initializing. Please wait a moment and try again.</p>
                <p style="margin-top: 10px; font-size: 0.9rem;">First-time setup can take 1-2 minutes to download the model.</p>
            </div>
        `;
        return;
    }

    // Show modal with loading state
    aiModal.style.display = 'flex';
    aiResponse.innerHTML = `
        <div class="ai-loading">
            <div class="spinner"></div>
            <p>Analyzing your question...</p>
        </div>
    `;

    try {
        // Get context from current page if PDF is loaded
        let context = '';
        if (pdfDoc && pdfText[currentPage - 1]) {
            context = pdfText[currentPage - 1];
        }

        // Determine if this is a summarization or question-answering request
        const isSummaryRequest = query.toLowerCase().includes('summar') ||
                                 query.toLowerCase().includes('main points') ||
                                 query.toLowerCase().includes('key concepts');

        let response;

        if (isSummaryRequest && context) {
            // Use local AI to summarize current page
            response = await summarizeContent(context);
        } else if (context) {
            // Try to extract relevant info from context
            response = await answerQuestion(query, context);
        } else {
            // No PDF loaded
            response = "Please load a PDF first to use AI features. The AI needs textbook content to answer your questions.";
        }

        // Display the response
        aiResponse.innerHTML = `
            <div class="ai-success">
                <h4>📘 Local AI Assistant</h4>
                <p>${response}</p>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #666;">
                    💡 This AI runs locally in your browser - no API key or internet required!
                </p>
            </div>
        `;

    } catch (error) {
        console.error('AI search error:', error);
        aiResponse.innerHTML = `
            <div class="ai-error">
                <p><strong>❌ Error</strong></p>
                <p>${error.message}</p>
                <p style="margin-top: 10px; font-size: 0.9rem;">Please try again or reload the page.</p>
            </div>
        `;
    }
}

// Local AI Functions - No API key needed!

async function summarizeContent(text) {
    try {
        // Limit text to first 3000 characters for faster processing
        const input = text.substring(0, 3000);

        const result = await localAI(input, {
            max_new_tokens: 150,
            min_new_tokens: 50,
        });

        return result[0].summary_text;
    } catch (error) {
        throw new Error('Failed to generate summary: ' + error.message);
    }
}

async function answerQuestion(query, context) {
    try {
        // For question answering, we'll use summarization on relevant context
        // This is a simplified approach - the model will extract key info

        // Create a focused text combining query and context
        const input = `Question: ${query}\n\nContext: ${context.substring(0, 2500)}`;

        const result = await localAI(input, {
            max_new_tokens: 100,
            min_new_tokens: 30,
        });

        return result[0].summary_text;
    } catch (error) {
        // Fallback: try to find relevant sentences in context
        return findRelevantContext(query, context);
    }
}

function findRelevantContext(query, context) {
    // Simple keyword matching fallback
    const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 3);

    // Find sentences containing query keywords
    const relevantSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        return queryWords.some(word => lowerSentence.includes(word));
    });

    if (relevantSentences.length > 0) {
        return relevantSentences.slice(0, 3).join('. ') + '.';
    }

    return 'I couldn\'t find specific information about that on this page. Try using "summarize this page" to get an overview, or navigate to a different chapter.';
}
