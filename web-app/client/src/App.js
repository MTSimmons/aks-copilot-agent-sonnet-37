import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import axios from 'axios';
import './App.css';

function App() {
  const [sessionId] = useState(uuidv4());
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Update UI immediately with user message
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await axios.post('/api/chat', { 
        sessionId, 
        message 
      });
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">
            Azure OpenAI Chat Demo
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, p: 2 }}>
            <List>
              {chatHistory.length === 0 ? (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 10 }}>
                  Start a conversation by typing a message below!
                </Typography>
              ) : (
                chatHistory.map((chat, index) => (
                  <ListItem 
                    key={index} 
                    sx={{
                      textAlign: chat.role === 'user' ? 'right' : 'left',
                      mb: 1
                    }}
                  >
                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        maxWidth: '80%', 
                        backgroundColor: chat.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                        ml: chat.role === 'user' ? 'auto' : 0,
                        borderRadius: 2
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Typography 
                            component="div" 
                            variant="body1"
                            sx={{ 
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}
                          >
                            {chat.content}
                          </Typography>
                        }
                      />
                    </Paper>
                  </ListItem>
                ))
              )}
              <div ref={messagesEndRef} />
            </List>
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', mt: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              disabled={isLoading || !message.trim()}
            >
              Send
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default App;