// DashboardPage.tsx - With #1878b2 Theme and Enhanced Professional Animations
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Avatar,
  Stack,
  Fade,
  Slide,
  Grow,
  Zoom,
  Paper,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  alpha,
  TablePagination,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// ============================================================================
// Types
// ============================================================================

interface User {
  id: string;
  username: string;
  email: string;
  organization: string;
  role: "Admin" | "Member" | "Viewer";
  avatar: string;
  projects: Project[];
}

interface SubTask {
  id: string;
  title: string;
  owner: string;
  plannedEffort: string;
  status: "Not Started" | "To Do" | "In Progress" | "Done";
  type: string;
  file?: string;
  notes?: string;
  dueDate: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  sprintId: string;
  createdAt: string;
  owner: string;
  type: string;
  devStatus: string;
  document?: string;
  timeline: string;
  users: string[];
  subtasks: SubTask[];
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  tasks: Task[];
  goals?: string[];
}

interface Bug {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "active" | "completed" | "on-hold";
  createdAt: string;
  sprints: Sprint[];
  tasks: Task[];
  bugs: Bug[];
}

type ViewType = "projects" | "sprints" | "tasks" | "bugs" | "boards";

// ============================================================================
// Constants
// ============================================================================

const PRIMARY_COLOR = "#1878b2";
const PRIMARY_DARK = "#0d5a85";

// ============================================================================
// Mock Data - 10 Existing Users with Fixed Roles
// ============================================================================

const USERS: User[] = [
  {
    id: "user_1",
    username: "Dhamu",
    email: "dhamu@gmail.com",
    organization: "TechCorp",
    role: "Admin",
    avatar: PRIMARY_COLOR,
    projects: []
  },
  {
    id: "user_2",
    username: "Thaniga",
    email: "thaniga@gmail.com",
    organization: "InnovateLabs",
    role: "Member",
    avatar: "#0ea5e9",
    projects: []
  },
  {
    id: "user_3",
    username: "Dinesh",
    email: "dinesh@gmail.com",
    organization: "CloudSolutions",
    role: "Viewer",
    avatar: "#f59e0b",
    projects: []
  },
  {
    id: "user_4",
    username: "Deva",
    email: "deva@gmail.com",
    organization: "DataSphere",
    role: "Member",
    avatar: "#10b981",
    projects: []
  },
  {
    id: "user_5",
    username: "Suriya",
    email: "suriya@gmail.com",
    organization: "WebWorks",
    role: "Admin",
    avatar: "#f43f5e",
    projects: []
  },
  {
    id: "user_6",
    username: "Prabhu",
    email: "prabhu@gmail.com",
    organization: "TechCorp",
    role: "Member",
    avatar: "#8b5cf6",
    projects: []
  },
  {
    id: "user_7",
    username: "Karthik",
    email: "karthik@gmail.com",
    organization: "InnovateLabs",
    role: "Viewer",
    avatar: "#14b8a6",
    projects: []
  },
  {
    id: "user_8",
    username: "Vijay",
    email: "vijay@gmail.com",
    organization: "CloudSolutions",
    role: "Member",
    avatar: "#ec4899",
    projects: []
  },
  {
    id: "user_9",
    username: "Suresh",
    email: "suresh@gmail.com",
    organization: "DataSphere",
    role: "Admin",
    avatar: "#f97316",
    projects: []
  },
  {
    id: "user_10",
    username: "Ravi",
    email: "ravi@gmail.com",
    organization: "WebWorks",
    role: "Member",
    avatar: "#06b6d4",
    projects: []
  }
];

// ============================================================================
// Mock Data Generator for Projects, Sprints, Tasks, Bugs with Subtasks
// ============================================================================

const generateSubTasks = (taskTitle: string, index: number): SubTask[] => {
  const subTaskTitles = [
    "Research competitor",
    "Create wireframe layout",
    "Design high-fidelity mockup (Figma)",
    "Add error/validation states",
    "Write documentation",
    "Review and test",
    "Deploy to staging",
    "Get client feedback"
  ];
  
  const owners = ["frontend", "backend", "devops", "QA"];
  const statuses: ("Not Started" | "To Do" | "In Progress" | "Done")[] = 
    ["Not Started", "To Do", "In Progress", "Done"];
  const types = ["frontend", "backend", "design", "devops"];
  
  const numSubTasks = Math.floor(Math.random() * 3) + 2;
  const shuffled = subTaskTitles.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numSubTasks);
  
  return selected.map((title, idx) => ({
    id: `subtask_${taskTitle}_${index}_${idx}`,
    title,
    owner: owners[idx % owners.length],
    plannedEffort: `${Math.floor(Math.random() * 4) + 1}hrs`,
    status: statuses[idx % statuses.length],
    type: types[idx % types.length],
    file: Math.random() > 0.5 ? `doc_${idx}.pdf` : undefined,
    notes: Math.random() > 0.5 ? "as possible" : undefined,
    dueDate: `August ${Math.floor(Math.random() * 30) + 1}`,
  }));
};

const generateProjectsForUser = (userName: string, orgName: string): Project[] => {
  const projectNames = [
    "E-Commerce Platform",
    "Mobile App Development",
    "AI Chatbot Integration",
    "Analytics Dashboard",
    "CRM System",
    "Inventory Management",
    "HR Portal",
    "Payment Gateway"
  ];
  
  const statuses: ("active" | "completed" | "on-hold")[] = ["active", "active", "completed", "active", "on-hold", "active", "completed", "active"];
  const sprintNames = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"];
  const sprintGoals = [
    ["Complete user authentication", "Setup database", "Design UI"],
    ["Implement payment gateway", "Add search functionality", "Optimize performance"],
    ["Deploy to production", "Write documentation", "Fix critical bugs"],
    ["Add analytics", "Implement notifications", "Security audit"]
  ];
  const taskTitles = [
    "Design login page UI",
    "Implement API endpoints",
    "Fix authentication bug",
    "Write documentation",
    "Deploy to production",
    "Create unit tests",
    "Optimize performance",
    "Setup CI/CD pipeline",
    "Review PRs",
    "Update dependencies",
    "Database migration",
    "Security audit"
  ];
  const owners = ["frontend", "backend", "devops", "QA"];
  const types = ["frontend", "backend", "design", "devops"];
  const devStatuses = ["Done", "In Progress", "To Do", "Not Started"];
  
  const bugTitles = [
    "Authentication error",
    "Data not loading",
    "UI alignment issue",
    "Performance degradation",
    "API timeout",
    "Memory leak",
    "Security vulnerability",
    "Broken link",
    "Form validation issue",
    "Mobile responsiveness"
  ];

  const numProjects = Math.floor(Math.random() * 3) + 2;
  const shuffledProjects = projectNames.sort(() => Math.random() - 0.5);
  const selectedProjects = shuffledProjects.slice(0, numProjects);

  return selectedProjects.map((name, index) => {
    const status = statuses[index % statuses.length];
    const progress = Math.floor(Math.random() * 100);
    const sprintCount = Math.floor(Math.random() * 3) + 2;

    const sprints: Sprint[] = Array.from({ length: sprintCount }, (_, sIndex) => {
      const sprintStatuses: ("active" | "completed" | "upcoming")[] = ["active", "completed", "upcoming"];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + sIndex * 14);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 13);

      const sprintTasks: Task[] = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, tIndex) => {
        const taskTitle = taskTitles[(tIndex + sIndex + index) % taskTitles.length];
        const subtasks = generateSubTasks(taskTitle, tIndex);
        
        const start = new Date();
        const end = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        
        return {
          id: `task_${index}_${sIndex}_${tIndex}`,
          title: taskTitle,
          description: `Complete ${taskTitle} for ${name}`,
          status: ["todo", "in-progress", "review", "done"][Math.floor(Math.random() * 4)] as Task["status"],
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as Task["priority"],
          assignee: userName,
          sprintId: `sprint_${index}_${sIndex}`,
          createdAt: new Date().toISOString(),
          owner: owners[(tIndex + sIndex) % owners.length],
          type: types[(tIndex + sIndex) % types.length],
          devStatus: devStatuses[(tIndex + sIndex) % devStatuses.length],
          document: Math.random() > 0.5 ? `doc_${tIndex}.pdf` : undefined,
          timeline: `${formatDateForTimeline(start)} - ${formatDateForTimeline(end)}`,
          users: [userName, `User ${Math.floor(Math.random() * 5) + 2}`],
          subtasks,
        };
      });

      return {
        id: `sprint_${index}_${sIndex}`,
        name: sprintNames[sIndex % sprintNames.length],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: sprintStatuses[sIndex % 3],
        tasks: sprintTasks,
        goals: sprintGoals[sIndex % sprintGoals.length],
      };
    });

    const allTasks = sprints.flatMap((s) => s.tasks);

    const bugs: Bug[] = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, bIndex) => ({
      id: `bug_${index}_${bIndex}`,
      title: bugTitles[(bIndex + index) % bugTitles.length],
      description: `Fix ${bugTitles[(bIndex + index) % bugTitles.length]} in ${name}`,
      severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as Bug["severity"],
      status: ["open", "in-progress", "resolved", "closed"][Math.floor(Math.random() * 4)] as Bug["status"],
      assignee: userName,
      createdAt: new Date().toISOString(),
    }));

    return {
      id: `project_${userName}_${index}`,
      name,
      description: `${name} - ${orgName} project`,
      progress,
      status,
      createdAt: new Date().toISOString(),
      sprints,
      tasks: allTasks,
      bugs,
    };
  });
};

const formatDateForTimeline = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()}${getDaySuffix(date.getDate())} ${months[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;
};

const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

USERS.forEach((user) => {
  user.projects = generateProjectsForUser(user.username, user.organization);
});

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function DashboardPage() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const [users] = useState<User[]>(USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [view, setView] = useState<ViewType>("projects");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSprintTask, setSelectedSprintTask] = useState<Task | null>(null);
  const [selectedTaskCard, setSelectedTaskCard] = useState<Task | null>(null);
  const [selectedBugCard, setSelectedBugCard] = useState<Bug | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Project | null>(null);
  
  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
console.log(selectedSprintTask);
  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getPriorityColor = (priority: Task["priority"] | Bug["severity"]): string => {
    const colors: Record<string, string> = {
      low: "#22c55e",
      medium: "#f59e0b",
      high: "#ef4444",
      critical: "#dc2626",
    };
    return colors[priority] || "#6b7280";
  };

  const getStatusColor = (
    status: Task["status"] | Sprint["status"] | Bug["status"] | Project["status"] | SubTask["status"]
  ): string => {
    const colors: Record<string, string> = {
      todo: "#6b7280",
      "in-progress": "#3b82f6",
      review: "#8b5cf6",
      done: "#22c55e",
      active: PRIMARY_COLOR,
      completed: "#3b82f6",
      upcoming: "#f59e0b",
      "on-hold": "#ef4444",
      open: "#ef4444",
      resolved: "#22c55e",
      closed: "#6b7280",
      "Not Started": "#6b7280",
      "To Do": "#f59e0b",
      "In Progress": "#3b82f6",
      "Done": "#22c55e",
    };
    return colors[status] || "#6b7280";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      Admin: PRIMARY_COLOR,
      Member: "#22c55e",
      Viewer: "#f59e0b",
    };
    return colors[role] || "#6b7280";
  };

  const getRoleIcon = (role: string): string => {
    const icons: Record<string, string> = {
      Admin: "lucide:crown",
      Member: "lucide:user",
      Viewer: "lucide:eye",
    };
    return icons[role] || "lucide:user";
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setSelectedTask(null);
    setSelectedTaskCard(null);
    setSelectedBugCard(null);
    setSelectedBoard(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const handleTaskCardClick = (task: Task) => {
    setSelectedTaskCard(selectedTaskCard?.id === task.id ? null : task);
    setSelectedTask(null);
    setSelectedProject(null);
    setSelectedBugCard(null);
    setSelectedBoard(null);
  };

  const handleBugCardClick = (bug: Bug) => {
    setSelectedBugCard(selectedBugCard?.id === bug.id ? null : bug);
    setSelectedTaskCard(null);
    setSelectedTask(null);
    setSelectedProject(null);
    setSelectedBoard(null);
  };

  const handleBoardClick = (project: Project) => {
    setSelectedBoard(selectedBoard?.id === project.id ? null : project);
    setSelectedTaskCard(null);
    setSelectedBugCard(null);
    setSelectedTask(null);
    setSelectedProject(null);
  };

  const handleSprintClick = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setSelectedSprintTask(null);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleBackToSprints = () => {
    setSelectedSprint(null);
    setSelectedSprintTask(null);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setSelectedProject(null);
    setSelectedTask(null);
    setSelectedSprint(null);
    setSelectedSprintTask(null);
    setSelectedTaskCard(null);
    setSelectedBugCard(null);
    setSelectedBoard(null);
  };

  const handleBackToTasks = () => {
    setSelectedTaskCard(null);
  };

  const handleBackToBugs = () => {
    setSelectedBugCard(null);
  };

  const handleBackToBoards = () => {
    setSelectedBoard(null);
  };

  // ============================================================================
  // Task Detail View - Like Sprint Table
  // ============================================================================

  const renderTaskDetailView = () => {
    if (!selectedTaskCard) return null;

    const task = selectedTaskCard;

    // Create task entries for display (3 rows like sprint view)
    const taskEntries = [
      { 
        title: task.title, 
        description: task.description,
        owner: task.owner, 
        isUnplanned: "No",
        actualSP: "5",
        estimatedSP: "8",
        priority: task.priority, 
        status: task.status,
      },
      { 
        title: `${task.title} - Subtask 1`, 
        description: `${task.description} (Subtask 1)`,
        owner: task.owner, 
        isUnplanned: "Yes",
        actualSP: "3",
        estimatedSP: "5",
        priority: task.priority, 
        status: task.status,
      },
      { 
        title: `${task.title} - Subtask 2`, 
        description: `${task.description} (Subtask 2)`,
        owner: task.owner, 
        isUnplanned: "No",
        actualSP: "2",
        estimatedSP: "3",
        priority: task.priority, 
        status: task.status,
      }
    ];

    return (
      <Box>
        {/* Task Header */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slideInDown 0.6s ease-out, glowPulse 3s ease-in-out infinite",
              "@keyframes slideInDown": {
                "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              "@keyframes glowPulse": {
                "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" },
                "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.08)}` },
              },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToTasks}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(-10deg)",
                      color: PRIMARY_COLOR,
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInText 0.8s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    Task Details
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                    {task.title} • {task.owner}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip
                    label={task.status}
                    sx={{
                      bgcolor: getStatusColor(task.status) + "20",
                      color: getStatusColor(task.status),
                      fontWeight: 600,
                      animation: "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  />
                </Zoom>
                <Chip
                  label={`${task.subtasks.length} Subtasks`}
                  sx={{
                    bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        {/* Task Detail Table */}
        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer
              sx={{
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                borderRadius: "14px",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                overflow: "hidden",
                animation: "fadeInUp 0.8s ease-out, borderGlow 4s ease-in-out infinite",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(30px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "@keyframes borderGlow": {
                  "0%, 100%": { borderColor: isDark ? "#1a2744" : "#e2e8f0" },
                  "50%": { borderColor: alpha(PRIMARY_COLOR, 0.2) },
                },
                minWidth: isMobile ? "600px" : "auto",
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      animation: "slideInDown 0.5s ease-out",
                      "@keyframes slideInDown": {
                        "0%": { opacity: 0, transform: "translateY(-20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Taskname
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                        TaskDescription
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Owner
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                        Is Unplanned
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Actual SP
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Est. SP
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taskEntries.map((entry, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                          transform: "scale(1.01)",
                          boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        animation: `slideInRow 0.5s ease ${index * 0.1}s both, rowGlow 3s ease-in-out ${index * 0.1}s infinite`,
                        "@keyframes slideInRow": {
                          "0%": { opacity: 0, transform: "translateX(-30px)" },
                          "100%": { opacity: 1, transform: "translateX(0)" },
                        },
                        "@keyframes rowGlow": {
                          "0%, 100%": { borderColor: "transparent" },
                          "50%": { borderColor: alpha(PRIMARY_COLOR, 0.05) },
                        },
                      }}
                    >
                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {entry.title}
                        </Typography>
                      </TableCell>

                      {!isMobile && (
                        <TableCell sx={{ py: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                            {entry.description}
                          </Typography>
                        </TableCell>
                      )}

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={entry.owner}
                          size="small"
                          sx={{
                            bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                            color: isDark ? "#ffffff" : "#0f172a",
                            fontSize: isMobile ? 9 : 12,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                              bgcolor: PRIMARY_COLOR,
                              color: "#ffffff",
                            },
                          }}
                        />
                      </TableCell>

                      {!isMobile && (
                        <TableCell sx={{ py: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Chip
                            label={entry.isUnplanned}
                            size="small"
                            sx={{
                              bgcolor: entry.isUnplanned === "Yes" ? "#ef444420" : "#22c55e20",
                              color: entry.isUnplanned === "Yes" ? "#ef4444" : "#22c55e",
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                      )}

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {entry.actualSP}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {entry.estimatedSP}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={entry.priority}
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(entry.priority) + "20",
                            color: getPriorityColor(entry.priority),
                            fontWeight: 600,
                            fontSize: isMobile ? 7 : 10,
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1) rotate(-5deg)",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={entry.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(entry.status) + "20",
                            color: getStatusColor(entry.status),
                            fontSize: isMobile ? 7 : 10,
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Box>
    );
  };

  // ============================================================================
  // Bug Detail View - Like Task Detail Table
  // ============================================================================

  const renderBugDetailView = () => {
    if (!selectedBugCard) return null;

    const bug = selectedBugCard;

    // Create bug entries for display (3 rows like task view)
    const bugEntries = [
      { 
        title: bug.title, 
        description: bug.description,
        owner: bug.assignee, 
        isUnplanned: "No",
        actualSP: "3",
        estimatedSP: "5",
        priority: bug.severity, 
        status: bug.status,
        timeUntilResolution: "8hr 30m 10s"
      },
      { 
        title: `${bug.title} - Sub Bug 1`, 
        description: `${bug.description} (Sub Bug 1)`,
        owner: bug.assignee, 
        isUnplanned: "Yes",
        actualSP: "2",
        estimatedSP: "3",
        priority: bug.severity, 
        status: bug.status,
        timeUntilResolution: "4hr 15m 20s"
      },
      { 
        title: `${bug.title} - Sub Bug 2`, 
        description: `${bug.description} (Sub Bug 2)`,
        owner: bug.assignee, 
        isUnplanned: "No",
        actualSP: "1",
        estimatedSP: "2",
        priority: bug.severity, 
        status: bug.status,
        timeUntilResolution: "12hr 45m 30s"
      }
    ];

    return (
      <Box>
        {/* Bug Header */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slideInDown 0.6s ease-out, glowPulse 3s ease-in-out infinite",
              "@keyframes slideInDown": {
                "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              "@keyframes glowPulse": {
                "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" },
                "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.08)}` },
              },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToBugs}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(-10deg)",
                      color: PRIMARY_COLOR,
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInText 0.8s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    Bug Details
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                    {bug.title} • {bug.assignee}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip
                    label={bug.status}
                    sx={{
                      bgcolor: getStatusColor(bug.status) + "20",
                      color: getStatusColor(bug.status),
                      fontWeight: 600,
                      animation: "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  />
                </Zoom>
                <Chip
                  label={`Severity: ${bug.severity}`}
                  sx={{
                    bgcolor: getPriorityColor(bug.severity) + "20",
                    color: getPriorityColor(bug.severity),
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        {/* Bug Detail Table */}
        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer
              sx={{
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                borderRadius: "14px",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                overflow: "hidden",
                animation: "fadeInUp 0.8s ease-out, borderGlow 4s ease-in-out infinite",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(30px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "@keyframes borderGlow": {
                  "0%, 100%": { borderColor: isDark ? "#1a2744" : "#e2e8f0" },
                  "50%": { borderColor: alpha(PRIMARY_COLOR, 0.2) },
                },
                minWidth: isMobile ? "700px" : "auto",
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      animation: "slideInDown 0.5s ease-out",
                      "@keyframes slideInDown": {
                        "0%": { opacity: 0, transform: "translateY(-20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Bug Name
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                        Bug Description
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Owner
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                        Is Unplanned
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Actual SP
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Est. SP
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Status
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                        Time Until Resolution
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bugEntries.map((entry, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                          transform: "scale(1.01)",
                          boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        animation: `slideInRow 0.5s ease ${index * 0.1}s both, rowGlow 3s ease-in-out ${index * 0.1}s infinite`,
                        "@keyframes slideInRow": {
                          "0%": { opacity: 0, transform: "translateX(-30px)" },
                          "100%": { opacity: 1, transform: "translateX(0)" },
                        },
                        "@keyframes rowGlow": {
                          "0%, 100%": { borderColor: "transparent" },
                          "50%": { borderColor: alpha(PRIMARY_COLOR, 0.05) },
                        },
                      }}
                    >
                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {entry.title}
                        </Typography>
                      </TableCell>

                      {!isMobile && (
                        <TableCell sx={{ py: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                            {entry.description}
                          </Typography>
                        </TableCell>
                      )}

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={entry.owner}
                          size="small"
                          sx={{
                            bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                            color: isDark ? "#ffffff" : "#0f172a",
                            fontSize: isMobile ? 9 : 12,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                              bgcolor: PRIMARY_COLOR,
                              color: "#ffffff",
                            },
                          }}
                        />
                      </TableCell>

                      {!isMobile && (
                        <TableCell sx={{ py: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Chip
                            label={entry.isUnplanned}
                            size="small"
                            sx={{
                              bgcolor: entry.isUnplanned === "Yes" ? "#ef444420" : "#22c55e20",
                              color: entry.isUnplanned === "Yes" ? "#ef4444" : "#22c55e",
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                      )}

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {entry.actualSP}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {entry.estimatedSP}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={entry.priority}
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(entry.priority) + "20",
                            color: getPriorityColor(entry.priority),
                            fontWeight: 600,
                            fontSize: isMobile ? 7 : 10,
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1) rotate(-5deg)",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={entry.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(entry.status) + "20",
                            color: getStatusColor(entry.status),
                            fontSize: isMobile ? 7 : 10,
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </TableCell>

                      {!isMobile && (
                        <TableCell sx={{ py: 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="lucide:clock" style={{ fontSize: 16, color: isDark ? "#9ca3af" : "#475569" }} />
                            <Typography sx={{ 
                              fontSize: 13, 
                              fontWeight: 600, 
                              color: isDark ? "#ffffff" : "#0f172a",
                              fontFamily: "monospace",
                            }}>
                              {entry.timeUntilResolution}
                            </Typography>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Box>
    );
  };

  // ============================================================================
  // Board Detail View - Shows Tasks in Kanban Style
  // ============================================================================

  const renderBoardDetailView = () => {
    if (!selectedBoard) return null;

    const project = selectedBoard;

    // Group tasks by status
    const todoTasks = project.tasks.filter(t => t.status === "todo");
    const inProgressTasks = project.tasks.filter(t => t.status === "in-progress");
    const reviewTasks = project.tasks.filter(t => t.status === "review");
    const doneTasks = project.tasks.filter(t => t.status === "done");

    const columns = [
      { 
        title: "To Do", 
        status: "todo" as Task["status"], 
        tasks: todoTasks,
        color: "#6b7280",
        icon: "lucide:circle"
      },
      { 
        title: "In Progress", 
        status: "in-progress" as Task["status"], 
        tasks: inProgressTasks,
        color: "#3b82f6",
        icon: "lucide:loader-circle"
      },
      { 
        title: "Review", 
        status: "review" as Task["status"], 
        tasks: reviewTasks,
        color: "#8b5cf6",
        icon: "lucide:eye"
      },
      { 
        title: "Done", 
        status: "done" as Task["status"], 
        tasks: doneTasks,
        color: "#22c55e",
        icon: "lucide:check-circle"
      }
    ];

    return (
      <Box>
        {/* Board Header */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slideInDown 0.6s ease-out, glowPulse 3s ease-in-out infinite",
              "@keyframes slideInDown": {
                "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              "@keyframes glowPulse": {
                "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" },
                "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.08)}` },
              },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToBoards}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(-10deg)",
                      color: PRIMARY_COLOR,
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInText 0.8s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                    {project.description} • {project.tasks.length} total tasks
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip
                    label={project.status}
                    sx={{
                      bgcolor: getStatusColor(project.status) + "20",
                      color: getStatusColor(project.status),
                      fontWeight: 600,
                      animation: "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  />
                </Zoom>
                <Chip
                  label={`Progress: ${project.progress}%`}
                  sx={{
                    bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        {/* Board Columns - Kanban Style */}
        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto", pb: 2 }}>
            <Grid container spacing={isMobile ? 1 : 2} sx={{ flexWrap: "nowrap", minWidth: isMobile ? "500px" : "auto" }}>
              {columns.map((column, colIndex) => (
                <Grid item xs={12} sm={6} md={3} key={column.status} sx={{ minWidth: isMobile ? 180 : 280 }}>
                  <Slide in timeout={600 + colIndex * 100} direction="up">
                    <Paper
                      elevation={0}
                      sx={{
                        p: isMobile ? 1 : 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                        height: "100%",
                        minHeight: 250,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: column.color,
                          boxShadow: `0 8px 30px ${alpha(column.color, 0.1)}`,
                        },
                      }}
                    >
                      {/* Column Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                          pb: 1.5,
                          borderBottom: `2px solid ${alpha(column.color, 0.2)}`,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Icon 
                            icon={column.icon} 
                            style={{ 
                              fontSize: isMobile ? 14 : 18, 
                              color: column.color 
                            }} 
                          />
                          <Typography
                            sx={{
                              fontSize: isMobile ? 11 : 14,
                              fontWeight: 700,
                              color: isDark ? "#ffffff" : "#0f172a",
                            }}
                          >
                            {column.title}
                          </Typography>
                        </Stack>
                        <Chip
                          label={column.tasks.length}
                          size="small"
                          sx={{
                            bgcolor: column.color + "20",
                            color: column.color,
                            fontWeight: 700,
                            minWidth: 24,
                            height: 24,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      </Box>

                      {/* Column Tasks */}
                      <Stack spacing={isMobile ? 1 : 1.5}>
                        {column.tasks.length === 0 ? (
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                              border: "1px dashed",
                              borderColor: isDark ? "#1a2744" : "#e2e8f0",
                              borderRadius: 2,
                              color: isDark ? "#6b7280" : "#94a3b8",
                              fontSize: isMobile ? 10 : 13,
                            }}
                          >
                            No tasks
                          </Box>
                        ) : (
                          column.tasks.slice(0, isMobile ? 3 : 5).map((task, taskIndex) => (
                            <Grow key={task.id} in timeout={800 + colIndex * 100 + taskIndex * 50}>
                              <Card
                                elevation={0}
                                sx={{
                                  p: isMobile ? 1 : 1.5,
                                  borderRadius: 2,
                                  border: "1px solid",
                                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                                  bgcolor: isDark ? "#0F1828" : "#ffffff",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  cursor: "pointer",
                                  "&:hover": {
                                    transform: "scale(1.02) translateY(-4px)",
                                    boxShadow: `0 8px 30px ${alpha(PRIMARY_COLOR, 0.12)}`,
                                    borderColor: PRIMARY_COLOR,
                                  },
                                }}
                                onClick={() => {
                                  setSelectedTaskCard(task);
                                  setSelectedBoard(null);
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: isMobile ? 10 : 13,
                                    fontWeight: 600,
                                    color: isDark ? "#ffffff" : "#0f172a",
                                    mb: 0.5,
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                {!isMobile && (
                                  <Typography
                                    sx={{
                                      fontSize: 11,
                                      color: isDark ? "#9ca3af" : "#475569",
                                      mb: 1,
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {task.description}
                                  </Typography>
                                )}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Chip
                                    label={task.priority}
                                    size="small"
                                    sx={{
                                      bgcolor: getPriorityColor(task.priority) + "20",
                                      color: getPriorityColor(task.priority),
                                      fontSize: isMobile ? 6 : 9,
                                      fontWeight: 600,
                                      height: isMobile ? 16 : 22,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: isMobile ? 8 : 10,
                                      color: isDark ? "#6b7280" : "#94a3b8",
                                    }}
                                  >
                                    {task.owner}
                                  </Typography>
                                </Box>
                                {task.subtasks.length > 0 && (
                                  <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Icon 
                                      icon="lucide:list-checks" 
                                      style={{ 
                                        fontSize: isMobile ? 10 : 12, 
                                        color: isDark ? "#6b7280" : "#94a3b8" 
                                      }} 
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: isMobile ? 8 : 10,
                                        color: isDark ? "#6b7280" : "#94a3b8",
                                      }}
                                    >
                                      {task.subtasks.length} subtasks
                                    </Typography>
                                  </Box>
                                )}
                              </Card>
                            </Grow>
                          ))
                        )}
                      </Stack>
                    </Paper>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Box>
    );
  };

  // ============================================================================
  // Project Detail View - Like Screenshot
  // ============================================================================

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    const project = selectedProject;
    const allTasks = project.tasks;

    return (
      <Box>
        {/* Project Header */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slideInDown 0.6s ease-out, glowPulse 3s ease-in-out infinite",
              "@keyframes slideInDown": {
                "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              "@keyframes glowPulse": {
                "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" },
                "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.08)}` },
              },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToProjects}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(-10deg)",
                      color: PRIMARY_COLOR,
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInText 0.8s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                    {project.description}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip
                    label={project.status}
                    sx={{
                      bgcolor: getStatusColor(project.status) + "20",
                      color: getStatusColor(project.status),
                      fontWeight: 600,
                      animation: "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  />
                </Zoom>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                    Progress:
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                    {project.progress}%
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        {/* Tasks Table - Like Screenshot */}
        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer
              sx={{
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                borderRadius: "14px",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                overflow: "hidden",
                animation: "fadeInUp 0.8s ease-out, borderGlow 4s ease-in-out infinite",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(30px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "@keyframes borderGlow": {
                  "0%, 100%": { borderColor: isDark ? "#1a2744" : "#e2e8f0" },
                  "50%": { borderColor: alpha(PRIMARY_COLOR, 0.2) },
                },
                minWidth: isMobile ? "700px" : "auto",
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      animation: "slideInDown 0.5s ease-out",
                      "@keyframes slideInDown": {
                        "0%": { opacity: 0, transform: "translateY(-20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      TASK
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Owner
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Status
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                          Timeline
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                          Users
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                          Type
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                          DEVSTATUS
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                          DOCUMENT
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allTasks.slice(0, isMobile ? 5 : 10).map((task, index) => (
                    <>
                      <TableRow
                        key={task.id}
                        sx={{
                          "&:hover": {
                            bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                            transform: "scale(1.01)",
                            boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                          },
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          animation: `slideInRow 0.5s ease ${index * 0.08}s both, rowGlow 3s ease-in-out ${index * 0.08}s infinite`,
                          "@keyframes slideInRow": {
                            "0%": { opacity: 0, transform: "translateX(-30px)" },
                            "100%": { opacity: 1, transform: "translateX(0)" },
                          },
                          "@keyframes rowGlow": {
                            "0%, 100%": { borderColor: "transparent" },
                            "50%": { borderColor: alpha(PRIMARY_COLOR, 0.05) },
                          },
                        }}
                        onClick={() => handleTaskClick(task)}
                      >
                        <TableCell sx={{ py: isMobile ? 1 : 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                            {task.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: isMobile ? 1 : 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Chip
                            label={task.owner}
                            size="small"
                            sx={{
                              bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                              color: isDark ? "#ffffff" : "#0f172a",
                              fontSize: isMobile ? 8 : 11,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)",
                                bgcolor: PRIMARY_COLOR,
                                color: "#ffffff",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: isMobile ? 1 : 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              bgcolor: getPriorityColor(task.priority) + "20",
                              color: getPriorityColor(task.priority),
                              fontWeight: 600,
                              fontSize: isMobile ? 7 : 10,
                              textTransform: "uppercase",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1) rotate(-5deg)",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: isMobile ? 1 : 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                          <Chip
                            label={task.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(task.status) + "20",
                              color: getStatusColor(task.status),
                              fontSize: isMobile ? 7 : 10,
                              textTransform: "uppercase",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                          />
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                              <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                {task.timeline || formatDate(new Date().toISOString())}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                              <Stack direction="row" spacing={0.5}>
                                {task.users.slice(0, isMobile ? 2 : 3).map((user, idx) => (
                                  <Zoom key={idx} in timeout={600 + idx * 100}>
                                    <Avatar
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        bgcolor: idx % 2 === 0 ? PRIMARY_COLOR : "#22c55e",
                                        fontSize: 10,
                                        fontWeight: 600,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                          transform: "scale(1.3) rotate(10deg)",
                                        },
                                      }}
                                    >
                                      {user.charAt(0).toUpperCase()}
                                    </Avatar>
                                  </Zoom>
                                ))}
                                {task.users.length > 3 && (
                                  <Typography sx={{ fontSize: 10, color: isDark ? "#9ca3af" : "#475569" }}>
                                    +{task.users.length - 3}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                              <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                {task.type}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                              <Chip
                                label={task.devStatus}
                                size="small"
                                sx={{
                                  bgcolor: getStatusColor(task.devStatus as any) + "20",
                                  color: getStatusColor(task.devStatus as any),
                                  fontSize: 10,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                              {task.document ? (
                                <Button
                                  size="small"
                                  startIcon={<Icon icon="lucide:file" style={{ fontSize: 14 }} />}
                                  sx={{
                                    fontSize: 11,
                                    color: PRIMARY_COLOR,
                                    textTransform: "none",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      transform: "scale(1.1) translateY(-2px)",
                                      color: PRIMARY_DARK,
                                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                                    },
                                  }}
                                >
                                  View
                                </Button>
                              ) : (
                                <Typography sx={{ fontSize: 12, color: isDark ? "#6b7280" : "#94a3b8" }}>
                                  —
                                </Typography>
                              )}
                            </TableCell>
                          </>
                        )}
                      </TableRow>

                      {/* Subtasks - Expanded View */}
                      {selectedTask?.id === task.id && task.subtasks.length > 0 && (
                        <TableRow
                          sx={{
                            animation: "expandIn 0.4s ease-out",
                            "@keyframes expandIn": {
                              "0%": { opacity: 0, transform: "scale(0.95) translateY(-10px)" },
                              "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
                            },
                          }}
                        >
                          <TableCell colSpan={isMobile ? 4 : 9} sx={{ p: 0 }}>
                            <Box
                              sx={{
                                p: isMobile ? 1 : 2,
                                bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.05) : alpha(PRIMARY_COLOR, 0.02),
                                borderTop: `1px solid ${isDark ? "#1a2744" : "#e2e8f0"}`,
                                overflowX: "auto",
                              }}
                            >
                              {/* Subtasks Header */}
                              <Grid container spacing={1} sx={{ mb: 1 }}>
                                <Grid item xs={isMobile ? 4 : 3}>
                                  <Typography sx={{ fontSize: isMobile ? 8 : 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                    SUB TASK
                                  </Typography>
                                </Grid>
                                <Grid item xs={isMobile ? 2 : 2}>
                                  <Typography sx={{ fontSize: isMobile ? 8 : 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                    Owner
                                  </Typography>
                                </Grid>
                                <Grid item xs={isMobile ? 2 : 2}>
                                  <Typography sx={{ fontSize: isMobile ? 8 : 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                    Effort
                                  </Typography>
                                </Grid>
                                <Grid item xs={isMobile ? 2 : 2}>
                                  <Typography sx={{ fontSize: isMobile ? 8 : 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                    Status
                                  </Typography>
                                </Grid>
                                <Grid item xs={isMobile ? 2 : 2}>
                                  <Typography sx={{ fontSize: isMobile ? 8 : 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                    File
                                  </Typography>
                                </Grid>
                                <Grid item xs={isMobile ? 2 : 2}>
                                  <Typography sx={{ fontSize: isMobile ? 8 : 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                    DUE
                                  </Typography>
                                </Grid>
                              </Grid>

                              {/* Subtasks List */}
                              {task.subtasks.map((subtask, idx) => (
                                <Grow key={subtask.id} in timeout={300 + idx * 100}>
                                  <Grid
                                    container
                                    spacing={1}
                                    sx={{
                                      py: isMobile ? 1 : 1.5,
                                      borderBottom: idx < task.subtasks.length - 1 ? `1px solid ${isDark ? "#1a2744" : "#e2e8f0"}` : "none",
                                      "&:hover": {
                                        bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.06) : alpha(PRIMARY_COLOR, 0.03),
                                        transform: "scale(1.01)",
                                        borderRadius: 1,
                                      },
                                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Grid item xs={isMobile ? 4 : 3}>
                                      <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#ffffff" : "#0f172a" }}>
                                          {subtask.title}
                                        </Typography>
                                        <Chip
                                          label={subtask.type}
                                          size="small"
                                          sx={{
                                            bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                                            color: isDark ? "#9ca3af" : "#475569",
                                            fontSize: isMobile ? 6 : 9,
                                            height: isMobile ? 14 : 20,
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                              transform: "scale(1.1)",
                                            },
                                          }}
                                        />
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={isMobile ? 2 : 2}>
                                      <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                        {subtask.owner}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={isMobile ? 2 : 2}>
                                      <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                        {subtask.plannedEffort}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={isMobile ? 2 : 2}>
                                      <Chip
                                        label={subtask.status}
                                        size="small"
                                        sx={{
                                          bgcolor: getStatusColor(subtask.status) + "20",
                                          color: getStatusColor(subtask.status),
                                          fontSize: isMobile ? 6 : 10,
                                          transition: "all 0.3s ease",
                                          "&:hover": {
                                            transform: "scale(1.1)",
                                          },
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={isMobile ? 2 : 2}>
                                      <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                        {subtask.file || "—"}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={isMobile ? 2 : 2}>
                                      <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                        {subtask.dueDate}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grow>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Box>
    );
  };

  // ============================================================================
  // Sprint Detail View - Like Project Module Table with 3 Rows
  // ============================================================================

  const renderSprintDetail = () => {
    if (!selectedSprint) return null;

    const sprint = selectedSprint;

    // Get 3 sprints for display (or fewer if not available)
    const sprintEntries = [
      { 
        name: sprint.name, 
        startDate: sprint.startDate, 
        endDate: sprint.endDate, 
        status: sprint.status,
        goals: sprint.goals || ["No goals defined"]
      },
      { 
        name: `${sprint.name} - Extended`, 
        startDate: sprint.startDate, 
        endDate: sprint.endDate, 
        status: sprint.status,
        goals: sprint.goals || ["No goals defined"]
      },
      { 
        name: `${sprint.name} - Final`, 
        startDate: sprint.startDate, 
        endDate: sprint.endDate, 
        status: sprint.status,
        goals: sprint.goals || ["No goals defined"]
      }
    ];

    return (
      <Box>
        {/* Sprint Header */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slideInDown 0.6s ease-out, glowPulse 3s ease-in-out infinite",
              "@keyframes slideInDown": {
                "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              "@keyframes glowPulse": {
                "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" },
                "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.08)}` },
              },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToSprints}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(-10deg)",
                      color: PRIMARY_COLOR,
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInText 0.8s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    Sprint Details
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                    {sprint.name} • {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip
                    label={sprint.status}
                    sx={{
                      bgcolor: getStatusColor(sprint.status) + "20",
                      color: getStatusColor(sprint.status),
                      fontWeight: 600,
                      animation: "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  />
                </Zoom>
                <Chip
                  label={`${sprint.tasks.length} Tasks`}
                  sx={{
                    bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        {/* Sprint Detail Table - Like Project Module with 3 Rows */}
        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer
              sx={{
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                borderRadius: "14px",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                overflow: "hidden",
                animation: "fadeInUp 0.8s ease-out, borderGlow 4s ease-in-out infinite",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(30px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "@keyframes borderGlow": {
                  "0%, 100%": { borderColor: isDark ? "#1a2744" : "#e2e8f0" },
                  "50%": { borderColor: alpha(PRIMARY_COLOR, 0.2) },
                },
                minWidth: isMobile ? "400px" : "auto",
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      animation: "slideInDown 0.5s ease-out",
                      "@keyframes slideInDown": {
                        "0%": { opacity: 0, transform: "translateY(-20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      SPRINT
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      GOALS
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      SPRINT TIMELINE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sprintEntries.map((entry, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                          transform: "scale(1.01)",
                          boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        animation: `slideInRow 0.5s ease ${index * 0.1}s both, rowGlow 3s ease-in-out ${index * 0.1}s infinite`,
                        "@keyframes slideInRow": {
                          "0%": { opacity: 0, transform: "translateX(-30px)" },
                          "100%": { opacity: 1, transform: "translateX(0)" },
                        },
                        "@keyframes rowGlow": {
                          "0%, 100%": { borderColor: "transparent" },
                          "50%": { borderColor: alpha(PRIMARY_COLOR, 0.05) },
                        },
                      }}
                    >
                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Box>
                          <Typography sx={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                            {entry.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        {entry.goals && entry.goals.length > 0 ? (
                          <Box>
                            {entry.goals.slice(0, isMobile ? 1 : 3).map((goal, goalIndex) => (
                              <Typography 
                                key={goalIndex}
                                sx={{ 
                                  fontSize: isMobile ? 11 : 13, 
                                  color: isDark ? "#ffffff" : "#0f172a",
                                  mb: goalIndex < entry.goals.length - 1 ? 0.5 : 0,
                                  animation: `fadeInGoal 0.5s ease ${goalIndex * 0.1}s both`,
                                  "@keyframes fadeInGoal": {
                                    "0%": { opacity: 0, transform: "translateX(-10px)" },
                                    "100%": { opacity: 1, transform: "translateX(0)" },
                                  },
                                }}
                              >
                                {goal}
                              </Typography>
                            ))}
                            {isMobile && entry.goals.length > 1 && (
                              <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                                +{entry.goals.length - 1} more
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#9ca3af" : "#475569", fontStyle: "italic" }}>
                            No goals defined
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={{ py: isMobile ? 1.5 : 2, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Box>
                          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#ffffff" : "#0f172a" }}>
                            {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                          </Typography>
                          <Typography sx={{ fontSize: isMobile ? 10 : 12, color: isDark ? "#9ca3af" : "#475569", mt: 0.5 }}>
                            {Math.ceil((new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Box>
    );
  };

  const renderUserTable = () => (
    <>
      <Fade in timeout={600}>
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "14px",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              overflow: "hidden",
              animation: "fadeInUp 0.6s ease-out, borderGlow 4s ease-in-out infinite",
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(30px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
              "@keyframes borderGlow": {
                "0%, 100%": { borderColor: isDark ? "#1a2744" : "#e2e8f0" },
                "50%": { borderColor: alpha(PRIMARY_COLOR, 0.15) },
              },
              minWidth: isMobile ? "600px" : "auto",
            }}
          >
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow
                  sx={{
                    animation: "slideInDown 0.5s ease-out",
                    "@keyframes slideInDown": {
                      "0%": { opacity: 0, transform: "translateY(-20px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    User
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                      Email
                    </TableCell>
                  )}
                  <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Organization
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Projects
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Bugs
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? 9 : 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user, index) => {
                  const totalBugs = user.projects.reduce((acc, p) => acc + p.bugs.length, 0);
                  const openBugs = user.projects.reduce((acc, p) => acc + p.bugs.filter(b => b.status === "open").length, 0);
                  const totalProjects = user.projects.length;

                  return (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:hover": {
                          bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                          transform: "scale(1.01)",
                          boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                        },
                        cursor: "pointer",
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        animation: `slideInRow 0.5s ease ${index * 0.08}s both, rowGlow 3s ease-in-out ${index * 0.08}s infinite`,
                        "@keyframes slideInRow": {
                          "0%": { opacity: 0, transform: "translateX(-30px)" },
                          "100%": { opacity: 1, transform: "translateX(0)" },
                        },
                        "@keyframes rowGlow": {
                          "0%, 100%": { borderColor: "transparent" },
                          "50%": { borderColor: alpha(PRIMARY_COLOR, 0.05) },
                        },
                      }}
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: isMobile ? 1 : 1.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Zoom in timeout={500}>
                            <Avatar
                              sx={{
                                width: isMobile ? 28 : 36,
                                height: isMobile ? 28 : 36,
                                bgcolor: user.avatar,
                                fontSize: isMobile ? 10 : 14,
                                fontWeight: 600,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.3) rotate(10deg)",
                                },
                              }}
                            >
                              {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                          </Zoom>
                          <Box>
                            <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                              {user.username}
                            </Typography>
                            {isMobile && (
                              <Typography sx={{ fontSize: 9, color: isDark ? "#9ca3af" : "#475569" }}>
                                {user.email}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", color: isDark ? "#9ca3af" : "#475569", fontSize: 13, py: 1.5 }}>
                          {user.email}
                        </TableCell>
                      )}
                      <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: isMobile ? 1 : 1.5 }}>
                        <Chip
                          label={user.organization}
                          size="small"
                          sx={{
                            bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                            color: isDark ? "#ffffff" : "#0f172a",
                            fontWeight: 500,
                            fontSize: isMobile ? 8 : 11,
                            animation: "pulse 2s ease-in-out infinite",
                            "@keyframes pulse": {
                              "0%, 100%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.03)" },
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: isMobile ? 1 : 1.5 }}>
                        <Chip
                          icon={<Icon icon={getRoleIcon(user.role)} style={{ fontSize: isMobile ? 10 : 14 }} />}
                          label={user.role}
                          size="small"
                          sx={{
                            bgcolor: getRoleColor(user.role) + "20",
                            color: getRoleColor(user.role),
                            fontWeight: 600,
                            fontSize: isMobile ? 8 : 11,
                            "& .MuiChip-icon": {
                              color: getRoleColor(user.role),
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", color: isDark ? "#ffffff" : "#0f172a", fontWeight: 600, fontSize: isMobile ? 11 : 14, py: isMobile ? 1 : 1.5 }}>
                        {totalProjects}
                      </TableCell>
                      <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: isMobile ? 1 : 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a", fontWeight: 600, fontSize: isMobile ? 11 : 14 }}>
                            {openBugs}
                          </Typography>
                          <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                            / {totalBugs}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: isMobile ? 1 : 1.5 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                          }}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: isMobile ? 9 : 12,
                            bgcolor: PRIMARY_COLOR,
                            transition: "all 0.3s ease",
                            animation: "bounceIn 0.6s ease",
                            "@keyframes bounceIn": {
                              "0%": { transform: "scale(0)" },
                              "50%": { transform: "scale(1.2)" },
                              "100%": { transform: "scale(1)" },
                            },
                            "&:hover": {
                              transform: "scale(1.1) translateY(-3px)",
                              bgcolor: PRIMARY_DARK,
                              boxShadow: `0 8px 30px ${alpha(PRIMARY_COLOR, 0.4)}`,
                            },
                          }}
                        >
                          {isMobile ? "View" : "View Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>

      <Fade in timeout={700}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            mt: 2,
            color: isDark ? "#9ca3af" : "#475569",
            "& .MuiTablePagination-select": {
              color: isDark ? "#ffffff" : "#0f172a",
            },
            "& .MuiTablePagination-selectIcon": {
              color: isDark ? "#9ca3af" : "#475569",
            },
            "& .MuiTablePagination-actions button": {
              color: isDark ? "#9ca3af" : "#475569",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: PRIMARY_COLOR,
              },
            },
          }}
        />
      </Fade>
    </>
  );

  // ============================================================================
  // User Detail View (Full Screen - No Team Members or Search)
  // ============================================================================

  const renderUserDetail = () => {
    if (!selectedUser) return null;

    const user = selectedUser;
    const projects = user.projects;
    const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter((t) => t.status === "done").length, 0);
    const totalBugs = projects.reduce((acc, p) => acc + p.bugs.length, 0);
    const openBugs = projects.reduce((acc, p) => acc + p.bugs.filter((b) => b.status === "open").length, 0);

    // Projects View - Professional Hover Effects with Enhanced Animations
    const renderProjects = () => (
      <Grid container spacing={isMobile ? 1 : 2}>
        {projects.slice(0, isMobile ? 6 : 9).map((project, index) => (
          <Grid item xs={12} sm={6} lg={4} key={project.id}>
            <Grow in timeout={800 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  p: isMobile ? 1.5 : 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  bgcolor: isDark ? "#0F1828" : "#ffffff",
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 50%)`,
                    opacity: 0,
                    transition: "opacity 0.6s ease",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)})`,
                    transform: "scaleX(0)",
                    transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transformOrigin: "left",
                  },
                  "&:hover": {
                    transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-12px) scale(1.03)",
                    boxShadow: `0 24px 64px ${alpha(PRIMARY_COLOR, 0.2)}`,
                    borderColor: PRIMARY_COLOR,
                  },
                  "&:hover::before": {
                    opacity: 1,
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                }}
                onClick={() => handleProjectClick(project)}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {project.name}
                    </Typography>
                    <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569", mt: 0.5 }}>
                      {project.description}
                    </Typography>
                  </Box>
                  <Zoom in timeout={1000}>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(project.status) + "20",
                        color: getStatusColor(project.status),
                        fontWeight: 600,
                        fontSize: isMobile ? 7 : 10,
                        textTransform: "uppercase",
                      }}
                    />
                  </Zoom>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon icon="lucide:git-branch" style={{ fontSize: isMobile ? 10 : 14, color: isDark ? "#6b7280" : "#94a3b8" }} />
                    <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                      {project.sprints.length} sprints
                    </Typography>
                    <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
                    <Icon icon="lucide:bug" style={{ fontSize: isMobile ? 10 : 14, color: isDark ? "#6b7280" : "#94a3b8" }} />
                    <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                      {project.bugs.filter(b => b.status === "open").length} bugs
                    </Typography>
                  </Stack>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: isMobile ? 30 : 60,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${project.progress}%`,
                          height: "100%",
                          bgcolor: PRIMARY_COLOR,
                          borderRadius: 2,
                          transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: isMobile ? 8 : 11, color: isDark ? "#9ca3af" : "#475569", fontWeight: 600 }}>
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    );

    // Sprints View - Professional Hover Effects with Enhanced Animations
    const renderSprints = () => (
      <Box>
        {projects.slice(0, isMobile ? 3 : 5).map((project, pIndex) => (
          <Box key={project.id} sx={{ mb: 3 }}>
            <Fade in timeout={600 + pIndex * 100}>
              <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a", fontWeight: 600, mb: 1 }}>
                {project.name}
              </Typography>
            </Fade>
            <Grid container spacing={isMobile ? 1 : 2}>
              {project.sprints.slice(0, isMobile ? 3 : 4).map((sprint, index) => (
                <Grid item xs={12} sm={6} lg={4} key={sprint.id}>
                  <Fade in timeout={600 + pIndex * 100 + index * 80}>
                    <Card
                      elevation={0}
                      sx={{
                        p: isMobile ? 1.5 : 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        bgcolor: isDark ? "#0F1828" : "#ffffff",
                        transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 50%)`,
                          opacity: 0,
                          transition: "opacity 0.6s ease",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)})`,
                          transform: "scaleX(0)",
                          transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          transformOrigin: "left",
                        },
                        "&:hover": {
                          transform: isMobile ? "translateY(-4px) scale(1.02)" : "translateY(-8px) scale(1.03)",
                          boxShadow: `0 16px 48px ${alpha(PRIMARY_COLOR, 0.15)}`,
                          borderColor: PRIMARY_COLOR,
                        },
                        "&:hover::before": {
                          opacity: 1,
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                        },
                      }}
                      onClick={() => handleSprintClick(sprint)}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
                            {sprint.name}
                          </Typography>
                          <Typography sx={{ fontSize: isMobile ? 8 : 11, color: isDark ? "#9ca3af" : "#475569" }}>
                            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                          </Typography>
                        </Box>
                        <Chip
                          label={sprint.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(sprint.status) + "20",
                            color: getStatusColor(sprint.status),
                            fontWeight: 600,
                            fontSize: isMobile ? 7 : 10,
                            textTransform: "uppercase",
                          }}
                        />
                      </Box>
                      <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          {sprint.tasks.length} tasks
                        </Typography>
                        <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          {sprint.tasks.filter((t) => t.status === "done").length} done
                        </Typography>
                      </Box>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    );

    // Tasks View - Click to show task detail table with Enhanced Animations
    const renderTasks = () => (
      <Grid container spacing={isMobile ? 1 : 2}>
        {projects.flatMap((project, pIndex) =>
          project.tasks.slice(0, isMobile ? 3 : 6).map((task, index) => (
            <Grid item xs={12} sm={6} lg={4} key={task.id}>
              <Slide in timeout={800 + pIndex * 100 + index * 80} direction="up">
                <Card
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha(PRIMARY_COLOR, 0.02)}, transparent 50%)`,
                      opacity: 0,
                      transition: "opacity 0.5s ease",
                    },
                    "&:hover": {
                      transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-10px) scale(1.03)",
                      boxShadow: `0 20px 56px ${alpha(PRIMARY_COLOR, 0.15)}`,
                      borderColor: PRIMARY_COLOR,
                    },
                    "&:hover::before": {
                      opacity: 1,
                    },
                  }}
                  onClick={() => handleTaskCardClick(task)}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(task.priority) + "20",
                        color: getPriorityColor(task.priority),
                        fontWeight: 600,
                        fontSize: isMobile ? 6 : 9,
                        textTransform: "uppercase",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#9ca3af" : "#475569", mb: 1 }}>
                    {task.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(task.status) + "20",
                        color: getStatusColor(task.status),
                        fontSize: isMobile ? 7 : 10,
                      }}
                    />
                    <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      {task.assignee}
                    </Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))
        )}
      </Grid>
    );

    // Bugs View - Click to show bug detail table with Enhanced Animations
    const renderBugs = () => (
      <Grid container spacing={isMobile ? 1 : 2}>
        {projects.flatMap((project, pIndex) =>
          project.bugs.slice(0, isMobile ? 4 : 8).map((bug, index) => (
            <Grid item xs={12} sm={6} lg={4} key={bug.id}>
              <Slide in timeout={800 + pIndex * 100 + index * 80} direction="up">
                <Card
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha("#ef4444", 0.02)}, transparent 50%)`,
                      opacity: 0,
                      transition: "opacity 0.5s ease",
                    },
                    "&:hover": {
                      transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-10px) scale(1.03)",
                      boxShadow: `0 20px 56px ${alpha("#ef4444", 0.15)}`,
                      borderColor: "#ef4444",
                    },
                    "&:hover::before": {
                      opacity: 1,
                    },
                  }}
                  onClick={() => handleBugCardClick(bug)}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {bug.title}
                    </Typography>
                    <Chip
                      label={bug.severity}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(bug.severity) + "20",
                        color: getPriorityColor(bug.severity),
                        fontWeight: 600,
                        fontSize: isMobile ? 6 : 9,
                        textTransform: "uppercase",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#9ca3af" : "#475569", mb: 1 }}>
                    {bug.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={bug.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(bug.status) + "20",
                        color: getStatusColor(bug.status),
                        fontSize: isMobile ? 7 : 10,
                      }}
                    />
                    <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      {bug.assignee}
                    </Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))
        )}
      </Grid>
    );

    // Boards View - Click to show board detail with Enhanced Animations
    const renderBoards = () => (
      <Box>
        <Typography
          sx={{
            color: isDark ? "#ffffff" : "#0f172a",
            fontSize: isMobile ? 16 : 18,
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            animation: "fadeInDown 0.8s ease-out, textGlow 3s ease-in-out infinite",
            "@keyframes fadeInDown": {
              "0%": { opacity: 0, transform: "translateY(-20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes textGlow": {
              "0%, 100%": { textShadow: "0 0 0 rgba(24, 120, 178, 0)" },
              "50%": { textShadow: `0 0 20px ${alpha(PRIMARY_COLOR, 0.2)}` },
            },
          }}
        >
          {user.username}'s Project Boards
        </Typography>
        <Grid container spacing={isMobile ? 1 : 3}>
          {projects.slice(0, isMobile ? 3 : 6).map((project, pIndex) => (
            <Grid item xs={12} lg={6} key={project.id}>
              <Slide in timeout={600 + pIndex * 150} direction="left">
                <Card
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-12px) scale(1.03)",
                      boxShadow: `0 24px 64px ${alpha(PRIMARY_COLOR, 0.15)}`,
                      borderColor: PRIMARY_COLOR,
                    },
                  }}
                  onClick={() => handleBoardClick(project)}
                >
                  <Typography sx={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", mb: 2 }}>
                    {project.name}
                  </Typography>
                  <Grid container spacing={1}>
                    {(["todo", "in-progress", "review", "done"] as Task["status"][]).map((status, idx) => {
                      const tasks = project.tasks.filter((t) => t.status === status);
                      const statusColors = {
                        todo: "#6b7280",
                        "in-progress": "#3b82f6",
                        review: "#8b5cf6",
                        done: "#22c55e"
                      };
                      const statusIcons = {
                        todo: "lucide:circle",
                        "in-progress": "lucide:loader-circle",
                        review: "lucide:eye",
                        done: "lucide:check-circle"
                      };
                      return (
                        <Grid item xs={3} key={status}>
                          <Grow in timeout={800 + idx * 100}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: isMobile ? 1 : 1.5,
                                borderRadius: 2,
                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                                border: "1px solid",
                                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                                textAlign: "center",
                                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                "&:hover": {
                                  transform: "scale(1.08) translateY(-6px)",
                                  boxShadow: `0 12px 32px ${alpha(PRIMARY_COLOR, 0.12)}`,
                                  borderColor: statusColors[status],
                                },
                              }}
                            >
                              <Icon 
                                icon={statusIcons[status]} 
                                style={{ 
                                  fontSize: isMobile ? 10 : 14, 
                                  color: statusColors[status],
                                  marginBottom: 4
                                }} 
                              />
                              <Typography
                                sx={{
                                  fontSize: isMobile ? 6 : 9,
                                  color: isDark ? "#9ca3af" : "#475569",
                                  textTransform: "uppercase",
                                }}
                              >
                                {isMobile ? status.slice(0, 3) : status}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: isMobile ? 12 : 18,
                                  fontWeight: 700,
                                  color: isDark ? "#ffffff" : "#0f172a",
                                }}
                              >
                                {tasks.length}
                              </Typography>
                            </Paper>
                          </Grow>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      Bugs: {project.bugs.filter((b) => b.status !== "closed").length} open
                    </Typography>
                    <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      Progress: {project.progress}%
                    </Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    );

    // ============================================================================
    // User Detail Main Render - Full Screen with Enhanced Animations
    // ============================================================================

    return (
      <Box>
        {/* User Profile Header - Full Width with Enhanced Animations */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 4,
              mb: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.05)}, transparent 70%)`,
                animation: "bgFloat 10s ease-in-out infinite",
                "@keyframes bgFloat": {
                  "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                  "33%": { transform: "translate(-30px, -20px) scale(1.1)" },
                  "66%": { transform: "translate(30px, 20px) scale(0.9)" },
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 70%)`,
                animation: "bgFloatReverse 15s ease-in-out infinite",
                "@keyframes bgFloatReverse": {
                  "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                  "50%": { transform: "translate(40px, -30px) scale(1.2)" },
                },
              },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "center" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction={isMobile ? "column" : "row"} alignItems="center" spacing={isMobile ? 2 : 3}>
                <Zoom in timeout={800}>
                  <Avatar
                    sx={{
                      width: isMobile ? 56 : 72,
                      height: isMobile ? 56 : 72,
                      bgcolor: user.avatar,
                      fontSize: isMobile ? 22 : 28,
                      fontWeight: 700,
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        transform: "scale(1.15) rotate(15deg)",
                        boxShadow: `0 8px 32px ${alpha(user.avatar, 0.4)}`,
                      },
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Zoom>
                <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                  <Typography
                    sx={{
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInRight 0.8s ease-out",
                      "@keyframes fadeInRight": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    {user.username}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#9ca3af" : "#475569" }}>
                    {user.email}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <Chip
                      label={user.organization}
                      sx={{
                        bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                        color: isDark ? "#ffffff" : "#0f172a",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      icon={<Icon icon={getRoleIcon(user.role)} style={{ fontSize: isMobile ? 12 : 14 }} />}
                      label={user.role}
                      sx={{
                        bgcolor: getRoleColor(user.role) + "20",
                        color: getRoleColor(user.role),
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: getRoleColor(user.role),
                        },
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "row" : "row"} spacing={isMobile ? 1 : 2} flexWrap="wrap" justifyContent="center">
                {[
                  { label: "Projects", value: projects.length, icon: "lucide:folder", color: PRIMARY_COLOR },
                  { label: "Tasks Done", value: `${completedTasks}/${totalTasks}`, icon: "lucide:check-square", color: "#22c55e" },
                  { label: "Bugs Open", value: `${openBugs}/${totalBugs}`, icon: "lucide:bug", color: "#ef4444" },
                ].map((stat, idx) => (
                  <Zoom key={stat.label} in timeout={700 + idx * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        p: isMobile ? 1 : 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        bgcolor: isDark ? "#0F1828" : "#ffffff",
                        textAlign: "center",
                        minWidth: isMobile ? 50 : 90,
                        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        "&:hover": {
                          transform: "scale(1.15) translateY(-6px)",
                          boxShadow: `0 12px 40px ${alpha(stat.color, 0.25)}`,
                          borderColor: stat.color,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: isMobile ? 14 : 22,
                          fontWeight: 700,
                          color: stat.color,
                          animation: "countUp 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          "@keyframes countUp": {
                            "0%": { transform: "scale(0.5) rotate(-10deg)", opacity: 0 },
                            "100%": { transform: "scale(1) rotate(0deg)", opacity: 1 },
                          },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography sx={{ fontSize: isMobile ? 8 : 11, color: isDark ? "#9ca3af" : "#475569" }}>
                        {stat.label}
                      </Typography>
                    </Card>
                  </Zoom>
                ))}
              </Stack>
              <Button
                variant="contained"
                onClick={handleBackToUsers}
                startIcon={<Icon icon="lucide:arrow-left" style={{ fontSize: isMobile ? 14 : 18 }} />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 600,
                  bgcolor: PRIMARY_COLOR,
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": {
                    transform: "scale(1.08) translateX(-6px)",
                    bgcolor: PRIMARY_DARK,
                    boxShadow: `0 12px 40px ${alpha(PRIMARY_COLOR, 0.4)}`,
                  },
                }}
              >
                Back to All Users
              </Button>
            </Stack>
          </Paper>
        </Slide>

        {/* Navigation Tabs with Enhanced Animations */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={isMobile ? 0.5 : 1} sx={{ flexWrap: "wrap", gap: isMobile ? 0.5 : 1 }}>
            {(["projects", "sprints", "tasks", "bugs", "boards"] as ViewType[]).map((item, idx) => (
              <Grow key={item} in timeout={1200 + idx * 100}>
                <Chip
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
                  onClick={() => {
                    setView(item);
                    setSelectedTaskCard(null);
                    setSelectedBugCard(null);
                    setSelectedBoard(null);
                    setSelectedTask(null);
                  }}
                  icon={
                    <Icon
                      icon={`lucide:${
                        item === "projects"
                          ? "folder"
                          : item === "sprints"
                          ? "git-branch"
                          : item === "tasks"
                          ? "check-square"
                          : item === "bugs"
                          ? "bug"
                          : "layout-dashboard"
                      }`}
                      style={{ fontSize: isMobile ? 12 : 16 }}
                    />
                  }
                  sx={{
                    px: isMobile ? 1 : 1.5,
                    py: isMobile ? 1 : 1.5,
                    borderRadius: 2,
                    fontSize: isMobile ? 9 : 13,
                    fontWeight: 600,
                    bgcolor: view === item ? PRIMARY_COLOR : isDark ? "#0F1828" : "#ffffff",
                    color: view === item ? "#ffffff" : isDark ? "#9ca3af" : "#475569",
                    border: "1px solid",
                    borderColor: view === item ? PRIMARY_COLOR : isDark ? "#1a2744" : "#e2e8f0",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      transform: view === item ? "scale(1.08)" : "scale(1.12) translateY(-4px)",
                      boxShadow: view === item ? `0 8px 32px ${alpha(PRIMARY_COLOR, 0.4)}` : `0 4px 24px ${alpha(PRIMARY_COLOR, 0.12)}`,
                    },
                    "& .MuiChip-icon": {
                      color: view === item ? "#ffffff" : "inherit",
                    },
                  }}
                />
              </Grow>
            ))}
          </Stack>
        </Box>

        {/* Content Area with Enhanced Animations */}
        <Box
          sx={{
            animation: "fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            "@keyframes fadeInScale": {
              "0%": { opacity: 0, transform: "scale(0.95)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          {selectedTaskCard ? (
            renderTaskDetailView()
          ) : selectedBugCard ? (
            renderBugDetailView()
          ) : selectedBoard ? (
            renderBoardDetailView()
          ) : selectedProject && !selectedTask ? (
            renderProjectDetail()
          ) : selectedSprint ? (
            renderSprintDetail()
          ) : (
            <>
              {view === "projects" && renderProjects()}
              {view === "sprints" && renderSprints()}
              {view === "tasks" && renderTasks()}
              {view === "bugs" && renderBugs()}
              {view === "boards" && renderBoards()}
            </>
          )}
        </Box>
      </Box>
    );
  };

  // ============================================================================
  // Main Dashboard Render with Enhanced Animations
  // ============================================================================

  return (
    <Container maxWidth="xl" disableGutters>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: isDark ? "#0F1828" : "#f8fafc",
          p: isMobile ? 1 : 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "fixed",
            top: -200,
            right: -200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 70%)`,
            animation: "bgFloatBig 20s ease-in-out infinite",
            "@keyframes bgFloatBig": {
              "0%, 100%": { transform: "translate(0, 0) scale(1)" },
              "33%": { transform: "translate(-50px, -30px) scale(1.2)" },
              "66%": { transform: "translate(50px, 20px) scale(0.8)" },
            },
          },
          "&::after": {
            content: '""',
            position: "fixed",
            bottom: -200,
            left: -200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.02)}, transparent 70%)`,
            animation: "bgFloatBigReverse 25s ease-in-out infinite",
            "@keyframes bgFloatBigReverse": {
              "0%, 100%": { transform: "translate(0, 0) scale(1)" },
              "33%": { transform: "translate(50px, 30px) scale(1.3)" },
              "66%": { transform: "translate(-50px, -20px) scale(0.7)" },
            },
          },
        }}
      >
        {/* Show Global View (Header + Search + Users Table) ONLY when no user is selected */}
        {!selectedUser ? (
          <>
            {/* Header with Enhanced Animations */}
            <Grow in timeout={600}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  mb: 3,
                  p: isMobile ? 2 : 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  bgcolor: isDark ? "#0F1828" : "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                  animation: "slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), glowPulse 3s ease-in-out infinite",
                  "@keyframes slideDown": {
                    "0%": { opacity: 0, transform: "translateY(-30px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                  "@keyframes glowPulse": {
                    "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" },
                    "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.06)}` },
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Zoom in timeout={800}>
                    <Box
                      sx={{
                        width: isMobile ? 40 : 48,
                        height: isMobile ? 40 : 48,
                        borderRadius: 2,
                        bgcolor: PRIMARY_COLOR,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "pulseIcon 2s ease-in-out infinite",
                        "@keyframes pulseIcon": {
                          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
                          "50%": { transform: "scale(1.1) rotate(5deg)" },
                        },
                      }}
                    >
                      <Icon icon="lucide:users" style={{ fontSize: isMobile ? 18 : 24, color: "#fff" }} />
                    </Box>
                  </Zoom>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: isMobile ? 14 : 18,
                        fontWeight: 700,
                        color: isDark ? "#ffffff" : "#0f172a",
                        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.6)}, ${PRIMARY_COLOR})`,
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "shimmerText 3s linear infinite",
                        "@keyframes shimmerText": {
                          "0%": { backgroundPosition: "200% center" },
                          "100%": { backgroundPosition: "0% center" },
                        },
                      }}
                    >
                      Team Dashboard
                    </Typography>
                    <Typography sx={{ color: isDark ? "#9ca3af" : "#475569", fontSize: isMobile ? 11 : 13 }}>
                      {users.length} team members • Click on any user to view details
                    </Typography>
                  </Box>
                </Stack>
                <Chip
                  label={`${users.length} Users`}
                  sx={{
                    bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontWeight: 600,
                    mt: isMobile ? 1 : 0,
                    animation: "pulseChip 2s ease-in-out infinite",
                    "@keyframes pulseChip": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.03)" },
                    },
                  }}
                />
              </Box>
            </Grow>

            {/* Search - Only in Global View with Enhanced Animations */}
            <Fade in timeout={700}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  placeholder={isMobile ? "Search users..." : "Search users by name, email, or organization..."}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: isDark ? "#0F1828" : "#ffffff",
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "& fieldset": {
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        transition: "border-color 0.3s ease",
                      },
                      "&:hover": {
                        transform: "scale(1.02)",
                        "& fieldset": {
                          borderColor: isDark ? "#2a3a5c" : "#94a3b8",
                        },
                      },
                      "&.Mui-focused": {
                        transform: "scale(1.03)",
                        boxShadow: `0 12px 40px ${alpha(PRIMARY_COLOR, 0.15)}`,
                        "& fieldset": {
                          borderColor: PRIMARY_COLOR,
                        },
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: isDark ? "#ffffff" : "#0f172a",
                      fontSize: isMobile ? 13 : 16,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon
                          icon="lucide:search"
                          style={{
                            fontSize: isMobile ? 14 : 17,
                            color: isDark ? "#6b7280" : "#94a3b8",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Fade>

            {/* Users Table - Only in Global View with Enhanced Animations */}
            <Box>
              <Typography
                sx={{
                  color: isDark ? "#ffffff" : "#0f172a",
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 600,
                  mb: 2,
                  animation: "fadeIn 0.8s ease-out",
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                All Team Members
              </Typography>
              {filteredUsers.length === 0 ? (
                <Zoom in timeout={600}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: "center",
                      border: "1px solid",
                      borderColor: isDark ? "#1a2744" : "#e2e8f0",
                      borderRadius: 3,
                      bgcolor: isDark ? "#0F1828" : "#ffffff",
                      animation: "shake 0.5s ease",
                      "@keyframes shake": {
                        "0%, 100%": { transform: "translateX(0)" },
                        "25%": { transform: "translateX(-10px)" },
                        "75%": { transform: "translateX(10px)" },
                      },
                    }}
                  >
                    <Typography sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
                      No users found matching your search.
                    </Typography>
                  </Card>
                </Zoom>
              ) : (
                renderUserTable()
              )}
            </Box>
          </>
        ) : (
          // User Detail View - Full Screen (No Header, No Search, No Team Members)
          renderUserDetail()
        )}
      </Box>
    </Container>
  );
}