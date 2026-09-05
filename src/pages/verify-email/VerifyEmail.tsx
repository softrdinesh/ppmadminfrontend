// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles' // Import useTheme from MUI

// ** Third Party Imports
import OtpInput from 'react-otp-input'

// ** Styles and Styled Components Imports
import { CardContent, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { maxWidth: '35rem' }
}))

const INIT_MINUTE = 0
const INIT_SECONDS = 10

// Hardcoded values for demo
const OBFUSCATED_EMAIL = 'j***@example.com'
const EMAIL = 'john@example.com'

const VerifyEmail = () => {
  // ** Hooks
  const muiTheme = useTheme(); // Get MUI theme
  const smBreakpoint = useMediaQuery(muiTheme.breakpoints.down('sm')) // Pass theme explicitly
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // ** States
  const [otp, setOtp] = useState('')
  const [otpValid, setOtpValid] = useState(false)
  const [minutes, setMinutes] = useState(INIT_MINUTE)
  const [seconds, setSeconds] = useState(INIT_SECONDS)
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // ** Theme-based colors
  const backgroundColor = isDark ? '#0F1828' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#666666';
  const inputBgColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
  const inputBorderColor = isDark ? 'rgba(255, 255, 255, 0.23)' : '#ccc';
  const inputFocusBorderColor = '#1878B2';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)';
  const cardShadow = isDark 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
    : '0 8px 32px rgba(0, 0, 0, 0.08)';
  const timerColor = isDark ? '#4a6a8a' : '#1878B2';

  // ** Timer logic
  useEffect(() => {
    // Only start timer if minutes and seconds are not both 0
    if (minutes === 0 && seconds === 0) {
      return; // Don't start interval when timer is at 0
    }

    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 0) {
          setMinutes(prevMinutes => {
            if (prevMinutes === 0) {
              clearInterval(interval);
              return 0;
            }
            return prevMinutes - 1;
          });
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]); // Add dependencies to re-run when minutes/seconds change

  // ** otp change function
  const handleOTPChange = (otpValue: string) => {
    setOtp(otpValue)
    setOtpValid(otpValue?.length === 6)
  }

  // ** reset otp change function
  const handleResendOtp = async () => {
    // Check if timer is at 0 (resend allowed)
    if (minutes !== 0 || seconds !== 0) {
      toast.error('Please wait for the timer to expire before resending');
      return;
    }

    setIsResending(true)
    setOtp('')
    setOtpValid(false)

    // Simulate API call
    console.log('Resending OTP to:', EMAIL)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Reset timer to initial values
    setMinutes(INIT_MINUTE)
    setSeconds(INIT_SECONDS)
    setIsResending(false)
    
    // Show success message
    toast.success('OTP resent successfully!')
  }

  // ** check otp function
  const handleVerifyOtp = async () => {
    if (!otpValid || isVerifying) return;

    setIsVerifying(true)
    
    try {
      // Simulate API verification
      console.log('Verifying OTP:', otp, 'for email:', EMAIL)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo: accept any 6-digit code
      if (otp.length === 6) {
        toast.success('OTP Verified Successfully!')
        // Redirect to login page after successful verification
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setOtp('')
        setOtpValid(false)
        toast.error('Invalid OTP. Please try again.')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Box 
      height={'100dvh'} 
      display={'flex'} 
      alignItems={'center'} 
      justifyContent={'center'}
      sx={{
        backgroundColor: isDark ? '#0a0f1a' : '#f5f7fa',
      }}
    >
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: cardShadow,
          backgroundColor: backgroundColor,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border: isDark 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box>
            <Typography 
              variant='h5' 
              sx={{ 
                color: textColor,
                fontWeight: 600,
                mb: 1,
                letterSpacing: '0.3px',
              }}
            >
              Verify your email ✉️
            </Typography>
            <Typography 
              sx={{ 
                color: secondaryTextColor,
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              We sent a verification code to your register email. Enter the code from the mail in the field below.
            </Typography>
            <Typography 
              fontWeight={700} 
              mt={2}
              sx={{ 
                color: textColor,
                fontSize: '1rem',
                letterSpacing: '0.5px',
              }}
            >
              {OBFUSCATED_EMAIL}
            </Typography>
          </Box>
          
          <Divider sx={{ 
            my: 3,
            borderColor: dividerColor,
          }} />
          
          {/* OTP Input */}
          <Box display='flex' justifyContent='center' my={4}>
            <OtpInput
              value={otp}
              inputStyle={{
                width: smBreakpoint ? '2.5rem' : '3rem',
                height: smBreakpoint ? '2.5rem' : '3rem',
                margin: '0 0.5rem',
                fontSize: '1.25rem',
                borderRadius: '12px',
                border: `2px solid ${inputBorderColor}`,
                backgroundColor: inputBgColor,
                color: textColor,
                textAlign: 'center',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onChange={handleOTPChange}
              numInputs={6}
              renderInput={(props, index) => (
                <input 
                  {...props} 
                  data-testid={'otpInput' + index}
                  autoFocus={index === 0}
                  onFocus={(e) => {
                    e.target.style.borderColor = inputFocusBorderColor;
                    e.target.style.boxShadow = `0 0 0 3px rgba(24, 120, 178, 0.15)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = inputBorderColor;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              )}
            />
          </Box>
          
          <Divider sx={{ 
            borderColor: dividerColor,
          }} />

          {/* Timer */}
          <Typography 
            sx={{ 
              textAlign: 'center', 
              fontWeight: 600, 
              mt: 2,
              color: timerColor,
              fontSize: '1.1rem',
              letterSpacing: '1px',
            }}
          >
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Typography>

          {/* Resend Section */}
          <Box display='flex' justifyContent='center' alignItems='center' gap={1} mt={2}>
            <Typography 
              sx={{ 
                color: secondaryTextColor,
                fontSize: '0.95rem',
              }}
            >
              Didn't get the mail?
            </Typography>
            <Button
              onClick={handleResendOtp}
              disabled={!(minutes === 0 && seconds === 0) || isResending}
              data-testid='resend-button'
              sx={{
                color: '#1878B2',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                padding: '4px 12px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: isDark 
                    ? 'rgba(24, 120, 178, 0.15)'
                    : 'rgba(24, 120, 178, 0.08)',
                },
                '&:disabled': {
                  color: isDark ? '#4a4a5a' : '#b0b0b0',
                }
              }}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </Button>
          </Box>

          {/* Verify Button */}
          <Box mt={3}>
            <Button
              fullWidth
              variant='contained'
              onClick={handleVerifyOtp}
              disabled={!otpValid || isVerifying || isResending}
              sx={{
                backgroundColor: '#1878B2',
                color: 'white',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: isDark 
                  ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(24, 120, 178, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#146394',
                  boxShadow: isDark 
                    ? '0 6px 24px rgba(0, 0, 0, 0.4)'
                    : '0 6px 24px rgba(24, 120, 178, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                '&:disabled': {
                  backgroundColor: isDark ? '#2a2a3a' : '#b0b0b0',
                  color: isDark ? '#6a6a7a' : undefined,
                  boxShadow: 'none',
                }
              }}
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default VerifyEmail