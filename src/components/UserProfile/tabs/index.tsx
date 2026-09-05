// MUI Imports
import { useState } from 'react'

import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import { Box,  Zoom, Grow, Slide } from '@mui/material'
import { useTheme as useCustomTheme } from "../../../context/ThemeContext";

import ChangePasswordProfile from './change-password'

const ProfileTabs = () => {
  // States
  const [value, setValue] = useState('change-password')
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const handleChange = (event: any, newValue: string) => {
    console.log(event);
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        animation: 'tabs-container 0.8s ease-out',
        '@keyframes tabs-container': {
          '0%': { opacity: 0, transform: 'scale(0.9) translateX(30px) rotate(-2deg)' },
          '60%': { transform: 'scale(1.02) translateX(-5px) rotate(1deg)' },
          '100%': { opacity: 1, transform: 'scale(1) translateX(0) rotate(0deg)' },
        },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: isDark 
            ? 'radial-gradient(circle at 70% 30%, rgba(99,102,241,0.03), transparent 60%)'
            : 'radial-gradient(circle at 70% 30%, rgba(24,120,178,0.03), transparent 60%)',
          animation: 'bg-float 15s ease-in-out infinite',
          pointerEvents: 'none',
          '@keyframes bg-float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '33%': { transform: 'translate(20px, -15px) scale(1.1)' },
            '66%': { transform: 'translate(-15px, 20px) scale(0.9)' },
          },
        },
      }}
    >
      <TabContext value={value}>
        <TabList 
          onChange={handleChange} 
          aria-label='profile tabs'
          sx={{
            borderBottom: isDark 
              ? '1px solid rgba(255, 255, 255, 0.08)' 
              : '1px solid #e8edf2',
            position: 'relative',
            '& .MuiTabs-indicator': {
              backgroundColor: '#1878B2',
              height: 3,
              borderRadius: '3px 3px 0 0',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '-50%',
                right: '-50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(24,120,178,0.3), transparent)',
                animation: 'indicator-glow 2s ease-in-out infinite',
                '@keyframes indicator-glow': {
                  '0%, 100%': { opacity: 0.3, transform: 'scaleX(0.5)' },
                  '50%': { opacity: 1, transform: 'scaleX(1.5)' },
                },
              },
            },
            '& .MuiTab-root': {
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                color: '#1878B2',
              },
              '&.Mui-selected': {
                color: '#1878B2',
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab
            value='change-password'
            label='Change Password'
            icon={<Icon icon={'solar:lock-password-broken'} fontSize={22} />}
            iconPosition='start'
            sx={{
              fontSize: '0.95rem',
              fontWeight: 500,
              textTransform: 'none',
              padding: '12px 28px',
              borderRadius: '10px 10px 0 0',
              color: isDark ? '#B0BEC5' : '#5a6b7c',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '0%',
                height: '3px',
                background: 'linear-gradient(90deg, #1878B2, #6366f1)',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: 'translateX(-50%)',
                borderRadius: '3px 3px 0 0',
              },
              '&:hover::before': {
                width: '80%',
              },
              '&.Mui-selected::before': {
                width: '100%',
              },
              '& .MuiTab-iconWrapper': {
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: 'icon-float 3s ease-in-out infinite',
                '@keyframes icon-float': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                  '25%': { transform: 'translateY(-3px) rotate(-5deg)' },
                  '75%': { transform: 'translateY(3px) rotate(5deg)' },
                },
              },
              '&:hover .MuiTab-iconWrapper': {
                transform: 'rotate(-15deg) scale(1.2)',
                animation: 'none',
              },
              '&.Mui-selected .MuiTab-iconWrapper': {
                transform: 'scale(1.15)',
                animation: 'icon-pulse 2s ease-in-out infinite',
                '@keyframes icon-pulse': {
                  '0%, 100%': { transform: 'scale(1.15)' },
                  '50%': { transform: 'scale(1.25)' },
                },
              },
              '&:hover': {
                backgroundColor: isDark 
                  ? 'rgba(255, 255, 255, 0.06)' 
                  : 'rgba(24, 120, 178, 0.06)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: isDark 
                  ? '0 -4px 20px rgba(99,102,241,0.05)'
                  : '0 -4px 20px rgba(24,120,178,0.08)',
              },
              '&.Mui-selected': {
                color: '#1878B2',
                fontWeight: 600,
                backgroundColor: isDark 
                  ? 'rgba(24, 120, 178, 0.1)' 
                  : 'rgba(24, 120, 178, 0.06)',
                boxShadow: isDark 
                  ? '0 -4px 30px rgba(99,102,241,0.08)'
                  : '0 -4px 30px rgba(24,120,178,0.1)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              animation: 'tab-slide-in 0.6s ease-out',
              '@keyframes tab-slide-in': {
                '0%': { opacity: 0, transform: 'translateY(-20px) scale(0.9) rotate(-3deg)' },
                '60%': { transform: 'translateY(5px) scale(1.02) rotate(1deg)' },
                '100%': { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
              },
            }}
          />
        </TabList>
        
        <TabPanel 
          value='change-password'
          sx={{
            padding: '28px 0 0 0',
            animation: 'panel-enter 0.7s ease-out',
            '@keyframes panel-enter': {
              '0%': { opacity: 0, transform: 'translateY(30px) scale(0.95) rotate(-1deg)' },
              '60%': { transform: 'translateY(-5px) scale(1.01) rotate(0.5deg)' },
              '100%': { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
            },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(24,120,178,0.2), transparent)',
              animation: 'panel-line 2s ease-in-out infinite',
              '@keyframes panel-line': {
                '0%, 100%': { transform: 'scaleX(0.3)', opacity: 0.3 },
                '50%': { transform: 'scaleX(1)', opacity: 1 },
              },
            },
          }}
        >
          <Grow in timeout={800} style={{ transformOrigin: 'top center' }}>
            <Box>
              <Slide direction="up" in timeout={700}>
                <Box>
                  <Zoom in timeout={600}>
                    <Box>
                      <ChangePasswordProfile />
                    </Box>
                  </Zoom>
                </Box>
              </Slide>
            </Box>
          </Grow>
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default ProfileTabs