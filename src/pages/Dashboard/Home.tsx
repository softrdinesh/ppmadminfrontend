import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,

  Fade,
  Grow,
  Zoom,
  Container,
  Stack,
  Avatar,

  Chip,

} from '@mui/material';
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { useNavigate } from 'react-router-dom';

// Custom SVG Icons
const FeedbackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"/>
  </svg>
);

const PaymentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
  </svg>
);

const PersonAddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const ArrowUpwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
  </svg>
);

const ArrowDownwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
  </svg>
);


// Stat Card Component with Professional Animation - Reduced Size
const StatCard = ({ title, value, icon, color, trend, trendValue, delay, onClick, redirectPath }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grow in timeout={delay} style={{ transformOrigin: '0 0 0' }}>
      <Card
        elevation={0}
        onClick={() => onClick && onClick(redirectPath)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          borderRadius: 3,
          background: isDark ? '#1a1a2e' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? isDark
              ? '0 12px 32px rgba(0,0,0,0.5)'
              : '0 12px 32px rgba(0,0,0,0.08)'
            : 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: color,
            opacity: isHovered ? 1 : 0.6,
            transition: 'all 0.35s ease',
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  fontSize: '0.6rem',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mt: 0.5,
                  color: isDark ? '#ffffff' : '#1a1a2e',
                  fontSize: '1.8rem',
                  letterSpacing: '-0.3px',
                }}
              >
                {value}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip
                  icon={trend === 'up' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  label={`${trendValue}%`}
                  size="small"
                  sx={{
                    height: 20,
                    borderRadius: 1.5,
                    bgcolor: trend === 'up' ? 'rgba(46, 213, 115, 0.12)' : 'rgba(255, 107, 107, 0.12)',
                    color: trend === 'up' ? '#2ed573' : '#ff6b6b',
                    fontWeight: 700,
                    fontSize: '0.55rem',
                    '& .MuiChip-icon': {
                      fontSize: '0.7rem',
                      color: trend === 'up' ? '#2ed573' : '#ff6b6b',
                    },
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    fontWeight: 500,
                    fontSize: '0.6rem',
                  }}
                >
                  vs last month
                </Typography>
              </Box>
            </Box>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: `${color}12`,
                color: color,
                borderRadius: 2.5,
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1) rotate(0)',
                border: `1px solid ${color}20`,
              }}
            >
              {icon}
            </Avatar>
          </Box>
          <Box 
            sx={{ 
              mt: 2, 
              pt: 1.5, 
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                fontSize: '0.55rem',
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}
            >
              View details →
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const { theme,  } = useCustomTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const statsData = [
    {
      title: 'Total Feedback',
      value: '2,847',
      icon: <FeedbackIcon />,
      color: '#6c5ce7',
      trend: 'up',
      trendValue: 12.5,
      delay: 200,
      redirectPath: '/FeedbackList',
    },
    {
      title: 'Payments Received',
      value: '$48,295',
      icon: <PaymentIcon />,
      color: '#00b894',
      trend: 'up',
      trendValue: 8.2,
      delay: 400,
      redirectPath: '/payment',
    },
    {
      title: 'New Onboardings',
      value: '1,432',
      icon: <PersonAddIcon />,
      color: '#0984e3',
      trend: 'down',
      trendValue: 3.1,
      delay: 600,
      redirectPath: '/Onboarding',
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? '#0a0a1a' : '#f5f6fa',
        p: { xs: 2, sm: 3, md: 4 },
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Card - Fixed Dark Mode */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: isDark ? '#1a1a2e' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: isDark ? '#ffffff' : '#1a1a2e',
                  mb: 0.5,
                  letterSpacing: '-0.3px',
                }}
              >
                Dashboard Overview
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  fontWeight: 500,
                }}
              >
                Welcome back! Here's what's happening with your business today.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Chip 
                label="Today" 
                size="small"
                sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  borderRadius: 1.5,
                }}
              />
             
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards - Now properly changing in dark mode */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatCard {...stat} onClick={handleCardClick} />
            </Grid>
          ))}
        </Grid>

        {/* Additional Stats Cards - Now properly changing in dark mode */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={800} style={{ transitionDelay: '100ms' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: isDark ? '#1a1a2e' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: isDark
                      ? '0 16px 32px rgba(0,0,0,0.4)'
                      : '0 16px 32px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2.5, 
                    color: isDark ? '#ffffff' : '#1a1a2e',
                    letterSpacing: '-0.3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 3, 
                      height: 18, 
                      borderRadius: 1.5, 
                      bgcolor: '#6c5ce7',
                      display: 'inline-block',
                    }} 
                  />
                  Recent Activity
                </Typography>
                <Stack spacing={2}>
                  {[
                    { icon: <FeedbackIcon />, text: 'New feedback from Sarah Johnson', time: '2 min ago', color: '#6c5ce7' },
                    { icon: <PaymentIcon />, text: 'Payment received from TechCorp', time: '15 min ago', color: '#00b894' },
                    { icon: <PersonAddIcon />, text: 'New user onboarded: Mike Anderson', time: '1 hour ago', color: '#0984e3' },
                  ].map((activity, idx) => (
                    <Fade in timeout={1000 + idx * 150} key={idx}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.02)',
                            transform: 'translateX(3px)',
                          },
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: `${activity.color}12`, 
                            color: activity.color,
                            borderRadius: 2,
                            border: `1px solid ${activity.color}20`,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                        <Box flex={1}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isDark ? '#ffffff' : '#1a1a2e', 
                              fontWeight: 600,
                              fontSize: '0.8rem',
                            }}
                          >
                            {activity.text}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                              fontSize: '0.65rem',
                              fontWeight: 500,
                            }}
                          >
                            {activity.time}
                          </Typography>
                        </Box>
                        <Chip 
                          label="New" 
                          size="small" 
                          sx={{
                            height: 18,
                            borderRadius: 1,
                            bgcolor: `${activity.color}12`,
                            color: activity.color,
                            fontSize: '0.5rem',
                            fontWeight: 700,
                            letterSpacing: 0.3,
                            textTransform: 'uppercase',
                          }}
                        />
                      </Box>
                    </Fade>
                  ))}
                </Stack>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={6}>
            <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: isDark ? '#1a1a2e' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: isDark
                      ? '0 16px 32px rgba(0,0,0,0.4)'
                      : '0 16px 32px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2.5, 
                    color: isDark ? '#ffffff' : '#1a1a2e',
                    letterSpacing: '-0.3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 3, 
                      height: 18, 
                      borderRadius: 1.5, 
                      bgcolor: '#00b894',
                      display: 'inline-block',
                    }} 
                  />
                  Performance Overview
                </Typography>
                <Stack spacing={2.5}>
                  {[
                    { label: 'Feedback Response Rate', value: 87, color: '#6c5ce7' },
                    { label: 'Payment Conversion', value: 65, color: '#00b894' },
                    { label: 'Onboarding Completion', value: 92, color: '#0984e3' },
                  ].map((metric, idx) => (
                    <Box key={idx}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Box 
                            sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              bgcolor: metric.color,
                              opacity: 0.8,
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                            }}
                          >
                            {metric.label}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 700, 
                              color: isDark ? '#ffffff' : '#1a1a2e',
                              fontSize: '0.9rem',
                            }}
                          >
                            {metric.value}%
                          </Typography>
                          <Chip 
                            label={metric.value >= 80 ? 'Excellent' : metric.value >= 70 ? 'Good' : 'Needs Work'}
                            size="small"
                            sx={{
                              height: 18,
                              borderRadius: 1,
                              bgcolor: metric.value >= 80 ? 'rgba(46, 213, 115, 0.12)' : metric.value >= 70 ? 'rgba(255, 193, 7, 0.12)' : 'rgba(255, 107, 107, 0.12)',
                              color: metric.value >= 80 ? '#2ed573' : metric.value >= 70 ? '#ffc107' : '#ff6b6b',
                              fontSize: '0.5rem',
                              fontWeight: 700,
                              letterSpacing: 0.3,
                              textTransform: 'uppercase',
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 6,
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${metric.value}%`,
                            height: '100%',
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
                            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;