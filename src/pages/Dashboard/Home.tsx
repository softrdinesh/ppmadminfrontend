import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Stack,
  Chip,
} from '@mui/material';
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

const ComingSoonIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

const ComingSoon: React.FC = () => {
  const { theme } = useCustomTheme();
  const isDark = theme === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? '#0a0a1a' : '#f5f6fa',
        p: { xs: 2, sm: 3, md: 4 },
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 3,
            bgcolor: isDark ? '#1a1a2e' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #6c5ce7, #00b894, #0984e3)',
              opacity: 0.8,
            },
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDark ? 'rgba(108, 92, 231, 0.12)' : 'rgba(108, 92, 231, 0.08)',
                color: '#6c5ce7',
                border: `2px solid ${isDark ? 'rgba(108, 92, 231, 0.2)' : 'rgba(108, 92, 231, 0.15)'}`,
                animation: 'pulse 2.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(108, 92, 231, 0.3)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 0 20px rgba(108, 92, 231, 0)',
                  },
                },
              }}
            >
              <ComingSoonIcon />
            </Box>

            {/* Chip */}
            <Chip
              label="Coming Soon"
              size="small"
              sx={{
                bgcolor: 'rgba(108, 92, 231, 0.12)',
                color: '#6c5ce7',
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: 1,
                textTransform: 'uppercase',
                borderRadius: 1.5,
                px: 1,
              }}
            />

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: isDark ? '#ffffff' : '#1a1a2e',
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              We're Working On It
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                fontWeight: 500,
                maxWidth: 400,
                lineHeight: 1.7,
                fontSize: '0.875rem',
              }}
            >
              This feature is currently under development. We're building something
              great and it will be available very soon. Stay tuned!
            </Typography>

            {/* Progress Dots */}
            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#6c5ce7',
                    opacity: 0.3,
                    animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                    '@keyframes bounce': {
                      '0%, 80%, 100%': {
                        transform: 'scale(0.6)',
                        opacity: 0.3,
                      },
                      '40%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              ))}
            </Stack>

            {/* Footer note */}
            <Box
              sx={{
                pt: 2,
                mt: 1,
                width: '100%',
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                  fontSize: '0.65rem',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Launching Soon
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ComingSoon;