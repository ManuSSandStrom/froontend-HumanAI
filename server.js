const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log('Loaded API Key:', process.env.GEMINI_API_KEY); // Debug log
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Added missing model definition

// Humanize endpoint using Gemini API
app.post('/humanize', async (req, res) => {
    const { text } = req.body;
    console.log('Received text:', text);
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const prompt = `Rewrite this text to sound natural and human-like, using a friendly and conversational tone: "${text}"`;        
        const result = await model.generateContent(prompt);
        const humanizedText = result.response.text().trim();
        console.log('Humanized text:', humanizedText);
        res.json({ humanizedText });
    } catch (error) {
        console.error('Gemini API error:', error.message);
        res.status(500).json({ error: 'Failed to humanize text. Please try again.' });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('AI Humanizer Backend is running');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});