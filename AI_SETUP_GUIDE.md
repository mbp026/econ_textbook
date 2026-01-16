# AI Setup Guide - Economics Textbook Reader

## Getting Your Google Gemini API Key

### Step 1: Get an API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Choose **"Create API key in new project"** (recommended for free tier)
5. Copy your API key (starts with `AIza...`)

### Step 2: Set Up Your API Key

Open your browser's Developer Console:
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: Enable Developer menu in Preferences, then press `Cmd+Option+C`

Then run this command in the console:
```javascript
localStorage.setItem('gemini_api_key', 'YOUR_API_KEY_HERE');
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

### Step 3: Verify Setup

After setting your API key, reload the page and try asking a question in the AI Search Bar.

## Understanding Rate Limits & Quota

### Free Tier Limits
- **Model**: gemini-1.5-flash (optimized for free tier)
- **Requests per minute**: 15 requests
- **Requests per day**: 1,500 requests
- **Tokens per minute**: 1 million tokens

### What Happens When You Hit Limits?

The app automatically handles rate limits with:
1. **Exponential Backoff**: Retries automatically with increasing delays (2s, 4s, 8s)
2. **User Feedback**: Shows friendly messages like "System busy, retrying in 30s..."
3. **Smart Retry Logic**: Uses hints from the API error to determine optimal retry time

### Common Quota Issues

#### "Quota Exceeded (limit: 0)"
This usually means:
- Your API key is from a restricted project
- You need to enable billing (even for free tier usage)
- Your daily limit has been reached

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Generative Language API
4. Set up billing (you won't be charged for free tier usage)
5. Generate a new API key from this project

#### "Rate Limit Exceeded"
You've made too many requests in a short time.

**Solution:**
- Wait 1-2 minutes and try again
- The app will automatically retry with backoff

#### "Invalid API Key"
Your API key is incorrect or expired.

**Solution:**
- Double-check you copied the full key
- Generate a new key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Upgrading for Higher Limits

If you need more requests:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing on your project
3. You'll get much higher quotas automatically

**Pay-as-you-go pricing** (you only pay for what you use):
- gemini-1.5-flash: Very affordable, optimized for speed
- First 1M tokens free each month even with billing enabled

## Troubleshooting

### Check Your API Key
Run this in the console to verify your key is stored:
```javascript
console.log(localStorage.getItem('gemini_api_key') ? 'API key is set' : 'No API key found');
```

### Clear Your API Key
If you need to reset:
```javascript
localStorage.removeItem('gemini_api_key');
```

### Check API Status
Visit [Google Cloud Status](https://status.cloud.google.com/) to see if there are any service disruptions.

## Model Information

**Current Model**: `gemini-1.5-flash`
- Chosen for optimal free tier compatibility
- Fast responses (2-3 seconds typically)
- Good quality for educational content
- Stable and reliable

**Previous Model**: `gemini-2.0-flash-exp`
- Experimental model with limited availability
- May have stricter quota limits
- Not recommended for production use

## Privacy & Security

- Your API key is stored locally in your browser (`localStorage`)
- No data is sent to our servers
- All API calls go directly from your browser to Google
- Your PDF content is processed entirely in your browser

## Support

If you continue to experience issues:
1. Check the [Google AI Studio Documentation](https://ai.google.dev/docs)
2. Verify your project has the Generative Language API enabled
3. Try generating a new API key
4. Consider enabling billing for higher quotas
