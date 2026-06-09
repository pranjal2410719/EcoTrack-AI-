#!/bin/bash
# Test if Gemini API quota has reset
# Run: bash scripts/test-gemini.sh

echo "🧪 Testing Gemini API quota..."
echo ""

cd "$(dirname "$0")/../backend"

# Test 1: Direct Gemini API call
echo "Test 1: Direct Gemini API call"
node -e "
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say hello in one word');
    console.log('✅ SUCCESS: ' + result.response.text());
    console.log('🎉 Gemini quota has RESET! Live AI is working.');
  } catch (e) {
    if (e.message.includes('429') || e.message.includes('quota') || e.message.includes('rate')) {
      console.log('⏳ STILL EXHAUSTED: Quota not yet reset.');
      console.log('   Free tier resets every 24 hours.');
    } else if (e.message.includes('403')) {
      console.log('❌ API key issue: ' + e.message);
    } else {
      console.log('❌ Error: ' + e.message);
    }
  }
}
test();
" 2>&1

echo ""

# Test 2: Via deployed backend
echo "Test 2: Via deployed Render backend"
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' https://ecotrack-ai-tdq4.onrender.com/api/health)
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Backend is live (HTTP $HTTP_CODE)"
else
  echo "⏳ Backend may be cold-starting (HTTP $HTTP_CODE) - wait 50s"
fi

echo ""
echo "💡 To test the full AI flow, run:"
echo "   1. Open https://ecotrack0a.netlify.app/coach"
echo "   2. Click a suggestion button"
echo "   3. If response is unique and detailed → Gemini is LIVE"
echo "   4. If response starts with '🔥 Ready for a change?' → Fallback (still exhausted)"
