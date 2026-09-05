"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
import axios from "axios";
import { Icon } from "@iconify/react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Avatar,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  Alert,
  Snackbar,
  Tooltip,
  LinearProgress,
  Fade,
  Slide,
  Grow,
  Zoom,
  useMediaQuery,
  useTheme,
  Skeleton,
  alpha,
} from "@mui/material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import MyEditor from '../Htmleditor/MyEditor';
import toast from "react-hot-toast";
import { getfeedbackapi } from "../../api/services/feedbackService";
import imageCompression from "browser-image-compression"


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeedbackStatus = "open" | "closed";

export interface FeedbackItem {
  id: string;
  userName: string;
  userEmail: string;
  message: string;
  organizationName: string;

  status: FeedbackStatus;
  timestamp: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  message: string;
  timestamp: string;
  repliedBy: string;
}

// ---------------------------------------------------------------------------
// API response shape + mapper
// ---------------------------------------------------------------------------

interface ApiFeedbackItem {
  feedbackID: number;
  username: string;
  email: string;
  organizationname: string;
  country: string;
  feedbackmessage: string;
  isClose: boolean;
  closeddate: string;
  openstatus: string;
}

function mapApiFeedbackToFeedbackItem(apiItem: ApiFeedbackItem): FeedbackItem {
  return {
    id: String(apiItem.feedbackID),
    userName: apiItem.username,
    userEmail: apiItem.email,
    organizationName: apiItem.organizationname,

    message: apiItem.feedbackmessage,
    status: apiItem.isClose ? "closed" : "open",
    timestamp: apiItem.closeddate || new Date().toISOString(),
    replies: [],
  };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface StatusConfigEntry {
  label: string;
  icon: string;
  color: string;
  bg: string;
  darkBg: string;
}

const STATUS_CONFIG: Record<FeedbackStatus, StatusConfigEntry> = {
  open: {
    label: "Open",
    icon: "lucide:clock",
    color: "#b45309",
    bg: "#fef3c7",
    darkBg: "#3d2e00",
  },
  closed: {
    label: "Closed",
    icon: "lucide:check-circle-2",
    color: "#047857",
    bg: "#dcfce7",
    darkBg: "#14291e",
  },
};

function getAvatarColor(name: string): string {
  const palette = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#14b8a6", "#ec4899"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to check if file is PDF
function isPDFFile(pathlink: string): boolean {
  if (!pathlink) return false;
  const lower = pathlink.toLowerCase();
  return lower.includes('.pdf') || lower.includes('pdf') || lower.includes('application/pdf');
}

// Helper function to check if file is image
function isImageFile(pathlink: string): boolean {
  if (!pathlink) return false;
  const lower = pathlink.toLowerCase();
  return lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || 
         lower.includes('.gif') || lower.includes('.webp') || lower.includes('image/');
}

// Helper function to check if file is Word document
function isWordFile(pathlink: string): boolean {
  if (!pathlink) return false;
  const lower = pathlink.toLowerCase();
  return lower.includes('.doc') || lower.includes('.docx') || lower.includes('word') || 
         lower.includes('application/msword') || lower.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

// Helper function to get filename from path
function getFileNameFromPath(pathlink: string): string {
  if (!pathlink) return 'Document';
  const parts = pathlink.split('/');
  const fileName = parts[parts.length - 1];
  return fileName.split('?')[0] || 'Document';
}

// Helper function to download file
function downloadFile(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const cfg = STATUS_CONFIG[status];
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  
  return (
    <Zoom in timeout={500}>
      <Chip
        icon={
          <Icon
            icon={cfg.icon}
            style={{
              fontSize: 14,
              color: cfg.color,
            }}
          />
        }
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
          border: `1px solid ${cfg.color}30`,
          boxShadow: `0 0 20px ${cfg.color}20`,
          animation: status === "open" ? "pulse-badge 2s ease-in-out infinite, glow-badge 3s ease-in-out infinite" : "none",
          "@keyframes pulse-badge": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" },
          },
          "@keyframes glow-badge": {
            "0%, 100%": { boxShadow: "0 0 5px rgba(99,102,241,0.1)" },
            "50%": { boxShadow: "0 0 20px rgba(99,102,241,0.2)" },
          },
        }}
      />
    </Zoom>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  accent: string;
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
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
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
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
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
          <Icon icon={icon} style={{ fontSize: { xs: 18, sm: 22 } as any, color: accent }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24 },
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
              fontSize: { xs: 11, sm: 12 },
              color: isDark ? "#9ca3af" : "#64748b",
              mt: 0.25,
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
          {sub && (
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 11 },
                color: isDark ? "#6b7280" : "#94a3b8",
                mt: 0.2,
              }}
            >
              {sub}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
            animation: "pulse-ring 3s ease-in-out infinite",
            "@keyframes pulse-ring": {
              "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
              "50%": { transform: "scale(1.8)", opacity: 0 },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `linear-gradient(45deg, transparent 40%, ${accent}08 50%, transparent 60%)`,
            animation: "shimmer-card 4s ease-in-out infinite",
            "@keyframes shimmer-card": {
              "0%": { transform: "translateX(-100%) rotate(45deg)" },
              "100%": { transform: "translateX(100%) rotate(45deg)" },
            },
            pointerEvents: "none",
          }}
        />
      </Card>
    </Grow>
  );
}

// History Skeleton Component
function HistorySkeleton({ isDark }: { isDark: boolean }) {
  return (
    <Stack spacing={1.5}>
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
          }}
        >
          <Skeleton 
            variant="text" 
            width={120} 
            height={16} 
            sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} 
          />
          <Skeleton 
            variant="text" 
            width="80%" 
            height={20} 
            sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", mt: 0.5 }} 
          />
          <Skeleton 
            variant="text" 
            width={100} 
            height={14} 
            sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", mt: 0.5 }} 
          />
        </Box>
      ))}
    </Stack>
  );
}

// Reply Dialog Component
function ReplyDialog({
  open,
  onClose,
  // onSubmit,
  feedback,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reply: string) => void;
  feedback: FeedbackItem | null;
}) {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [content, setContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  // const [plainTextValue, setPlainTextValue] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPDF, setPreviewPDF] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [newReplyId, setNewReplyId] = useState<string | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  // State for file preview (same as PaymentStatusPage)
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{ file: File; name: string; url?: string } | null>(null);

  // Check if file size is valid (max 3MB)
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
console.log(previewImage,previewPDF);
  // File upload handler for the editor - Shows preview (same as PaymentStatusPage)
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
      // Simulate progress for better UX
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10; 
           if (progress >= 90) {
          progress = 90;
          clearInterval(progressInterval);
        }
        setUploadProgress(Math.min(progress, 90));
      }, 300);
      
      const fileToUpload = await compressImageIfNeeded(pendingFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Wait a moment to show 100%
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUploadedFile({
        file: fileToUpload,
        name: pendingFile.name,
        url: URL.createObjectURL(fileToUpload)
      });
      
      let fileHtml = '';
      if (pendingFile.type.startsWith('image/')) {
        fileHtml = `<p><img src="${URL.createObjectURL(fileToUpload)}" alt="${pendingFile.name}" style="max-width: 100%; height: auto;" /><br/><em>📎 ${pendingFile.name}</em></p>`;
      } else {
        fileHtml = `<p>📎 <strong>${pendingFile.name}</strong></p>`;
      }
      
      const updatedContent = content + fileHtml;
      setContent(updatedContent);
      
      // Update plain text value for validation
      // const plainText = new DOMParser()
      //   .parseFromString(updatedContent, "text/html")
      //   .body.textContent || "";
      // setPlainTextValue(plainText);
      
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
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      setPendingFile(null);
      setFilePreviewUrl("");
    }
  };

  // Cancel file upload
  const cancelFileUpload = () => {
    setFilePreviewOpen(false);
    setPendingFile(null);
    setFilePreviewUrl("");
    setIsUploading(false);
    setUploadProgress(0);
    if ((window as any).__fileUploadReject) {
      (window as any).__fileUploadReject(new Error('Upload cancelled'));
      delete (window as any).__fileUploadResolve;
      delete (window as any).__fileUploadReject;
    }
  };

  const handleChange = (newContent: string) => {
    // const plainText = new DOMParser()
    //   .parseFromString(newContent, "text/html")
    //   .body.textContent || "";
    // setPlainTextValue(plainText);
    setContent(newContent);
  };

  const handleSendReply = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Simulate progress for sending
      let progress = 0;
      const progressInterval = setInterval(() => {
   progress += 10; 
           if (progress >= 95) {
          progress = 95;
          clearInterval(progressInterval);
        }
        setUploadProgress(Math.min(progress, 95));
      }, 400);
      
      const hasImageTag = /<img\b[^>]*>/i.test(content)
      const formData = new FormData();
      
      // Extract text content from HTML
      const parsedDoc = new DOMParser().parseFromString(content, 'text/html');
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
      
      formData.append('Feedbackmessage', textOnlyMessage);
      formData.append('FeedbackID', feedback?.id ?? '');
      
      // If we have an uploaded file, attach it
      if (uploadedFile) {
        formData.append('file', uploadedFile.file);
      }
      
      // Check if there's a base64 image in the content
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

      await axios.post(
        `${Baseurl}/Feedback/ReplyFeedback`,
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
           const roundedProgress = Math.round(percentCompleted / 5) * 5;
          setUploadProgress(Math.min(roundedProgress, 95));
          },
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      await Feedbackhistory();
      toast.success("Reply Uploaded Successfully!");
      setContent('');
      // setPlainTextValue('');
      setUploadedFile(null);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'File upload failed');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setContent('');
        // setPlainTextValue('');
      }, 500);
    }
  };

  const Feedbackhistory = async () => {
    setIsHistoryLoading(true);
    try {
      const Baseurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${Baseurl}/Feedback/GetFeedbackhistorylist?FeedbackID=${feedback?.id}`);
      setHistoryData(response.data);
      if (response.data.length > 0) {
        const latestReply = response.data[response.data.length - 1];
        setNewReplyId(latestReply.id);
        setTimeout(() => {
          if (historyEndRef.current) {
            historyEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 300);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (open && feedback?.id) {
      Feedbackhistory();
    }
    if (!open) {
      setHistoryData([]);
      setNewReplyId(null);
      setUploadedFile(null);
      setFilePreviewOpen(false);
      setPendingFile(null);
      setFilePreviewUrl("");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [open, feedback?.id]);

  const handleSubmit = async () => {
    await handleSendReply();
  };

  if (!feedback) return null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ timeout: 400 }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            bgcolor: isDark ? "#0F1828" : "#ffffff",
            animation: "dialog-enter 0.5s ease-out",
            "@keyframes dialog-enter": {
              "0%": { transform: "scale(0.8) rotate(-5deg)", opacity: 0 },
              "100%": { transform: "scale(1) rotate(0deg)", opacity: 1 },
            },
            margin: { xs: 1, sm: 2, md: 3 },
            maxHeight: { xs: "95vh", sm: "90vh" },
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pr: { xs: 6, sm: 6 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Zoom in timeout={800}>
              <Avatar 
                sx={{ 
                  bgcolor: "primary.main",
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                }}
              >
                {feedback.userName.charAt(0)}
              </Avatar>
            </Zoom>
            <Box>
              <Typography sx={{ 
                color: isDark ? "#ffffff" : "#0f172a",
                animation: "slide-in-right 0.5s ease-out",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 600,
                "@keyframes slide-in-right": {
                  "0%": { transform: "translateX(-20px)", opacity: 0 },
                  "100%": { transform: "translateX(0)", opacity: 1 },
                },
              }}>
                Reply to {feedback.userName}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? "#9ca3af" : "#475569", display: "block" }}>
                {feedback.userEmail}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: isDark ? "#9ca3af" : "#64748b",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg) scale(1.1)",
              color: "#dc2626",
            },
          }}
        >
          <Icon icon="lucide:x" style={{ fontSize: 20 }} />
        </IconButton>
        <Divider sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
        <DialogContent sx={{ mt: 2, px: { xs: 1, sm: 2, md: 3 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              borderRadius: 2,
              mb: 3,
              borderLeft: "3px solid",
              borderColor: "primary.main",
              animation: "slide-in-left 0.6s ease-out",
              "@keyframes slide-in-left": {
                "0%": { transform: "translateX(-30px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateX(0) scale(1)", opacity: 1 },
              },
            }}
          >
            <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
              Original Message:
            </Typography>
            <Typography sx={{ 
              color: isDark ? "#ffffff" : "#0f172a",
              wordBreak: "break-word",
            }}>
              {feedback.message}
            </Typography>

            {isHistoryLoading ? (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
                <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
                  Reply History
                </Typography>
                <HistorySkeleton isDark={isDark} />
              </Box>
            ) : historyData.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
                <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
                  Reply History
                </Typography>
                <Stack spacing={1.5} sx={{ maxHeight: 300, overflowY: "auto" }}>
                  {historyData.map((item: any) => {
                    const isQr = item.pathlink && item.pathlink.toLowerCase().includes("qr");
                    const isNewReply = item.id === newReplyId;
                    const isPDF = isPDFFile(item.pathlink);
                    const isWord = isWordFile(item.pathlink);
                    const isImage = isImageFile(item.pathlink) && !isQr;
                    
                    return (
                      <Box
                        key={item.id}
                        ref={isNewReply ? historyEndRef : null}
                        sx={{
                          position: "relative",
                          p: 1.5,
                          pr: 8,
                          borderRadius: 2,
                          bgcolor: isNewReply 
                            ? (isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)")
                            : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
                          border: "1px solid",
                          borderColor: isNewReply 
                            ? "#6366f1"
                            : (isDark ? "#1a2744" : "#e2e8f0"),
                          transition: "all 0.4s ease",
                          animation: isNewReply ? "highlight-pulse 2s ease-in-out" : "none",
                          "@keyframes highlight-pulse": {
                            "0%": { 
                              transform: "scale(1)",
                              boxShadow: "0 0 0 0 rgba(99,102,241,0.4)"
                            },
                            "50%": { 
                              transform: "scale(1.02)",
                              boxShadow: "0 0 20px 8px rgba(99,102,241,0.15)"
                            },
                            "100%": { 
                              transform: "scale(1)",
                              boxShadow: "0 0 0 0 rgba(99,102,241,0)"
                            },
                          },
                        }}
                      >
                        {isNewReply && (
                          <Chip
                            label="New"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: 8,
                              bgcolor: "#6366f1",
                              color: "#ffffff",
                              fontWeight: 600,
                              fontSize: "0.6rem",
                              height: 20,
                              borderRadius: "4px",
                              animation: "bounce-in 0.5s ease-out",
                              "@keyframes bounce-in": {
                                "0%": { transform: "scale(0) rotate(-10deg)" },
                                "50%": { transform: "scale(1.3) rotate(5deg)" },
                                "100%": { transform: "scale(1) rotate(0deg)" },
                              },
                            }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 12,
                            color: isDark ? "#9ca3af" : "#475569",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.createdate}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: isDark ? "#c8d0e6" : "#334155",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            mb: 0.5,
                          }}
                        >
                          Reply
                        </Typography>
                        {item.feedbackmessage && (
                          <Typography
                            sx={{ 
                              color: isDark ? "#ffffff" : "#0f172a",
                              wordBreak: "break-word",
                              fontSize: "0.875rem",
                              mb: item.pathlink && !isQr ? 1 : 0,
                              "& p": { margin: 0 },
                            }}
                            dangerouslySetInnerHTML={{ __html: item.feedbackmessage }}
                          />
                        )}
                        {item.pathlink && !isQr && isImage && (
                          <Box
                            component="img"
                            src={item.pathlink}
                            alt="attachment"
                            onClick={() => setPreviewImage(item.pathlink)}
                            sx={{
                              maxWidth: "100%",
                              maxHeight: 220,
                              borderRadius: 1.5,
                              display: "block",
                              objectFit: "contain",
                              cursor: "pointer",
                              transition: "opacity 0.2s ease",
                              "&:hover": {
                                opacity: 0.85,
                              },
                            }}
                          />
                        )}
                        {item.pathlink && !isQr && isPDF && (
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 1.5,
                              bgcolor: isDark ? "rgba(220,38,38,0.08)" : "rgba(220,38,38,0.05)",
                              border: "1px solid",
                              borderColor: isDark ? "rgba(220,38,38,0.2)" : "rgba(220,38,38,0.15)",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                              },
                            }}
                            onClick={() => setPreviewPDF(item.pathlink)}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: "#dc2626",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Icon icon="lucide:file-text" style={{ fontSize: 24, color: "#ffffff" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ 
                                fontWeight: 600, 
                                color: isDark ? "#ffffff" : "#0f172a",
                                fontSize: "0.875rem",
                              }}>
                                PDF Document
                              </Typography>
                              <Typography sx={{ 
                                color: isDark ? "#9ca3af" : "#64748b",
                                fontSize: "0.75rem",
                              }}>
                                Click to view PDF
                              </Typography>
                            </Box>
                            <Icon icon="lucide:eye" style={{ fontSize: 20, color: isDark ? "#9ca3af" : "#64748b" }} />
                          </Box>
                        )}
                        {item.pathlink && !isQr && isWord && (
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 1.5,
                              bgcolor: isDark ? "rgba(30,136,229,0.08)" : "rgba(30,136,229,0.05)",
                              border: "1px solid",
                              borderColor: isDark ? "rgba(30,136,229,0.2)" : "rgba(30,136,229,0.15)",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                              },
                            }}
                            onClick={() => {
                              const fileName = getFileNameFromPath(item.pathlink);
                              downloadFile(item.pathlink, fileName);
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: "#1e88e5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Icon icon="lucide:file-text" style={{ fontSize: 24, color: "#ffffff" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ 
                                fontWeight: 600, 
                                color: isDark ? "#ffffff" : "#0f172a",
                                fontSize: "0.875rem",
                              }}>
                                {getFileNameFromPath(item.pathlink)}
                              </Typography>
                              <Typography sx={{ 
                                color: isDark ? "#9ca3af" : "#64748b",
                                fontSize: "0.75rem",
                              }}>
                                Word Document • Click to download
                              </Typography>
                            </Box>
                            <Icon icon="lucide:download" style={{ fontSize: 20, color: "#1e88e5" }} />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Paper>
          <MyEditor
            placeholder="Write your content here..."
            height="400"
            onChange={handleChange}
            setContent={content}
            defaultValue="<p>Initial content</p>"
            onFileUpload={handleFileUpload}
          />
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
                  let updatedContent = content.replace(/<p>📎 <strong>.*?<\/strong><\/p>/, '');
                  updatedContent = updatedContent.replace(/<p><img[^>]*\/><br\/><em>📎 .*?<\/em><\/p>/, '');
                  setContent(updatedContent);
                  // const plainText = new DOMParser()
                  //   .parseFromString(updatedContent, "text/html")
                  //   .body.textContent || "";
                  // setPlainTextValue(plainText);
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
          {isUploading && (
            <Box width="100%" mb={2} sx={{ 
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.03)",
              border: "1px solid",
              borderColor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
              animation: "fadeIn 0.3s ease-in",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(-10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              }
            }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ 
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    }
                  }}>
                    <Icon icon="lucide:loader-2" style={{ fontSize: 18, color: "#6366f1" }} />
                  </Box>
                  <Typography variant="body2" sx={{ 
                    color: isDark ? "#e2e8f0" : "#1e293b",
                    fontWeight: 500,
                  }}>
                    {filePreviewOpen ? 'Uploading file...' : 'Sending reply...'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  color: "#6366f1", 
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  bgcolor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                }}>
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 6,
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.12)",
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)`,
                    backgroundSize: '200% 100%',
                    animation: 'progressGlow 1.5s ease-in-out infinite',
                    '@keyframes progressGlow': {
                      '0%': { backgroundPosition: '200% 0' },
                      '100%': { backgroundPosition: '-200% 0' },
                    },
                  },
                  boxShadow: "0 2px 10px rgba(99,102,241,0.2)",
                }} 
              />
              <Typography variant="caption" sx={{ 
                display: 'block',
                mt: 0.5,
                color: isDark ? "#6b7280" : "#94a3b8",
                textAlign: 'center',
                fontSize: '0.7rem',
              }}>
                {uploadProgress < 100 ? 'Processing...' : 'Complete!'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0, flexWrap: "wrap", gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={content == '<p><br></p>' || isUploading}          
            endIcon={<Icon icon="lucide:send" />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 600,
              bgcolor: "#6366f1",
              transition: "all 0.4s ease",
              "&:hover:not(:disabled)": {
                transform: "scale(1.05) translateY(-3px)",
                boxShadow: "0 12px 35px rgba(99,102,241,0.4)",
                bgcolor: "#4f46e5",
              },
              "&:active:not(:disabled)": {
                transform: "scale(0.95)",
              },
              "&.Mui-disabled": {
                bgcolor: isDark ? "rgba(255,255,255,0.12)" : undefined,
                color: isDark ? "rgba(255,255,255,0.4)" : undefined,
              },
            }}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog - Same as PaymentStatusPage */}
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
                  Click "Attach to Reply" to add this document
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
                  Click "Attach to Reply" to add this document
                </Typography>
              </Box>
            )}
          </Box>
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
            Attach to Reply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// View Feedback Dialog
function ViewFeedbackDialog({
  open,
  onClose,
  feedback,
  // onReply,
  onStatusChange,
}: {
  open: boolean;
  onClose: () => void;
  feedback: FeedbackItem | null;
  onReply: (feedbackId: string, replyMessage: string) => void;
  onStatusChange: (feedbackId: string, newStatus: FeedbackStatus) => void;
}) {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [content, setContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPDF, setPreviewPDF] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [newReplyId, setNewReplyId] = useState<string | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  // State for file preview (same as PaymentStatusPage)
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{ file: File; name: string; url?: string } | null>(null);

  // Check if file size is valid (max 3MB)
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

  // File upload handler for the editor - Shows preview (same as PaymentStatusPage)
  const handleFileUpload = async (file: File): Promise<{ url: string; name: string }> => {
    return new Promise((resolve, reject) => {
      if (!isFileTypeAllowed(file)) {
        toast.error('File type not supported. Please upload PDF, Word, or image files.');
        reject(new Error('File type not supported'));
        return;
      }

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
      // Simulate progress for better UX
      let progress = 0;
      const progressInterval = setInterval(() => {
           progress += 10; 
        if (progress >= 90) {
          progress = 90;
          clearInterval(progressInterval);
        }
        setUploadProgress(Math.min(progress, 90));
      }, 300);
      
      const fileToUpload = await compressImageIfNeeded(pendingFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Wait a moment to show 100%
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUploadedFile({
        file: fileToUpload,
        name: pendingFile.name,
        url: URL.createObjectURL(fileToUpload)
      });
      
      let fileHtml = '';
      if (pendingFile.type.startsWith('image/')) {
        fileHtml = `<p><img src="${URL.createObjectURL(fileToUpload)}" alt="${pendingFile.name}" style="max-width: 100%; height: auto;" /><br/><em>📎 ${pendingFile.name}</em></p>`;
      } else {
        fileHtml = `<p>📎 <strong>${pendingFile.name}</strong></p>`;
      }
      
      const updatedContent = content + fileHtml;
      setContent(updatedContent);
      
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
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      setPendingFile(null);
      setFilePreviewUrl("");
    }
  };

  // Cancel file upload
  const cancelFileUpload = () => {
    setFilePreviewOpen(false);
    setPendingFile(null);
    setFilePreviewUrl("");
    setIsUploading(false);
    setUploadProgress(0);
    if ((window as any).__fileUploadReject) {
      (window as any).__fileUploadReject(new Error('Upload cancelled'));
      delete (window as any).__fileUploadResolve;
      delete (window as any).__fileUploadReject;
    }
  };

  const handleChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSendReply = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Simulate progress for sending
      let progress = 0;
      const progressInterval = setInterval(() => {
   progress += 10; 
           if (progress >= 95) {
          progress = 95;
          clearInterval(progressInterval);
        }
        setUploadProgress(Math.min(progress, 95));
      }, 400);
      
      const hasImageTag = /<img\b[^>]*>/i.test(content);
      const formData = new FormData();
      
      const parsedDoc = new DOMParser().parseFromString(content, 'text/html');
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
      
      formData.append('Feedbackmessage', textOnlyMessage);
      formData.append('FeedbackID', feedback?.id ?? '');
      
      if (uploadedFile) {
        formData.append('file', uploadedFile.file);
      }
      
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

      await axios.post(
        `${Baseurl}/Feedback/ReplyFeedback`,
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
            const roundedProgress = Math.round(percentCompleted / 5) * 5;
          setUploadProgress(Math.min(roundedProgress, 95));
          },
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      await Feedbackhistory();
      toast.success("Reply Uploaded Successfully!");
      setContent('');
      setUploadedFile(null);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'File upload failed');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setContent('');
      }, 500);
    }
  };

  const handleReply = async () => {
    await handleSendReply();
  };

  const Feedbackhistory = async () => {
    setIsHistoryLoading(true);
    try {
      const Baseurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${Baseurl}/Feedback/GetFeedbackhistorylist?FeedbackID=${feedback?.id}`);
      setHistoryData(response.data);
      if (response.data.length > 0) {
        const latestReply = response.data[response.data.length - 1];
        setNewReplyId(latestReply.id);
        setTimeout(() => {
          if (historyEndRef.current) {
            historyEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 300);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (open && feedback?.id) {
      Feedbackhistory();
    }
    if (!open) {
      setHistoryData([]);
      setNewReplyId(null);
      setUploadedFile(null);
      setFilePreviewOpen(false);
      setPendingFile(null);
      setFilePreviewUrl("");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [open, feedback?.id]);

  const handleStatusToggle = () => {
    if (feedback) {
      const newStatus = feedback.status === "open" ? "closed" : "open";
      onStatusChange(feedback.id, newStatus);
    }
  };

  if (!feedback) return null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            bgcolor: isDark ? "#0F1828" : "#ffffff",
            animation: "dialog-zoom 0.6s ease-out",
            "@keyframes dialog-zoom": {
              "0%": { transform: "scale(0.7) rotate(3deg)", opacity: 0 },
              "100%": { transform: "scale(1) rotate(0deg)", opacity: 1 },
            },
            margin: { xs: 1, sm: 2, md: 3 },
            maxHeight: { xs: "95vh", sm: "90vh" },
          }
        }}
      >
        <DialogTitle sx={{ pr: { xs: 6, sm: 8 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", minWidth: 0 }}>
              <Zoom in timeout={800}>
                <Avatar 
                  sx={{ 
                    bgcolor: "primary.main",
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                  }}
                >
                  {feedback.userName.charAt(0)}
                </Avatar>
              </Zoom>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ 
                  color: isDark ? "#ffffff" : "#0f172a",
                  animation: "fade-in 0.5s ease-out",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: 600,
                  wordBreak: "break-word",
                  "@keyframes fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                  },
                }}>
                  {feedback.userName}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? "#9ca3af" : "#475569", display: "block" }}>
                  {feedback.userEmail}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <StatusBadge status={feedback.status} />
              <Tooltip title={feedback.status === "open" ? "Close Feedback" : "Reopen Feedback"}>
                <IconButton
                  onClick={handleStatusToggle}
                  size="small"
                  sx={{
                    color: feedback.status === "open" ? "#16a34a" : "#d97706",
                    transition: "all 0.4s ease",
                    bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.1)" : "rgba(217,119,6,0.1)",
                    "&:hover": {
                      transform: "rotate(180deg) scale(1.2)",
                      bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.2)" : "rgba(217,119,6,0.2)",
                    },
                  }}
                >
                  <Icon 
                    icon={feedback.status === "open" ? "lucide:check-circle" : "lucide:clock"} 
                    style={{ fontSize: 20 }} 
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: isDark ? "#9ca3af" : "#64748b",
            zIndex: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg) scale(1.1)",
              color: "#dc2626",
            },
          }}
        >
          <Icon icon="lucide:x" style={{ fontSize: 20 }} />
        </IconButton>
        <Divider sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
        <DialogContent sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                borderRadius: 2,
                mb: 3,
                borderLeft: "3px solid",
                borderColor: "primary.main",
                animation: "slide-in-left 0.6s ease-out",
                "@keyframes slide-in-left": {
                  "0%": { transform: "translateX(-30px) scale(0.95)", opacity: 0 },
                  "100%": { transform: "translateX(0) scale(1)", opacity: 1 },
                },
              }}
            >
              <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
                Original Message:
              </Typography>
              <Typography sx={{ 
                color: isDark ? "#ffffff" : "#0f172a",
                wordBreak: "break-word",
              }}>
                {feedback.message}
              </Typography>

              {isHistoryLoading ? (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
                  <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
                    Reply History
                  </Typography>
                  <HistorySkeleton isDark={isDark} />
                </Box>
              ) : historyData.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
                  <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
                    Reply History
                  </Typography>
                  <Stack spacing={1.5} sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {historyData.map((item: any) => {
                      const isQr = item.pathlink && item.pathlink.toLowerCase().includes("qr");
                      const isNewReply = item.id === newReplyId;
                      const isPDF = isPDFFile(item.pathlink);
                      const isWord = isWordFile(item.pathlink);
                      const isImage = isImageFile(item.pathlink) && !isQr;
                      
                      return (
                        <Box
                          key={item.id}
                          ref={isNewReply ? historyEndRef : null}
                          sx={{
                            position: "relative",
                            p: 1.5,
                            pr: 8,
                            borderRadius: 2,
                            bgcolor: isNewReply 
                              ? (isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)")
                              : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
                            border: "1px solid",
                            borderColor: isNewReply 
                              ? "#6366f1"
                              : (isDark ? "#1a2744" : "#e2e8f0"),
                            transition: "all 0.4s ease",
                            animation: isNewReply ? "highlight-pulse 2s ease-in-out" : "none",
                            "@keyframes highlight-pulse": {
                              "0%": { 
                                transform: "scale(1)",
                                boxShadow: "0 0 0 0 rgba(99,102,241,0.4)"
                              },
                              "50%": { 
                                transform: "scale(1.02)",
                                boxShadow: "0 0 20px 8px rgba(99,102,241,0.15)"
                              },
                              "100%": { 
                                transform: "scale(1)",
                                boxShadow: "0 0 0 0 rgba(99,102,241,0)"
                              },
                            },
                          }}
                        >
                          {isNewReply && (
                            <Chip
                              label="New"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: 8,
                                bgcolor: "#6366f1",
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: "0.6rem",
                                height: 20,
                                borderRadius: "4px",
                                animation: "bounce-in 0.5s ease-out",
                                "@keyframes bounce-in": {
                                  "0%": { transform: "scale(0) rotate(-10deg)" },
                                  "50%": { transform: "scale(1.3) rotate(5deg)" },
                                  "100%": { transform: "scale(1) rotate(0deg)" },
                                },
                              }}
                            />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 12,
                              color: isDark ? "#9ca3af" : "#475569",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.createdate}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: isDark ? "#c8d0e6" : "#334155",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              mb: 0.5,
                            }}
                          >
                            Reply
                          </Typography>
                          {item.feedbackmessage && (
                            <Typography
                              sx={{ 
                                color: isDark ? "#ffffff" : "#0f172a",
                                wordBreak: "break-word",
                                fontSize: "0.875rem",
                                mb: item.pathlink && !isQr ? 1 : 0,
                                "& p": { margin: 0 },
                              }}
                              dangerouslySetInnerHTML={{ __html: item.feedbackmessage }}
                            />
                          )}
                          {item.pathlink && !isQr && isImage && (
                            <Box
                              component="img"
                              src={item.pathlink}
                              alt="attachment"
                              onClick={() => setPreviewImage(item.pathlink)}
                              sx={{
                                maxWidth: "100%",
                                maxHeight: 220,
                                borderRadius: 1.5,
                                display: "block",
                                objectFit: "contain",
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                                "&:hover": {
                                  opacity: 0.85,
                                },
                              }}
                            />
                          )}
                          {item.pathlink && !isQr && isPDF && (
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 1.5,
                                bgcolor: isDark ? "rgba(220,38,38,0.08)" : "rgba(220,38,38,0.05)",
                                border: "1px solid",
                                borderColor: isDark ? "rgba(220,38,38,0.2)" : "rgba(220,38,38,0.15)",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                },
                              }}
                              onClick={() => setPreviewPDF(item.pathlink)}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2,
                                  bgcolor: "#dc2626",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Icon icon="lucide:file-text" style={{ fontSize: 24, color: "#ffffff" }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ 
                                  fontWeight: 600, 
                                  color: isDark ? "#ffffff" : "#0f172a",
                                  fontSize: "0.875rem",
                                }}>
                                  PDF Document
                                </Typography>
                                <Typography sx={{ 
                                  color: isDark ? "#9ca3af" : "#64748b",
                                  fontSize: "0.75rem",
                                }}>
                                  Click to view PDF
                                </Typography>
                              </Box>
                              <Icon icon="lucide:eye" style={{ fontSize: 20, color: isDark ? "#9ca3af" : "#64748b" }} />
                            </Box>
                          )}
                          {item.pathlink && !isQr && isWord && (
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 1.5,
                                bgcolor: isDark ? "rgba(30,136,229,0.08)" : "rgba(30,136,229,0.05)",
                                border: "1px solid",
                                borderColor: isDark ? "rgba(30,136,229,0.2)" : "rgba(30,136,229,0.15)",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                },
                              }}
                              onClick={() => {
                                const fileName = getFileNameFromPath(item.pathlink);
                                downloadFile(item.pathlink, fileName);
                              }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2,
                                  bgcolor: "#1e88e5",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Icon icon="lucide:file-text" style={{ fontSize: 24, color: "#ffffff" }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ 
                                  fontWeight: 600, 
                                  color: isDark ? "#ffffff" : "#0f172a",
                                  fontSize: "0.875rem",
                                }}>
                                  {getFileNameFromPath(item.pathlink)}
                                </Typography>
                                <Typography sx={{ 
                                  color: isDark ? "#9ca3af" : "#64748b",
                                  fontSize: "0.75rem",
                                }}>
                                  Word Document • Click to download
                                </Typography>
                              </Box>
                              <Icon icon="lucide:download" style={{ fontSize: 20, color: "#1e88e5" }} />
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </Paper>
           
            <MyEditor
              placeholder="Write your content here..."
              height="400"
              onChange={handleChange}
              setContent={content}
              defaultValue="<p>Initial content</p>"
              onFileUpload={handleFileUpload}
            />
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
                    let updatedContent = content.replace(/<p>📎 <strong>.*?<\/strong><\/p>/, '');
                    updatedContent = updatedContent.replace(/<p><img[^>]*\/><br\/><em>📎 .*?<\/em><\/p>/, '');
                    setContent(updatedContent);
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
            {isUploading && (
              <Box width="100%" mb={2} sx={{ 
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.03)",
                border: "1px solid",
                borderColor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                animation: "fadeIn 0.3s ease-in",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(-10px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                }
              }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ 
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      }
                    }}>
                      <Icon icon="lucide:loader-2" style={{ fontSize: 18, color: "#6366f1" }} />
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: isDark ? "#e2e8f0" : "#1e293b",
                      fontWeight: 500,
                    }}>
                      {filePreviewOpen ? 'Uploading file...' : 'Sending reply...'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    color: "#6366f1", 
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    bgcolor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}>
                    {uploadProgress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 6,
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.12)",
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: `linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)`,
                      backgroundSize: '200% 100%',
                      animation: 'progressGlow 1.5s ease-in-out infinite',
                      '@keyframes progressGlow': {
                        '0%': { backgroundPosition: '200% 0' },
                        '100%': { backgroundPosition: '-200% 0' },
                      },
                    },
                    boxShadow: "0 2px 10px rgba(99,102,241,0.2)",
                  }} 
                />
                <Typography variant="caption" sx={{ 
                  display: 'block',
                  mt: 0.5,
                  color: isDark ? "#6b7280" : "#94a3b8",
                  textAlign: 'center',
                  fontSize: '0.7rem',
                }}>
                  {uploadProgress < 100 ? 'Processing...' : 'Complete!'}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              <Dialog
                open={!!previewImage}
                onClose={() => setPreviewImage(null)}
                maxWidth="md"
                PaperProps={{
                  sx: {
                    bgcolor: "transparent",
                    boxShadow: "none",
                    overflow: "visible",
                  },
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {previewImage && (
                    <Box
                      component="img"
                      src={previewImage}
                      alt="preview"
                      sx={{
                        maxWidth: { xs: "90vw", sm: 800 },
                        maxHeight: { xs: "75vh", sm: 800 },
                        width: "auto",
                        height: "auto",
                        borderRadius: 2,
                        display: "block",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </Box>
                <IconButton
                  onClick={() => setPreviewImage(null)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: isDark ? "rgba(15,24,40,0.85)" : "rgba(255,255,255,0.9)",
                    color: isDark ? "#ffffff" : "#0f172a",
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    "&:hover": {
                      bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                    },
                  }}
                >
                  <Icon icon="lucide:x" style={{ fontSize: 18 }} />
                </IconButton>
              </Dialog>

              {/* PDF Preview Dialog */}
              <Dialog
                open={!!previewPDF}
                onClose={() => setPreviewPDF(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                  sx: {
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    borderRadius: 3,
                    maxHeight: "90vh",
                  },
                }}
              >
                <DialogTitle sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  borderBottom: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                }}>
                  <Typography sx={{ fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                    PDF Preview
                  </Typography>
                  <IconButton onClick={() => setPreviewPDF(null)}>
                    <Icon icon="lucide:x" style={{ fontSize: 20, color: isDark ? "#9ca3af" : "#64748b" }} />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 2, height: "70vh" }}>
                  {previewPDF && (
                    <iframe
                      src={previewPDF}
                      title="PDF Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: 8,
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <Button
                variant="contained"
                size="small"
                disabled={content== '<p><br></p>' || isUploading}
                endIcon={<Icon icon="lucide:send" />}
                onClick={handleReply}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  bgcolor: "#6366f1",
                  transition: "all 0.4s ease",
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.05) translateY(-3px)",
                    boxShadow: "0 12px 35px rgba(99,102,241,0.4)",
                    bgcolor: "#4f46e5",
                  },
                  "&:active:not(:disabled)": {
                    transform: "scale(0.95)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: isDark ? "rgba(255,255,255,0.12)" : undefined,
                    color: isDark ? "rgba(255,255,255,0.4)" : undefined,
                  },
                }}
              >
                Send Reply
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog - Same as PaymentStatusPage */}
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
                  Click "Attach to Reply" to add this document
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
                  Click "Attach to Reply" to add this document
                </Typography>
              </Box>
            )}
          </Box>
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
            Attach to Reply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

type StatusFilter = "all" | FeedbackStatus;

// ---------------------------------------------------------------------------
// Loading Skeleton Component
// ---------------------------------------------------------------------------

function LoadingSkeleton({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) {
  if (isMobile) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: isDark ? "#0F1828" : "#f8fafc", p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
          <Skeleton variant="text" width={300} height={24} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", mt: 1 }} />
        </Box>
        
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={4} key={i}>
              <Skeleton variant="rounded" height={80} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
        
        <Skeleton variant="rounded" height={50} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "10px", mb: 2 }} />
        <Skeleton variant="rounded" height={40} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "10px", mb: 2 }} />
        
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "14px", mb: 1.5 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: isDark ? "#0F1828" : "#f8fafc", p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={250} height={45} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
          <Skeleton variant="text" width={350} height={28} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", mt: 1 }} />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton variant="rounded" height={90} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
        
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ width: { xs: "100%", lg: 480 } }}>
            <Skeleton variant="rounded" height={50} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "10px" }} />
          </Box>
          <Box sx={{ width: { xs: "100%", lg: 300 } }}>
            <Skeleton variant="rounded" height={50} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "10px" }} />
          </Box>
        </Stack>
        
        <Skeleton variant="rounded" height={400} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0", borderRadius: "14px" }} />
        
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
          <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
            <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function FeedbackContent() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    Getfeedback();
  }, []);

  const Getfeedback = async () => {
    setLoading(true);
    try {
      const response = await getfeedbackapi();
      const values: ApiFeedbackItem[] = response.data;
      const mapped = values.map(mapApiFeedbackToFeedbackItem);
      setData(mapped);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  // All hooks must be called before any conditional returns
  const statusFiltered = useMemo(
    () => (statusFilter === "all" ? data : data.filter((f) => f.status === statusFilter)),
    [data, statusFilter]
  );

  const summary = useMemo(() => {
    const open = data.filter((f) => f.status === "open");
    const closed = data.filter((f) => f.status === "closed");
    return {
      openCount: open.length,
      closedCount: closed.length,
      totalCount: data.length,
    };
  }, [data]);

  const handleReply = (feedbackId: string, replyMessage: string): void => {
    setData((prevData) =>
      prevData.map((feedback) => {
        if (feedback.id === feedbackId) {
          const newReply: Reply = {
            id: `reply_${Date.now()}`,
            message: replyMessage,
            timestamp: new Date().toISOString(),
            repliedBy: "Support Team",
          };
          return {
            ...feedback,
            replies: [...feedback.replies, newReply],
            status: feedback.status === "closed" ? "open" : feedback.status,
          };
        }
        return feedback;
      })
    );
    setSnackbar({
      open: true,
      message: "Reply sent successfully!",
      severity: "success",
    });
  };

  const handleStatusChange = (feedbackId: string, newStatus: FeedbackStatus): void => {
    setData((prevData) =>
      prevData.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback
      )
    );
    setSnackbar({
      open: true,
      message: `Feedback ${newStatus === "open" ? "reopened" : "closed"} successfully!`,
      severity: "success",
    });
  };

  const handleOpenReplyDialog = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setReplyDialogOpen(true);
  };

  const handleOpenViewDialog = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleReplySubmit = (replyMessage: string) => {
    if (selectedFeedback) {
      handleReply(selectedFeedback.id, replyMessage);
    }
  };

  // columns must be defined before any conditional return
  const columns = useMemo<ColumnDef<FeedbackItem>[]>(
    () => [
      {
        id: "user",
        accessorFn: (row) => `${row.userName} ${row.userEmail}`,
        header: "Customer",
        cell: ({ row }) => {
          const feedback = row.original;
          const avatarColor = getAvatarColor(feedback.userName);
          const initials = feedback.userName
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
                  width: { xs: 28, sm: 34 }, 
                  height: { xs: 28, sm: 34 }, 
                  fontWeight: 700, 
                  fontSize: { xs: 10, sm: 12 },
                  transition: "all 0.4s ease",
                  border: `2px solid ${avatarColor}30`,
                  "&:hover": {
                    transform: "scale(1.3) rotate(15deg)",
                    boxShadow: `0 8px 25px ${avatarColor}40`,
                  },
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ 
                  fontSize: { xs: 12, sm: 13.5 }, 
                  fontWeight: 600, 
                  color: isDark ? "#ffffff" : "#0f172a",
                  transition: "color 0.3s ease",
                }}>
                  {feedback.userName}
                </Typography>
                {!isMobile && (
                  <Typography noWrap sx={{ 
                    fontSize: { xs: 10, sm: 12 }, 
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "color 0.3s ease",
                  }}>
                    {feedback.userEmail}
                  </Typography>
                )}
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "message",
        header: "Feedback",
        cell: ({ row }) => (
          <Typography noWrap sx={{ 
            fontSize: { xs: 11, sm: 13 }, 
            color: isDark ? "#9ca3af" : "#475569",
            maxWidth: { xs: 100, sm: 200, md: 250 },
            transition: "all 0.3s ease",
            "&:hover": {
              color: isDark ? "#ffffff" : "#0f172a",
              transform: "scale(1.02)",
            },
          }}>
            {row.original.message}
          </Typography>
        ),
      },
      {
        accessorKey: "organizationName",
        header: "Organization",
        cell: ({ row }) => (
          <Typography noWrap sx={{ 
            fontSize: { xs: 11, sm: 13 }, 
            color: isDark ? "#9ca3af" : "#475569",
            maxWidth: { xs: 100, sm: 150, md: 180 },
          }}>
            {row.original.organizationName}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, columnId, filterValue: StatusFilter) =>
          filterValue === "all" || row.getValue(columnId) === filterValue,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "timestamp",
        header: "Date",
        cell: ({ row }) => (
          <Typography sx={{ 
            fontSize: { xs: 10, sm: 13 }, 
            color: isDark ? "#9ca3af" : "#475569",
            transition: "color 0.3s ease",
          }}>
            {formatDate(row.original.timestamp)}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const feedback = row.original;
          return (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="View Details" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenViewDialog(feedback);
                  }}
                  sx={{
                    color: isDark ? "#9ca3af" : "#64748b",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      color: "#6366f1",
                      transform: "scale(1.15)",
                      bgcolor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
                    },
                  }}
                >
                  <Icon icon="lucide:eye" style={{ color: isDark? "white": 'black', fontSize: { xs: 16, sm: 18 } as any }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reply" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReplyDialog(feedback);
                  }}
                  sx={{
                    color: isDark ? "#9ca3af" : "#64748b",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      color: "#10b981",
                      transform: "scale(1.15) rotate(-10deg)",
                      bgcolor: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.08)",
                    },
                  }}
                >
                  <Icon icon="lucide:reply" style={{color: isDark? "white": 'black',  fontSize: { xs: 16, sm: 18 } as any }} />
                </IconButton>
              </Tooltip>

              {!isMobile && (
                <Tooltip title={feedback.status === "open" ? "Close Feedback" : "Reopen Feedback"} arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(feedback.id, feedback.status === "open" ? "closed" : "open");
                    }}
                    sx={{
                      color: feedback.status === "open" ? "#16a34a" : "#d97706",
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: feedback.status === "open" ? "rotate(90deg) scale(1.15)" : "rotate(-90deg) scale(1.15)",
                        bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.15)" : "rgba(217,119,6,0.15)",
                      },
                    }}
                  >
                    <Icon
                      icon={feedback.status === "open" ? "lucide:check-circle" : "lucide:clock"}
                      style={{color: isDark? "white": 'black',  fontSize: { xs: 16, sm: 18 } as any }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        },
      },
    ],
    [isDark, isMobile]
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
    initialState: { pagination: { pageSize: isMobile ? 5 : 9 } },
  });

  const gridRows = table.getRowModel().rows;

  // Now conditional return is safe - all hooks have been called
  if (loading) {
    return <LoadingSkeleton isDark={isDark} isMobile={isMobile} />;
  }

  // Mobile view - Card based layout for small screens
  if (isMobile) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: isDark ? "#0a1220" : "#f1f5f9",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -200,
          right: -200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)",
          animation: "float-bg 20s ease-in-out infinite",
          "@keyframes float-bg": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(-50px, -30px) scale(1.2)" },
            "66%": { transform: "translate(50px, 20px) scale(0.8)" },
          },
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -200,
          left: -200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)",
          animation: "float-bg-reverse 25s ease-in-out infinite",
          "@keyframes float-bg-reverse": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(50px, 30px) scale(1.3)" },
            "66%": { transform: "translate(-50px, -20px) scale(0.7)" },
          },
        },
      }}>
        <Box sx={{ 
          maxWidth: 1440, 
          mx: "auto", 
          px: { xs: 1.5, sm: 3, md: 4 }, 
          py: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 1,
        }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ 
              fontSize: { xs: 18, sm: 20 }, 
              fontWeight: 700, 
              color: isDark ? "#ffffff" : "#0f172a",
              animation: "fade-in-down 0.8s ease-out",
              "@keyframes fade-in-down": {
                "0%": { transform: "translateY(-30px) scale(0.9)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              background: isDark ? "none" : "linear-gradient(90deg, #0f172a, #6366f1, #0f172a)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: isDark ? "none" : "text",
              WebkitTextFillColor: isDark ? "#ffffff" : "transparent",
            }}>
              Feedback Management
            </Typography>
            <Typography sx={{ 
              fontSize: { xs: 12, sm: 13.5 }, 
              color: isDark ? "#9ca3af" : "#64748b", 
              mt: 0.4,
              animation: "fade-in-up 0.8s ease-out",
              "@keyframes fade-in-up": {
                "0%": { transform: "translateY(20px)", opacity: 0 },
                "100%": { transform: "translateY(0)", opacity: 1 },
              },
            }}>
              Review and respond to customer feedback
            </Typography>
          </Box>

          {/* Summary cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <SummaryCard
                icon="lucide:message-square"
                label="Total"
                value={summary.totalCount.toString()}
                accent="#6366f1"
              />
            </Grid>
            <Grid item xs={4}>
              <SummaryCard
                icon="lucide:clock"
                label="Open"
                value={summary.openCount.toString()}
                accent="#d97706"
              />
            </Grid>
            <Grid item xs={4}>
              <SummaryCard
                icon="lucide:check-circle-2"
                label="Closed"
                value={summary.closedCount.toString()}
                accent="#16a34a"
              />
            </Grid>
          </Grid>

          {/* Toolbar */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 3,
              borderRadius: "14px",
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "fade-in 0.6s ease-out",
              "@keyframes fade-in": {
                "0%": { opacity: 0, transform: "scale(0.95)" },
                "100%": { opacity: 1, transform: "scale(1)" },
              },
            }}
          >
            <Stack direction="column" spacing={1.5}>
              <TextField
                size="small"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                sx={{
                  width: "100%",
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
                    fontSize: "0.875rem",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon 
                        icon="lucide:search" 
                        style={{ 
                          fontSize: 16, 
                          color: isDark ? "#6b7280" : "#94a3b8",
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  borderRadius: "10px",
                  p: 0.5,
                  bgcolor: isDark ? "#0a1220" : "#f8fafc",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": { height: 0 },
                }}
              >
                {(["all", "open", "closed"] as StatusFilter[]).map((s, index) => (
                  <Grow in timeout={300 + index * 150} key={s}>
                    <Chip
                      label={s.charAt(0).toUpperCase() + s.slice(1)}
                      onClick={() => setStatusFilter(s)}
                      size="small"
                      sx={{
                        fontSize: 11,
                        fontWeight: 500,
                        borderRadius: "8px",
                        bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : "transparent",
                        color: statusFilter === s ? (isDark ? "#0F1828" : "#ffffff") : (isDark ? "#9ca3af" : "#64748b"),
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                        "&:hover": {
                          transform: "scale(1.05)",
                          bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "#1a2744" : "#f1f5f9"),
                        },
                      }}
                    />
                  </Grow>
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Mobile Card View */}
          {gridRows.length === 0 ? (
            <Zoom in timeout={600}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  bgcolor: isDark ? "#0F1828" : "#ffffff",
                  py: 6,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <Icon icon="lucide:inbox" style={{ fontSize: 48, color: isDark ? "#6b7280" : "#94a3b8" }} />
                </Box>
                <Typography sx={{ 
                  fontSize: 15, 
                  color: isDark ? "#9ca3af" : "#64748b" 
                }}>
                  No feedback matches your search or filters.
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    setGlobalFilter("");
                    setStatusFilter("all");
                  }}
                  sx={{ mt: 1.5, color: "#6366f1", textTransform: "none" }}
                >
                  Clear filters
                </Button>
              </Paper>
            </Zoom>
          ) : (
            <Stack spacing={2}>
              {gridRows.map((row, index) => {
                const feedback = row.original;
                const avatarColor = getAvatarColor(feedback.userName);
                const initials = feedback.userName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <Fade in timeout={300 + index * 80} key={row.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        borderRadius: "14px",
                        p: 2,
                        bgcolor: isDark ? "#0F1828" : "#ffffff",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                          borderColor: "#6366f1",
                        },
                      }}
                      onClick={() => handleOpenViewDialog(feedback)}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: avatarColor, 
                              width: 36, 
                              height: 36, 
                              fontWeight: 700, 
                              fontSize: 12,
                              border: `2px solid ${avatarColor}30`,
                            }}
                          >
                            {initials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography noWrap sx={{ 
                              fontSize: 13, 
                              fontWeight: 600, 
                              color: isDark ? "#ffffff" : "#0f172a",
                            }}>
                              {feedback.userName}
                            </Typography>
                            <Typography noWrap sx={{ 
                              fontSize: 10, 
                              color: isDark ? "#6b7280" : "#94a3b8",
                            }}>
                              {formatDate(feedback.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                        <StatusBadge status={feedback.status} />
                      </Box>
                      
                      <Typography sx={{ 
                        fontSize: 12, 
                        color: isDark ? "#9ca3af" : "#475569",
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {feedback.message}
                      </Typography>
                      
                      <Divider sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", mb: 1.5 }} />
                      
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReplyDialog(feedback);
                          }}
                          sx={{
                            color: isDark ? "#9ca3af" : "#64748b",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              color: "#10b981",
                              transform: "scale(1.15) rotate(-10deg)",
                              bgcolor: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.08)",
                            },
                          }}
                        >
                          <Icon icon="lucide:reply" style={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(feedback.id, feedback.status === "open" ? "closed" : "open");
                          }}
                          sx={{
                            color: feedback.status === "open" ? "#16a34a" : "#d97706",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: feedback.status === "open" ? "rotate(90deg) scale(1.15)" : "rotate(-90deg) scale(1.15)",
                              bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.15)" : "rgba(217,119,6,0.15)",
                            },
                          }}
                        >
                          <Icon 
                            icon={feedback.status === "open" ? "lucide:check-circle" : "lucide:clock"} 
                            style={{ fontSize: 18 }} 
                          />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Fade>
                );
              })}
            </Stack>
          )}

          {/* Pagination */}
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{ 
              pt: 3,
              animation: "fade-in-up 0.8s ease-out",
              "@keyframes fade-in-up": {
                "0%": { transform: "translateY(30px)", opacity: 0 },
                "100%": { transform: "translateY(0)", opacity: 1 },
              },
            }}
          >
            <Typography sx={{ 
              fontSize: { xs: 10, sm: 12 }, 
              color: isDark ? "#9ca3af" : "#64748b",
              transition: "color 0.3s ease",
            }}>
              {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                size="small"
                sx={{ 
                  border: "1px solid", 
                  borderColor: isDark ? "#1a2744" : "#e2e8f0", 
                  borderRadius: "8px",
                  color: isDark ? "#ffffff" : "#0f172a",
                  transition: "all 0.3s ease",
                  padding: { xs: 0.5, sm: 1 },
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.1) translateX(-2px)",
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    borderColor: "#6366f1",
                  },
                  "&:active:not(:disabled)": {
                    transform: "scale(0.9)",
                  },
                  "&.Mui-disabled": {
                    color: isDark ? "#6b7280" : "#94a3b8",
                  }
                }}
              >
                <Icon icon="lucide:chevron-left" style={{ fontSize: 14 }} />
              </IconButton>
              <IconButton
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                size="small"
                sx={{ 
                  border: "1px solid", 
                  borderColor: isDark ? "#1a2744" : "#e2e8f0", 
                  borderRadius: "8px",
                  color: isDark ? "#ffffff" : "#0f172a",
                  transition: "all 0.3s ease",
                  padding: { xs: 0.5, sm: 1 },
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.1) translateX(2px)",
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    borderColor: "#6366f1",
                  },
                  "&:active:not(:disabled)": {
                    transform: "scale(0.9)",
                  },
                  "&.Mui-disabled": {
                    color: isDark ? "#6b7280" : "#94a3b8",
                  }
                }}
              >
                <Icon icon="lucide:chevron-right" style={{ fontSize: 14 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* Dialogs */}
        <ReplyDialog
          open={replyDialogOpen}
          onClose={() => {
            setReplyDialogOpen(false);
            setSelectedFeedback(null);
          }}
          onSubmit={handleReplySubmit}
          feedback={selectedFeedback}
        />

        <ViewFeedbackDialog
          open={viewDialogOpen}
          onClose={() => {
            setViewDialogOpen(false);
            setSelectedFeedback(null);
          }}
          feedback={selectedFeedback}
          onReply={handleReply}
          onStatusChange={handleStatusChange}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Slide}
          TransitionProps={{ timeout: 400 }}
        >
          <Zoom in timeout={500}>
            <Alert
              severity={snackbar.severity}
              sx={{
                borderRadius: 2,
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                animation: "slide-in-bottom 0.6s ease-out",
                "@keyframes slide-in-bottom": {
                  "0%": { transform: "translateY(100px) scale(0.8)", opacity: 0 },
                  "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
                },
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              }}
            >
              {snackbar.message}
            </Alert>
          </Zoom>
        </Snackbar>
      </Box>
    );
  }

  // Desktop/Tablet View
  return (
    <Box sx={{ 
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
        "@keyframes float-bg": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-80px, -40px) scale(1.2)" },
          "66%": { transform: "translate(80px, 40px) scale(0.8)" },
        },
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
        "@keyframes float-bg-reverse": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(80px, 40px) scale(1.2)" },
          "66%": { transform: "translate(-80px, -40px) scale(0.8)" },
        },
      },
    }}>
      <Box sx={{ 
        maxWidth: 1440, 
        mx: "auto", 
        px: { xs: 2, sm: 3, md: 4 }, 
        py: { xs: 3, md: 4 },
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
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
                  <Icon icon="lucide:message-square" style={{ fontSize: 24 }} />
                </Box>
                Feedback Management
                <Chip
                  label={`${data.length} items`}
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
                Review and respond to customer feedback
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={Getfeedback}
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

        {/* Summary cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <SummaryCard
              icon="lucide:message-square"
              label="Total Feedback"
              value={summary.totalCount.toString()}
              accent="#6366f1"
              sub="All submissions"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SummaryCard
              icon="lucide:clock"
              label="Open"
              value={summary.openCount.toString()}
              accent="#d97706"
              sub="Needs attention"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SummaryCard
              icon="lucide:check-circle-2"
              label="Closed"
              value={summary.closedCount.toString()}
              accent="#16a34a"
              sub="Resolved items"
            />
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
            animation: "fade-in 0.6s ease-out",
            "@keyframes fade-in": {
              "0%": { opacity: 0, transform: "scale(0.95)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
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
              placeholder="Search by name, email, or feedback..."
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
                    <Icon 
                      icon="lucide:search" 
                      style={{ 
                        fontSize: 17, 
                        color: isDark ? "#6b7280" : "#94a3b8",
                      }} 
                    />
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
              {(["all", "open", "closed"] as StatusFilter[]).map((s, index) => {
                const icons = {
                  all: "lucide:layers",
                  open: "lucide:clock",
                  closed: "lucide:check-circle",
                };
                const labels = {
                  all: "All",
                  open: "Open",
                  closed: "Closed",
                };
                return (
                  <Grow in timeout={300 + index * 150} key={s}>
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
                        bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : "transparent",
                        color: statusFilter === s ? (isDark ? "#0F1828" : "#ffffff") : (isDark ? "#9ca3af" : "#64748b"),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "#1a2744" : "#f1f5f9"),
                        },
                        "& .MuiChip-icon": {
                          color: statusFilter === s ? (isDark ? "#0F1828" : "#ffffff") : (isDark ? "#9ca3af" : "#64748b"),
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
        {gridRows.length === 0 ? (
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: "fade-in 0.6s ease-out",
                "@keyframes fade-in": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <Icon icon="lucide:inbox" style={{ fontSize: 48, color: isDark ? "#6b7280" : "#94a3b8" }} />
              </Box>
              <Typography sx={{ 
                fontSize: 15, 
                color: isDark ? "#9ca3af" : "#64748b" 
              }}>
                No feedback matches your search or filters.
              </Typography>
              <Button
                variant="text"
                onClick={() => {
                  setGlobalFilter("");
                  setStatusFilter("all");
                }}
                sx={{ mt: 1.5, color: "#6366f1", textTransform: "none" }}
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
              animation: "slide-up 0.6s ease-out",
              "@keyframes slide-up": {
                "0%": { transform: "translateY(40px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)",
                backgroundSize: "200% 100%",
                animation: "gradient-scroll 3s ease-in-out infinite",
                "@keyframes gradient-scroll": {
                  "0%": { backgroundPosition: "200% 0" },
                  "100%": { backgroundPosition: "-200% 0" },
                },
              },
            }}
          >
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="medium" sx={{ minWidth: { xs: 500, sm: 600, md: 700 } }}>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow 
                      key={headerGroup.id}
                      sx={{
                        bgcolor: isDark ? "#0a111f" : "#f8fafc",
                        borderBottom: `2px solid ${isDark ? "#1a2744" : "#e2e8f0"}`,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
                          animation: "header-glow 2s ease-in-out infinite",
                          "@keyframes header-glow": {
                            "0%": { transform: "scaleX(0)", opacity: 0 },
                            "50%": { transform: "scaleX(1)", opacity: 1 },
                            "100%": { transform: "scaleX(0)", opacity: 0 },
                          },
                        },
                      }}
                    >
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          key={header.id}
                          sx={{
                            fontSize: { xs: 10, sm: 12.5 },
                            fontWeight: 700,
                            color: isDark ? "#c8d0e6" : "#334155",
                            borderColor: isDark ? "#1a2744" : "#e2e8f0",
                            whiteSpace: "nowrap",
                            padding: "14px 16px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            position: "relative",
                            "&:hover": {
                              color: isDark ? "#ffffff" : "#0f172a",
                            },
                            "&:not(:last-child)::after": {
                              content: '""',
                              position: "absolute",
                              right: 0,
                              top: "20%",
                              height: "60%",
                              width: "1px",
                              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                            },
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {gridRows.map((row, index) => (
                    <Fade 
                      in={true} 
                      timeout={300 + index * 60} 
                      key={row.id}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        transformOrigin: "top center",
                      }}
                    >
                      <TableRow
                        sx={{
                          "&:last-child td": { borderBottom: 0 },
                          "&:hover": { 
                            bgcolor: isDark ? alpha("#6366f1", 0.06) : alpha("#6366f1", 0.04),
                            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: "scale(1.005)",
                            boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
                            "& td": {
                              borderBottomColor: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
                            }
                          },
                          "&:not(:last-child) td": {
                            borderBottom: `1px solid ${isDark ? alpha("#1a2744", 0.8) : alpha("#e2e8f0", 0.6)}`,
                          },
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          animation: `row-appear 0.5s ease-out ${index * 50}ms both`,
                          "@keyframes row-appear": {
                            "0%": { 
                              transform: "translateX(-20px) scale(0.98)", 
                              opacity: 0,
                              background: isDark ? "rgba(99,102,241,0.02)" : "rgba(99,102,241,0.02)",
                            },
                            "100%": { 
                              transform: "translateX(0) scale(1)", 
                              opacity: 1,
                              background: "transparent",
                            },
                          },
                        }}
                        onClick={() => handleOpenViewDialog(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            sx={{
                              borderColor: isDark ? "#1a2744" : "#e2e8f0",
                              py: { xs: 0.8, sm: 1.2 },
                              px: { xs: 0.5, sm: 1 },
                              color: isDark ? "#e2e8f0" : "#1e293b",
                              fontSize: { xs: 11, sm: 13 },
                              position: "relative",
                              "&:hover": {
                                color: isDark ? "#ffffff" : "#0f172a",
                              },
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
            
            <Box
              sx={{
                height: "3px",
                background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #6366f1, transparent)",
                backgroundSize: "300% 100%",
                animation: "footer-gradient 4s ease-in-out infinite",
                "@keyframes footer-gradient": {
                  "0%": { backgroundPosition: "300% 0" },
                  "100%": { backgroundPosition: "-300% 0" },
                },
              }}
            />
          </Paper>
        )}

        {/* Pagination */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ 
            pt: 3,
            animation: "fade-in-up 0.8s ease-out",
            "@keyframes fade-in-up": {
              "0%": { transform: "translateY(30px)", opacity: 0 },
              "100%": { transform: "translateY(0)", opacity: 1 },
            },
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ 
            fontSize: { xs: 10, sm: 12 }, 
            color: isDark ? "#9ca3af" : "#64748b",
            transition: "color 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#6366f1",
                animation: "pulse-dot 2s ease-in-out infinite",
                "@keyframes pulse-dot": {
                  "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                  "50%": { opacity: 1, transform: "scale(1.2)" },
                },
              }}
            />
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)} · {table.getFilteredRowModel().rows.length} results
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="small"
              sx={{ 
                border: "1px solid", 
                borderColor: isDark ? "#1a2744" : "#e2e8f0", 
                borderRadius: "8px",
                color: isDark ? "#ffffff" : "#0f172a",
                transition: "all 0.4s ease",
                padding: { xs: 0.5, sm: 1 },
                "&:hover:not(:disabled)": {
                  transform: "scale(1.15) translateX(-4px) rotate(-3deg)",
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  borderColor: "#6366f1",
                },
                "&:active:not(:disabled)": {
                  transform: "scale(0.9)",
                },
                "&.Mui-disabled": {
                  color: isDark ? "#6b7280" : "#94a3b8",
                }
              }}
            >
              <Icon icon="lucide:chevron-left" style={{ fontSize: { xs: 14, sm: 16 } as any }} />
            </IconButton>
            <IconButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="small"
              sx={{ 
                border: "1px solid", 
                borderColor: isDark ? "#1a2744" : "#e2e8f0", 
                borderRadius: "8px",
                color: isDark ? "#ffffff" : "#0f172a",
                transition: "all 0.4s ease",
                padding: { xs: 0.5, sm: 1 },
                "&:hover:not(:disabled)": {
                  transform: "scale(1.15) translateX(4px) rotate(3deg)",
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  borderColor: "#6366f1",
                },
                "&:active:not(:disabled)": {
                  transform: "scale(0.9)",
                },
                "&.Mui-disabled": {
                  color: isDark ? "#6b7280" : "#94a3b8",
                }
              }}
            >
              <Icon icon="lucide:chevron-right" style={{ fontSize: { xs: 14, sm: 16 } as any }} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Dialogs */}
      <ReplyDialog
        open={replyDialogOpen}
        onClose={() => {
          setReplyDialogOpen(false);
          setSelectedFeedback(null);
        }}
        onSubmit={handleReplySubmit}
        feedback={selectedFeedback}
      />

      <ViewFeedbackDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedFeedback(null);
        }}
        feedback={selectedFeedback}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
        TransitionProps={{ timeout: 400 }}
      >
        <Zoom in timeout={500}>
          <Alert
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              color: isDark ? "#ffffff" : "#0f172a",
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              animation: "slide-in-bottom 0.6s ease-out",
              "@keyframes slide-in-bottom": {
                "0%": { transform: "translateY(100px) scale(0.8)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Zoom>
      </Snackbar>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function FeedbackPage() {
  return <FeedbackContent />;
}