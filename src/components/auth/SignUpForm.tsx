import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  Autocomplete,
  FormControlLabel,
  FormControl,
  FormHelperText,

  InputAdornment,
  IconButton,

} from "@mui/material";
import { EyeCloseIcon, EyeIcon } from "../../icons";

// Shared professional styling for every MUI TextField in this form.
// Uses currentColor / inherit so it follows Tailwind's dark: text color
// on the wrapping element instead of MUI's palette.mode.
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    backgroundColor: "transparent",
    color: "inherit",
    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.35)", // slate-400/35
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

// TEMP placeholder — replace with your real country source (API/context).
// Shape matches your Autocomplete renderOption (ID, Name, Code).
interface Country {
  ID: string | number;
  Name: string;
  Code: string;
}

const countryList: Country[] = [
  { ID: 1, Name: "India", Code: "IN" },
  { ID: 2, Name: "United States", Code: "US" },
  { ID: 3, Name: "United Kingdom", Code: "GB" },
  { ID: 4, Name: "Australia", Code: "AU" },
  { ID: 5, Name: "Germany", Code: "DE" },
];

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  orgName: string;
  orgSize: string;
}

interface SignUpFormErrors {
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
  orgName?: string;
  orgSize?: string;
  country?: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Form control state — tracks field values and validation errors
  // without touching any of the existing UI logic above.
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgSize: "",
  });
  const [country, setCountry] = useState<Country | null>(null);
  const [errors, setErrors] = useState<SignUpFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignUpFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryChange = (_: unknown, newValue: Country | null) => {
    setCountry(newValue);
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const validate = () => {
    const newErrors: SignUpFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!country) {
      newErrors.country = "Please select a country";
    }
    if (!formData.orgName.trim()) {
      newErrors.orgName = "Organization name is required";
    }
    if (!formData.orgSize) {
      newErrors.orgSize = "Please select organization size";
    }
    if (!isChecked) {
      newErrors.terms = "You must accept the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    // Validation passed — hook up your submit/signup call here.
  };

  return (
    <div className="relative flex flex-col flex-1 w-full overflow-x-hidden overflow-y-auto lg:w-1/2 no-scrollbar bg-gray-50 dark:bg-gray-950">
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
        @media (prefers-reduced-motion: reduce) {
          .signin-animate { opacity: 1; animation: none; }
          .signin-blob { animation: none; }
        }
      `}</style>

      {/* Ambient background accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none" />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative z-10 flex flex-col justify-center flex-1 w-full max-w-2xl px-4 py-10 mx-auto">
        <div
          className="w-full p-12 transition-shadow duration-300 bg-white border border-gray-100 shadow-xl signin-animate rounded-2xl dark:border-gray-800 dark:bg-gray-900 sm:p-16 hover:shadow-2xl text-gray-800 dark:text-white/90"
          style={{ animationDelay: "0.05s" }}
        >
          <div>
            <div
              className="flex flex-col items-center mb-8 text-center signin-animate"
              style={{ animationDelay: "0.12s" }}
            >
              <img
                src="/images/logo/logo-pp.png"
                alt="Logo"
                className="object-contain w-auto h-12 mb-6 sm:h-14"
              />
            </div>

            <div>
              <p className="text-lg font-semibold text-center text-gray-800 dark:text-white/90 sm:text-xl">
A Warm welcome
              </p>
              <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
to the new era of the project management application

              </p>
            </div>
            <Box component="form" noValidate onSubmit={handleSubmit}>
              {/* Name */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.24s" }}
                sx={{ mt: 3 }}
              >
                <FormControl fullWidth error={Boolean(errors.name)}>
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Enter your full name"
                    required
                    fullWidth
                    size="small"
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    sx={textFieldSx}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.name}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Email */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.3s" }}
                sx={{ mt: 2.5 }}
              >
                <FormControl fullWidth error={Boolean(errors.email)}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    required
                    fullWidth
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                    error={Boolean(errors.email)}
                    sx={textFieldSx}
                  />
                  {errors.email && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.email}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Password */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.36s" }}
                sx={{ mt: 2.5 }}
              >
                <FormControl fullWidth error={Boolean(errors.password)}>
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={Boolean(errors.password)}
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
                  {errors.password && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Country */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.4s" }}
                sx={{ mt: 2.5 }}
              >
                <FormControl fullWidth error={Boolean(errors.country)}>
                  <Autocomplete
                    size="small"
                    value={country}
                    onChange={handleCountryChange}
                    options={countryList}
                    isOptionEqualToValue={(row, value) => row.ID === value?.ID}
                    getOptionLabel={(row) => row.Name || ""}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.ID}>
                        <img
                          key={option.Code}
                          className="mie-4 flex-shrink-0"
                          alt=""
                          width="20"
                          loading="lazy"
                          src={`https://flagcdn.com/w20/${option.Code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.Code.toLowerCase()}.png 2x`}
                          style={{ marginRight: 8 }}
                        />
                        {option.Name} ({option.Code})
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        required
                        error={Boolean(errors.country)}
                        sx={textFieldSx}
                      />
                    )}
                  />
                  {errors.country && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.country}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Organization Name */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.44s" }}
                sx={{ mt: 2.5 }}
              >
                <FormControl fullWidth error={Boolean(errors.orgName)}>
                  <TextField
                    id="orgName"
                    name="orgName"
                    label="Organization Name"
                    placeholder="Enter your organization name"
                    required
                    fullWidth
                    size="small"
                    value={formData.orgName}
                    onChange={handleChange}
                    error={Boolean(errors.orgName)}
                    sx={textFieldSx}
                  />
                  {errors.orgName && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.orgName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Organization Size */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.48s" }}
                sx={{ mt: 2.5 }}
              >
                <FormControl fullWidth error={Boolean(errors.orgSize)}>
                  <TextField
                    id="orgSize"
                    name="orgSize"
                    select
                    label="Organization Size"
                    required
                    fullWidth
                    size="small"
                    value={formData.orgSize}
                    onChange={handleChange}
                    error={Boolean(errors.orgSize)}
                    sx={textFieldSx}
                  >
                    <MenuItem value="1-10">1-10</MenuItem>
                    <MenuItem value="11-25">11-25</MenuItem>
                    <MenuItem value="25+">25+</MenuItem>
                  </TextField>
                  {errors.orgSize && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.orgSize}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Checkbox */}
              <Box
                className="signin-animate"
                style={{ animationDelay: "0.52s" }}
                sx={{ mt: 2.5 }}
              >
                <FormControl error={Boolean(errors.terms)}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      sx={{ mx: 0, alignItems: "center" }}
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            setIsChecked(e.target.checked);
                            if (errors.terms) {
                              setErrors((prev) => ({ ...prev, terms: "" }));
                            }
                          }}
                          sx={{
                            color: "rgba(148, 163, 184, 0.6)",
                            p: "4px 8px 4px 0",
                            "&.Mui-checked": { color: "#1878b1" },
                          }}
                        />
                      }
                      label={
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          I agree to privacy policy & terms{" "}
                        </p>
                      }
                    />
                  </Box>
                  {errors.terms && (
                    <FormHelperText sx={{ ml: "2px" }}>
                      {errors.terms}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Button */}
              <div
                className="signin-animate"
                style={{ animationDelay: "0.56s" }}
              >
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 mt-6 text-sm font-medium text-white transition-transform duration-200 rounded-lg bg-[#1878b1] shadow-theme-xs shadow-[#1878b1]/20 hover:bg-[#146393] hover:scale-[1.02] active:scale-[0.99]"
                >
                  Sign Up
                </button>
              </div>
            </Box>

            <div
              className="mt-6 signin-animate"
              style={{ animationDelay: "0.6s" }}
            >
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  to="/Login"
                  className="font-medium transition-colors text-[#1878b1] hover:text-[#146393]"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}