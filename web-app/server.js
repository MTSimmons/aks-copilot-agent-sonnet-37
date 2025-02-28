import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Check for required environment variables
if (!process.env.AZURE_OPENAI_API_KEY) {
  console.error('Missing required environment variable AZURE_OPENAI_API_KEY');
  process.exit(1);
}

if (!process.env.AZURE_OPENAI_ENDPOINT) {
  console.error('Missing required environment variable AZURE_OPENAI_ENDPOINT');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Chat completion API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request. Messages array is required.' });
    }

    // Make request to Azure OpenAI service
    const response = await axios.post(
      process.env.AZURE_OPENAI_ENDPOINT,
      {
        messages,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error communicating with Azure OpenAI service',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Handle any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});