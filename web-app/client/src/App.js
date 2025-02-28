import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, Box, TextField, Button, Paper, Typography, 
  Avatar, CssBaseline, ThemeProvider, createTheme, IconButton,
  CircularProgress, Divider, AppBar, Toolbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatMessage from './components/ChatMessage';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'You are a helpful assistant that provides accurate, concise, and friendly responses.' 
    },
    { 
      role: 'assistant', 
      content: 'Hi there! How can I help you today?' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatMessages = [...messages, userMessage].filter(
        msg => msg.role !== 'error'
      );

      const response = await axios.post('/api/chat', {
        messages: chatMessages
      });

      if (response.data.choices && response.data.choices.length > 0) {
        const assistantMessage = response.data.choices[0].message;
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'error',
          content: `Sorry, there was an error communicating with the AI service. ${error.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'system', 
        content: 'You are a helpful assistant that provides accurate, concise, and friendly responses.' 
      },
      { 
        role: 'assistant', 
        content: 'Hi there! How can I help you today?' 
      }
    ]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <SmartToyIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
              Azure OpenAI Chat
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<DeleteIcon />}
              onClick={clearChat}
              size="small"
            >
              Clear Chat
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          p: 2,
          backgroundColor: theme.palette.background.default
        }}>
          <Container maxWidth="md" sx={{ my: 2 }}>
            {messages.filter(msg => msg.role !== 'system').map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {loading && (
              <Box display="flex" justifyContent="center" mt={2} mb={2}>
                <CircularProgress size={30} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Container>
        </Box>

        <Box component="footer" sx={{ 
          p: 2, 
          backgroundColor: 'background.paper',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Container maxWidth="md">
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                disabled={loading}
                sx={{ 
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || input.trim() === ''}
                sx={{ 
                  borderRadius: '50%', 
                  minWidth: '56px', 
                  width: '56px', 
                  height: '56px',
                  p: 0
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;