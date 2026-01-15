# AI Integration Setup Guide 🤖

Your Economics Textbook Reader now has **real AI-powered features** using Google's Gemini API!

## ✅ What's Been Added

### 1. **Real Google Gemini Integration**
- Direct connection to Google's Gemini API
- Uses Gemini 2.0 Flash by default (latest model, fast and free)
- Can be upgraded to Gemini 1.5 Pro for more detailed responses
- Analyzes your textbook content to answer questions

### 2. **Manual Chapter Configuration**
- All 36 chapters are pre-configured
- Chapter 1 starts at page 36 (as you specified)
- Each chapter has defined start and end pages
- Clean chapter names in sidebar (no page numbers)

### 3. **API Key Management**
- Secure storage in browser localStorage
- Easy configuration through settings modal
- Password-masked display
- One-time setup

---

## 🚀 Quick Start Guide

### Step 1: Get Your Google Gemini API Key

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API key"
   - Select a Google Cloud project (or create new)
   - Copy the key (starts with `AIza`)
   - ⚠️ **IMPORTANT:** Save it somewhere safe!

3. **Free Tier**
   - Gemini 2.0 Flash has a generous free tier!
   - 15 requests per minute free
   - 1 million tokens per day free
   - Perfect for student use!

### Step 2: Configure the App

1. **Open the Textbook Reader**
   - Load your PDF as normal

2. **Open Settings**
   - Click the ⚙️ button in the header

3. **Enter API Key**
   - Paste your API key (AIza...)
   - Click "Save API Key"
   - You'll see "✅ API key saved successfully!"

### Step 3: Start Using AI!

**Try these commands:**

```
"Summarize Chapter 1"
"What is supply and demand?"
"Explain the concept of elasticity"
"How does inflation affect the economy?"
"Give me practice questions on Chapter 5"
```

---

## 💡 Features & Capabilities

### What the AI Can Do:

✅ **Answer Questions**
- Ask anything about economics concepts
- Get explanations in simple terms
- Request examples and applications

✅ **Summarize Chapters**
- Type: "Summarize Chapter 3"
- AI reads the entire chapter
- Provides key points and main concepts

✅ **Explain Vocabulary**
- Ask: "What is GDP?"
- Get detailed definitions beyond the built-in vocabulary

✅ **Generate Study Materials**
- Request practice questions
- Ask for concept comparisons
- Get step-by-step explanations

✅ **Context-Aware**
- Analyzes your current page
- Uses surrounding pages for context
- Gives relevant, textbook-specific answers

---

## ⚙️ Configuration Options

### Change AI Model

Edit [config.js](config.js:10):

```javascript
GEMINI_MODEL: 'gemini-2.0-flash-latest'  // Latest, fast, free tier available (recommended)
// OR
GEMINI_MODEL: 'gemini-1.5-pro'           // More capable, higher limits
```

### Adjust Response Length

Edit [config.js](config.js:11):

```javascript
MAX_TOKENS: 1000    // Default (about 750 words)
MAX_TOKENS: 1500    // Longer responses
MAX_TOKENS: 500     // Shorter, faster responses
```

### Adjust Creativity

Edit [config.js](config.js:12):

```javascript
TEMPERATURE: 0.7    // Default (balanced)
TEMPERATURE: 0.3    // More factual, less creative
TEMPERATURE: 1.0    // More creative explanations
```

---

## 📊 Chapter Structure

All 36 chapters are configured in [config.js](config.js:16-52):

| Chapter | Title | Pages |
|---------|-------|-------|
| 1 | Introduction to Economics | 36-51 |
| 2 | Economic Systems | 52-67 |
| 3 | Supply and Demand | 68-83 |
| 4 | Market Equilibrium | 84-99 |
| 5 | Elasticity | 100-115 |
| ... | ... | ... |
| 36 | Current Economic Issues | 596-611 |

**To customize:**
1. Open [config.js](config.js)
2. Find the `CHAPTERS` array
3. Update titles or page ranges as needed

---

## 💰 Cost Estimates

### Gemini 2.0 Flash (Recommended)
- **Free Tier:** 15 requests/minute, 1M tokens/day
- **Average Question:** ~500-1000 tokens = **FREE**
- **Chapter Summary:** ~2000-3000 tokens = **FREE**
- **Perfect for:** Student use, unlimited questions for free! 🎉

### Gemini 1.5 Pro
- **Free Tier:** 2 requests/minute, 50 requests/day
- **Better for:** Complex explanations, detailed analysis
- **Still FREE** for typical student use!

### Paid Tier (if you exceed free limits)
- **Gemini 2.0 Flash:** $0.075 per 1M input tokens
- **Gemini 1.5 Pro:** $1.25 per 1M input tokens
- Most students won't need paid tier!

---

## 🔒 Privacy & Security

### Your Data:
✅ **API Key Storage**
- Stored locally in your browser only
- Never sent anywhere except Google
- You control and can delete it anytime

✅ **Textbook Content**
- Only relevant excerpts sent to Google
- ~3000 characters per request (context window)
- No full textbook uploaded

✅ **Google's Policy**
- Consumer API data is NOT used to train models
- See: https://ai.google.dev/gemini-api/terms

---

## 🐛 Troubleshooting

### "API Key Required" Error
**Solution:** Click ⚙️ settings and enter your API key

### "Invalid API Key" Error
**Check:**
- Key starts with `AIza`
- No extra spaces
- Key is active at https://aistudio.google.com/app/apikey

### "Rate Limit" Error
**Means:** Too many requests in a short time (15/min on free tier)
**Solution:** Wait 60 seconds and try again

### Slow Responses
**Causes:**
- Using Gemini 1.5 Pro (slower but smarter)
- Long chapter summaries
- Google server load

**Solutions:**
- Use Gemini 2.0 Flash in config.js (default)
- Reduce MAX_TOKENS
- Try again in a few minutes

### "API Key Not Valid" or 400 Errors
**Check:**
- Make sure you enabled the Generative Language API in Google Cloud Console
- Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

---

## 📝 Example Queries

### Basic Questions
```
"What is inflation?"
"Define monopoly"
"Explain fiscal policy"
```

### Chapter Summaries
```
"Summarize Chapter 5"
"Give me the main points of Chapter 12"
"What are the key concepts in Chapter 20?"
```

### Study Help
```
"Create 5 practice questions on elasticity"
"Compare monopoly and perfect competition"
"Explain GDP with a simple example"
"What's the difference between fiscal and monetary policy?"
```

### Exam Prep
```
"Quiz me on Chapter 8"
"What are the most important formulas in this chapter?"
"Explain this concept like I'm in high school"
```

---

## 🎓 Advanced Tips

### 1. Be Specific
❌ "Tell me about economics"
✅ "Explain how supply and demand determine prices"

### 2. Reference Page Content
✅ "Explain the graph on this page"
✅ "What does this section mean?"

### 3. Ask Follow-ups
✅ "Can you explain that in simpler terms?"
✅ "Give me an example"

### 4. Use for Different Learning Styles
✅ "Explain this with a real-world example"
✅ "Show me the step-by-step process"
✅ "What's an analogy for this concept?"

---

## 🔧 Technical Details

### API Integration
- **Endpoint:** `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-latest:generateContent`
- **Method:** POST with API key in URL parameter
- **Request Format:** JSON with contents array
- **Response:** JSON with candidates array

### Context Management
- Extracts text from current page ± 2 pages
- For chapter summaries: loads up to 10 pages
- Truncates to 3000 characters for API
- Caches loaded pages for speed

### Error Handling
- Network errors: Shows retry message
- Invalid API key: Prompts to check settings
- Rate limits: Suggests waiting
- Malformed responses: Falls back gracefully

---

## 🚀 Next Steps

1. **Get your API key** from Google AI Studio
2. **Configure it** in settings (⚙️ button)
3. **Start asking questions!**
4. **Bookmark frequently used chapters**
5. **Use AI to prepare for exams**

---

## 📚 Resources

- **Google AI Studio:** https://aistudio.google.com
- **API Documentation:** https://ai.google.dev/docs
- **Get API Key:** https://aistudio.google.com/app/apikey
- **Pricing:** https://ai.google.dev/pricing
- **Terms of Service:** https://ai.google.dev/gemini-api/terms

---

## ✨ Enjoy Your AI-Powered Study Experience!

You now have a personal economics tutor built into your textbook reader, powered by Google's latest AI. Ask questions anytime, get instant explanations, and ace your economics course! 📚🎓

**Questions or Issues?**
- Check the troubleshooting section above
- Review your API key in settings
- Make sure you're within free tier limits (15 requests/min)

Happy studying! 🚀
