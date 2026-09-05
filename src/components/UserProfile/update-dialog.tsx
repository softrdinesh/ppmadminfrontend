import { useEffect } from 'react'
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  TextField,
  Zoom,
 
  Grow,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

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

interface UpdateProfileDialogProps {
  open: boolean
  close: () => void
  data: ProfileData
  refetch: () => void
}

type FormFields = {
  ProfilePicture: string | null | File
  Name: string
  CountryID: Country | null
  Address: string
}

// Helper function for getInitials
const getInitials = (name: string = 'User'): string => {
  if (!name) return 'U'
  const nameParts = name.trim().split(' ')
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
}

const UpdateProfileDialog = ({ open, close, data, refetch }: UpdateProfileDialogProps) => {
  const countryData: Country[] = [] // Mock data - replace with actual data if needed
  const isLoading = false
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      ProfilePicture: data?.ProfilePicture || null,
      Name: data?.Name || '',
      CountryID: data?.country || null,
      Address: data?.Address || ''
    }
  })

  const onSubmit = async () => {
    try {
      // API call removed - just close and refetch
      close()
      refetch()
    } catch (error) {
      refetch()
    }
  }

  useEffect(() => {
    if (open) {
      reset({
        ProfilePicture: data?.ProfilePicture || null,
        Name: data?.Name || '',
        CountryID: data?.country || null,
        Address: data?.Address || ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset, refetch])

  // Theme-based colors
  const backgroundColor = isDark ? '#0F1828' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a1a2e';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#4a4a6a';
  const inputBgColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(24, 120, 178, 0.1)';

  return (
    <>
      <Dialog 
        open={open} 
        onClose={close} 
        TransitionComponent={Zoom} 
        TransitionProps={{ timeout: 500 }}
        fullWidth 
        maxWidth='sm'
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '24px',
            boxShadow: isDark 
              ? '0 24px 80px rgba(0,0,0,0.6)' 
              : '0 24px 80px rgba(0,0,0,0.18)',
            backgroundColor: backgroundColor,
            animation: 'dialog-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '@keyframes dialog-enter': {
              '0%': { transform: 'scale(0.7) rotate(-5deg) translateY(30px)', opacity: 0 },
              '60%': { transform: 'scale(1.05) rotate(1deg) translateY(-5px)' },
              '100%': { transform: 'scale(1) rotate(0deg) translateY(0)', opacity: 1 },
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
              animation: 'shimmer-dialog 5s ease-in-out infinite',
              pointerEvents: 'none',
              '@keyframes shimmer-dialog': {
                '0%': { transform: 'translateX(-100%) rotate(45deg) scale(0.5)' },
                '50%': { transform: 'translateX(0%) rotate(45deg) scale(1)' },
                '100%': { transform: 'translateX(100%) rotate(45deg) scale(0.5)' },
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #1878B2, #6366f1, #1878B2)',
              animation: 'border-glow 3s ease-in-out infinite',
              '@keyframes border-glow': {
                '0%, 100%': { transform: 'scaleX(0.5)', opacity: 0.5 },
                '50%': { transform: 'scaleX(1)', opacity: 1 },
              },
            },
          }
        }}
      >
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog Header with Gradient and Enhanced Animation */}
          <Box
            sx={{
              background: isDark 
                ? 'linear-gradient(135deg, #0F1828 0%, #1a2a40 50%, #1f3a5f 100%)'
                : 'linear-gradient(135deg, #1878B2 0%, #1a8bc7 50%, #2a9fd6 100%)',
              padding: '32px 32px 24px 32px',
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
                animation: 'header-shimmer-dialog 3s ease-in-out infinite',
                '@keyframes header-shimmer-dialog': {
                  '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
                  '100%': { transform: 'translateX(100%) skewX(-15deg)' },
                },
              },
            }}
          >
            {/* Animated decorative particles in header */}
            <Box
              sx={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                top: '5%',
                right: '5%',
                animation: 'float-particle-dialog 7s ease-in-out infinite',
                '@keyframes float-particle-dialog': {
                  '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
                  '25%': { transform: 'translate(-30px, -20px) scale(1.3) rotate(90deg)' },
                  '50%': { transform: 'translate(20px, 15px) scale(0.7) rotate(180deg)' },
                  '75%': { transform: 'translate(-15px, 25px) scale(1.1) rotate(270deg)' },
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
                bottom: '10%',
                left: '10%',
                animation: 'float-particle-dialog-2 9s ease-in-out infinite',
                '@keyframes float-particle-dialog-2': {
                  '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
                  '33%': { transform: 'translate(25px, -15px) scale(1.4) rotate(-90deg)' },
                  '66%': { transform: 'translate(-20px, 25px) scale(0.6) rotate(90deg)' },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                top: '30%',
                right: '20%',
                animation: 'float-particle-dialog-3 11s ease-in-out infinite',
                '@keyframes float-particle-dialog-3': {
                  '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                  '50%': { transform: 'translate(-20px, -25px) scale(1.5)' },
                },
              }}
            />
            {/* Decorative ring in header */}
            <Box
              sx={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.05)',
                top: '-40px',
                right: '-20px',
                animation: 'spin-slow-dialog 20s linear infinite',
                '@keyframes spin-slow-dialog': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <DialogTitle 
              sx={{ 
                p: 0,
                color: 'white',
                fontSize: '1.7rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                position: 'relative',
                zIndex: 1,
                animation: 'fade-in-down-dialog 0.7s ease-out',
                '@keyframes fade-in-down-dialog': {
                  '0%': { opacity: 0, transform: 'translateY(-30px) scale(0.9) rotate(-3deg)' },
                  '100%': { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
                },
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.15)',
                  animation: 'pulse-icon 2s ease-in-out infinite',
                  '@keyframes pulse-icon': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                  },
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✏️</span>
              </Box>
              Update Profile
            </DialogTitle>
          </Box>
          
          <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
            <Grid container spacing={4}>
              {/* Image */}
              <Grid item xs={12}>
                {/* Profile Picture */}
                <Controller
                  control={control}
                  name='ProfilePicture'
                  render={({ field }) => (
                    <>
                      <input
                        type='file'
                        accept='.jpg,.jpeg,.png'
                        id='profile-picture'
                        onChange={e => {
                          if (e.target.files) {
                            const file = e.target.files[0]
                            field.onChange(file)
                          }
                        }}
                        hidden
                      />

                      {/* Avatar Box with Enhanced Animation */}
                      <Box
                        component='label'
                        htmlFor='profile-picture'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        py={2}
                        sx={{
                          animation: 'fade-in-up-dialog 0.8s ease-out',
                          '@keyframes fade-in-up-dialog': {
                            '0%': { opacity: 0, transform: 'translateY(30px) scale(0.9) rotate(-2deg)' },
                            '100%': { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
                          },
                        }}
                      >
                        <Box
                          display={'flex'}
                          position='relative'
                          overflow={'hidden'}
                          borderRadius={'20px'}
                          sx={{
                            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            '&:hover': {
                              transform: 'scale(1.08) rotate(3deg)',
                              '& #hover-box-input': {
                                cursor: 'pointer',
                                opacity: '1',
                                transform: 'scale(1)',
                              }
                            }
                          }}
                        >
                          {/* Decorative rings around avatar */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '-8px',
                              left: '-8px',
                              right: '-8px',
                              bottom: '-8px',
                              borderRadius: '24px',
                              border: '2px solid transparent',
                              borderTopColor: isDark ? '#818cf8' : '#1878B2',
                              borderRightColor: isDark ? '#818cf8' : '#1878B2',
                              animation: 'spin-ring-dialog 6s linear infinite',
                              '@keyframes spin-ring-dialog': {
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
                              borderRadius: '28px',
                              border: '2px solid transparent',
                              borderBottomColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(24,120,178,0.3)',
                              borderLeftColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(24,120,178,0.3)',
                              animation: 'spin-ring-reverse-dialog 8s linear infinite',
                              '@keyframes spin-ring-reverse-dialog': {
                                '0%': { transform: 'rotate(0deg) scale(1)' },
                                '50%': { transform: 'rotate(-180deg) scale(1.05)' },
                                '100%': { transform: 'rotate(-360deg) scale(1)' },
                              },
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '-20px',
                              left: '-20px',
                              right: '-20px',
                              bottom: '-20px',
                              borderRadius: '32px',
                              border: '1px solid rgba(99,102,241,0.1)',
                              animation: 'pulse-ring-dialog 3s ease-in-out infinite',
                              '@keyframes pulse-ring-dialog': {
                                '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
                                '50%': { transform: 'scale(1.05)', opacity: 0 },
                              },
                            }}
                          />
                          <Avatar
                            variant='rounded'
                            sx={{ 
                              width: 160, 
                              height: 160, 
                              boxShadow: isDark
                                ? '0 8px 40px rgba(0,0,0,0.5)'
                                : '0 8px 40px rgba(24, 120, 178, 0.3)',
                              border: isDark
                                ? '4px solid #1a2a40'
                                : '4px solid #1878B2',
                              borderRadius: '20px',
                              position: 'relative',
                              backgroundColor: isDark ? '#1a2a40' : '#1878B2',
                              color: 'white',
                              fontSize: '3.5rem',
                              fontWeight: 700,
                              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              '&:hover': {
                                transform: 'scale(1.05) rotate(5deg)',
                              },
                            }}
                            src={
                              field?.value instanceof File ? URL.createObjectURL(field.value) : field.value || undefined
                            }
                          >
                            {getInitials(data?.Name || 'User')}
                          </Avatar>
                          <Box
                            position={'absolute'}
                            width={'100%'}
                            height={'100%'}
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            bgcolor={isDark 
                              ? 'rgba(15, 24, 40, 0.75)'
                              : 'rgba(24, 120, 178, 0.7)'
                            }
                            id='hover-box-input'
                            sx={{ 
                              opacity: 0,
                              transform: 'scale(0.8)',
                              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              borderRadius: '20px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <span style={{ fontSize: '2.5rem' }}>📷</span>
                              <span style={{ 
                                fontSize: '0.8rem', 
                                color: 'white',
                                fontWeight: 500,
                              }}>
                                Change Photo
                              </span>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}
                />
              </Grid>

              {/* Name */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='Name'
                  rules={{
                    required: 'Please enter a name',
                    maxLength: { value: 100, message: 'You cannot enter more than 100 characters' }
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Grow in timeout={600} style={{ transformOrigin: 'top' }}>
                        <TextField 
                          {...field} 
                          label='Name' 
                          inputProps={{ maxLength: 100 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: inputBgColor,
                              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              '&:focus-within': {
                                transform: 'scale(1.03)',
                                boxShadow: isDark 
                                  ? '0 0 0 3px rgba(99,102,241,0.2)'
                                  : '0 0 0 3px rgba(24,120,178,0.2)',
                              },
                              '& fieldset': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : undefined,
                                transition: 'border-color 0.3s ease',
                              },
                              '&:hover fieldset': {
                                borderColor: isDark ? '#4a6a8a' : '#1878B2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: isDark ? '#4a6a8a' : '#1878B2',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: isDark ? secondaryTextColor : undefined,
                              transition: 'color 0.3s ease',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: isDark ? '#4a6a8a' : '#1878B2',
                            },
                            '& .MuiInputBase-input': {
                              color: textColor,
                            },
                          }}
                        />
                      </Grow>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='CountryID'
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Grow in timeout={700} style={{ transformOrigin: 'top' }}>
                        <Autocomplete
                          value={field?.value || undefined}
                          onChange={(_e, value) => {
                            field?.onChange(value)
                          }}
                          loading={isLoading}
                          options={countryData ?? []}
                          renderOption={(props, option) => (
                            <li {...props} key={option.ID}>
                              {option.Name}
                            </li>
                          )}
                          disableClearable
                          renderInput={params => (
                            <TextField 
                              {...params} 
                              label={'Country'}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  backgroundColor: inputBgColor,
                                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                  '&:focus-within': {
                                    transform: 'scale(1.03)',
                                    boxShadow: isDark 
                                      ? '0 0 0 3px rgba(99,102,241,0.2)'
                                      : '0 0 0 3px rgba(24,120,178,0.2)',
                                  },
                                  '& fieldset': {
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : undefined,
                                    transition: 'border-color 0.3s ease',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: isDark ? '#4a6a8a' : '#1878B2',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: isDark ? '#4a6a8a' : '#1878B2',
                                  },
                                },
                                '& .MuiInputLabel-root': {
                                  color: isDark ? secondaryTextColor : undefined,
                                  transition: 'color 0.3s ease',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: isDark ? '#4a6a8a' : '#1878B2',
                                },
                                '& .MuiInputBase-input': {
                                  color: textColor,
                                },
                              }}
                            />
                          )}
                          getOptionLabel={option => {
                            return option.Name || ''
                          }}
                        />
                      </Grow>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='Address'
                  rules={{ maxLength: { value: 200, message: 'You cannot enter more than 200 characters' } }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Grow in timeout={800} style={{ transformOrigin: 'top' }}>
                        <TextField
                          multiline
                          maxRows={4}
                          minRows={3}
                          {...field}
                          label='Address'
                          inputProps={{ maxLength: 200 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: inputBgColor,
                              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              '&:focus-within': {
                                transform: 'scale(1.03)',
                                boxShadow: isDark 
                                  ? '0 0 0 3px rgba(99,102,241,0.2)'
                                  : '0 0 0 3px rgba(24,120,178,0.2)',
                              },
                              '& fieldset': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : undefined,
                                transition: 'border-color 0.3s ease',
                              },
                              '&:hover fieldset': {
                                borderColor: isDark ? '#4a6a8a' : '#1878B2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: isDark ? '#4a6a8a' : '#1878B2',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: isDark ? secondaryTextColor : undefined,
                              transition: 'color 0.3s ease',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: isDark ? '#4a6a8a' : '#1878B2',
                            },
                            '& .MuiInputBase-input': {
                              color: textColor,
                            },
                          }}
                        />
                      </Grow>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <Divider 
            sx={{ 
              borderColor: dividerColor,
              animation: 'width-expand-divider 1s ease-out',
              '@keyframes width-expand-divider': {
                '0%': { transform: 'scaleX(0) scaleY(0.5)', opacity: 0 },
                '50%': { transform: 'scaleX(0.7) scaleY(1)', opacity: 0.5 },
                '100%': { transform: 'scaleX(1) scaleY(1)', opacity: 1 },
              },
            }} 
          />
          
          <DialogActions sx={{ 
            justifyContent: 'space-between', 
            p: 3,
            gap: 2,
            animation: 'fade-in-up-dialog-actions 0.8s ease-out',
            animationDelay: '0.4s',
            opacity: 0,
            animationFillMode: 'forwards',
            '@keyframes fade-in-up-dialog-actions': {
              '0%': { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
              '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
          }}>
            <Button 
              variant='outlined' 
              onClick={close}
              sx={{
                borderRadius: '12px',
                padding: '10px 28px',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#1878B2',
                color: '#1878B2',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(24,120,178,0.1), transparent)',
                  transition: 'left 0.6s ease',
                },
                '&:hover': {
                  borderColor: '#146394',
                  backgroundColor: 'rgba(24, 120, 178, 0.08)',
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(24,120,178,0.15)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              variant='contained' 
              type='submit' 
              disabled={!isDirty || isSubmitting}
              sx={{
                backgroundColor: '#1878B2',
                color: 'white',
                borderRadius: '12px',
                padding: '10px 36px',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(24, 120, 178, 0.3)',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
                '&:hover:not(:disabled)': {
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
                '&:active:not(:disabled)': {
                  transform: 'translateY(0px) scale(0.95)',
                },
                '&.Mui-disabled': {
                  backgroundColor: isDark ? '#2a2a3a' : '#b0b0b0',
                  color: isDark ? '#6a6a7a' : undefined,
                }
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateProfileDialog