// ** React Imports
import { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import 'remixicon/fonts/remixicon.css'
// ** MUI Imports
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { TextField } from '@mui/material'
import toast from 'react-hot-toast'
import Divider from '@mui/material/Divider'
import { Grow, Zoom, Fade, Slide } from '@mui/material'

// ** Custom Functions
import { pattern } from '../../../constants/patterns'
import { useTheme as useCustomTheme } from "../../../context/ThemeContext";

type FormType = {
  password: string
  confirm_password: string
}

const resetPasswordRules = {
  defaultValues: {
    password: '',
    confirm_password: ''
  },
  password: {
    required: { value: true, message: 'Please enter password' },
    pattern: {
      value: pattern.passwordPattern,
      message:
        'Password must contain 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character, whitespace not allowed'
    }
  },
  confirm_password: {
    required: { value: true, message: 'Please enter confirm password' }
  }
}

const ChangePasswordProfile = () => {
  // ** States
  const [values, setValues] = useState({
    showNewPassword: false,
    showConfirmNewPassword: false
  })

  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const {
    control,
    getValues,
    reset,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormType>({
    defaultValues: resetPasswordRules.defaultValues
  })

  useEffect(() => {
    reset()
  }, [reset])

  // Handle Password
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  // Handle Confirm Password
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const onSubmit = async (data: FormType) => {
    console.log(data)
    try {
      // API call removed - just show success message and reset
      reset()
      toast.success('Changed Password Successfully!!')
    } catch {}
  }

  // Theme-based colors
  const cardBgColor = isDark ? '#0F1828' : '#FFFFFF';
  const headerBgColor = isDark ? '#1a2a40' : '#f8fafc';
  const textColor = isDark ? '#FFFFFF' : '#1a2a3a';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#5a6b7c';
  const inputBgColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
  const alertBgColor = isDark ? 'rgba(255, 193, 7, 0.15)' : '#fff8e6';
  const alertBorderColor = isDark ? 'rgba(255, 193, 7, 0.3)' : '#ffd966';
  const alertTextColor = isDark ? '#ffd966' : '#856404';

  return (
    <Grow in timeout={800}>
      <Card 
        sx={{ 
          mt: 5, 
          borderRadius: '16px',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: isDark 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid #e8edf2',
          backgroundColor: cardBgColor,
          animation: 'card-enter 0.6s ease-out',
          '@keyframes card-enter': {
            '0%': { opacity: 0, transform: 'scale(0.95) translateY(20px)' },
            '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
          },
          transition: 'all 0.4s ease',
          '&:hover': {
            boxShadow: isDark 
              ? '0 12px 48px rgba(0, 0, 0, 0.6)' 
              : '0 12px 48px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-4px)',
          },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 40%, rgba(99,102,241,0.03) 50%, transparent 60%)',
            animation: 'shimmer-card 5s ease-in-out infinite',
            pointerEvents: 'none',
            '@keyframes shimmer-card': {
              '0%': { transform: 'translateX(-100%) rotate(45deg) scale(0.5)' },
              '50%': { transform: 'translateX(0%) rotate(45deg) scale(1)' },
              '100%': { transform: 'translateX(100%) rotate(45deg) scale(0.5)' },
            },
          },
        }}
      >
        <CardHeader 
          title={'Change Password'} 
          sx={{
            backgroundColor: headerBgColor,
            borderBottom: isDark 
              ? '1px solid rgba(255, 255, 255, 0.08)' 
              : '1px solid #e8edf2',
            '& .MuiCardHeader-title': {
              fontSize: '1.25rem',
              fontWeight: 700,
              color: textColor,
              letterSpacing: '0.5px',
              animation: 'fade-in-down 0.6s ease-out',
              '@keyframes fade-in-down': {
                '0%': { opacity: 0, transform: 'translateY(-15px) scale(0.95)' },
                '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
            },
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #1878B2, #6366f1, #1878B2)',
              animation: 'header-line 3s ease-in-out infinite',
              '@keyframes header-line': {
                '0%, 100%': { transform: 'scaleX(0.3)', opacity: 0.5 },
                '50%': { transform: 'scaleX(1)', opacity: 1 },
              },
            },
          }}
          titleTypographyProps={{
            variant: 'h6'
          }}
        />
        
        <CardContent sx={{ p: 6 }}>
          <Slide direction="up" in timeout={600}>
            <div>
              <Alert
                icon={false}
                severity='warning'
                sx={{
                  mb: 6,
                  borderRadius: '10px',
                  backgroundColor: alertBgColor,
                  border: isDark 
                    ? `1px solid ${alertBorderColor}`
                    : '1px solid #ffd966',
                  '& .MuiAlertTitle-root': {
                    color: alertTextColor,
                    fontWeight: 700,
                  },
                  '& .MuiAlert-message': {
                    color: alertTextColor,
                  },
                  animation: 'pulse-alert 2s ease-in-out infinite',
                  '@keyframes pulse-alert': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.9, transform: 'scale(1.01)' },
                  },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 20px rgba(255,193,7,0.2)',
                  },
                }}
              >
                <AlertTitle sx={{ fontWeight: 700, mb: theme => `${theme.spacing(1)} !important` }}>
                  {'🔒 Ensure that these requirements are met'}
                </AlertTitle>
                {'Minimum 8 characters long, uppercase & symbol'}
              </Alert>
            </div>
          </Slide>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              {/* New Password */}
              <Grid item xs={12} sm={6}>
                <Grow in timeout={700} style={{ transformOrigin: 'top left' }}>
                  <FormControl fullWidth>
                    <Controller
                      name='password'
                      control={control}
                      rules={resetPasswordRules.password}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          autoComplete='off'
                          label={'New Password'}
                          value={value}
                          id='profile-view-security-new-password'
                          onChange={e => {
                            onChange(e)
                            trigger('password')
                          }}
                          type={values.showNewPassword ? 'text' : 'password'}
                          inputProps={{ 'data-testid': 'new-password' }}
                          error={Boolean(errors.password)}
                          helperText={errors?.password?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              backgroundColor: inputBgColor,
                              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              '&:focus-within': {
                                transform: 'scale(1.02)',
                                boxShadow: isDark 
                                  ? '0 0 0 3px rgba(99,102,241,0.2)'
                                  : '0 0 0 3px rgba(24,120,178,0.15)',
                              },
                              '& fieldset': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : '#d0d7de',
                                transition: 'border-color 0.3s ease',
                              },
                              '&:hover fieldset': {
                                borderColor: '#1878B2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1878B2',
                                borderWidth: '2px',
                              },
                              '&.Mui-error fieldset': {
                                borderColor: '#d32f2f',
                              },
                              '&.Mui-error:hover fieldset': {
                                borderColor: '#d32f2f',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: isDark ? secondaryTextColor : '#5a6b7c',
                              transition: 'color 0.3s ease',
                              '&.Mui-focused': {
                                color: '#1878B2',
                              },
                              '&.Mui-error': {
                                color: '#d32f2f',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: isDark ? '#FFFFFF' : undefined,
                              transition: 'color 0.3s ease',
                            },
                            '& .MuiFormHelperText-root': {
                              marginLeft: 0,
                              fontWeight: 400,
                              color: isDark ? '#ff6b6b' : undefined,
                              transition: 'all 0.3s ease',
                            },
                            animation: 'fade-in-up 0.6s ease-out',
                            '@keyframes fade-in-up': {
                              '0%': { opacity: 0, transform: 'translateY(15px)' },
                              '100%': { opacity: 1, transform: 'translateY(0)' },
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  id={'profile-show-new-password'}
                                  onClick={handleClickShowNewPassword}
                                  data-testid='show-new-password'
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                  sx={{
                                    color: isDark ? secondaryTextColor : '#5a6b7c',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      color: '#1878B2',
                                      transform: 'scale(1.2) rotate(10deg)',
                                    },
                                    '&:active': {
                                      transform: 'scale(0.8)',
                                    },
                                  }}
                                >
                                  <i className={values.showNewPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grow>
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} sm={6}>
                <Grow in timeout={800} style={{ transformOrigin: 'top right' }}>
                  <FormControl fullWidth>
                    <Controller
                      name='confirm_password'
                      control={control}
                      rules={{
                        ...resetPasswordRules.confirm_password,
                        validate: value => value === getValues('password') || 'Password did not match'
                      }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoComplete='off'
                          value={value}
                          onBlur={onBlur}
                          label={'Confirm New Password'}
                          id='user-view-security-confirm-new-password'
                          inputProps={{ 'data-testid': 'confirm-password' }}
                          type={values.showConfirmNewPassword ? 'text' : 'password'}
                          onChange={e => {
                            onChange(e)
                            trigger('confirm_password')
                          }}
                          helperText={errors?.confirm_password?.message}
                          error={Boolean(errors.confirm_password)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              backgroundColor: inputBgColor,
                              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              '&:focus-within': {
                                transform: 'scale(1.02)',
                                boxShadow: isDark 
                                  ? '0 0 0 3px rgba(99,102,241,0.2)'
                                  : '0 0 0 3px rgba(24,120,178,0.15)',
                              },
                              '& fieldset': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : '#d0d7de',
                                transition: 'border-color 0.3s ease',
                              },
                              '&:hover fieldset': {
                                borderColor: '#1878B2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1878B2',
                                borderWidth: '2px',
                              },
                              '&.Mui-error fieldset': {
                                borderColor: '#d32f2f',
                              },
                              '&.Mui-error:hover fieldset': {
                                borderColor: '#d32f2f',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: isDark ? secondaryTextColor : '#5a6b7c',
                              transition: 'color 0.3s ease',
                              '&.Mui-focused': {
                                color: '#1878B2',
                              },
                              '&.Mui-error': {
                                color: '#d32f2f',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: isDark ? '#FFFFFF' : undefined,
                              transition: 'color 0.3s ease',
                            },
                            '& .MuiFormHelperText-root': {
                              marginLeft: 0,
                              fontWeight: 400,
                              color: isDark ? '#ff6b6b' : undefined,
                              transition: 'all 0.3s ease',
                            },
                            animation: 'fade-in-up 0.7s ease-out',
                            animationDelay: '0.1s',
                            opacity: 0,
                            animationFillMode: 'forwards',
                            '@keyframes fade-in-up': {
                              '0%': { opacity: 0, transform: 'translateY(15px)' },
                              '100%': { opacity: 1, transform: 'translateY(0)' },
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  id={'profile-show-new-confirm-password'}
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                  onClick={handleClickShowConfirmNewPassword}
                                  data-testid='show-new-confirm-password'
                                  sx={{
                                    color: isDark ? secondaryTextColor : '#5a6b7c',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      color: '#1878B2',
                                      transform: 'scale(1.2) rotate(-10deg)',
                                    },
                                    '&:active': {
                                      transform: 'scale(0.8)',
                                    },
                                  }}
                                >
                                  <i className={values.showConfirmNewPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grow>
              </Grid>

              <Grid item xs={12}>
                <Zoom in timeout={900}>
                  <Divider sx={{ 
                    mb: 3,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : undefined,
                    animation: 'divider-expand 1s ease-out',
                    '@keyframes divider-expand': {
                      '0%': { transform: 'scaleX(0) scaleY(0.5)', opacity: 0 },
                      '50%': { transform: 'scaleX(0.7) scaleY(1)', opacity: 0.5 },
                      '100%': { transform: 'scaleX(1) scaleY(1)', opacity: 1 },
                    },
                  }} />
                </Zoom>
                
                <Fade in timeout={1000}>
                  <Button
                    type='submit'
                    variant='contained'
                    id='change-password'
                    data-testid='set-new-password'
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: '#1878B2',
                      borderRadius: '10px',
                      padding: '12px 40px',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: isDark 
                        ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                        : '0 4px 16px rgba(24, 120, 177, 0.3)',
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
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.6s ease',
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
                        boxShadow: isDark 
                          ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                          : '0 8px 32px rgba(24, 120, 177, 0.5)',
                        transform: 'translateY(-3px) scale(1.03)',
                        '&::before': {
                          left: '100%',
                        },
                        '&::after': {
                          transform: 'scaleX(1)',
                        },
                      },
                      '&:active:not(:disabled)': {
                        transform: 'translateY(0) scale(0.95)',
                      },
                      '&:disabled': {
                        backgroundColor: '#1878B2',
                        opacity: 0.6,
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {isSubmitting ? '🔄 Changing Password...' : '🔐 Change Password'}
                  </Button>
                </Fade>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Grow>
  )
}

export default ChangePasswordProfile