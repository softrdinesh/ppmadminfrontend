import React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material';
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

interface FallbackSpinnerProps {
  sx?: SxProps<Theme>;
  height?: string;
  logoLight?: string;
  logoDark?: string;
  mode?: 'light' | 'dark' | 'system';
}

const FallbackSpinner: React.FC<FallbackSpinnerProps> = ({ 
  sx, 
  height,
  logoLight = '/images/logo/logo-pp.png',
  logoDark = '/images/logo/logo-pp-dark.png',
  mode = 'light'
}) => {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  // Get theme mode from localStorage if not provided
  const getThemeMode = (): 'light' | 'dark' | 'system' => {
    const storedMode = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    return storedMode || mode;
  };

  const [currentMode, setCurrentMode] = React.useState<'light' | 'dark' | 'system'>(getThemeMode);

  React.useEffect(() => {
    const handleStorageChange = () => {
      setCurrentMode(getThemeMode());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Determine which logo to use - prioritize currentMode, fallback to isDark
  const getLogoSrc = () => {
    // If system mode, use isDark from context
    if (currentMode == 'system') {
      return isDark ? logoDark : logoLight;
    }
    // Otherwise use currentMode
    return currentMode === 'dark' ? logoDark : logoLight;
  };
console.log(currentMode,'currentMode');
  const logoSrc = getLogoSrc();

  // Dynamic colors based on theme
  const spinnerColor = isDark ? '#6ab0e6' : '#5a95d3';
  const backgroundColor = isDark ? '#1a1a2e' : '#ffffff';

  return (
    <Box
      sx={{
        width: '100%',
        height: height ?? '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        ...sx
      }}
    >
      <img
        key={logoSrc} // Force re-render when src changes
        src={logoSrc}
        alt="Loading..."
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '12rem',
          animation: 'bounce 1s ease-in-out infinite'
        }}
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      
      {/* Spinner 1: Pulsating Dots */}
      <div className="ringContainer">
        <div className="circle" style={{ backgroundColor: spinnerColor }}></div>
        <div className="circle" style={{ backgroundColor: spinnerColor }}></div>
        <div className="circle" style={{ backgroundColor: spinnerColor }}></div>
      </div>

    

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          /* Spinner 1: Pulsating Dots */
          .ringContainer {
            margin-top: 20px;
            display: flex;
            gap: 10px;
          }

          .circle {
            width: 15px;
            aspect-ratio: 1;
            border-radius: 50%;
            animation: pulsate 1.4s linear infinite;
            opacity: 0;
          }

          .circle:nth-child(2) {
            animation-delay: 0.3s;
          }

          .circle:last-child {
            animation-delay: 0.6s;
          }

          @keyframes pulsate {
            0% {
              transform: scale(0.1);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: scale(1.2);
              opacity: 0;
            }
          }

          /* Spinner 2: Rotating Ring */
          .spinner-ring {
            margin-top: 20px;
            width: 40px;
            height: 40px;
            border: 4px solid;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Spinner 3: Double Bounce */
          .double-bounce {
            margin-top: 20px;
            width: 40px;
            height: 40px;
            position: relative;
          }

          .bounce-dot {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            opacity: 0.6;
            position: absolute;
            top: 0;
            left: 0;
            animation: doubleBounce 2s ease-in-out infinite;
          }

          .bounce2 {
            animation-delay: -1s;
          }

          @keyframes doubleBounce {
            0%, 100% { transform: scale(0); }
            50% { transform: scale(1); }
          }

          /* Spinner 4: Wave Bars */
          .wave-bars {
            margin-top: 20px;
            display: flex;
            gap: 4px;
            align-items: center;
            height: 30px;
          }

          .bar {
            width: 6px;
            height: 100%;
            border-radius: 3px;
            animation: wave 1.2s ease-in-out infinite;
          }

          .bar:nth-child(2) {
            animation-delay: -1.1s;
          }
          .bar:nth-child(3) {
            animation-delay: -1.0s;
          }
          .bar:nth-child(4) {
            animation-delay: -0.9s;
          }
          .bar:nth-child(5) {
            animation-delay: -0.8s;
          }

          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); }
            20% { transform: scaleY(1); }
          }

          /* Spinner 5: Pulse Ring */
          .pulse-ring {
            margin-top: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            animation: pulseRing 1.2s ease-out infinite;
          }

          @keyframes pulseRing {
            0% {
              transform: scale(0.8);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.2;
            }
            100% {
              transform: scale(0.8);
              opacity: 0.7;
            }
          }

          /* Spinner 6: Dots Wave */
          .dots-wave {
            margin-top: 20px;
            display: flex;
            gap: 6px;
            align-items: center;
          }

          .dot-wave {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: dotsWave 1.5s ease-in-out infinite;
          }

          .dot-wave:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot-wave:nth-child(3) {
            animation-delay: 0.4s;
          }
          .dot-wave:nth-child(4) {
            animation-delay: 0.6s;
          }
          .dot-wave:nth-child(5) {
            animation-delay: 0.8s;
          }

          @keyframes dotsWave {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-15px);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default FallbackSpinner;