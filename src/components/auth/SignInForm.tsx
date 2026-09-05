import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { saveSession } from "../../utils/auth";
import { loginApi } from "../../api/services/authService";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    backgroundColor: "transparent",
    color: "inherit",
    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.35)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(148, 163, 184, 0.6)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1878b1",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "inherit",
    opacity: 0.6,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1878b1",
    opacity: 1,
  },
  "& .MuiInputBase-input": {
    color: "inherit",
    padding: "10px 14px",
    fontSize: "0.875rem",
  },
  "& .MuiInputBase-input::placeholder": {
    opacity: 0.45,
  },
};

const validationSchema = Yup.object({
  accountID: Yup.string()
    .required("Accountid is required"),
  password: Yup.string().required("Password is required"),
});

type SignInFormValues = {
  accountID: string;
  password: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocation({ latitude: 0, longitude: 0 });
      }
    );
  }, []);
console.log(location);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      accountID: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      const response = await loginApi(values.accountID, values.password);

      toast.success("Login successfully!", {
        duration: 4000,
      });
      saveSession(response.data.token, {
        UserID: response.data.userID,
        Name: "",
        Email: "",
        OrganizationName: "",
        ProfilePicture: "",
      });

      setLoading(false);
      setRedirecting(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      
      toast.error("Invalid Credentials", { duration: 4000 });
      console.error(error);
      setLoading(false);
    }
  };

  const theme = localStorage.getItem("theme");

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <style>{`
        @keyframes signin-fade-up {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes signin-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .signin-animate {
          opacity: 0;
          animation: signin-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .signin-blob {
          animation: signin-blob 12s ease-in-out infinite;
        }

        @keyframes redirect-overlay-in {
          0% { 
            opacity: 0; 
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
          }
          100% { 
            opacity: 1; 
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
        }

        @keyframes redirect-card-in {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.92);
            filter: blur(2px);
          }
          50% {
            transform: translateY(-5px) scale(1.01);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            transform: scale(0.6);
            opacity: 0;
          }
        }

        @keyframes loader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes loader-spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes progress-wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes status-pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes dots-bounce {
          0%, 80%, 100% { 
            transform: translateY(0);
            opacity: 0.3;
          }
          40% { 
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes float-particle {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(24, 120, 177, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(24, 120, 177, 0.4), 0 0 60px rgba(24, 120, 177, 0.1);
          }
        }

        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes progress-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes spin-dot {
          0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
        }

        @keyframes dash-draw {
          0% { stroke-dashoffset: 283; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes shimmer-effect {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .redirect-overlay {
          animation: redirect-overlay-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .redirect-card {
          animation: redirect-card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        .loader-ring {
          animation: loader-spin 2s linear infinite;
        }

        .loader-ring-reverse {
          animation: loader-spin-reverse 3s linear infinite;
        }

        .progress-wave {
          animation: progress-wave 2s ease-in-out infinite;
        }

        .status-pulse {
          animation: status-pulse 1.5s ease-in-out infinite;
        }

        .dot-1 { animation: dots-bounce 1.2s ease-in-out infinite; }
        .dot-2 { animation: dots-bounce 1.2s ease-in-out 0.2s infinite; }
        .dot-3 { animation: dots-bounce 1.2s ease-in-out 0.4s infinite; }

        .glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .text-gradient {
          background: linear-gradient(90deg, #1878b1, #1a8ac9, #1878b1);
          background-size: 200% auto;
          animation: text-gradient 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-glow {
          animation: progress-glow 1.5s ease-in-out infinite;
        }

        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer-effect 2s ease-in-out infinite;
        }

        .bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .float-particle {
          animation: float-particle 3s ease-out forwards;
        }

        .spin-dot {
          animation: spin-dot 4s linear infinite;
        }

        .dash-draw {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: dash-draw 1.5s ease-in-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .signin-animate { opacity: 1; animation: none; }
          .signin-blob { animation: none; }
          .redirect-overlay, .redirect-card { animation: none; opacity: 1; transform: none; filter: none; }
          .pulse-ring { animation: none; }
          .loader-ring, .loader-ring-reverse { animation: none; }
          .progress-wave { animation: none; }
          .status-pulse { animation: none; }
          .dot-1, .dot-2, .dot-3 { animation: none; opacity: 1; transform: translateY(0); }
          .glow-pulse { animation: none; }
          .text-gradient { animation: none; -webkit-text-fill-color: #1878b1; }
          .progress-glow { animation: none; }
          .shimmer-effect { animation: none; }
          .bounce-in { animation: none; opacity: 1; transform: scale(1); }
          .float-particle { animation: none; }
          .spin-dot { animation: none; }
          .dash-draw { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none" />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {redirecting && (
        <div className="redirect-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="redirect-card flex flex-col items-center gap-6 px-12 py-10 bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl dark:bg-gray-900/95 dark:border-gray-700/30 min-w-[380px] relative overflow-hidden">
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#1878b1]/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#1878b1]/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#1878b1]/[0.03] rounded-full blur-2xl"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => {
                const tx = (Math.random() - 0.5) * 100;
                const ty = (Math.random() - 0.5) * 100;
                return (
                  <div
                    key={i}
                    className="float-particle absolute w-1 h-1 rounded-full bg-[#1878b1]"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${10 + Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                      opacity: 0.3,
                      transform: `translate(${tx}px, ${ty}px)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Main loader with multiple rings */}
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Outer pulsing rings */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#1878b1]/10 pulse-ring"></div>
                <div className="absolute inset-0 rounded-full border-[3px] border-[#1878b1]/15 pulse-ring" style={{ animationDelay: "0.6s" }}></div>
                <div className="absolute inset-0 rounded-full border-[3px] border-[#1878b1]/20 pulse-ring" style={{ animationDelay: "1.2s" }}></div>
              </div>
              
              {/* Rotating rings */}
              <svg className="loader-ring absolute inset-0" width="96" height="96" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="rgba(24, 120, 177, 0.05)"
                  strokeWidth="2"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="rgba(24, 120, 177, 0.08)"
                  strokeWidth="2"
                  strokeDasharray="251.2"
                  strokeDashoffset="60"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="rgba(24, 120, 177, 0.15)"
                  strokeWidth="2.5"
                  strokeDasharray="120 131.2"
                  strokeDashoffset="30"
                />
              </svg>

              {/* Reverse rotating ring with gradient */}
              <svg className="loader-ring-reverse absolute inset-0" width="96" height="96" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="30"
                  fill="none"
                  stroke="url(#loaderGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="188.4"
                  strokeDashoffset="188.4"
                  className="dash-draw"
                />
                <defs>
                  <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1878b1" />
                    <stop offset="50%" stopColor="#1a8ac9" />
                    <stop offset="100%" stopColor="#146393" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner rotating dots */}
              <div className="absolute inset-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="spin-dot absolute w-2 h-2 rounded-full bg-[#1878b1]"
                    style={{
                      top: '50%',
                      left: '50%',
                      marginTop: '-4px',
                      marginLeft: '-4px',
                      animationDelay: `${i * 0.5}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>

              {/* Center icon with glow */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1878b1] to-[#146393] rounded-2xl glow-pulse">
                <svg className="w-6 h-6 text-white bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Status text with gradient */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xl font-bold text-gradient">
                Signing You In
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <span>Securely connecting to your Account</span>
                <span className="flex gap-1 ml-1">
                  <span className="dot-1 inline-block w-1.5 h-1.5 rounded-full bg-[#1878b1]"></span>
                  <span className="dot-2 inline-block w-1.5 h-1.5 rounded-full bg-[#1878b1]"></span>
                  <span className="dot-3 inline-block w-1.5 h-1.5 rounded-full bg-[#1878b1]"></span>
                </span>
              </div>
            </div>

            {/* Animated progress bar with glow */}
            <div className="w-full space-y-2">
              <div className="relative w-full h-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1878b1]/5 via-[#1878b1]/20 to-[#1878b1]/5">
                  <div className="progress-wave w-full h-full shimmer-effect"></div>
                </div>
                <div className="relative h-full rounded-full bg-gradient-to-r from-[#1878b1] via-[#1a8ac9] to-[#146393] w-[100%] progress-glow">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer-effect"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <p className="font-medium text-gray-400 dark:text-gray-500">
                  Loading resources
                </p>
                <p className="font-medium text-[#1878b1]">100%</p>
              </div>
            </div>

            {/* Status indicators with icons */}
            <div className="flex items-center gap-8 text-xs">
              <div className="flex items-center gap-2">
                <div className="status-pulse w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-pulse w-2 h-2 rounded-full bg-blue-400" style={{ animationDelay: "0.5s" }}></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Syncing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-pulse w-2 h-2 rounded-full bg-purple-400" style={{ animationDelay: "1s" }}></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Loading</span>
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1878b1]/30 to-transparent"></div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-center flex-1 w-full max-w-xl px-4 mx-auto">
        <div
          className="w-full p-10 transition-shadow duration-300 bg-white border border-gray-100 shadow-xl signin-animate rounded-2xl dark:border-gray-800 dark:bg-gray-900 sm:p-14 hover:shadow-2xl text-gray-800 dark:text-white/90"
          style={{ animationDelay: "0.05s" }}
        >
          <div>
            <div
              className="flex flex-col items-center mb-8 text-center signin-animate"
              style={{ animationDelay: "0.12s" }}
            >
              {theme == 'dark' ? (
                <img
                  src="/images/logo/logo-pp-dark.png"
                  alt="Logo"
                  className="object-contain w-auto h-12 mb-6 sm:h-14"
                />
              ) : (
                <img
                  src="/images/logo/logo-pp.png"
                  alt="Logo"
                  className="object-contain w-auto h-12 mb-6 sm:h-14"
                />
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                A Warm welcome to the new era of the project management application
              </p>
            </div>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div
                  className="signin-animate"
                  style={{ animationDelay: "0.18s" }}
                >
                  <TextField
                    id="accountID"
                    type="string"
                    label="AccountID"
                    placeholder="AccountID"
                    required
                    fullWidth
                    inputProps={{ maxLength: 8 }}
                    size="small"
                    {...register("accountID")}
                    error={Boolean(errors.accountID)}
                    helperText={errors.accountID?.message}
                    sx={textFieldSx}
                  />
                </div>
                <div
                  className="signin-animate"
                  style={{ animationDelay: "0.24s" }}
                >
                  <TextField
                    id="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    sx={textFieldSx}
                    inputProps={{ maxLength: 8 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div
                  className="flex items-center justify-between signin-animate"
                  style={{ animationDelay: "0.3s" }}
                >
                  <FormControlLabel
                    sx={{ mx: 0, alignItems: "center" }}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        sx={{
                          color: "rgba(148, 163, 184, 0.6)",
                          p: "4px 8px 4px 0",
                          "&.Mui-checked": { color: "#1878b1" },
                        }}
                      />
                    }
                    label={
                      <span className="block font-normal text-gray-700 dark:text-gray-300">
                        Keep me logged in
                      </span>
                    }
                  />
                  <Link
                    to="/signup"
                    className="text-sm font-medium transition-colors text-[#1878b1] hover:text-[#146393]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div
                  className="signin-animate"
                  style={{ animationDelay: "0.36s" }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-transform duration-200 rounded-lg bg-[#1878b1] shadow-theme-xs shadow-[#1878b1]/20 hover:bg-[#146393] hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}