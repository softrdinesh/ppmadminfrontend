import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
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
  //  .. .email("Enter a valid email address")
    .required("Email is required"),
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
  const apiUrl = import.meta.env.VITE_API_URL;


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
        setLocation({ latitude: 0, longitude: 0 },);
      }
    );
  }, [location]);

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
      const response = await axios.post(
        `${apiUrl}/Account/Login`,
        {
          accountID: values.accountID,
          password: values.password,
         // latitude: location.latitude,
         // longitude: location.longitude,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Login successful!", {
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
      // const message =
      //   error?.response?.data?.message || "Invalid email or password";
      toast.error("invalid credentials", { duration: 4000 });
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

        /* Professional Redirect Loader Animations */
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

        @keyframes redirect-ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes redirect-ring-dash {
          0% {
            stroke-dashoffset: 150;
            transform: rotate(0deg);
          }
          50% {
            stroke-dashoffset: 35;
            transform: rotate(180deg);
          }
          100% {
            stroke-dashoffset: 150;
            transform: rotate(360deg);
          }
        }

        @keyframes redirect-bar-fill {
          0% { 
            width: 0%; 
            opacity: 0.7;
          }
          100% { 
            width: 100%; 
            opacity: 1;
          }
        }

        @keyframes redirect-dot-pulse {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(0.6);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }

        @keyframes redirect-text-slide {
          0% { 
            opacity: 0; 
            transform: translateY(10px) scale(0.95);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }

        @keyframes redirect-icon-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes redirect-sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes redirect-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .redirect-overlay {
          animation: redirect-overlay-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .redirect-card {
          animation: redirect-card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .redirect-ring {
          animation: redirect-ring-spin 2s linear infinite;
        }

        .redirect-ring-dash {
          animation: redirect-ring-dash 1.5s ease-in-out infinite;
        }

        .redirect-bar-fill {
          animation: redirect-bar-fill 1.5s ease-in-out forwards;
        }

        .redirect-dot {
          animation: redirect-dot-pulse 1.2s ease-in-out infinite;
        }

        .redirect-text {
          animation: redirect-text-slide 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .redirect-icon {
          animation: redirect-icon-bounce 2s ease-in-out infinite;
        }

        .redirect-sparkle-1 {
          animation: redirect-sparkle 3s ease-in-out infinite 0.2s;
        }
        .redirect-sparkle-2 {
          animation: redirect-sparkle 3s ease-in-out infinite 0.8s;
        }
        .redirect-sparkle-3 {
          animation: redirect-sparkle 3s ease-in-out infinite 1.4s;
        }

        .redirect-shimmer {
          background: linear-gradient(
            90deg,
            rgba(24, 120, 177, 0) 0%,
            rgba(24, 120, 177, 0.15) 50%,
            rgba(24, 120, 177, 0) 100%
          );
          background-size: 200% 100%;
          animation: redirect-shimmer 2s ease-in-out infinite;
        }

        /* Loading dots animation */
        .loading-dots::after {
          content: '';
          animation: loading-dots 1.5s steps(4, end) infinite;
        }

        @keyframes loading-dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
          100% { content: ''; }
        }

        @media (prefers-reduced-motion: reduce) {
          .signin-animate { opacity: 1; animation: none; }
          .signin-blob { animation: none; }
          .redirect-overlay, .redirect-card { animation: none; opacity: 1; transform: none; filter: none; }
          .redirect-ring { animation: none; }
          .redirect-ring-dash { animation: none; stroke-dashoffset: 35; }
          .redirect-bar-fill { animation: none; width: 100%; }
          .redirect-dot { animation: none; opacity: 1; transform: scale(1); }
          .redirect-text { animation: none; opacity: 1; }
          .redirect-icon { animation: none; }
          .redirect-sparkle-1, .redirect-sparkle-2, .redirect-sparkle-3 { animation: none; opacity: 0; }
          .redirect-shimmer { animation: none; background: none; }
        }
      `}</style>

      {/* Ambient background accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none" />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* Professional Redirect Loader */}
      {redirecting && (
        <div className="redirect-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="redirect-card flex flex-col items-center gap-5 px-10 py-9 bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl dark:bg-gray-900/95 dark:border-gray-700/30 min-w-[320px] relative overflow-hidden">
            {/* Shimmer effect background */}
            <div className="redirect-shimmer absolute inset-0 pointer-events-none" />
            
            {/* Sparkle decorations */}
            <div className="absolute top-3 right-3 redirect-sparkle-1 text-[#1878b1] text-opacity-30 text-lg">✦</div>
            <div className="absolute bottom-3 left-3 redirect-sparkle-2 text-[#1878b1] text-opacity-30 text-lg">✦</div>
            <div className="absolute top-1/2 -left-2 redirect-sparkle-3 text-[#1878b1] text-opacity-20 text-lg">✦</div>

            <div className="relative flex items-center justify-center size-16 redirect-icon">
              {/* Animated ring with multiple layers */}
              <svg className="redirect-ring absolute inset-0" width="64" height="64" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(24, 120, 177, 0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(24, 120, 177, 0.15)"
                  strokeWidth="3"
                  strokeDasharray="175.93"
                  strokeDashoffset="0"
                />
                <circle
                  className="redirect-ring-dash"
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#1878b1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="175.93"
                  strokeDashoffset="150"
                />
              </svg>
              
              {/* Inner icon */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-[#1878b1] rounded-lg shadow-lg shadow-[#1878b1]/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="redirect-text flex flex-col items-center gap-1.5 text-center">
              <p className="text-base font-semibold text-gray-800 dark:text-white">
                Signing you in
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Preparing your workspace
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="redirect-dot size-2.5 rounded-full bg-[#1878b1]" style={{ animationDelay: "0s" }} />
              <span className="redirect-dot size-2.5 rounded-full bg-[#1878b1]" style={{ animationDelay: "0.15s" }} />
              <span className="redirect-dot size-2.5 rounded-full bg-[#1878b1]" style={{ animationDelay: "0.3s" }} />
            </div>

            <div className="w-full h-1.5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700 relative">
              <div className="redirect-bar-fill h-full rounded-full bg-gradient-to-r from-[#1878b1] via-[#1a8ac9] to-[#146393] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer" />
              </div>
            </div>

            {/* Loading status text with better visibility */}
            <div className="redirect-text text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <span>Loading</span>
              <span className="text-[#1878b1] font-bold">
                <span className="loading-dots inline-block w-4"></span>
              </span>
            </div>
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
                    label="accountID"
                    placeholder="info@gmail.com"
                    required
                    fullWidth
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