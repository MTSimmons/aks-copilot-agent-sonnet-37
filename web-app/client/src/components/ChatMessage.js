import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  const getAvatar = () => {
    if (isUser) {
      return (
        <Avatar sx={{ bgcolor: '#e0e7ff' }}>
          <PersonIcon sx={{ color: '#4f46e5' }} />
        </Avatar>
      );
    } else if (isError) {
      return (
        <Avatar sx={{ bgcolor: '#fee2e2' }}>
          <ErrorOutlineIcon sx={{ color: '#dc2626' }} />
        </Avatar>
      );
    } else {
      return (
        <Avatar sx={{ bgcolor: '#dcfce7' }}>
          <SmartToyIcon sx={{ color: '#059669' }} />
        </Avatar>
      );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        alignItems: 'flex-start',
      }}
    >
      {getAvatar()}
      <Paper
        elevation={0}
        sx={{
          ml: 1,
          p: 2,
          maxWidth: '85%',
          backgroundColor: isUser ? '#f1f5f9' : '#ffffff',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: isUser ? '#e2e8f0' : (isError ? '#fecaca' : '#dbeafe'),
        }}
      >
        <Typography 
          component="div" 
          variant="body1" 
          sx={{ 
            color: isError ? '#dc2626' : 'inherit',
            '& a': {
              color: '#2563eb',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& p': {
              margin: '8px 0',
            },
            '& p:first-of-type': {
              marginTop: 0,
            },
            '& p:last-of-type': {
              marginBottom: 0,
            },
            '& code': {
              backgroundColor: '#f1f5f9',
              padding: '2px 4px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
            },
          }}
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    customStyle={{ 
                      margin: '16px 0', 
                      borderRadius: '6px',
                      fontSize: '0.9em',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </Typography>
      </Paper>
    </Box>
  );
}

export default ChatMessage;