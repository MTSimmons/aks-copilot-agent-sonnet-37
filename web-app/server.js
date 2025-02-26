require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Chat history storage (in memory for demo)
const chatSessions = new Map();

// Azure OpenAI endpoint
const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT || "https://simmons-ai.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-08-01-preview";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    // Initialize session if it doesn't exist
    if (!chatSessions.has(sessionId)) {
      chatSessions.set(sessionId, []);
    }
    
    const chatHistory = chatSessions.get(sessionId);
    
    // Add user message to history
    chatHistory.push({ role: 'user', content: message });
    
    // Call Azure OpenAI API
    const response = await axios.post(
      OPENAI_ENDPOINT,
      {
        messages: chatHistory,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': OPENAI_API_KEY,
        },
      }
    );
    
    // Extract assistant's reply
    const assistantMessage = response.data.choices[0].message;
    
    // Add assistant's reply to chat history
    chatHistory.push(assistantMessage);
    
    // Save updated chat history
    chatSessions.set(sessionId, chatHistory);
    
    // Send response back to client
    res.json({ message: assistantMessage.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Get chat history endpoint
app.get('/api/chat/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const chatHistory = chatSessions.get(sessionId) || [];
  res.json({ chatHistory });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});