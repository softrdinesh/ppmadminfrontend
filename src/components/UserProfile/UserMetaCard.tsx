'use client'

import { useState } from 'react'

import { Avatar, Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import { Grid2 } from '@mui/material'

import ProfileTabs from './tabs'
import UpdateProfileDialog from './update-dialog'
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// Local type definition (replacing the import from '@/services/modules/profile/types')
interface Country {
  ID: number
  Name: string
}

interface ProfileData {
  ProfilePicture?: string | null
  Name?: string
  Email?: string
  country?: Country | null
  Address?: string
}

// Local helper function (replacing the import from '@/utils/getInitials')
const getInitials = (name: string = 'User'): string => {
  if (!name) return 'U'
  const nameParts = name.trim().split(' ')
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
}

interface UserDetailsProps {
  title: string
  value: string
}

const UserDetails = ({ title, value }: UserDetailsProps) => {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  return (
    <Box 
      display={'flex'} 
      alignItems={'center'} 
      gap={2}
      sx={{
        animation: 'fade-in-up 0.5s ease-out',
        '@keyframes fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '6px 8px',
        borderRadius: '8px',
        '&:hover': {
          transform: 'translateX(12px) scale(1.02)',
          backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(24,120,178,0.06)',
          '& .MuiTypography-root:first-of-type': {
            color: isDark ? '#818cf8' : '#1878B2',
            transform: 'scale(1.05)',
          },
          '& .MuiTypography-root:last-child': {
            color: isDark ? '#ffffff' : '#0a1628',
          }
        },
      }}
    >
      <Typography 
        fontWeight={600} 
        fontSize={15}
        sx={{
          color: isDark ? '#9ca3af' : '#4a4a6a',
          transition: 'all 0.4s ease',
          minWidth: '80px',
        }}
      >
        {title}:
      </Typography>
      <Typography 
        fontSize={15}
        sx={{
          color: isDark ? '#e2e8f0' : '#1a1a2e',
          fontWeight: 500,
          transition: 'all 0.4s ease',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

interface OverviewCardProps {
  data: ProfileData
  refetch: () => void
}

const OverviewCard = ({ data, refetch }: OverviewCardProps) => {
  const [open, setOpen] = useState(false)
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  // Theme-based colors
  const backgroundColor = isDark ? '#0F1828' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a1a2e';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#4a4a6a';
  const cardShadow = isDark 
    ? '0 8px 32px rgba(0,0,0,0.4)' 
    : '0 8px 32px rgba(0,0,0,0.08)';
  const cardHoverShadow = isDark 
    ? '0 16px 64px rgba(0,0,0,0.6)' 
    : '0 16px 64px rgba(0,0,0,0.12)';
  const avatarBgColor = isDark ? '#1a2a40' : '#1878B2';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(24, 120, 178, 0.15)';

  return (
    <Card 
      sx={{ 
        borderRadius: '20px',
        boxShadow: cardShadow,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: backgroundColor,
        animation: 'card-enter 0.8s ease-out',
        '@keyframes card-enter': {
          '0%': { opacity: 0, transform: 'scale(0.9) rotate(-2deg) translateY(30px)' },
          '60%': { transform: 'scale(1.02) rotate(1deg) translateY(-5px)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(0deg) translateY(0)' },
        },
        '&:hover': {
          boxShadow: cardHoverShadow,
          transform: 'translateY(-8px) scale(1.01)',
        },
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 40%, rgba(99,102,241,0.05) 50%, transparent 60%)',
          animation: 'shimmer 5s ease-in-out infinite',
          pointerEvents: 'none',
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%) rotate(45deg) scale(0.5)' },
            '50%': { transform: 'translateX(0%) rotate(45deg) scale(1)' },
            '100%': { transform: 'translateX(100%) rotate(45deg) scale(0.5)' },
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark 
            ? 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.03), transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(24,120,178,0.03), transparent 50%)',
          pointerEvents: 'none',
          animation: 'pulse-glow 4s ease-in-out infinite',
          '@keyframes pulse-glow': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 1 },
          },
        },
      }}
    >
      {/* Gradient Header with Enhanced Animation */}
      <Box 
        sx={{ 
          height: '140px', 
          background: isDark 
            ? 'linear-gradient(135deg, #0F1828 0%, #1a2a40 50%, #1f3a5f 100%)'
            : 'linear-gradient(135deg, #1878B2 0%, #1a8bc7 50%, #2a9fd6 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            animation: 'header-shimmer 3.5s ease-in-out infinite',
            '@keyframes header-shimmer': {
              '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
              '100%': { transform: 'translateX(100%) skewX(-15deg)' },
            },
          },
        }} 
      >
        {/* Animated floating particles in header */}
        <Box
          sx={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: '10%',
            left: '5%',
            animation: 'float-particle-1 7s ease-in-out infinite',
            '@keyframes float-particle-1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
              '25%': { transform: 'translate(30px, -20px) scale(1.3) rotate(90deg)' },
              '50%': { transform: 'translate(-10px, 30px) scale(0.8) rotate(180deg)' },
              '75%': { transform: 'translate(20px, 10px) scale(1.1) rotate(270deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            bottom: '15%',
            right: '10%',
            animation: 'float-particle-2 9s ease-in-out infinite',
            '@keyframes float-particle-2': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
              '33%': { transform: 'translate(-25px, 15px) scale(1.4) rotate(-90deg)' },
              '66%': { transform: 'translate(15px, -20px) scale(0.7) rotate(90deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            top: '40%',
            right: '25%',
            animation: 'float-particle-3 11s ease-in-out infinite',
            '@keyframes float-particle-3': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(40px, -30px) scale(1.5)' },
            },
          }}
        />
        {/* Decorative ring */}
        <Box
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.05)',
            top: '-30px',
            right: '-30px',
            animation: 'spin-slow 20s linear infinite',
            '@keyframes spin-slow': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.03)',
            bottom: '-20px',
            left: '-20px',
            animation: 'spin-slow-reverse 15s linear infinite',
            '@keyframes spin-slow-reverse': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(-360deg)' },
            },
          }}
        />
      </Box>
      
      <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          {/* Avatar with Enhanced Animation */}
          <Box 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'center'} 
            sx={{ mt: '-70px' }}
          >
            <Box
              sx={{
                position: 'relative',
                animation: 'avatar-container 0.8s ease-out',
                '@keyframes avatar-container': {
                  '0%': { transform: 'scale(0)' },
                  '60%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              {/* Decorative ring around avatar */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  borderRadius: '20px',
                  border: '2px solid transparent',
                  borderTopColor: isDark ? '#818cf8' : '#1878B2',
                  borderRightColor: isDark ? '#818cf8' : '#1878B2',
                  animation: 'spin-ring 6s linear infinite',
                  '@keyframes spin-ring': {
                    '0%': { transform: 'rotate(0deg) scale(1)' },
                    '50%': { transform: 'rotate(180deg) scale(1.05)' },
                    '100%': { transform: 'rotate(360deg) scale(1)' },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '-14px',
                  left: '-14px',
                  right: '-14px',
                  bottom: '-14px',
                  borderRadius: '24px',
                  border: '2px solid transparent',
                  borderBottomColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(24,120,178,0.3)',
                  borderLeftColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(24,120,178,0.3)',
                  animation: 'spin-ring-reverse 8s linear infinite',
                  '@keyframes spin-ring-reverse': {
                    '0%': { transform: 'rotate(0deg) scale(1)' },
                    '50%': { transform: 'rotate(-180deg) scale(1.05)' },
                    '100%': { transform: 'rotate(-360deg) scale(1)' },
                  },
                }}
              />
              <Avatar
                variant='rounded'
                sx={{ 
                  width: 130, 
                  height: 130, 
                  boxShadow: isDark 
                    ? '0 8px 32px rgba(0,0,0,0.5)'
                    : '0 8px 32px rgba(24, 120, 178, 0.3)',
                  border: `4px solid ${isDark ? '#1a2a40' : 'white'}`,
                  borderRadius: '20px',
                  backgroundColor: avatarBgColor,
                  color: 'white',
                  fontSize: '2.8rem',
                  fontWeight: 700,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.08) rotate(8deg)',
                    boxShadow: isDark 
                      ? '0 12px 48px rgba(0,0,0,0.7)'
                      : '0 12px 48px rgba(24, 120, 178, 0.5)',
                    borderColor: isDark ? '#818cf8' : '#1878B2',
                  },
                }}
                src={data?.ProfilePicture || undefined}
              >
                {getInitials(data?.Name)}
              </Avatar>
            </Box>
          </Box>

          {/* Name with Enhanced Animation */}
          <Box
            sx={{
              animation: 'fade-in-up 0.7s ease-out',
              '@keyframes fade-in-up': {
                '0%': { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
                '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
            }}
          >
            <Typography 
              fontSize={24} 
              fontWeight={700} 
              textAlign={'center'}
              sx={{ 
                color: textColor,
                letterSpacing: '0.5px',
                mt: 1,
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  color: isDark ? '#818cf8' : '#1878B2',
                  textShadow: isDark 
                    ? '0 0 30px rgba(99,102,241,0.2)'
                    : '0 0 30px rgba(24,120,178,0.1)',
                },
              }}
            >
              {data?.Name}
            </Typography>
            {/* Status indicator */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              sx={{
                mt: 1,
                animation: 'pulse-status 2s ease-in-out infinite',
                '@keyframes pulse-status': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  animation: 'blink-dot 1.5s ease-in-out infinite',
                  '@keyframes blink-dot': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.5)', opacity: 0.5 },
                  },
                }}
              />
              <Typography fontSize={12} sx={{ color: isDark ? '#9ca3af' : '#4a4a6a' }}>
                Active
              </Typography>
            </Box>
          </Box>

          {/* Details Section with Enhanced Animation */}
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography 
              fontSize={18} 
              fontWeight={600}
              sx={{ 
                color: isDark ? '#4a6a8a' : '#1878B2',
                letterSpacing: '0.3px',
                animation: 'slide-in-left 0.6s ease-out',
                '@keyframes slide-in-left': {
                  '0%': { opacity: 0, transform: 'translateX(-30px) scale(0.9)' },
                  '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
                },
              }}
            >
              Account Details
            </Typography>
            <Divider 
              sx={{ 
                borderColor: dividerColor,
                animation: 'width-expand 1s ease-out',
                '@keyframes width-expand': {
                  '0%': { transform: 'scaleX(0) scaleY(0.5)', opacity: 0 },
                  '50%': { transform: 'scaleX(0.7) scaleY(1)', opacity: 0.5 },
                  '100%': { transform: 'scaleX(1) scaleY(1)', opacity: 1 },
                },
              }} 
            />
            
            <Box sx={{ 
              '& .MuiTypography-root': { 
                color: isDark ? secondaryTextColor : '#4a4a6a' 
              },
              '& .MuiTypography-root:last-child': { 
                color: isDark ? '#FFFFFF' : '#1a1a2e',
                fontWeight: 500,
              },
              animation: 'fade-in 1s ease-out',
              '@keyframes fade-in': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
              },
            }}>
              <UserDetails 
                title={'Name'} 
                value={data?.Name || ''} 
              />
              <UserDetails 
                title={'Email'} 
                value={data?.Email?.toLowerCase() || ''}
              />
              <UserDetails 
                title={'Country'} 
                value={data?.country?.Name || ''}
              />
              <UserDetails 
                title={'Address'} 
                value={data?.Address || '-'}
              />
            </Box>
          </Box>

          {/* Edit Button with Enhanced Animation */}
          <Box 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'center'} 
            gap={2}
            sx={{
              animation: 'fade-in-up 1s ease-out',
              '@keyframes fade-in-up': {
                '0%': { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
                '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
            }}
          >
            <Button 
              variant='contained' 
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: '#1878B2',
                color: 'white',
                borderRadius: '14px',
                padding: '12px 48px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(24, 120, 178, 0.3)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.8s ease',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.6s ease',
                  transformOrigin: 'center',
                },
                '&:hover': {
                  backgroundColor: '#146394',
                  boxShadow: '0 8px 40px rgba(24, 120, 178, 0.5)',
                  transform: 'translateY(-4px) scale(1.03)',
                  '&::before': {
                    left: '100%',
                  },
                  '&::after': {
                    transform: 'scaleX(1)',
                  },
                },
                '&:active': {
                  transform: 'translateY(0px) scale(0.95)',
                },
                '& .MuiButton-startIcon': {
                  transition: 'transform 0.4s ease',
                },
                '&:hover .MuiButton-startIcon': {
                  transform: 'translateX(6px) rotate(10deg)',
                },
              }}
              startIcon={
                <Box
                  component="span"
                  sx={{
                    transition: 'transform 0.4s ease',
                    display: 'inline-flex',
                    fontSize: '20px',
                  }}
                >
                  ✏️
                </Box>
              }
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      </CardContent>
      
      <UpdateProfileDialog 
        open={open} 
        close={() => setOpen(false)} 
        data={data} 
        refetch={refetch} 
      />
    </Card>
  )
}

const UserProfilePage = () => {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  // Static data
  const data: ProfileData = {
    ProfilePicture: null,
    Name: "John Doe",
    Email: "john.doe@example.com",
    country: {
      ID: 1,
      Name: "United States"
    },
    Address: "123 Main Street, New York"
  }

  const refetch = () => {
    console.log("Refetching profile data...")
  }

  return (
    <Box
      sx={{
        animation: 'page-enter 0.8s ease-out',
        '@keyframes page-enter': {
          '0%': { opacity: 0, transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
        padding: { xs: 2, md: 3 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: isDark 
            ? 'radial-gradient(circle at 70% 30%, rgba(99,102,241,0.03), transparent 50%)'
            : 'radial-gradient(circle at 70% 30%, rgba(24,120,178,0.03), transparent 50%)',
          animation: 'bg-float 15s ease-in-out infinite',
          pointerEvents: 'none',
          '@keyframes bg-float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '33%': { transform: 'translate(30px, -20px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 30px) scale(0.9)' },
          },
        },
      }}
    >
      <Grid2 container spacing={6}>
        <Grid2 
          size={{ xs: 12, md: 4 }}
          sx={{
            animation: 'slide-in-left-page 0.8s ease-out',
            '@keyframes slide-in-left-page': {
              '0%': { opacity: 0, transform: 'translateX(-40px) scale(0.95)' },
              '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
            },
          }}
        >
          <OverviewCard data={data} refetch={refetch} />
        </Grid2>
        <Grid2 
          size={{ xs: 12, md: 8 }}
          sx={{
            animation: 'slide-in-right-page 0.8s ease-out',
            '@keyframes slide-in-right-page': {
              '0%': { opacity: 0, transform: 'translateX(40px) scale(0.95)' },
              '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
            },
          }}
        >
          <ProfileTabs />
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default UserProfilePage