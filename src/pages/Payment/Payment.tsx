"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grow,
  Fade,
  Zoom,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Tooltip,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import toast from "react-hot-toast";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { Getpaymenthistoryapi } from "../../api/services/paymentService";
import MyEditor from '../Htmleditor/MyEditor';
import imageCompression from "browser-image-compression";
import axios from "axios";

// ---------------------------------------------------------------------------
// API response types — exactly what the endpoint returns
// ---------------------------------------------------------------------------

interface ApiUserPaymentItem {
  userID: number;
  empname: string;
  email: string;
  isTrialversion: boolean;
  paymentID: string;
  expiry: string;
  expiryDate: string;
  paymentdate: string;
}

interface ApiPaymentResponse {
  lst: ApiUserPaymentItem[];
  cnt: {
    total: number;
    notExpired: number;
    expired: number;
  };
}

// ---------------------------------------------------------------------------
// Predefined reminder templates
// ---------------------------------------------------------------------------

const REMINDER_TEMPLATES = [
  {
    id: 'payment-due',
    name: 'Payment Due Reminder',
    content: '<p>Dear {name},</p><p>This is a friendly reminder that your payment is due soon. Please ensure your payment is completed to avoid any interruption in service.</p><p>Thank you for your business!</p>'
  },
  {
    id: 'payment-overdue',
    name: 'Payment Overdue Alert',
    content: '<p>Dear {name},</p><p>Your payment is now overdue. Please make the payment at your earliest convenience to continue enjoying our services without interruption.</p><p>If you have already made the payment, please disregard this message.</p>'
  },
  {
    id: 'subscription-renewal',
    name: 'Subscription Renewal Notice',
    content: '<p>Dear {name},</p><p>Your subscription is set to expire soon. To continue enjoying uninterrupted access to our services, please renew your subscription today.</p><p>We look forward to continuing to serve you!</p>'
  },
  {
    id: 'trial-expiring',
    name: 'Trial Version Expiring',
    content: '<p>Dear {name},</p><p>Your trial version is about to expire. Upgrade to a paid plan to continue enjoying all the features and benefits of our platform.</p><p>Contact us if you have any questions!</p>'
  },
  {
    id: 'general-reminder',
    name: 'General Reminder',
    content: '<p>Dear {name},</p><p>We hope this message finds you well. This is a gentle reminder regarding your payment status with us.</p><p>Please don\'t hesitate to reach out if you need any assistance.</p>'
  }
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isExpired(expiry: string): boolean {
  return expiry.trim().toLowerCase() === "expired";
}

function getAvatarColor(name: string): string {
  const palette = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#14b8a6", "#ec4899"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function formatDate(dateStr: string): string {
  if (!dateStr || !dateStr.trim()) return "";
  return dateStr.trim().split(/\s+/).join("-");
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function ExpiryBadge({ expiry }: { expiry: string }) {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const expired = isExpired(expiry);

  const cfg = expired
    ? { label: "Expired", icon: "lucide:x-circle", color: "#dc2626", bg: "#fee2e2", darkBg: "#7f1d1d", ringColor: "#dc262640" }
    : { label: "Active", icon: "lucide:check-circle-2", color: "#059669", bg: "#d1fae5", darkBg: "#064e3b", ringColor: "#05966940" };

  return (
    <Zoom in timeout={500}>
      <Chip
        icon={<Icon icon={cfg.icon} style={{ fontSize: 14, color: cfg.color }} />}
        label={cfg.label}
        size="small"
        sx={{
          bgcolor: isDark ? cfg.darkBg : cfg.bg,
          color: cfg.color,
          fontWeight: 600,
          fontSize: 11.5,
          height: 26,
          borderRadius: "999px",
          "& .MuiChip-icon": { ml: "6px" },
          border: `1px solid ${isDark ? cfg.color + '30' : cfg.color + '20'}`,
          boxShadow: `0 0 20px ${cfg.ringColor}`,
          animation: expired ? "pulse-badge 2s ease-in-out infinite" : "none",
          "@keyframes pulse-badge": {
            "0%, 100%": { boxShadow: `0 0 20px ${cfg.ringColor}` },
            "50%": { boxShadow: `0 0 40px ${cfg.ringColor}` },
          },
        }}
      />
    </Zoom>
  );
}

function TrialBadge({ isTrial }: { isTrial: boolean }) {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  return (
    <Chip
      label={isTrial ? "Trial" : "Paid"}
      size="small"
      sx={{
        fontSize: 10.5,
        fontWeight: 600,
        height: 22,
        borderRadius: "999px",
        bgcolor: isTrial 
          ? (isDark ? "#451a03" : "#fffbeb") 
          : (isDark ? "#064e3b" : "#d1fae5"),
        color: isTrial ? "#d97706" : "#059669",
        border: `1px solid ${isTrial ? '#d9770640' : '#05966940'}`,
        letterSpacing: 0.3,
      }}
    />
  );
}

function SummaryCard({
  icon,
  label,
  value,
  accent,
  trend,
}: {
  icon: string;
  label: string;
  value: string;
  accent: string;
  trend?: { value: string; positive: boolean };
}) {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  return (
    <Grow in timeout={600}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDark ? "#1a2744" : "#e2e8f0",
          borderRadius: "16px",
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          height: "100%",
          bgcolor: isDark ? "#0F1828" : "#ffffff",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDark 
              ? "0 12px 40px rgba(0,0,0,0.4)" 
              : "0 12px 40px rgba(0,0,0,0.08)",
            borderColor: accent,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${accent}08, transparent 60%)`,
            opacity: 0,
            transition: "opacity 0.6s ease",
          },
          "&:hover::before": { opacity: 1 },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: `linear-gradient(90deg, ${accent}, ${accent}60)`,
            transform: "scaleX(0)",
            transition: "transform 0.6s ease",
            transformOrigin: "left",
          },
          "&:hover::after": { transform: "scaleX(1)" },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: `1px solid ${accent}20`,
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "scale(1.1) rotate(-5deg)",
            },
          }}
        >
          <Icon icon={icon} style={{ fontSize: 22, color: accent }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: isDark ? "#ffffff" : "#0f172a",
              lineHeight: 1.2,
              letterSpacing: -0.5,
            }}
          >
            {value}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: isDark ? "#9ca3af" : "#64748b",
              mt: 0.25,
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
        </Box>
        {trend && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: trend.positive ? "#059669" : "#dc2626",
              bgcolor: trend.positive ? "#d1fae5" : "#fee2e2",
              px: 1,
              py: 0.5,
              borderRadius: "999px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <Icon icon={trend.positive ? "lucide:trending-up" : "lucide:trending-down"} style={{ fontSize: 14 }} />
            {trend.value}
          </Box>
        )}
      </Card>
    </Grow>
  );
}

function SummaryCardSkeleton() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: isDark ? "#1a2744" : "#e2e8f0",
        borderRadius: "16px",
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
        bgcolor: isDark ? "#0F1828" : "#ffffff",
      }}
    >
      <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: "12px", flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
    </Card>
  );
}

type StatusFilter = "all" | "expired" | "notExpired" | "active";

function PaymentStatusContent() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<ApiUserPaymentItem[]>([]);
  const [cnt, setCnt] = useState({ total: 0, notExpired: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "expiryDate", desc: true }]);

  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUserPaymentItem | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const [emailError, setEmailError] = useState("");
  const [content, setContent] = useState<string>('');

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for file preview
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  
  // Store uploaded file info for final email send
  const [uploadedFile, setUploadedFile] = useState<{ file: File; name: string; url?: string } | null>(null);

  useEffect(() => {
    GetPaymentHistory();
  }, []);

  const GetPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await Getpaymenthistoryapi();
      const apiData: ApiPaymentResponse = response.data;
      setData(apiData.lst);
      setCnt(apiData.cnt);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const statusFiltered = useMemo(() => {
    if (statusFilter === "all") return data;
    if (statusFilter === "expired") return data.filter((p) => isExpired(p.expiry));
    if (statusFilter === "notExpired") return data.filter((p) => !isExpired(p.expiry));
    if (statusFilter === "active") return data.filter((p) => !isExpired(p.expiry) && !p.isTrialversion);
    return data;
  }, [data, statusFilter]);

  const handleReminderClick = (user: ApiUserPaymentItem) => {
    console.log(user, 'ddd');
    setSelectedUser(user);
    setEmailContent("");
    setEmailError("");
    setSelectedTemplate("");
    setContent("");
    setUploadedFile(null);
    setReminderOpen(true);
  };

  const handleTemplateChange = (event: SelectChangeEvent) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId && selectedUser) {
      const template = REMINDER_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        const personalizedContent = template.content.replace(/{name}/g, selectedUser.empname);
        setContent(personalizedContent);
        setEmailContent(personalizedContent);
        if (emailError) setEmailError("");
      }
    } else {
      setContent("");
      setEmailContent("");
    }
  };

  const handleSendReminder = async () => {
    if (!content.trim() || content == '<p><br></p>') {
      setEmailError("Please write the email content.");
      return;
    }
    setIsUploading(true);
    await handleSendEmailWithContent();
  };

  const handleCloseReminder = () => {
    setReminderOpen(false);
    setSelectedUser(null);
    setEmailContent("");
    setEmailError("");
    setContent("");
    setSelectedTemplate("");
    setIsUploading(false);
    setUploadProgress(0);
    setFilePreviewOpen(false);
    setPendingFile(null);
    setFilePreviewUrl("");
    setUploadedFile(null);
  };

  const handleEditorChange = (content: string) => {
    console.log(content,'fff');
    setContent(content);
    setEmailContent(content);
    if (emailError) setEmailError("");
  };

  // Check if file size is valid (max 3MB for PDF and Word)
  const isFileSizeValid = (file: File): boolean => {
    const maxSizeMB = 3;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  // Check if file type is allowed (PDF, Word, or images)
  const isFileTypeAllowed = (file: File): boolean => {
    const allowedTypes = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.some(type => file.type.startsWith(type) || file.type === type);
  };

  // Only compress images
  const compressImageIfNeeded = async (file: File): Promise<File> => {
    // Only compress if it's an image
    if (!file.type.startsWith("image/")) {
      return file;
    }
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.8,
      maxIteration: 3,
    };
    try {
      const compressedBlob = await imageCompression(file, options);
      return new File([compressedBlob], file.name, {
        type: compressedBlob.type,
        lastModified: Date.now(),
      });
    } catch (compressionError) {
      return file;
    }
  };

  // File upload handler for the editor - Shows preview
  const handleFileUpload = async (file: File): Promise<{ url: string; name: string }> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!isFileTypeAllowed(file)) {
        toast.error('File type not supported. Please upload PDF, Word, or image files.');
        reject(new Error('File type not supported'));
        return;
      }

      // Validate file size (max 3MB)
      if (!isFileSizeValid(file)) {
        toast.error('File size exceeds 3MB limit. Please compress or choose a smaller file.');
        reject(new Error('File size exceeds 3MB'));
        return;
      }

      setPendingFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreviewUrl(previewUrl);
      setFilePreviewOpen(true);
      (window as any).__fileUploadResolve = resolve;
      (window as any).__fileUploadReject = reject;
    });
  };

  // Confirm file upload after preview - Store file for later attachment
  const confirmFileUpload = async () => {
    if (!pendingFile) return;
    
    setFilePreviewOpen(false);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Only compress if it's an image
      const fileToUpload = await compressImageIfNeeded(pendingFile);
      
      // Store the file for later use in email send
      setUploadedFile({
        file: fileToUpload,
        name: pendingFile.name,
        url: URL.createObjectURL(fileToUpload)
      });
      
      // Insert a placeholder/indicator in the editor content
      let fileHtml = '';
      if (pendingFile.type.startsWith('image/')) {
        fileHtml = `<p><img src="${URL.createObjectURL(fileToUpload)}" alt="${pendingFile.name}" style="max-width: 100%; height: auto;" /><br/><em>📎 ${pendingFile.name}</em></p>`;
      } else {
        // For PDF and Word files, show a link indicator
        fileHtml = `<p>📎 <strong>${pendingFile.name}</strong></p>`;
      }
      
      // Append file indicator to existing content
      const updatedContent = content + fileHtml;
      setContent(updatedContent);
      setEmailContent(updatedContent);
      
      if ((window as any).__fileUploadResolve) {
        (window as any).__fileUploadResolve({
          url: URL.createObjectURL(fileToUpload),
          name: pendingFile.name
        });
        delete (window as any).__fileUploadResolve;
        delete (window as any).__fileUploadReject;
      }
      
      toast.success("File attached successfully!");
      
    } catch (error) {
      console.error('File upload error:', error);
      if ((window as any).__fileUploadReject) {
        (window as any).__fileUploadReject(error);
        delete (window as any).__fileUploadResolve;
        delete (window as any).__fileUploadReject;
      }
    //  toast.error('File upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setPendingFile(null);
      setFilePreviewUrl("");
    }
  };

  // Cancel file upload
  const cancelFileUpload = () => {
    setFilePreviewOpen(false);
    setPendingFile(null);
    setFilePreviewUrl("");
    if ((window as any).__fileUploadReject) {
      (window as any).__fileUploadReject(new Error('Upload cancelled'));
      delete (window as any).__fileUploadResolve;
      delete (window as any).__fileUploadReject;
    }
  };

  const handleSendEmailWithContent = async () => {
    if (!content || content == '<p><br></p>') {
      toast.error("Please enter Description");
      return;
    }

    setUploadProgress(0);
    try {
      // Check if there's an image in the content
      const hasImageTag = /<img\b[^>]*>/i.test(content);
      const formData = new FormData();
      
      // Extract text content from HTML
      const parsedDoc = new DOMParser().parseFromString(content, 'text/html');
      
      // Remove image tags and file indicators from text content
      parsedDoc.querySelectorAll('.se-image-container, img, em, strong').forEach((el) => {
        if (el.tagName === 'EM' || el.tagName === 'STRONG') {
          // Keep text but remove styling
        } else {
          el.remove();
        }
      });
      
      const textOnlyMessage = (parsedDoc.body.textContent || '').trim()
        ? parsedDoc.body.innerHTML.trim()
        : '';
      
      // Add email body to form data
      formData.append('RemainderEmailbody', textOnlyMessage);
      formData.append('Toemailaddress', (selectedUser?.email)?.toLowerCase() ?? '');
      
      // If we have an uploaded file, attach it
      if (uploadedFile) {
        formData.append('file', uploadedFile.file);
      }
      
      // Check if there's a base64 image in the content that needs to be uploaded
      if (hasImageTag && !uploadedFile) {
        const srcMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
        const base64Src = srcMatch?.[1];
        
        if (base64Src && base64Src.startsWith('data:')) {
          const res = await fetch(base64Src);
          const blob = await res.blob();
          const mimeMatch = base64Src.match(/^data:(.*?);base64,/);
          const mimeType = mimeMatch?.[1] || 'image/png';
          const extension = mimeType.split('/')[1] || 'png';
          const fileName = `pasted-image-${Date.now()}.${extension}`;
          const file = new File([blob], fileName, { type: mimeType });
          const fileToUpload = await compressImageIfNeeded(file);
          formData.append('file', fileToUpload);
        }
      }
      
      const Baseurl = import.meta.env.VITE_API_URL;
      
      // Single API call to send email with attachment
      await axios.post(
        `${Baseurl}/Payment/SendPaymentRemainder`,
        formData,
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      toast.success("Email Sent Successfully!");
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to send email');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setReminderOpen(false);
      setIsUploading(false);
      setUploadProgress(0);
      setContent('');
      setEmailError("");
      setSelectedUser(null);
      setEmailContent("");
      setSelectedTemplate("");
      setUploadedFile(null);
    }
  };

  const columns = useMemo<ColumnDef<ApiUserPaymentItem>[]>(
    () => [
      {
        accessorKey: "empname",
        header: "User",
        cell: ({ row }) => {
          const item = row.original;
          const avatarColor = getAvatarColor(item.empname);
          const initials = item.empname
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  bgcolor: avatarColor,
                  width: 36,
                  height: 36,
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.4s ease",
                  border: `2px solid ${avatarColor}30`,
                  "&:hover": {
                    transform: "scale(1.15) rotate(10deg)",
                    boxShadow: `0 8px 25px ${avatarColor}40`,
                  },
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: isDark ? "#ffffff" : "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {item.empname}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: isDark ? "#6b7280" : "#94a3b8",
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
               
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <Typography
            sx={{
              fontSize: 12.5,
              color: isDark ? "#9ca3af" : "#475569",
              fontFamily: 'monospace',
              letterSpacing: 0.2,
            }}
          >
            {row.original.email}
          </Typography>
        ),
      },
      {
        accessorKey: "isTrialversion",
        header: "Type",
        cell: ({ row }) => <TrialBadge isTrial={row.original.isTrialversion} />,
      },
      {
        accessorKey: "paymentID",
        header: "Payment ID",
        cell: ({ row }) => (
          <Typography
            sx={{
              fontSize: 12,
              color: isDark ? "#9ca3af" : "#475569",
              fontFamily: 'monospace',
              bgcolor: isDark ? "#1a2744" : "#f1f5f9",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              display: 'inline-block',
            }}
          >
            {row.original.paymentID || "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "expiry",
        header: "Status",
        filterFn: (row, columnId, filterValue: StatusFilter) => {
          if (filterValue === "all") return true;
          const expired = isExpired(row.getValue(columnId) as string);
          if (filterValue === "expired") return expired;
          if (filterValue === "notExpired") return !expired;
          if (filterValue === "active") return !expired && !row.original.isTrialversion;
          return true;
        },
        cell: ({ row }) => <ExpiryBadge expiry={row.original.expiry} />,
      },
      {
        accessorKey: "expiryDate",
        header: "Expiry Date",
        cell: ({ row }) => (
          <Typography
            sx={{
              fontSize: 12.5,
              color: isDark ? "#9ca3af" : "#475569",
              fontWeight: 500,
            }}
          >
            {formatDate(row.original.expiryDate) || "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "paymentdate",
        header: "Payment Date",
        cell: ({ row }) => (
          <Typography
            sx={{
              fontSize: 12.5,
              color: isDark ? "#6b7280" : "#94a3b8",
            }}
          >
            {formatDate(row.original.paymentdate) || "—"}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Tooltip title="Send reminder email" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => handleReminderClick(item)}
                sx={{
                  color: isDark ? "#9ca3af" : "#64748b",
                  transition: "all 0.4s ease",
                  bgcolor: isDark ? "transparent" : "transparent",
                  "&:hover": {
                    color: "#6366f1",
                    transform: "scale(1.1) rotate(-5deg)",
                    bgcolor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
                  },
                }}
              >
                <Icon icon="lucide:mail" style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    [isDark]
  );

  const table = useReactTable({
    data: statusFiltered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 9 } },
  });

  const gridRows = table.getRowModel().rows;

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: isDark ? "#0a1220" : "#f1f5f9",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -300,
            right: -300,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.04), transparent 70%)",
            animation: "float-bg 20s ease-in-out infinite",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -300,
            left: -300,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.04), transparent 70%)",
            animation: "float-bg-reverse 25s ease-in-out infinite",
          },
          "@keyframes float-bg": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(-80px, -40px) scale(1.2)" },
            "66%": { transform: "translate(80px, 40px) scale(0.8)" },
          },
          "@keyframes float-bg-reverse": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(80px, 40px) scale(1.2)" },
            "66%": { transform: "translate(-80px, -40px) scale(0.8)" },
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 24, sm: 28 },
                    fontWeight: 800,
                    color: isDark ? "#ffffff" : "#0f172a",
                    letterSpacing: -0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 1,
                      borderRadius: "12px",
                      bgcolor: "rgba(99,102,241,0.12)",
                      color: "#6366f1",
                    }}
                  >
                    <Icon icon="lucide:credit-card" style={{ fontSize: 24 }} />
                  </Box>
                  Payment Status
                  <Chip
                    label={`${data.length} users`}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                      color: isDark ? "#ffffff" : "#0f172a",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13.5,
                    color: isDark ? "#9ca3af" : "#64748b",
                    mt: 0.5,
                    ml: 0.5,
                  }}
                >
                  Monitor user subscriptions and payment statuses
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={GetPaymentHistory}
                startIcon={<Icon icon="lucide:refresh-cw" style={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: "10px",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  color: isDark ? "#ffffff" : "#0f172a",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#6366f1",
                    bgcolor: "rgba(99,102,241,0.08)",
                  },
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              {loading ? (
                <SummaryCardSkeleton />
              ) : (
                <SummaryCard
                  icon="lucide:users"
                  label="Total Users"
                  value={cnt.total.toString()}
                  accent="#6366f1"
                  trend={{ value: "100%", positive: true }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {loading ? (
                <SummaryCardSkeleton />
              ) : (
                <SummaryCard
                  icon="lucide:shield-check"
                  label="Active Subscriptions"
                  value={cnt.notExpired.toString()}
                  accent="#059669"
                  trend={{ 
                    value: cnt.total > 0 ? `${Math.round((cnt.notExpired / cnt.total) * 100)}%` : '0%', 
                    positive: true 
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {loading ? (
                <SummaryCardSkeleton />
              ) : (
                <SummaryCard
                  icon="lucide:alert-circle"
                  label="Expired Accounts"
                  value={cnt.expired.toString()}
                  accent="#dc2626"
                  trend={{ 
                    value: cnt.total > 0 ? `${Math.round((cnt.expired / cnt.total) * 100)}%` : '0%', 
                    positive: false 
                  }}
                />
              )}
            </Grid>
          </Grid>

          {/* Toolbar */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: "16px",
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <TextField
                size="small"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search by name, email, or payment ID..."
                sx={{
                  width: { xs: "100%", md: 360 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: isDark ? "#0a1220" : "#f8fafc",
                    transition: "all 0.3s ease",
                    "&:focus-within": {
                      boxShadow: "0 0 0 3px rgba(99,102,241,0.15)",
                      bgcolor: isDark ? "#0F1828" : "#ffffff",
                    },
                    "& fieldset": {
                      borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    },
                    "&:hover fieldset": {
                      borderColor: isDark ? "#2a3a5c" : "#94a3b8",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontSize: 13,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="lucide:search" style={{ fontSize: 17, color: isDark ? "#6b7280" : "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack
                direction="row"
                spacing={0.5}
                flexWrap="wrap"
                sx={{
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  borderRadius: "10px",
                  p: 0.5,
                  bgcolor: isDark ? "#0a1220" : "#f8fafc",
                  rowGap: 0.5,
                }}
              >
                {(["all", "notExpired", "expired", "active"] as StatusFilter[]).map((s, index) => {
                  const labels = {
                    all: "All",
                    notExpired: "Active",
                    expired: "Expired",
                    active: "Paid",
                  };
                  const icons = {
                    all: "lucide:layers",
                    notExpired: "lucide:check-circle",
                    expired: "lucide:x-circle",
                    active: "lucide:crown",
                  };
                  return (
                    <Grow in timeout={300 + index * 100} key={s}>
                      <Chip
                        icon={<Icon icon={icons[s]} style={{ fontSize: 14 }} />}
                        label={labels[s]}
                        onClick={() => setStatusFilter(s)}
                        size="small"
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: "8px",
                          px: 0.5,
                          bgcolor: statusFilter === s 
                            ? (isDark ? "#ffffff" : "#0f172a") 
                            : "transparent",
                          color: statusFilter === s 
                            ? (isDark ? "#0F1828" : "#ffffff") 
                            : (isDark ? "#9ca3af" : "#64748b"),
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            bgcolor: statusFilter === s 
                              ? (isDark ? "#ffffff" : "#0f172a") 
                              : (isDark ? "#1a2744" : "#f1f5f9"),
                          },
                          "& .MuiChip-icon": {
                            color: statusFilter === s 
                              ? (isDark ? "#0F1828" : "#ffffff") 
                              : (isDark ? "#9ca3af" : "#64748b"),
                          },
                        }}
                      />
                    </Grow>
                  );
                })}
              </Stack>
            </Stack>
          </Paper>

          {/* Table */}
          {loading ? (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ bgcolor: isDark ? "#0a1220" : "#f8fafc" }}>
                      {["User", "Email", "Type", "Payment ID", "Status", "Expiry Date", "Payment Date", "Action"].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isDark ? "#9ca3af" : "#64748b",
                            borderColor: isDark ? "#1a2744" : "#e2e8f0",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            py: 1.5,
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Skeleton variant="circular" width={36} height={36} />
                            <Box>
                              <Skeleton variant="text" width={100} height={20} />
                              <Skeleton variant="text" width={50} height={14} />
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="text" width={150} />
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: "999px" }} />
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="text" width={90} />
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: "999px" }} />
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                          <Skeleton variant="circular" width={32} height={32} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : gridRows.length === 0 ? (
            <Zoom in timeout={600}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  bgcolor: isDark ? "#0F1828" : "#ffffff",
                  py: 8,
                  textAlign: "center",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Icon icon="lucide:inbox" style={{ fontSize: 48, color: isDark ? "#6b7280" : "#94a3b8" }} />
                </Box>
                <Typography sx={{ fontSize: 15, color: isDark ? "#9ca3af" : "#64748b" }}>
                  No records match your search or filters.
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    setGlobalFilter("");
                    setStatusFilter("all");
                  }}
                  sx={{ mt: 1, color: "#6366f1", textTransform: "none" }}
                >
                  Clear filters
                </Button>
              </Paper>
            </Zoom>
          ) : (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        sx={{
                          bgcolor: isDark ? "#0a1220" : "#f8fafc",
                          "& th": {
                            borderBottom: `2px solid ${isDark ? "#1a2744" : "#e2e8f0"}`,
                          },
                        }}
                      >
                        {headerGroup.headers.map((header) => (
                          <TableCell
                            key={header.id}
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isDark ? "#9ca3af" : "#64748b",
                              borderColor: isDark ? "#1a2744" : "#e2e8f0",
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                              py: 1.5,
                              whiteSpace: "nowrap",
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                              "&:hover": {
                                color: isDark ? "#ffffff" : "#0f172a",
                              },
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              {header.column.getCanSort() && (
                                <Icon
                                  icon={
                                    header.column.getIsSorted() === "asc"
                                      ? "lucide:arrow-up"
                                      : header.column.getIsSorted() === "desc"
                                      ? "lucide:arrow-down"
                                      : "lucide:arrow-up-down"
                                  }
                                  style={{
                                    fontSize: 12,
                                    opacity: header.column.getIsSorted() ? 1 : 0.4,
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody>
                    {gridRows.map((row, index) => (
                      <Fade in timeout={200 + index * 50} key={row.id}>
                        <TableRow
                          sx={{
                            "&:last-child td": { borderBottom: 0 },
                            "&:hover": {
                              bgcolor: isDark ? "#0a1220" : "#f8fafc",
                              cursor: "pointer",
                            },
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              sx={{
                                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                                py: 1.5,
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Pagination */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              pt: 3,
              pb: 1,
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 12.5,
                color: isDark ? "#9ca3af" : "#64748b",
                fontWeight: 500,
              }}
            >
              {loading
                ? "Loading..."
                : `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )} of ${table.getFilteredRowModel().rows.length} entries`}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                onClick={() => table.previousPage()}
                disabled={loading || !table.getCanPreviousPage()}
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  borderRadius: "8px",
                  color: isDark ? "#ffffff" : "#0f172a",
                  transition: "all 0.3s ease",
                  "&:hover:not(:disabled)": {
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    transform: "scale(1.05)",
                  },
                  "&.Mui-disabled": {
                    color: isDark ? "#6b7280" : "#94a3b8",
                    opacity: 0.5,
                  },
                }}
              >
                <Icon icon="lucide:chevron-left" style={{ fontSize: 18 }} />
              </IconButton>

              <Box sx={{ px: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isDark ? "#ffffff" : "#0f172a",
                  }}
                >
                  {loading ? "—" : `${table.getState().pagination.pageIndex + 1} / ${Math.max(table.getPageCount(), 1)}`}
                </Typography>
              </Box>

              <IconButton
                onClick={() => table.nextPage()}
                disabled={loading || !table.getCanNextPage()}
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  borderRadius: "8px",
                  color: isDark ? "#ffffff" : "#0f172a",
                  transition: "all 0.3s ease",
                  "&:hover:not(:disabled)": {
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    transform: "scale(1.05)",
                  },
                  "&.Mui-disabled": {
                    color: isDark ? "#6b7280" : "#94a3b8",
                    opacity: 0.5,
                  },
                }}
              >
                <Icon icon="lucide:chevron-right" style={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Reminder Email Dialog */}
      <Dialog
        open={reminderOpen}
        onClose={handleCloseReminder}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: isDark ? "#0F1828" : "#ffffff",
            border: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            maxHeight: "90vh",
            boxShadow: isDark ? "0 25px 80px rgba(0,0,0,0.6)" : "0 25px 80px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: isDark ? "#ffffff" : "#0f172a",
            borderBottom: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            pb: 2,
            pt: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                p: 1,
                borderRadius: "10px",
                bgcolor: "rgba(99,102,241,0.12)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icon icon="lucide:mail" style={{ fontSize: 22, color: "#6366f1" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
                Send Reminder
              </Typography>
              {selectedUser && (
                <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#64748b" }}>
                  To: {selectedUser.empname}
                </Typography>
              )}
            </Box>
          </Stack>
          <IconButton
            onClick={handleCloseReminder}
            sx={{
              color: isDark ? "#9ca3af" : "#64748b",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1) rotate(90deg)",
                color: "#dc2626",
                bgcolor: "rgba(220, 38, 38, 0.08)",
              },
            }}
          >
            <Icon icon="lucide:x" style={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isDark ? "#9ca3af" : "#64748b",
                  mb: 0.75,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Recipient
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput
                  size="small"
                  value={selectedUser?.email?.toLowerCase() || ""}
                  disabled
                  sx={{
                    bgcolor: isDark ? "#0a1220" : "#f8fafc",
                    borderRadius: "10px",
                    height: 42,
                    "& .MuiOutlinedInput-input": {
                      color: isDark ? "#ffffff" : "#475569",
                      fontSize: 13,
                      WebkitTextFillColor: isDark ? "#ffffff" : "#475569",
                    },
                    "& fieldset": {
                      borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    },
                    "&.Mui-disabled": {
                      opacity: 1,
                      "& .MuiOutlinedInput-input": {
                        WebkitTextFillColor: isDark ? "#ffffff" : "#475569",
                      },
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <Icon icon="lucide:mail" style={{ fontSize: 16, color: isDark ? "#6b7280" : "#94a3b8" }} />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>

            {/* Template Selection Dropdown */}
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isDark ? "#9ca3af" : "#64748b",
                  mb: 0.75,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Select Template
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel 
                  id="template-select-label"
                  sx={{
                    color: isDark ? "#9ca3af" : "#64748b",
                    '&.Mui-focused': { color: '#6366f1' },
                  }}
                >
                  Choose a template
                </InputLabel>
                <Select
                  labelId="template-select-label"
                  value={selectedTemplate}
                  label="Choose a template"
                  onChange={handleTemplateChange}
                  sx={{
                    bgcolor: isDark ? "#0a1220" : "#f8fafc",
                    borderRadius: "10px",
                    height: 42,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDark ? "#2a3a5c" : "#94a3b8",
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6366f1',
                    },
                    '& .MuiSelect-select': {
                      color: isDark ? "#ffffff" : "#0f172a",
                      fontSize: 13,
                    },
                    '& .MuiSvgIcon-root': {
                      color: isDark ? "#9ca3af" : "#64748b",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: isDark ? "#0F1828" : "#ffffff",
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        borderRadius: "12px",
                        boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.1)",
                        '& .MuiMenuItem-root': {
                          color: isDark ? "#ffffff" : "#0f172a",
                          '&:hover': {
                            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          },
                          '&.Mui-selected': {
                            bgcolor: "rgba(99,102,241,0.12)",
                            '&:hover': {
                              bgcolor: "rgba(99,102,241,0.18)",
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Custom Message</em>
                  </MenuItem>
                  {REMINDER_TEMPLATES.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon 
                          icon="lucide:file-text" 
                          style={{ fontSize: 16, color: isDark ? "#9ca3af" : "#94a3b8" }} 
                        />
                        <span>{template.name}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isDark ? "#9ca3af" : "#64748b",
                  mb: 0.75,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Message
              </Typography>
              <Box
                sx={{
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  overflow: "hidden",
                  bgcolor: isDark ? "#0a1220" : "#ffffff",
                }}
              >
                <MyEditor
                  placeholder="Write your email content here..."
                  height="280"
                  onChange={handleEditorChange}
                  setContent={emailContent}
                  defaultValue="<p>Dear user,</p><p>This is a reminder about your payment status.</p>"
                  onFileUpload={handleFileUpload}
                />
              </Box>
              {emailError && (
                <FormHelperText error sx={{ mt: 1, fontSize: 12 }}>
                  {emailError}
                </FormHelperText>
              )}
              {uploadedFile && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="lucide:paperclip" style={{ fontSize: 16, color: '#6366f1' }} />
                  <Typography sx={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>
                    Attached: {uploadedFile.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setUploadedFile(null);
                      // Remove the file indicator from content
                      const contentWithoutFile = content.replace(/<p>📎 <strong>.*?<\/strong> \(attached\)<\/p>/, '');
                      setContent(contentWithoutFile);
                      setEmailContent(contentWithoutFile);
                      toast.success('File removed');
                    }}
                    sx={{
                      color: '#dc2626',
                      '&:hover': {
                        bgcolor: 'rgba(220, 38, 38, 0.08)',
                      },
                    }}
                  >
                    <Icon icon="lucide:x" style={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              )}
            </Box>

            {isUploading && (
              <Box sx={{ width: "100%" }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.75}>
                  <Typography variant="body2" color={isDark ? "#9ca3af" : "#64748b"} fontSize={12}>
                    {filePreviewOpen ? 'Uploading file...' : 'Sending email...'}
                  </Typography>
                  <Typography variant="body2" color="#6366f1" fontWeight={600} fontSize={12}>
                    {uploadProgress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? "#1a2744" : "#e2e8f0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      backgroundColor: "#6366f1",
                    },
                  }}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            pt: 2,
            pb: 2.5,
            px: 3,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCloseReminder}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 1,
              textTransform: "none",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              color: isDark ? "#ffffff" : "#0f172a",
              "&:hover": {
                borderColor: "#dc2626",
                color: "#dc2626",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendReminder}
            disabled={content == '<p><br></p>' || isUploading}
            startIcon={<Icon icon="lucide:send" style={{ fontSize: 18 }} />}
            sx={{
              bgcolor: "#6366f1",
              borderRadius: "10px",
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#4f46e5",
                transform: "scale(1.02)",
                boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
              },
              "&:disabled": {
                bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                color: isDark ? "#6b7280" : "#94a3b8",
              },
              transition: "all 0.3s ease",
            }}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog - Fixed alignment and professional design */}
      <Dialog
        open={filePreviewOpen}
        onClose={cancelFileUpload}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: isDark ? "#0F1828" : "#ffffff",
            border: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            boxShadow: isDark ? "0 25px 80px rgba(0,0,0,0.6)" : "0 25px 80px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: isDark ? "#ffffff" : "#0f172a",
            borderBottom: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            pb: 2,
            pt: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                p: 1,
                borderRadius: "10px",
                bgcolor: "rgba(99,102,241,0.12)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icon icon="lucide:file" style={{ fontSize: 22, color: "#6366f1" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
                File Preview
              </Typography>
              {pendingFile && (
                <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#64748b" }}>
                  {pendingFile.name} ({(pendingFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          </Stack>
          <IconButton
            onClick={cancelFileUpload}
            sx={{
              color: isDark ? "#9ca3af" : "#64748b",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1) rotate(90deg)",
                color: "#dc2626",
                bgcolor: "rgba(220, 38, 38, 0.08)",
              },
            }}
          >
            <Icon icon="lucide:x" style={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              bgcolor: isDark ? "#0a1220" : "#f8fafc",
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {pendingFile && pendingFile.type.startsWith('image/') ? (
              <Box
                component="img"
                src={filePreviewUrl}
                alt="File preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: "8px",
                  objectFit: "contain",
                }}
              />
            ) : pendingFile && pendingFile.type === 'application/pdf' ? (
              <Box sx={{ width: '100%', height: '100%' }}>
                <iframe
                  src={filePreviewUrl}
                  title="PDF Preview"
                  style={{
                    width: '100%',
                    height: '400px',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            ) : pendingFile && (pendingFile.type.includes('word') || pendingFile?.name?.endsWith('.docx') || pendingFile?.name?.endsWith('.doc')) ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 4,
                width: '100%',
              }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "16px",
                    bgcolor: "rgba(30, 136, 229, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Icon icon="lucide:file-text" style={{ fontSize: 40, color: "#1e88e5" }} />
                </Box>
                <Typography sx={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  color: isDark ? "#ffffff" : "#0f172a",
                  mb: 0.5,
                }}>
                  Word Document
                </Typography>
                <Typography sx={{ 
                  fontSize: 13, 
                  color: isDark ? "#9ca3af" : "#64748b",
                  mb: 1,
                }}>
                  {pendingFile?.name || "Document"}
                </Typography>
                <Typography sx={{ 
                  fontSize: 12, 
                  color: isDark ? "#6b7280" : "#94a3b8",
                  fontStyle: 'italic',
                }}>
                  Click "Attach to Email" to add this document
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 4,
                width: '100%',
              }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "16px",
                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Icon icon="lucide:file" style={{ fontSize: 40, color: isDark ? "#6b7280" : "#94a3b8" }} />
                </Box>
                <Typography sx={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  color: isDark ? "#ffffff" : "#0f172a",
                  mb: 0.5,
                }}>
                  {pendingFile?.name || "File"}
                </Typography>
                <Typography sx={{ 
                  fontSize: 13, 
                  color: isDark ? "#9ca3af" : "#64748b",
                  mb: 1,
                }}>
                  {(pendingFile?.size ? (pendingFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                </Typography>
                <Typography sx={{ 
                  fontSize: 12, 
                  color: isDark ? "#6b7280" : "#94a3b8",
                  fontStyle: 'italic',
                }}>
                  Click "Attach to Email" to add this document
                </Typography>
              </Box>
            )}
          </Box>

          {isUploading && filePreviewOpen && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.75}>
                <Typography variant="body2" color={isDark ? "#9ca3af" : "#64748b"} fontSize={12}>
                  Uploading file...
                </Typography>
                <Typography variant="body2" color="#6366f1" fontWeight={600} fontSize={12}>
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: isDark ? "#1a2744" : "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    backgroundColor: "#6366f1",
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            pt: 2,
            pb: 2.5,
            px: 3,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={cancelFileUpload}
            disabled={isUploading}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 1,
              textTransform: "none",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              color: isDark ? "#ffffff" : "#0f172a",
              "&:hover": {
                borderColor: "#dc2626",
                color: "#dc2626",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmFileUpload}
            disabled={isUploading}
            startIcon={<Icon icon="lucide:paperclip" style={{ fontSize: 18 }} />}
            sx={{
              bgcolor: "#6366f1",
              borderRadius: "10px",
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#4f46e5",
                transform: "scale(1.02)",
                boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
              },
              "&:disabled": {
                bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                color: isDark ? "#6b7280" : "#94a3b8",
              },
              transition: "all 0.3s ease",
            }}
          >
            Attach to Email
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PaymentStatusPage() {
  return <PaymentStatusContent />;
}