"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Tooltip,
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Skeleton,
  Checkbox,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";



interface ApiUser {
  userID: number;
  name: string;
  email: string;
  organizationname: string | null;
  organizationID?: number;
  role: string;
  projectcount: number;
  projecttaskcount: number;
  projectworkspacecount: number;
  sprintcount: number;
  isProductOwner: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  organization: string;
  role: "Admin" | "Member" | "Viewer";
  avatar: string;
  projects: Project[];
  userID?: number;
  organizationID?: number;
  projectcount?: number;
  projecttaskcount?: number;
  projectworkspacecount?: number;
  sprintcount?: number;
  isProductOwner?: boolean;
}

interface UserProjectTask {
  workspaceID: number;
  userID: number;
  username: string;
  taskID: number;
  taskname: string;
  taskDescription: string;
  statusname: string;
  statusid: number;
  priorityname: string;
  priorityID: number;
  projectname: string;
  projectID: number;
  taskGroupID: number;
  taskGroupname: string;
  timelinestartdate: string;
  timelineenddate: string;
}



interface ApiWorkspace {
  workspaceID: number;
  workspaceName: string;
  organizationID: number;
  organizationname: string;
}



interface ApiSprintTaskGroupInfo {
  taskGroupID: number;
  groupname: string;
  sprintID: number;
  sprintname: string;
  sprintGoals: string;
  sprintTimelineEnd: string;
  sprintTimeLineStart: string;
  sprintTimeElapsedInSeconds: number;
}



interface ApiSprintGroup {
  SprintGroupID: number;
  GroupName: string;
  WorkspaceID: number;
}



// ✅ NEW: GetSprintInfoList API types
interface ApiSprintInfoLookup {
  id: number;
  title: string;
  key: string; // USR | DDL | LBL | FLE | TXT | DPK | NUM
}

interface ApiSprintInfoColumn {
  additionalColumnID: number;
  colname: string;
  typeID: number;
  dynamicColumnTypeInfo: string;
  lookups: ApiSprintInfoLookup;
}

interface ApiSprintInfoDetail {
  sprintID: number;
  name: string;
  goals: string;
  sprinttimelinestart: string;
  sprinttimelineend: string;
  sprintstatus: string;
  sprintTimeElapsedinSeconds: number;
  completedate: string;
  isSprintComplete: number;
  isSprintActive: number;
  dynamicColumnList: unknown | null;
}

interface ApiSprintInfoDropdownValue {
  dynamicddlID: number;
  valueText: string;
}

interface ApiSprintInfoUserValue {
  userID: number;
  username: string;
  email: string;
}

interface ApiSprintInfoStatusValue {
  statusID: number;
  statustext: string;
}

interface ApiSprintInfoColumnValue {
  additionalColumnID: number;
  colname: string;
  typeID: number;
  dynamicColumnTypeInfo: string;
  sprintWorkspaceID: number;
  dynamicColumnValues: string;
  dynamicUserID: number;
  dynamicDropDownID: string;
  statusID: number;
  displayText: string;
  sprintID: number;
  dynamicDropdownValueList: ApiSprintInfoDropdownValue[];
  dynamicUserValueList: ApiSprintInfoUserValue[];
  dynamicStatusValueList: ApiSprintInfoStatusValue[];
}

interface ApiSprintInfoGroup {
  colList: ApiSprintInfoColumn[];
  detailList: ApiSprintInfoDetail[];
  colvalueList: ApiSprintInfoColumnValue[];
}

type ApiSprintInfoResponse = ApiSprintInfoGroup[];



interface ApiBugGroup {
  bugGroupID: number;
  groupname: string;
}




interface ApiBugDynamicColumnLookup {
  id: number;
  title: string;
  key: string; // USR | DDL | DPK | LBL | NUM | FLE | TXT
}

interface ApiBugDynamicColumn {
  additionalColumnID: number;
  colname: string;
  typeID: number;
  dynamicColumnTypeInfo: string;
  lookups: ApiBugDynamicColumnLookup;
}

interface ApiBugDetail {
  bugID: number;
  bugName: string;
  bugDescription: string;
  reporterID: number;
  reporterinfo: string;
  timeResolution: string;
  isTimerStart: boolean;
  statusID: number;
  statusname: string;
  priorityID: number;
  priorityname: string;
  prioritycolorcode: string;
  taskID: number;
  groupID: number;
  dynamicColumnList: unknown | null;
}

interface ApiBugColumnValue {
  additionalColumnID: number;
  colname: string;
  typeID: number;
  dynamicColumnTypeInfo: string;
  workspaceID: number;
  dynamicColumnValues: string;
  dynamicUserID: number;
  dynamicDropDownID: string;
  statusID: number;
  displayText: string;
  bugID: number;
  dynamicDropdownValueList: Array<{
    dynamicddlID: number;
    valueText: string;
  }>;
  dynamicUserValueList: Array<{
    userID: number;
    username: string;
    email: string;
  }>;
  dynamicStatusValueList: Array<{
    statusID: number;
    statustext: string;
  }>;
}

interface ApiBugInfoGroup {
  colList: ApiBugDynamicColumn[];
  detailList: ApiBugDetail[];
  colvalueList: ApiBugColumnValue[];
}

type ApiBugInfoResponse = ApiBugInfoGroup[];



interface MergedBugColumn {
  key: string;
  id: number;
  name: string;
  keyname: string;
  isCore: boolean;
}

const BUG_CORE_COLUMN_IDS = {
  BUG_NAME: -2001,
  BUG_DESCRIPTION: -2002,
  REPORTER: -2003,
  TIME_RESOLUTION: -2004,
  PRIORITY: -2005,
  STATUS: -2006,
} as const;

const buildMergedBugColumns = (
  dynamicColumns: ApiBugDynamicColumn[]
): MergedBugColumn[] => {
  const coreColumns: MergedBugColumn[] = [
    {
      key: "core:bugName",
      id: BUG_CORE_COLUMN_IDS.BUG_NAME,
      name: "Bug Name",
      keyname: "NAME",
      isCore: true,
    },
    {
      key: "core:bugDescription",
      id: BUG_CORE_COLUMN_IDS.BUG_DESCRIPTION,
      name: "Bug Details",
      keyname: "DESCRIPTION",
      isCore: true,
    },
    {
      key: "core:reporter",
      id: BUG_CORE_COLUMN_IDS.REPORTER,
      name: "Reporter",
      keyname: "REPORTER",
      isCore: true,
    },
    {
      key: "core:timeResolution",
      id: BUG_CORE_COLUMN_IDS.TIME_RESOLUTION,
      name: "Time Until Resolution",
      keyname: "TIME_RESOLUTION",
      isCore: true,
    },
    {
      key: "core:priority",
      id: BUG_CORE_COLUMN_IDS.PRIORITY,
      name: "Priority",
      keyname: "PRIORITY",
      isCore: true,
    },
    {
      key: "core:status",
      id: BUG_CORE_COLUMN_IDS.STATUS,
      name: "Status",
      keyname: "STATUS",
      isCore: true,
    },
  ];

  const dynamicMapped: MergedBugColumn[] = dynamicColumns.map((col) => ({
    key: `dyn:${col.additionalColumnID}`,
    id: col.additionalColumnID,
    name: col.colname || "Column",
    keyname: (col.lookups?.key || "").toUpperCase(),
    isCore: false,
  }));

  return [...coreColumns, ...dynamicMapped];
};



const getBugColumnValue = (
  bug: ApiBugDetail,
  column: MergedBugColumn,
  colValue: ApiBugColumnValue | undefined,
  helpers: {
    getPriorityColor: (p: string) => string;
    getStatusColor: (s: string) => string;
    isDark: boolean;
    isMobile: boolean;
    onFileClick?: FileClickHandler;
  }
): React.ReactNode => {
  const { getPriorityColor, getStatusColor, isDark, isMobile, onFileClick } = helpers;

  if (column.isCore) {
    switch (column.keyname) {
      case "NAME":
        return (
          <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
            {bug.bugName || "Untitled Bug"}
          </Typography>
        );

      case "DESCRIPTION":
        return (
          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#cbd5e1" : "#334155", lineHeight: 1.5 }}>
            {bug.bugDescription || "—"}
          </Typography>
        );

      case "REPORTER":
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                width: 26, height: 26,
                bgcolor: isDark ? "#334155" : "#cbd5e1",
                fontSize: 11, fontWeight: 700,
                color: isDark ? "#e2e8f0" : "#0f172a",
              }}
            >
              {(bug.reporterinfo.split(";")[1]?.trim()|| "?").charAt(0).toUpperCase()}
            </Avatar>
          <Tooltip title={bug.reporterinfo.split(";")[1]?.trim() || "-"} arrow>
  <Typography 
    sx={{ 
      fontSize: isMobile ? 11 : 13, 
      color: isDark ? "#e2e8f0" : "#1e293b",
      cursor: "pointer"
    }}
  >
    {bug.reporterinfo 
      ? bug.reporterinfo.split(";")[1]?.trim() || bug.reporterinfo 
      : "-"}
  </Typography>
</Tooltip>
          </Stack>
        );

      case "TIME_RESOLUTION":
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Icon icon="lucide:clock" style={{ fontSize: 14, color: isDark ? "#94a3b8" : "#64748b" }} />
            <Typography sx={{
              fontSize: isMobile ? 11 : 12, fontWeight: 600,
              color: isDark ? "#ffffff" : "#0f172a", fontFamily: "monospace",
            }}>
              {bug.timeResolution || "—"}
            </Typography>
          </Stack>
        );

      case "PRIORITY":
        return (
          <Chip
            label={bug.priorityname || "—"}
            size="small"
            sx={{
              bgcolor: alpha(bug.prioritycolorcode || getPriorityColor(bug.priorityname), 0.15),
              color: bug.prioritycolorcode || getPriorityColor(bug.priorityname),
              fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px",
            }}
          />
        );

      case "STATUS": {
        const label = bug.statusname || "—";
        const color = getStatusColor(label);
        return (
          <Chip
            label={label}
            size="small"
            sx={{ bgcolor: alpha(color, 0.15), color: color, fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px" }}
          />
        );
      }

      default:
        return <Typography sx={{ fontSize: 12 }}>—</Typography>;
    }
  }

  if (!colValue) {
    return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
  }

  switch (column.keyname) {
    case "USR": {
      const users = colValue.dynamicUserValueList || [];
      if (users.length === 0) {
        return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      }
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 26, height: 26, bgcolor: isDark ? "#334155" : "#cbd5e1", fontSize: 11, fontWeight: 700, color: isDark ? "#e2e8f0" : "#0f172a" }}>
            {users[0].username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            {users[0].username}
          </Typography>
        </Stack>
      );
    }

    case "DDL": {
      const ddls = colValue.dynamicDropdownValueList || [];
      const label = ddls.length > 0 ? ddls[0].valueText : colValue.displayText || "—";
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{label || "—"}</Typography>;
    }

    case "DPK":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;

    case "LBL": {
      const statuses = colValue.dynamicStatusValueList || [];
      if (statuses.length === 0) {
        return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      }
      const label = statuses[0].statustext;
      const color = getStatusColor(label);
      return (
        <Chip label={label} size="small" sx={{ bgcolor: alpha(color, 0.15), color: color, fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px" }} />
      );
    }

    case "NUM":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{colValue.dynamicColumnValues || "0"}</Typography>;

    case "FLE": {
      const fileUrl = colValue.dynamicColumnValues;
      const displayName = colValue.displayText || "File";
      if (!fileUrl) {
        return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      }
      const imageFile = isImageUrl(fileUrl);
      return (
        <Button
          size="small"
          onClick={(e) => { e.stopPropagation(); onFileClick?.({ title: displayName, url: fileUrl }); }}
          startIcon={<Icon icon={imageFile ? "lucide:image" : "lucide:file"} style={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none", fontSize: 11, fontWeight: 600, color: PRIMARY_COLOR,
            px: 0.75, py: 0.25, minWidth: 0, borderRadius: "6px", transition: "all 0.25s ease",
            "&:hover": { color: PRIMARY_DARK, backgroundColor: alpha(PRIMARY_COLOR, 0.1), transform: "translateY(-1px)" },
          }}
        >
          {displayName}
        </Button>
      );
    }

    case "TXT":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;

    default:
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;
  }
};



interface WorkspaceTaskGroupTask {
  taskID: number;
  taskName: string;
  taskDescription: string;
  owner: string;
  ownerProfilePicture?: string;
  isUnplanned: boolean;
  actualSP: number;
  estimatedSP: number;
  priority: string;
  status: string;
}

interface WorkspaceTaskGroup {
  taskGroupID: number;
  taskGroupName: string;
  tasks: WorkspaceTaskGroupTask[];
}










interface ApiDynamicColumnLookup {
  id: number;
  title: string;
  key: string;
}

interface ApiDynamicColumn {
  additionalColumnID: number;
  colname: string;
  typeID: number;
  dynamicColumnTypeInfo: string;
  lookups: ApiDynamicColumnLookup;
}

interface ApiDynamicColumnUserValue {
  userID: number;
  username: string;
  email: string;
}

interface ApiDynamicColumnDropdownValue {
  dynamicddlID: number;
  valueText: string;
}

interface ApiDynamicColumnStatusValue {
  statusID: number;
  statustext: string;
}

interface ApiTaskDetail {
  taskID: number;
  taskname: string;
  description: string;
  ownername: string;
  ownerID: number;
  statusname: string;
  statusColorCode: string;
  actualSP: number;
  estimatedSP: number;
  isUnplanned: boolean;
  sprintID: number;
  priorityID: number;
  priorityname: string;
  dynamicColumnList: unknown | null;
}

interface ApiColumnValue {
  additionalColumnID: number;
  colname: string;
  typeID: number;
  dynamicColumnTypeInfo: string;
  groupID: number;
  dynamicColumnValues: string;
  dynamicUserID: number;
  dynamicDropDownID: string;
  statusID: number;
  displayText: string;
  taskID: number;
  dynamicDropdownValueList: ApiDynamicColumnDropdownValue[];
  dynamicUserValueList: ApiDynamicColumnUserValue[];
  dynamicStatusValueList: ApiDynamicColumnStatusValue[];
}

interface ApiSprintTaskInfoGroup {
  colList: ApiDynamicColumn[];
  detailList: ApiTaskDetail[];
  colvalueList: ApiColumnValue[];
}

type ApiSprintTaskInfoResponse = ApiSprintTaskInfoGroup[];


interface ApiSprintDynamicColumn {
  additionalColumnID: number;
  columnName: string;
  id: number;
  keyname: string;
  title: string;
  groupID: number;
}

type ApiSprintDynamicColumnList = ApiSprintDynamicColumn[];



interface MergedTaskColumn {
  key: string;
  id: number;
  name: string;
  keyname: string;
  isCore: boolean;
}

const TASK_CORE_COLUMN_IDS = {
  TASK_NAME: -1001,
  DESCRIPTION: -1002,
  OWNER: -1003,
  STATUS: -1004,
  ACTUAL_SP: -1005,
  ESTIMATED_SP: -1006,
  IS_UNPLANNED: -1007,
  PRIORITY: -1008,
} as const;



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
  attachmentLink?: string;
  createDate?: string;
  categoryName?: string;
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

interface BoardTaskDetail {
  taskID: number;
  taskTitle: string;
  taskDescription: string;
  priorityID: number;
  priorityName: string;
  priorityColorCode: string;
  assignedTo: string;
  projectTaskID: number;
  createDate: string;
  attachmentLink: string;
  categoryID: number;
  categoryName: string;
  assignedUserID: number;
}

interface BoardCategory {
  categoryID: number;
  categoryname: string;
  categoryColorCode: string;
  details: BoardTaskDetail[];
}

interface UserProjectListItem {
  organizationID: number;
  userID: number;
  userName: string;
  organizationName: string;
  totalProjects: number;
  projects: string;
}

type ViewType = "projects" | "sprints" | "tasks" | "bugs" | "boards";



const PRIMARY_COLOR = "#1878b2";
const PRIMARY_DARK = "#0d5a85";
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl1 = import.meta.env.VITE_API_URL1;


console.log(apiUrl1);
const baseUrl = apiUrl.replace(/\/api\/?$/, "");
console.log(baseUrl);
const API_URL = `${baseUrl}/GetOnboardUserDashboard`;
const USER_PROJECT_LIST_API_URL = `${apiUrl1}GetUserProjectList`;
const USER_PROJECT_TASK_LIST_API_URL = `${apiUrl1}GetUserProjectTaskList`;
const WORKSPACE_LIST_API_URL = `${apiUrl1}GetWorkspaceList`;

const SPRINT_TASK_GROUP_INFO_API_URL = `${apiUrl1}GetSprintTaskGroupInfoList`;
const SPRINT_TASK_INFO_API_URL = `${apiUrl1}GetSprintTaskInfoList`;
const SPRINT_TASK_DYNAMIC_COLUMNS_API_URL = `${apiUrl1}SprintTaskGetDynamicColumList`;
const BUG_GROUP_LIST_API_URL = `${apiUrl1}GetBuggroupList`;
const BUG_INFO_LIST_API_URL = `${apiUrl1}GetBugInfoList`;
// ✅ NEW: Sprint Group API (returns groups for a workspace)
const SPRINT_GROUP_API_URL = `http://localhost:8080/api/sprint-group`;
// ✅ NEW: GetSprintInfoList API
const SPRINT_INFO_API_URL = `${apiUrl1}GetSprintInfoList`;
const AVATAR_COLORS = [
  "#1878b2", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e",
  "#8b5cf6", "#14b8a6", "#ec4899", "#f97316", "#06b6d4",
  "#6366f1", "#84cc16", "#d946ef", "#0891b2", "#e11d48"
];

const BOARD_PRIORITY_COLORS: Record<string, string> = {
  "High": "#ef4444",
  "Medium": "#f59e0b",
  "Low": "#22c55e",
};



const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return /\.(jpeg|jpg|gif|png|webp|svg|bmp|avif|ico)$/i.test(clean);
};

const isAbsoluteUrl = (url: string): boolean => {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
};


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

const generateProjectsForUser = (userName: string, orgName: string, projectCount: number = 2): Project[] => {
  const projectNames = [
    "E-Commerce Platform", "Mobile App Development", "AI Chatbot Integration",
    "Analytics Dashboard", "CRM System", "Inventory Management", "HR Portal", "Payment Gateway"
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
    "Design login page UI", "Implement API endpoints", "Fix authentication bug",
    "Write documentation", "Deploy to production", "Create unit tests",
    "Optimize performance", "Setup CI/CD pipeline", "Review PRs",
    "Update dependencies", "Database migration", "Security audit"
  ];
  const owners = ["frontend", "backend", "devops", "QA"];
  const types = ["frontend", "backend", "design", "devops"];
  const devStatuses = ["Done", "In Progress", "To Do", "Not Started"];

  const bugTitles = [
    "Authentication error", "Data not loading", "UI alignment issue",
    "Performance degradation", "API timeout", "Memory leak",
    "Security vulnerability", "Broken link", "Form validation issue", "Mobile responsiveness"
  ];

  const numProjects = Math.min(projectCount > 0 ? projectCount : 2, projectNames.length);
  const shuffledProjects = projectNames.sort(() => Math.random() - 0.5);
  const selectedProjects = shuffledProjects.slice(0, numProjects);

  return selectedProjects.map((name, index) => {
    const status = statuses[index % statuses.length];
    const progress = Math.floor(Math.random() * 100);
    const sprintCount = Math.floor(Math.random() * 3) + 1;

    const sprints: Sprint[] = Array.from({ length: sprintCount }, (_, sIndex) => {
      const sprintStatuses: ("active" | "completed" | "upcoming")[] = ["active", "completed", "upcoming"];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + sIndex * 14);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 13);

      const sprintTasks: Task[] = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, tIndex) => {
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

    const bugs: Bug[] = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, bIndex) => ({
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
      description: `${name} - ${orgName || "Organization"} project`,
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

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Invalid date";
  }
};

const mapRole = (role: string): "Admin" | "Member" | "Viewer" => {
  const roleLower = role?.toLowerCase() || "";
  if (roleLower === "administrator" || roleLower === "admin") return "Admin";
  if (roleLower === "member") return "Member";
  if (roleLower === "viewer") return "Viewer";
  return "Member";
};

const mapBoardPriority = (priorityName: string): Task["priority"] => {
  const lower = priorityName?.toLowerCase() || "";
  if (lower === "high") return "high";
  if (lower === "medium") return "medium";
  if (lower === "low") return "low";
  return "medium";
};

const mapBoardStatus = (categoryName: string): Task["status"] => {
  const lower = categoryName?.toLowerCase() || "";
  if (lower === "high") return "todo";
  if (lower === "medium") return "in-progress";
  if (lower === "low") return "review";
  return "todo";
};

const parseUserProjectsString = (projectsStr: string, userName: string): Project[] => {
  if (!projectsStr) return [];

  return projectsStr
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split("|").map((p) => p.trim());
      const [projId, projName, projDescription, projStatus] = parts;

      const statusLower = (projStatus || "").toLowerCase();
      const mappedStatus: Project["status"] =
        statusLower === "closed" || statusLower === "completed"
          ? "completed"
          : statusLower === "hold" || statusLower === "on-hold"
          ? "on-hold"
          : "active";

      return {
        id: `userproj_${projId}`,
        name: projName || `Project ${projId}`,
        description: projDescription || `${projName || "Project"} - ${userName}`,
        progress: 0,
        status: mappedStatus,
        createdAt: new Date().toISOString(),
        sprints: [],
        tasks: [],
        bugs: [],
      };
    });
};

const convertProjectTaskToTask = (apiTask: UserProjectTask): Task => {
  const statusMap: Record<string, Task["status"]> = {
    "Done": "done", "In Progress": "in-progress", "In Progess": "in-progress",
    "In Review": "review", "Not started": "todo", "Open": "todo",
    "Closed": "done", "Resolved": "done",
  };
  const priorityMap: Record<string, Task["priority"]> = {
    "Low": "low", "Medium": "medium", "High": "high", "Critical": "high",
  };

  const status = statusMap[apiTask.statusname] || "todo";
  const priority = priorityMap[apiTask.priorityname] || "medium";

  const cleanDescription = apiTask.taskDescription
    ? apiTask.taskDescription.replace(/<[^>]*>/g, "").trim()
    : "No description";

  return {
    id: `task_${apiTask.taskID}`,
    title: apiTask.taskname,
    description: cleanDescription,
    status: status,
    priority: priority,
    assignee: apiTask.username,
    sprintId: `sprint_${apiTask.taskGroupID}`,
    createdAt: apiTask.timelinestartdate || new Date().toISOString(),
    owner: apiTask.username,
    type: apiTask.taskGroupname || "General",
    devStatus: apiTask.statusname,
    document: undefined,
    timeline: `${formatDate(apiTask.timelinestartdate)} - ${formatDate(apiTask.timelineenddate)}`,
    users: [apiTask.username],
    subtasks: [],
    attachmentLink: apiTask.taskDescription?.includes("https://")
      ? apiTask.taskDescription.match(/https:\/\/[^\s<]+/)?.[0]
      : undefined,
    createDate: apiTask.timelinestartdate,
    categoryName: apiTask.taskGroupname,
  };
};




interface FileClickHandler {
  (payload: { title: string; url: string }): void;
}



const buildMergedTaskColumns = (
  dynamicColumns: Array<ApiDynamicColumn | ApiSprintDynamicColumn>
): MergedTaskColumn[] => {
  const coreColumns: MergedTaskColumn[] = [
    { key: "core:taskname",    id: TASK_CORE_COLUMN_IDS.TASK_NAME,    name: "Task Name",    keyname: "NAME",         isCore: true },
    { key: "core:description", id: TASK_CORE_COLUMN_IDS.DESCRIPTION,  name: "Description",  keyname: "DESCRIPTION",  isCore: true },
    { key: "core:owner",       id: TASK_CORE_COLUMN_IDS.OWNER,        name: "Owner",        keyname: "OWNER",        isCore: true },
    { key: "core:status",      id: TASK_CORE_COLUMN_IDS.STATUS,       name: "Status",       keyname: "STATUS",       isCore: true },
    { key: "core:actualSP",    id: TASK_CORE_COLUMN_IDS.ACTUAL_SP,    name: "Actual SP",    keyname: "ACTUAL_SP",    isCore: true },
    { key: "core:estimatedSP", id: TASK_CORE_COLUMN_IDS.ESTIMATED_SP, name: "Estimated SP", keyname: "ESTIMATED_SP", isCore: true },
    { key: "core:isUnplanned", id: TASK_CORE_COLUMN_IDS.IS_UNPLANNED, name: "Is Unplanned", keyname: "IS_UNPLANNED", isCore: true },
    { key: "core:priority",    id: TASK_CORE_COLUMN_IDS.PRIORITY,     name: "Priority",     keyname: "PRIORITY",     isCore: true },
  ];

  const dynamicMapped: MergedTaskColumn[] = dynamicColumns.map((col) => {
    const anyCol = col as any;
    const additionalColumnID = anyCol.additionalColumnID;
    const name = anyCol.columnName || anyCol.colname || "Column";
    const keyname = (anyCol.keyname || anyCol.lookups?.key || "").toUpperCase();

    return {
      key: `dyn:${additionalColumnID}`,
      id: additionalColumnID,
      name,
      keyname,
      isCore: false,
    };
  });

  return [...coreColumns, ...dynamicMapped];
};



interface TaskColHelpers {
  getPriorityColor: (p: string) => string;
  getStatusColor: (s: string) => string;
  isDark: boolean;
  isMobile: boolean;
  onFileClick?: FileClickHandler;
}

const getTaskColumnValue = (
  task: ApiTaskDetail,
  column: MergedTaskColumn,
  colValue: ApiColumnValue | undefined,
  helpers: TaskColHelpers
): React.ReactNode => {
  const { getPriorityColor, getStatusColor, isDark, isMobile, onFileClick } = helpers;

  if (column.isCore) {
    switch (column.keyname) {
      case "NAME":
        return <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{task.taskname || "Untitled Task"}</Typography>;

      case "DESCRIPTION":
        return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#cbd5e1" : "#334155", lineHeight: 1.5 }}>{task.description || "—"}</Typography>;

      case "OWNER":
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: isDark ? "#334155" : "#cbd5e1", fontSize: 11, fontWeight: 700, color: isDark ? "#e2e8f0" : "#0f172a" }}>
              {(task.ownername || "?").charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{task.ownername || "-"}</Typography>
          </Stack>
        );

      case "STATUS": {
        const raw = task.statusname || "";
        const parts = raw.split(";");
        const label = parts.length > 1 ? parts[1] : raw;
        const color = task.statusColorCode || getStatusColor(label);
        return (
          <Chip label={label || "—"} size="small" sx={{ bgcolor: alpha(color, 0.15), color: color, fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px", "& .MuiChip-label": { px: 1 } }} />
        );
      }

      case "ACTUAL_SP":
        return <Typography sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{task.actualSP ?? 0}</Typography>;

      case "ESTIMATED_SP":
        return <Typography sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{task.estimatedSP ?? 0}</Typography>;

      case "IS_UNPLANNED":
        return (
          <Chip label={task.isUnplanned ? "Yes" : "No"} size="small" sx={{ bgcolor: task.isUnplanned ? alpha("#ef4444", 0.15) : alpha("#22c55e", 0.15), color: task.isUnplanned ? "#ef4444" : "#22c55e", fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px" }} />
        );

      case "PRIORITY":
        return (
          <Chip label={task.priorityname || "—"} size="small" sx={{ bgcolor: alpha(getPriorityColor(task.priorityname), 0.15), color: getPriorityColor(task.priorityname), fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px" }} />
        );

      default:
        return <Typography sx={{ fontSize: 12 }}>—</Typography>;
    }
  }

  if (!colValue) {
    return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
  }

  switch (column.keyname) {
    case "USR": {
      const users = colValue.dynamicUserValueList || [];
      if (users.length === 0) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 26, height: 26, bgcolor: isDark ? "#334155" : "#cbd5e1", fontSize: 11, fontWeight: 700, color: isDark ? "#e2e8f0" : "#0f172a" }}>
            {users[0].username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{users[0].username}</Typography>
        </Stack>
      );
    }

    case "DDL": {
      const ddls = colValue.dynamicDropdownValueList || [];
      const label = ddls.length > 0 ? ddls[0].valueText : colValue.displayText || "—";
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{label || "—"}</Typography>;
    }

    case "LBL": {
      const statuses = colValue.dynamicStatusValueList || [];
      if (statuses.length === 0) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      const label = statuses[0].statustext;
      const color = getStatusColor(label);
      return <Chip label={label} size="small" sx={{ bgcolor: alpha(color, 0.15), color: color, fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px" }} />;
    }

    case "TXT":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;

    case "DPK":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;

    case "NUM":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{colValue.dynamicColumnValues || "0"}</Typography>;

    case "FLE": {
      const fileUrl = colValue.dynamicColumnValues;
      const displayName = colValue.displayText || "File";
      if (!fileUrl) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      const imageFile = isImageUrl(fileUrl);
      return (
        <Button
          size="small"
          onClick={(e) => { e.stopPropagation(); onFileClick?.({ title: displayName, url: fileUrl }); }}
          startIcon={<Icon icon={imageFile ? "lucide:image" : "lucide:file"} style={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none", fontSize: 11, fontWeight: 600, color: PRIMARY_COLOR,
            px: 0.75, py: 0.25, minWidth: 0, borderRadius: "6px", transition: "all 0.25s ease",
            "&:hover": { color: PRIMARY_DARK, backgroundColor: alpha(PRIMARY_COLOR, 0.1), transform: "translateY(-1px)" },
          }}
        >
          {displayName}
        </Button>
      );
    }

    default:
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;
  }
};



// ✅ NEW: Merged sprint-info column builder
interface MergedSprintInfoColumn {
  key: string;
  id: number;
  name: string;
  keyname: string;
  isCore: boolean;
}

const SPRINT_INFO_CORE_COLUMN_IDS = {
  SPRINT_NAME: -3001,
  GOALS: -3002,
  SPRINT_TIMELINE: -3003,
  SPRINT_STATUS: -3004,
} as const;

const buildMergedSprintInfoColumns = (
  dynamicColumns: ApiSprintInfoColumn[]
): MergedSprintInfoColumn[] => {
  const coreColumns: MergedSprintInfoColumn[] = [
    { key: "core:sprintName",     id: SPRINT_INFO_CORE_COLUMN_IDS.SPRINT_NAME,     name: "Sprint",          keyname: "SPRINT_NAME",     isCore: true },
    { key: "core:goals",          id: SPRINT_INFO_CORE_COLUMN_IDS.GOALS,           name: "Goals",           keyname: "GOALS",           isCore: true },
    { key: "core:sprintTimeline", id: SPRINT_INFO_CORE_COLUMN_IDS.SPRINT_TIMELINE, name: "Sprint Timeline", keyname: "SPRINT_TIMELINE", isCore: true },
    { key: "core:sprintStatus",   id: SPRINT_INFO_CORE_COLUMN_IDS.SPRINT_STATUS,   name: "Status",          keyname: "SPRINT_STATUS",   isCore: true },
  ];

  const dynamicMapped: MergedSprintInfoColumn[] = dynamicColumns.map((col) => ({
    key: `dyn:${col.additionalColumnID}`,
    id: col.additionalColumnID,
    name: col.colname || "Column",
    keyname: (col.lookups?.key || "").toUpperCase(),
    isCore: false,
  }));

  return [...coreColumns, ...dynamicMapped];
};

// ✅ NEW: Sprint-info column value renderer
const getSprintInfoColumnValue = (
  sprint: ApiSprintInfoDetail,
  column: MergedSprintInfoColumn,
  colValue: ApiSprintInfoColumnValue | undefined,
  helpers: {
    getStatusColor: (s: string) => string;
    isDark: boolean;
    isMobile: boolean;
    onFileClick?: FileClickHandler;
  }
): React.ReactNode => {
  const { getStatusColor, isDark, isMobile, onFileClick } = helpers;

  if (column.isCore) {
    switch (column.keyname) {
      case "SPRINT_NAME":
        return (
          <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
            {sprint.name || "Untitled Sprint"}
          </Typography>
        );

      case "GOALS":
        return (
          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#cbd5e1" : "#334155", lineHeight: 1.5, whiteSpace: "normal" }}>
            {sprint.goals || "—"}
          </Typography>
        );

      case "SPRINT_TIMELINE": {
        const start = sprint.sprinttimelinestart || "—";
        const end = sprint.sprinttimelineend || "—";
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Icon icon="lucide:calendar" style={{ fontSize: 14, color: isDark ? "#94a3b8" : "#64748b" }} />
            <Typography sx={{ fontSize: isMobile ? 11 : 12, color: isDark ? "#e2e8f0" : "#1e293b", fontWeight: 500 }}>
              {start} - {end}
            </Typography>
          </Stack>
        );
      }

      case "SPRINT_STATUS": {
        const label = sprint.sprintstatus || "—";
        const color = getStatusColor(label);
        return (
          <Chip label={label} size="small" sx={{ bgcolor: alpha(color, 0.15), color: color, fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px", "& .MuiChip-label": { px: 1 } }} />
        );
      }

      default:
        return <Typography sx={{ fontSize: 12 }}>—</Typography>;
    }
  }

  if (!colValue) {
    return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
  }

  switch (column.keyname) {
    case "USR": {
      const users = colValue.dynamicUserValueList || [];
      if (users.length === 0) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 26, height: 26, bgcolor: isDark ? "#334155" : "#cbd5e1", fontSize: 11, fontWeight: 700, color: isDark ? "#e2e8f0" : "#0f172a" }}>
            {users[0].username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{users[0].username}</Typography>
        </Stack>
      );
    }

    case "DDL": {
      const ddls = colValue.dynamicDropdownValueList || [];
      if (ddls.length === 0) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {ddls.map((d) => (
            <Chip key={d.dynamicddlID} label={d.valueText} size="small" sx={{ bgcolor: alpha(PRIMARY_COLOR, 0.12), color: PRIMARY_COLOR, fontWeight: 600, fontSize: isMobile ? 10 : 11, height: 22, borderRadius: "6px" }} />
          ))}
        </Stack>
      );
    }

    case "LBL": {
      const statuses = colValue.dynamicStatusValueList || [];
      if (statuses.length === 0) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      const label = statuses[0].statustext;
      const color = getStatusColor(label);
      return <Chip label={label} size="small" sx={{ bgcolor: alpha(color, 0.15), color: color, fontWeight: 700, fontSize: isMobile ? 10 : 11, height: 24, borderRadius: "6px" }} />;
    }

    case "FLE": {
      const fileUrl = colValue.dynamicColumnValues;
      const displayName = colValue.displayText || "File";
      if (!fileUrl) return <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>—</Typography>;
      const imageFile = isImageUrl(fileUrl);
      return (
        <Button
          size="small"
          onClick={(e) => { e.stopPropagation(); onFileClick?.({ title: displayName, url: fileUrl }); }}
          startIcon={<Icon icon={imageFile ? "lucide:image" : "lucide:file"} style={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none", fontSize: 11, fontWeight: 600, color: PRIMARY_COLOR,
            px: 0.75, py: 0.25, minWidth: 0, borderRadius: "6px", transition: "all 0.25s ease",
            "&:hover": { color: PRIMARY_DARK, backgroundColor: alpha(PRIMARY_COLOR, 0.1), transform: "translateY(-1px)" },
          }}
        >
          {displayName}
        </Button>
      );
    }

    case "TXT":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;

    case "DPK":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;

    case "NUM":
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{colValue.dynamicColumnValues || "0"}</Typography>;

    default:
      return <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#e2e8f0" : "#1e293b" }}>{colValue.dynamicColumnValues || colValue.displayText || "—"}</Typography>;
  }
};



const getProfessionalTableStyles = (isDark: boolean) => ({
  container: {
    border: "1px solid",
    borderColor: isDark ? "#1e293b" : "#e2e8f0",
    borderRadius: "16px",
    bgcolor: isDark ? "#0B1220" : "#ffffff",
    overflow: "hidden",
    boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(15,23,42,0.06)",
  },
  headCell: {
    fontSize: { xs: 10, sm: 11, md: 12 },
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: isDark ? "#94a3b8" : "#64748b",
    py: 1.75, px: 2,
    borderBottom: "1px solid",
    borderColor: isDark ? "#1e293b" : "#e2e8f0",
    bgcolor: isDark ? "#0F1828" : "#f8fafc",
    whiteSpace: "nowrap" as const,
    lineHeight: 1.4,
  },
  bodyCell: {
    py: 1.75, px: 2,
    fontSize: { xs: 11, sm: 12, md: 13 },
    color: isDark ? "#e2e8f0" : "#1e293b",
    borderBottom: "1px solid",
    borderColor: isDark ? "#1e293b" : "#f1f5f9",
    verticalAlign: "middle" as const,
    lineHeight: 1.5,
  },
  row: {
    transition: "background-color 0.18s ease",
    "&:hover": { bgcolor: isDark ? "rgba(24,120,178,0.06)" : "rgba(24,120,178,0.035)" },
    "&:last-child td": { borderBottom: "none" },
  },
  chip: {
    fontSize: { xs: 9, sm: 10, md: 11 },
    fontWeight: 600,
    height: { xs: 20, sm: 22, md: 24 },
    borderRadius: "6px",
    letterSpacing: "0.02em",
    "& .MuiChip-label": { px: { xs: 0.75, sm: 1 } },
  },
});



const ProjectDetailSkeleton = ({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) => {
  const s = getProfessionalTableStyles(isDark);
  return (
    <Box>
      <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, mb: 3, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            <Box>
              <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
              <Skeleton variant="text" width={300} height={20} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width={80} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
            <Skeleton variant="rounded" width={100} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
              <Skeleton variant="text" width={60} height={16} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
              <Skeleton variant="text" width={40} height={36} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer sx={{ ...s.container, minWidth: isMobile ? "700px" : "auto" }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                {["Task", "Owner", "Priority", "Status", "Timeline", "Users", "Type", "Dev Status", "Document"].map((h, i) => (
                  <TableCell key={i} sx={s.headCell}>
                    <Skeleton variant="text" width={h.length * 8} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} sx={s.row}>
                  {Array.from({ length: 9 }).map((_, ci) => (
                    <TableCell key={ci} sx={s.bodyCell}>
                      <Skeleton variant="text" width={ci === 0 ? 140 : 70} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const BoardViewSkeleton = ({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) => (
  <Box>
    <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, mb: 3, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="rounded" width={48} height={48} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
          <Box>
            <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            <Skeleton variant="text" width={250} height={20} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={80} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
          <Skeleton variant="rounded" width={80} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
          <Skeleton variant="rounded" width={80} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
        </Stack>
      </Stack>
      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}` }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Skeleton variant="text" width={100} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
          <Skeleton variant="text" width={40} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
        </Box>
        <Skeleton variant="rounded" width="100%" height={6} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 3 }} />
      </Box>
    </Paper>

    <Box sx={{ overflowX: "auto", pb: 2 }}>
      <Grid container spacing={isMobile ? 1 : 2} sx={{ flexWrap: "nowrap", minWidth: isMobile ? "500px" : "auto" }}>
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <Grid item xs={12} sm={6} md={3} key={colIndex} sx={{ minWidth: isMobile ? 200 : 280, maxWidth: isMobile ? 280 : 350, flexShrink: 0 }}>
            <Paper elevation={0} sx={{ p: isMobile ? 1 : 2, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", minHeight: 300 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1.5, borderBottom: `2px solid ${isDark ? "#1e293b" : "#e2e8f0"}` }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                  <Skeleton variant="text" width={80} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                </Stack>
                <Skeleton variant="rounded" width={30} height={24} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
              </Box>
              <Stack spacing={1.5}>
                {Array.from({ length: 3 }).map((_, cardIndex) => (
                  <Card key={cardIndex} elevation={0} sx={{ p: 1.5, borderRadius: 2, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
                    <Skeleton variant="text" width="80%" sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                    <Skeleton variant="text" width="100%" sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                      <Skeleton variant="rounded" width={50} height={20} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
                      <Skeleton variant="text" width={60} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

const ProjectsGridSkeleton = ({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) => (
  <Grid container spacing={isMobile ? 1 : 2}>
    {Array.from({ length: isMobile ? 4 : 6 }).map((_, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card elevation={0} sx={{ p: isMobile ? 1.5 : 2.5, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
              <Skeleton variant="text" width={200} height={20} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            </Box>
            <Skeleton variant="rounded" width={70} height={24} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton variant="text" width={60} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
              <Skeleton variant="text" width={50} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton variant="rounded" width={60} height={4} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2 }} />
              <Skeleton variant="text" width={30} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
            </Stack>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
);


export default function DashboardPage() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [view, setView] = useState<ViewType>("projects");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskCard, setSelectedTaskCard] = useState<Task | null>(null);
  const [selectedBugCard, setSelectedBugCard] = useState<Bug | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Project | null>(null);

  // ✅ NEW: Refresh state
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const [boardData, setBoardData] = useState<BoardCategory[]>([]);
  const [boardLoading, setBoardLoading] = useState<boolean>(false);
  const [boardError, setBoardError] = useState<string | null>(null);

  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userProjectsLoading, setUserProjectsLoading] = useState<boolean>(false);
  const [userProjectsError, setUserProjectsError] = useState<string | null>(null);

  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectTasksLoading, setProjectTasksLoading] = useState<boolean>(false);
  const [projectTasksError, setProjectTasksError] = useState<string | null>(null);

  // ❌ REMOVED: subtask state for project view
  // const [subTasks, setSubTasks] = useState<Record<number, SubTask[]>>({});
  // const [subTasksLoading, setSubTasksLoading] = useState<Record<number, boolean>>({});
  // const [subTaskColumns, setSubTaskColumns] = useState<Record<number, ApiSubTaskColumn[]>>({});
  // const [subTaskColumnsLoading, setSubTaskColumnsLoading] = useState<Record<number, boolean>>({});
  // const [rawSubTasks, setRawSubTasks] = useState<Record<number, ApiSubTask[]>>({});

  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([]);
  const [workspacesLoading, setWorkspacesLoading] = useState<boolean>(false);
  const [workspacesError, setWorkspacesError] = useState<string | null>(null);

  const [selectedWorkspace, setSelectedWorkspace] = useState<ApiWorkspace | null>(null);
  const [workspaceTaskGroups, setWorkspaceTaskGroups] = useState<WorkspaceTaskGroup[]>([]);
  const [workspaceTaskGroupsLoading, setWorkspaceTaskGroupsLoading] = useState<boolean>(false);
  const [workspaceTaskGroupsError, setWorkspaceTaskGroupsError] = useState<string | null>(null);

  const [sprintTaskGroupInfo, setSprintTaskGroupInfo] = useState<ApiSprintTaskGroupInfo[]>([]);
  const [sprintTaskGroupInfoLoading, setSprintTaskGroupInfoLoading] = useState<boolean>(false);
  const [sprintTaskGroupInfoError, setSprintTaskGroupInfoError] = useState<string | null>(null);

  // ✅ NEW: Sprint Group state (from /api/sprint-group)
  const [sprintGroups, setSprintGroups] = useState<ApiSprintGroup[]>([]);
  const [sprintGroupsLoading, setSprintGroupsLoading] = useState<boolean>(false);
  const [sprintGroupsError, setSprintGroupsError] = useState<string | null>(null);

  // ✅ NEW: GetSprintInfoList state
  const [sprintInfoData, setSprintInfoData] = useState<Record<number, ApiSprintInfoGroup>>({});
  const [sprintInfoLoading, setSprintInfoLoading] = useState<Record<number, boolean>>({});
  const [sprintInfoError, setSprintInfoError] = useState<Record<number, string | null>>({});

  const [sprintTaskInfo, setSprintTaskInfo] = useState<Record<number, ApiSprintTaskInfoGroup>>({});
  const [sprintTaskInfoLoading, setSprintTaskInfoLoading] = useState<Record<number, boolean>>({});

  const [sprintDynamicColumns, setSprintDynamicColumns] = useState<Record<number, ApiSprintDynamicColumn[]>>({});
  const [sprintDynamicColumnsLoading, setSprintDynamicColumnsLoading] = useState<Record<number, boolean>>({});


  const [bugGroups, setBugGroups] = useState<ApiBugGroup[]>([]);
  const [bugGroupsLoading, setBugGroupsLoading] = useState<boolean>(false);
  const [bugGroupsError, setBugGroupsError] = useState<string | null>(null);

  const [bugInfo, setBugInfo] = useState<Record<number, ApiBugInfoGroup>>({});
  const [bugInfoLoading, setBugInfoLoading] = useState<Record<number, boolean>>({});
  const [bugInfoError, setBugInfoError] = useState<Record<number, string | null>>({});

  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState<boolean>(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{ title: string; url: string } | null>(null);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const tableStyles = getProfessionalTableStyles(isDark);

  // ✅ NEW: Handle refresh for all APIs
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    // Small delay to show the spinner animation
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiUser[]>(API_URL);
        const data = response.data;

        const transformedUsers: User[] = data.map((apiUser, index) => {
          const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
          const projects = generateProjectsForUser(
            apiUser.name,
            apiUser.organizationname || "Organization",
            Math.min(apiUser.projectcount || 2, 5)
          );

          const uniqueId = `user_${apiUser.userID}_${index}`;

          return {
            id: uniqueId,
            username: apiUser.name,
            email: apiUser.email,
            organization: apiUser.organizationname || "No Organization",
            role: mapRole(apiUser.role),
            avatar: avatarColor,
            projects: projects,
            userID: apiUser.userID,
            organizationID: apiUser.organizationID,
            projectcount: apiUser.projectcount,
            projecttaskcount: apiUser.projecttaskcount,
            projectworkspacecount: apiUser.projectworkspacecount,
            sprintcount: apiUser.sprintcount,
            isProductOwner: apiUser.isProductOwner,
          };
        });

        setUsers(transformedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err instanceof Error ? err.message : "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!selectedUser?.userID) {
        setWorkspaces([]);
        setWorkspacesError(null);
        return;
      }

      setWorkspacesLoading(true);
      setWorkspacesError(null);

      try {
        const response = await axios.get<ApiWorkspace[]>(
          `${WORKSPACE_LIST_API_URL}?UserID=${selectedUser.userID}`
        );
        setWorkspaces(response.data);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
        setWorkspacesError(err instanceof Error ? err.message : "Failed to load workspaces");
        setWorkspaces([]);
      } finally {
        setWorkspacesLoading(false);
      }
    };

    fetchWorkspaces();
  }, [selectedUser, refreshTrigger]);

  // Fetch workspace task groups
  useEffect(() => {
    const fetchWorkspaceTaskGroups = async () => {
      if (!selectedWorkspace || !selectedUser?.userID) {
        setWorkspaceTaskGroups([]);
        setWorkspaceTaskGroupsError(null);
        return;
      }

      setWorkspaceTaskGroupsLoading(true);
      setWorkspaceTaskGroupsError(null);

      try {
        const response = await axios.get<UserProjectTask[]>(
          `${USER_PROJECT_TASK_LIST_API_URL}?UserID=${selectedUser.userID}`
        );

        const workspaceTasks = response.data.filter(
          (task) => task.workspaceID === selectedWorkspace.workspaceID
        );

        const groupMap = new Map<number, WorkspaceTaskGroup>();

        workspaceTasks.forEach((apiTask) => {
          const groupId = apiTask.taskGroupID ?? 0;
          const groupName = apiTask.taskGroupname || "Ungrouped";

          if (!groupMap.has(groupId)) {
            groupMap.set(groupId, { taskGroupID: groupId, taskGroupName: groupName, tasks: [] });
          }

          const priorityLower = (apiTask.priorityname || "").toLowerCase();
          const mappedPriority = priorityLower === "high" ? "High" : priorityLower === "low" ? "Low" : "Medium";

          groupMap.get(groupId)!.tasks.push({
            taskID: apiTask.taskID,
            taskName: apiTask.taskname || "Untitled Task",
            taskDescription: apiTask.taskDescription ? apiTask.taskDescription.replace(/<[^>]*>/g, "").trim() : "No description",
            owner: apiTask.username || "-",
            ownerProfilePicture: undefined,
            isUnplanned: false,
            actualSP: 0,
            estimatedSP: 0,
            priority: mappedPriority,
            status: apiTask.statusname || "Not Started",
          });
        });

        setWorkspaceTaskGroups(Array.from(groupMap.values()));
      } catch (err) {
        console.error("Failed to fetch workspace task groups:", err);
        setWorkspaceTaskGroupsError(err instanceof Error ? err.message : "Failed to load workspace tasks");
        setWorkspaceTaskGroups([]);
      } finally {
        setWorkspaceTaskGroupsLoading(false);
      }
    };

    fetchWorkspaceTaskGroups();
  }, [selectedWorkspace, selectedUser, refreshTrigger]);

  // Fetch sprint task group info
  useEffect(() => {
    const fetchSprintTaskGroupInfo = async () => {
      if (!selectedWorkspace) {
        setSprintTaskGroupInfo([]);
        setSprintTaskGroupInfoError(null);
        return;
      }

      setSprintTaskGroupInfoLoading(true);
      setSprintTaskGroupInfoError(null);

      try {
        const response = await axios.get<ApiSprintTaskGroupInfo[]>(
          `${SPRINT_TASK_GROUP_INFO_API_URL}?WorkspaceID=${selectedWorkspace.workspaceID}`
        );
        setSprintTaskGroupInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch sprint task group info:", err);
        setSprintTaskGroupInfoError(err instanceof Error ? err.message : "Failed to load sprint task group info");
        setSprintTaskGroupInfo([]);
      } finally {
        setSprintTaskGroupInfoLoading(false);
      }
    };

    fetchSprintTaskGroupInfo();
  }, [selectedWorkspace, refreshTrigger]);

  // ✅ NEW: Fetch sprint groups from /api/sprint-group?workspaceID=X
  useEffect(() => {
    const fetchSprintGroups = async () => {
      if (!selectedWorkspace) {
        setSprintGroups([]);
        setSprintGroupsError(null);
        return;
      }

      setSprintGroupsLoading(true);
      setSprintGroupsError(null);

      try {
        const response = await axios.get<{ status: boolean; statusCode: number; message: string; data: ApiSprintGroup[] }>(
          `${SPRINT_GROUP_API_URL}?workspaceID=${selectedWorkspace.workspaceID}`
        );

        const raw = response.data as any;
        const groups: ApiSprintGroup[] = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];

        setSprintGroups(groups);
      } catch (err) {
        console.error("Failed to fetch sprint groups:", err);
        setSprintGroupsError(err instanceof Error ? err.message : "Failed to load sprint groups");
        setSprintGroups([]);
      } finally {
        setSprintGroupsLoading(false);
      }
    };

    fetchSprintGroups();
  }, [selectedWorkspace, refreshTrigger]);

  // ✅ NEW: Fetch GetSprintInfoList for a given SprintGroupID
  const fetchSprintInfo = async (sprintGroupID: number) => {
    if (!sprintGroupID || isNaN(sprintGroupID)) {
      console.warn("Invalid SprintGroupID for sprint info:", sprintGroupID);
      return;
    }

    setSprintInfoLoading((prev) => ({ ...prev, [sprintGroupID]: true }));
    setSprintInfoError((prev) => ({ ...prev, [sprintGroupID]: null }));

    try {
      const response = await axios.get<ApiSprintInfoResponse>(
        `${SPRINT_INFO_API_URL}?SprintGroupID=${sprintGroupID}`
      );

      const raw = response.data as any;
      const groupData: ApiSprintInfoGroup | undefined = Array.isArray(raw)
        ? raw[0]
        : raw?.data?.[0] || raw?.data || raw;

      if (!groupData) {
        setSprintInfoData((prev) => ({
          ...prev,
          [sprintGroupID]: { colList: [], detailList: [], colvalueList: [] },
        }));
        return;
      }

      setSprintInfoData((prev) => ({
        ...prev,
        [sprintGroupID]: {
          colList: groupData.colList || [],
          detailList: groupData.detailList || [],
          colvalueList: groupData.colvalueList || [],
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch sprint info for group ${sprintGroupID}:`, err);
      setSprintInfoError((prev) => ({
        ...prev,
        [sprintGroupID]: err instanceof Error ? err.message : "Failed to load sprint info",
      }));
      setSprintInfoData((prev) => ({
        ...prev,
        [sprintGroupID]: { colList: [], detailList: [], colvalueList: [] },
      }));
    } finally {
      setSprintInfoLoading((prev) => ({ ...prev, [sprintGroupID]: false }));
    }
  };

  // ✅ NEW: Auto-fetch GetSprintInfoList whenever sprintGroups changes
  useEffect(() => {
    setSprintInfoData({});
    setSprintInfoLoading({});
    setSprintInfoError({});

    if (sprintGroups.length === 0) return;

    sprintGroups.forEach((g) => {
      fetchSprintInfo(g.SprintGroupID);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintGroups, refreshTrigger]);

  // Fetch bug groups
  useEffect(() => {
    const fetchBugGroups = async () => {
      if (!selectedWorkspace) {
        setBugGroups([]);
        setBugGroupsError(null);
        return;
      }

      setBugGroupsLoading(true);
      setBugGroupsError(null);

      try {
        const response = await axios.get<ApiBugGroup[]>(
          `${BUG_GROUP_LIST_API_URL}?WorkspaceID=${selectedWorkspace.workspaceID}`
        );
        setBugGroups(response.data);
      } catch (err) {
        console.error("Failed to fetch bug groups:", err);
        setBugGroupsError(err instanceof Error ? err.message : "Failed to load bug groups");
        setBugGroups([]);
      } finally {
        setBugGroupsLoading(false);
      }
    };

    fetchBugGroups();
  }, [selectedWorkspace, refreshTrigger]);

  // Fetch sprint task info
  const fetchSprintTaskInfo = async (taskGroupID: number) => {
    if (!taskGroupID || isNaN(taskGroupID)) {
      console.warn("Invalid taskGroupID for sprint task info:", taskGroupID);
      return;
    }
    if (!selectedUser?.userID) {
      console.warn("No selected user for sprint task info fetch");
      return;
    }

    setSprintTaskInfoLoading((prev) => ({ ...prev, [taskGroupID]: true }));

    try {
      const response = await axios.get<ApiSprintTaskInfoResponse>(
        `${SPRINT_TASK_INFO_API_URL}?TaskGroupID=${taskGroupID}&UserID=${selectedUser.userID}`
      );

      const raw = response.data;
      const groupData: ApiSprintTaskInfoGroup | undefined = Array.isArray(raw)
        ? raw[0]
        : (raw as any)?.data?.[0] || (raw as any)?.data || raw;

      if (!groupData) {
        setSprintTaskInfo((prev) => ({ ...prev, [taskGroupID]: { colList: [], detailList: [], colvalueList: [] } }));
        return;
      }

      setSprintTaskInfo((prev) => ({
        ...prev,
        [taskGroupID]: {
          colList: groupData.colList || [],
          detailList: groupData.detailList || [],
          colvalueList: groupData.colvalueList || [],
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch sprint task info for group ${taskGroupID}:`, err);
      setSprintTaskInfo((prev) => ({ ...prev, [taskGroupID]: { colList: [], detailList: [], colvalueList: [] } }));
    } finally {
      setSprintTaskInfoLoading((prev) => ({ ...prev, [taskGroupID]: false }));
    }
  };

  // Fetch sprint dynamic columns
  const fetchSprintDynamicColumns = async (taskGroupID: number) => {
    if (!taskGroupID || isNaN(taskGroupID)) {
      console.warn("Invalid taskGroupID for dynamic columns:", taskGroupID);
      return;
    }
    if (!selectedUser?.userID) {
      console.warn("No selected user for dynamic columns fetch");
      return;
    }

    setSprintDynamicColumnsLoading((prev) => ({ ...prev, [taskGroupID]: true }));

    try {
      const response = await axios.get<ApiSprintDynamicColumnList>(
        `${SPRINT_TASK_DYNAMIC_COLUMNS_API_URL}?LoginUserID=${selectedUser.userID}&GroupID=${taskGroupID}`
      );

      const raw = response.data as any;
      const columns: ApiSprintDynamicColumn[] = Array.isArray(raw) ? raw : raw?.data || [];

      setSprintDynamicColumns((prev) => ({ ...prev, [taskGroupID]: columns }));
    } catch (err) {
      console.error(`Failed to fetch dynamic columns for group ${taskGroupID}:`, err);
      setSprintDynamicColumns((prev) => ({ ...prev, [taskGroupID]: [] }));
    } finally {
      setSprintDynamicColumnsLoading((prev) => ({ ...prev, [taskGroupID]: false }));
    }
  };

  // Fetch bug info
  const fetchBugInfo = async (bugGroupID: number) => {
    if (!bugGroupID || isNaN(bugGroupID)) {
      console.warn("Invalid bugGroupID for bug info:", bugGroupID);
      return;
    }
    if (!selectedUser?.userID) {
      console.warn("No selected user for bug info fetch");
      return;
    }

    setBugInfoLoading((prev) => ({ ...prev, [bugGroupID]: true }));
    setBugInfoError((prev) => ({ ...prev, [bugGroupID]: null }));

    try {
      const response = await axios.get<ApiBugInfoResponse>(
        `${BUG_INFO_LIST_API_URL}?GroupID=${bugGroupID}&UserID=${selectedUser.userID}`
      );

      const raw = response.data;
      const groupData: ApiBugInfoGroup | undefined = Array.isArray(raw)
        ? raw[0]
        : (raw as any)?.data?.[0] || (raw as any)?.data || raw;

      if (!groupData) {
        setBugInfo((prev) => ({ ...prev, [bugGroupID]: { colList: [], detailList: [], colvalueList: [] } }));
        return;
      }

      setBugInfo((prev) => ({
        ...prev,
        [bugGroupID]: {
          colList: groupData.colList || [],
          detailList: groupData.detailList || [],
          colvalueList: groupData.colvalueList || [],
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch bug info for group ${bugGroupID}:`, err);
      setBugInfoError((prev) => ({ ...prev, [bugGroupID]: err instanceof Error ? err.message : "Failed to load bug info" }));
      setBugInfo((prev) => ({ ...prev, [bugGroupID]: { colList: [], detailList: [], colvalueList: [] } }));
    } finally {
      setBugInfoLoading((prev) => ({ ...prev, [bugGroupID]: false }));
    }
  };

  // Auto-fetch bug info
  useEffect(() => {
    setBugInfo({});
    setBugInfoLoading({});
    setBugInfoError({});

    if (bugGroups.length > 0) {
      bugGroups.forEach((group) => {
        fetchBugInfo(group.bugGroupID);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugGroups, refreshTrigger]);

  // Auto-fetch sprint task info + dynamic columns
  useEffect(() => {
    setSprintTaskInfo({});
    setSprintTaskInfoLoading({});

    setSprintDynamicColumns({});
    setSprintDynamicColumnsLoading({});

    if (!selectedWorkspace) return;

    if (sprintTaskGroupInfo.length > 0) {
      sprintTaskGroupInfo.forEach((info) => {
        fetchSprintTaskInfo(info.taskGroupID);
        fetchSprintDynamicColumns(info.taskGroupID);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace, sprintTaskGroupInfo.length, selectedUser?.userID, refreshTrigger]);

  // Fetch board data
  useEffect(() => {
    const fetchBoardData = async () => {
      if (!selectedUser?.userID) {
        setBoardData([]);
        return;
      }

      setBoardLoading(true);
      setBoardError(null);

      try {
        const response = await axios.get<BoardCategory[]>(
          `${apiUrl1}GetBoardTaskList?LoginuserID=${selectedUser.userID}`
        );
        setBoardData(response.data);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
        setBoardError(err instanceof Error ? err.message : "Failed to load board tasks");
        setBoardData([]);
      } finally {
        setBoardLoading(false);
      }
    };

    if (selectedUser && view === "boards") {
      fetchBoardData();
    }
  }, [selectedUser, view, refreshTrigger]);

  // Fetch user projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!selectedUser) {
        setUserProjects([]);
        setUserProjectsError(null);
        return;
      }

      setUserProjectsLoading(true);
      setUserProjectsError(null);

      try {
        const orgId = selectedUser.organizationID ?? 1;
        const response = await axios.get<UserProjectListItem[]>(
          `${USER_PROJECT_LIST_API_URL}?OrganizationID=${orgId}`
        );

        const matchedUser = response.data.find((item) => item.userID === selectedUser.userID);
        const parsedProjects = matchedUser
          ? parseUserProjectsString(matchedUser.projects, selectedUser.username)
          : [];

        setUserProjects(parsedProjects);
      } catch (err) {
        console.error("Failed to fetch user projects:", err);
        setUserProjectsError(err instanceof Error ? err.message : "Failed to load user projects");
        setUserProjects([]);
      } finally {
        setUserProjectsLoading(false);
      }
    };

    fetchUserProjects();
  }, [selectedUser, refreshTrigger]);

  // Fetch project tasks
  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (!selectedProject || !selectedUser?.userID) {
        setProjectTasks([]);
        setProjectTasksError(null);
        return;
      }

      setProjectTasksLoading(true);
      setProjectTasksError(null);

      try {
        const projectIdMatch = selectedProject.id.match(/userproj_(\d+)/);
        const projectId = projectIdMatch ? projectIdMatch[1] : null;

        if (!projectId) {
          setProjectTasks([]);
          setProjectTasksLoading(false);
          return;
        }

        const response = await axios.get<UserProjectTask[]>(
          `${USER_PROJECT_TASK_LIST_API_URL}?UserID=${selectedUser.userID}`
        );

        const filteredTasks = response.data
          .filter((task) => task.projectID === parseInt(projectId))
          .map((apiTask) => convertProjectTaskToTask(apiTask));

        setProjectTasks(filteredTasks);
      } catch (err) {
        console.error("Failed to fetch project tasks:", err);
        setProjectTasksError(err instanceof Error ? err.message : "Failed to load project tasks");
        setProjectTasks([]);
      } finally {
        setProjectTasksLoading(false);
      }
    };

    fetchProjectTasks();
  }, [selectedProject, selectedUser, refreshTrigger]);

  // ❌ REMOVED: fetchSubTasks and fetchSubTaskColumns functions (project view no longer uses subtasks)

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getPriorityColor = (priority: Task["priority"] | Bug["severity"] | string): string => {
    const colors: Record<string, string> = {
      low: "#22c55e", medium: "#f59e0b", high: "#ef4444", critical: "#dc2626",
      Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444", Critical: "#dc2626",
    };
    return colors[priority] || "#6b7280";
  };

  const getStatusColor = (
    status: Task["status"] | Sprint["status"] | Bug["status"] | Project["status"] | SubTask["status"] | string
  ): string => {
    const colors: Record<string, string> = {
      todo: "#6b7280", "in-progress": "#3b82f6", review: "#8b5cf6", done: "#22c55e",
      active: PRIMARY_COLOR, completed: "#3b82f6", upcoming: "#f59e0b", "on-hold": "#ef4444",
      open: "#ef4444", resolved: "#22c55e", closed: "#6b7280",
      "Not Started": "#6b7280", "Not started": "#6b7280", "Notstarted": "#6b7280",
      "To Do": "#f59e0b", "In Progress": "#3b82f6", "Done": "#22c55e",
    };
    return colors[status] || "#6b7280";
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      Admin: PRIMARY_COLOR, Member: "#22c55e", Viewer: "#f59e0b",
    };
    return colors[role] || "#6b7280";
  };

  const getRoleIcon = (role: string): string => {
    const icons: Record<string, string> = {
      Admin: "lucide:crown", Member: "lucide:user", Viewer: "lucide:eye",
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
    setProjectTasks([]);
  };

  // ❌ REMOVED: handleTaskClick subtask fetching - now just toggles task expansion
  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task.id, task.title);
    const isExpanding = selectedTask?.id !== task.id;
    setSelectedTask(isExpanding ? task : null);
    // ❌ REMOVED: subtask fetching logic
  };


  const handleBugCardClick = (bug: Bug) => {
    setSelectedBugCard(selectedBugCard?.id === bug.id ? null : bug);
    setSelectedTaskCard(null);
    setSelectedTask(null);
    setSelectedProject(null);
    setSelectedBoard(null);
  };

const handleSprintClick = (sprint: Sprint) => {
  setSelectedSprint(sprint);

  // ✅ FIX: Fetch sprint task group info for this sprint
  // so the Sprints table has real data to render.
  if (!selectedUser?.userID) return;

  const numericIdMatch = String(sprint.id || "").match(/(\d+)/);
  const numericId = numericIdMatch ? parseInt(numericIdMatch[1], 10) : NaN;
  if (isNaN(numericId)) return;

  setSprintTaskGroupInfoLoading(true);
  setSprintTaskGroupInfoError(null);

  axios
    .get<ApiSprintTaskGroupInfo[]>(
      `${SPRINT_TASK_GROUP_INFO_API_URL}?WorkspaceID=${numericId}`
    )
    .then((res) => {
      setSprintTaskGroupInfo(res.data || []);
    })
    .catch((err) => {
      console.error("Failed to fetch sprint task group info:", err);
      setSprintTaskGroupInfoError(
        err instanceof Error ? err.message : "Failed to load sprints"
      );
      setSprintTaskGroupInfo([]);
    })
    .finally(() => {
      setSprintTaskGroupInfoLoading(false);
    });

  // ✅ NEW: Also fetch sprint groups from /api/sprint-group?workspaceID=X
  setSprintGroupsLoading(true);
  setSprintGroupsError(null);

  axios
    .get<{ status: boolean; statusCode: number; message: string; data: ApiSprintGroup[] }>(
      `${SPRINT_GROUP_API_URL}?workspaceID=${numericId}`
    )
    .then((res) => {
      const raw = res.data as any;
      const groups: ApiSprintGroup[] = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];
      setSprintGroups(groups);
    })
    .catch((err) => {
      console.error("Failed to fetch sprint groups:", err);
      setSprintGroupsError(
        err instanceof Error ? err.message : "Failed to load sprint groups"
      );
      setSprintGroups([]);
    })
    .finally(() => {
      setSprintGroupsLoading(false);
    });
};

  const handleWorkspaceClick = (workspace: ApiWorkspace) => {
    setSelectedWorkspace(workspace);
    setSelectedTaskCard(null);
    setSelectedBugCard(null);
    setSelectedBoard(null);
    setSelectedProject(null);
    setSelectedSprint(null);
    setSelectedTask(null);
    setBugGroups([]);
    setBugGroupsError(null);
  };

  const handleBackToWorkspaces = () => {
    setSelectedWorkspace(null);
    setWorkspaceTaskGroups([]);
    setWorkspaceTaskGroupsError(null);
    setSprintTaskGroupInfo([]);
    setSprintTaskGroupInfoError(null);
    setSprintTaskInfo({});
    setSprintTaskInfoLoading({});
    setSprintDynamicColumns({});
    setSprintDynamicColumnsLoading({});
    // ✅ NEW: reset sprint groups state
    setSprintGroups([]);
    setSprintGroupsLoading(false);
    setSprintGroupsError(null);
    // ✅ NEW: reset sprint info state
    setSprintInfoData({});
    setSprintInfoLoading({});
    setSprintInfoError({});
    setBugGroups([]);
    setBugGroupsError(null);
    setBugInfo({});
    setBugInfoLoading({});
    setBugInfoError({});
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedTask(null);
    setProjectTasks([]);
  };

  const handleBackToSprints = () => {
    setSelectedSprint(null);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setSelectedProject(null);
    setSelectedTask(null);
    setSelectedSprint(null);
    setSelectedTaskCard(null);
    setSelectedBugCard(null);
    setSelectedBoard(null);
    setSelectedWorkspace(null);
    setWorkspaceTaskGroups([]);
    setSprintTaskGroupInfo([]);
    setSprintTaskGroupInfoError(null);
    setSprintTaskInfo({});
    setBugInfo({});
    setBugInfoLoading({});
    setBugInfoError({});
    setSprintTaskInfoLoading({});
    setSprintDynamicColumns({});
    setSprintDynamicColumnsLoading({});
    // ✅ NEW: reset sprint groups state
    setSprintGroups([]);
    setSprintGroupsLoading(false);
    setSprintGroupsError(null);
    // ✅ NEW: reset sprint info state
    setSprintInfoData({});
    setSprintInfoLoading({});
    setSprintInfoError({});
    setProjectTasks([]);
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

  const handleAttachmentClick = (task: Task) => {
    let attachmentUrl = task.attachmentLink || task.document || "";
    attachmentUrl = attachmentUrl.trim();

    if (attachmentUrl && !attachmentUrl.startsWith("http://") && !attachmentUrl.startsWith("https://")) {
      console.log("Attachment URL is not absolute:", attachmentUrl);
    }

    if (attachmentUrl) {
      setSelectedAttachment({ title: task.title || "Attachment", url: attachmentUrl });
      setAttachmentDialogOpen(true);
    } else {
      setSelectedAttachment({ title: task.title || "Attachment", url: "" });
      setAttachmentDialogOpen(true);
    }
  };

  const handleAttachmentDialogClose = () => {
    setAttachmentDialogOpen(false);
    setSelectedAttachment(null);
  };

  const handleSubTaskFileClick = (payload: { title: string; url: string }) => {
    setSelectedAttachment({ title: payload.title || "Attachment", url: payload.url || "" });
    setAttachmentDialogOpen(true);
  };

 

  const renderWorkspaceList = (title: string, emptyIcon: string, emptyTitle: string, emptyMessage: string) => {
    if (workspacesLoading) {
      return (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress size={24} sx={{ color: PRIMARY_COLOR }} />
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1.5 }}>Loading workspaces...</Typography>
        </Box>
      );
    }

    if (workspacesError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block", margin: "0 auto" }} />
          <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load workspaces</Typography>
          <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{workspacesError}</Typography>
        </Box>
      );
    }

    if (workspaces.length === 0) {
      return (
        <Fade in timeout={700}>
          <Card
            elevation={0}
            sx={{
              p: 6, textAlign: "center",
              border: "1px dashed",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: 3,
              bgcolor: isDark ? "#0B1220" : "#ffffff",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Icon icon={emptyIcon} style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
            </Box>
            <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mb: 1, textAlign: "center" }}>
              {emptyTitle}
            </Typography>
            <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto", textAlign: "center" }}>
              {emptyMessage}
            </Typography>
          </Card>
        </Fade>
      );
    }

    return (
      <Box>
        <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a", fontSize: isMobile ? 14 : 16, fontWeight: 600, mb: 2 }}>
          {title} ({workspaces.length})
        </Typography>
        <Grid container spacing={isMobile ? 1 : 2}>
          {workspaces.map((ws, index) => (
            <Grid item xs={12} sm={6} lg={4} key={ws.workspaceID}>
              <Slide in timeout={800 + index * 80} direction="up">
                <Card
                  elevation={0}
                  onClick={() => handleWorkspaceClick(ws)}
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    bgcolor: isDark ? "#0B1220" : "#ffffff",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    position: "relative", overflow: "hidden", cursor: "pointer",
                    "&:hover": {
                      transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-10px) scale(1.03)",
                      boxShadow: `0 20px 56px ${alpha(PRIMARY_COLOR, 0.15)}`,
                      borderColor: PRIMARY_COLOR,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {ws.workspaceName}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#94a3b8" : "#64748b", mb: 1 }}>
                    {ws.organizationname}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip label="Workspace" size="small" sx={{ bgcolor: getStatusColor("active") + "20", color: getStatusColor("active"), ...tableStyles.chip }} />
                   
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  

  const renderTaskDetailView = () => {
    if (!selectedTaskCard) return null;
    const task = selectedTaskCard;

    const taskEntries = [
      { title: task.title, description: task.description, owner: task.owner, isUnplanned: "No", actualSP: "5", estimatedSP: "8", priority: task.priority, status: task.status },
      { title: `${task.title} - Subtask 1`, description: `${task.description} (Subtask 1)`, owner: task.owner, isUnplanned: "Yes", actualSP: "3", estimatedSP: "5", priority: task.priority, status: task.status },
      { title: `${task.title} - Subtask 2`, description: `${task.description} (Subtask 2)`, owner: task.owner, isUnplanned: "No", actualSP: "2", estimatedSP: "3", priority: task.priority, status: task.status }
    ];

    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              bgcolor: isDark ? "#0B1220" : "#ffffff",
              animation: "slideInDown 0.6s ease-out, glowPulse 3s ease-in-out infinite",
              "@keyframes slideInDown": { "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 }, "100%": { transform: "translateY(0) scale(1)", opacity: 1 } },
              "@keyframes glowPulse": { "0%, 100%": { boxShadow: "0 0 0 rgba(24, 120, 178, 0)" }, "50%": { boxShadow: `0 0 30px ${alpha(PRIMARY_COLOR, 0.08)}` } },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToTasks}
                  sx={{
                    color: isDark ? "#94a3b8" : "#64748b", transition: "all 0.3s ease",
                    "&:hover": { transform: "scale(1.2) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>Task Details</Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{task.title} • {task.owner}</Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip label={task.status} sx={{ bgcolor: getStatusColor(task.status) + "20", color: getStatusColor(task.status), ...tableStyles.chip }} />
                </Zoom>
                <Chip label={`${task.subtasks.length} Subtasks`} sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#ffffff" : "#0f172a", ...tableStyles.chip }} />
                {(task.attachmentLink || task.document) && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon icon="lucide:paperclip" style={{ fontSize: 16 }} />}
                    onClick={() => handleAttachmentClick(task)}
                    sx={{
                      borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR, textTransform: "none",
                      fontSize: 12, fontWeight: 600, transition: "all 0.3s ease",
                      "&:hover": { backgroundColor: alpha(PRIMARY_COLOR, 0.08), borderColor: PRIMARY_DARK, transform: "scale(1.05)" },
                    }}
                  >
                    View Attachment
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer sx={{ ...tableStyles.container, minWidth: isMobile ? "600px" : "auto" }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    {["Task Name", "Task Description", "Owner", "Is Unplanned", "Actual SP", "Est. SP", "Priority", "Status"].map((h, i) => (
                      <TableCell key={i} sx={tableStyles.headCell}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taskEntries.map((entry) => (
                    <TableRow key={entry.title} sx={tableStyles.row}>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.title}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#94a3b8" : "#64748b" }}>{entry.description}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.owner} size="small" sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#e2e8f0" : "#1e293b", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.isUnplanned} size="small" sx={{ bgcolor: entry.isUnplanned === "Yes" ? "#ef444420" : "#22c55e20", color: entry.isUnplanned === "Yes" ? "#ef4444" : "#22c55e", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.actualSP}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.estimatedSP}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.priority} size="small" sx={{ bgcolor: getPriorityColor(entry.priority) + "20", color: getPriorityColor(entry.priority), textTransform: "uppercase", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.status} size="small" sx={{ bgcolor: getStatusColor(entry.status) + "20", color: getStatusColor(entry.status), textTransform: "uppercase", ...tableStyles.chip }} />
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



  const renderBugDetailView = () => {
    if (!selectedBugCard) return null;
    const bug = selectedBugCard;

    const bugEntries = [
      { title: bug.title, description: bug.description, owner: bug.assignee, isUnplanned: "No", actualSP: "3", estimatedSP: "5", priority: bug.severity, status: bug.status, timeUntilResolution: "8hr 30m 10s" },
      { title: `${bug.title} - Sub Bug 1`, description: `${bug.description} (Sub Bug 1)`, owner: bug.assignee, isUnplanned: "Yes", actualSP: "2", estimatedSP: "3", priority: bug.severity, status: bug.status, timeUntilResolution: "4hr 15m 20s" },
      { title: `${bug.title} - Sub Bug 2`, description: `${bug.description} (Sub Bug 2)`, owner: bug.assignee, isUnplanned: "No", actualSP: "1", estimatedSP: "2", priority: bug.severity, status: bug.status, timeUntilResolution: "12hr 45m 30s" }
    ];

    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              bgcolor: isDark ? "#0B1220" : "#ffffff",
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToBugs}
                  sx={{
                    color: isDark ? "#94a3b8" : "#64748b", transition: "all 0.3s ease",
                    "&:hover": { transform: "scale(1.2) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>Bug Details</Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{bug.title} • {bug.assignee}</Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Zoom in timeout={800}>
                  <Chip label={bug.status} sx={{ bgcolor: getStatusColor(bug.status) + "20", color: getStatusColor(bug.status), ...tableStyles.chip }} />
                </Zoom>
                <Chip label={`Severity: ${bug.severity}`} sx={{ bgcolor: getPriorityColor(bug.severity) + "20", color: getPriorityColor(bug.severity), ...tableStyles.chip }} />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer sx={{ ...tableStyles.container, minWidth: isMobile ? "700px" : "auto" }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    {["Bug Name", "Bug Description", "Owner", "Is Unplanned", "Actual SP", "Est. SP", "Priority", "Status", "Time Until Resolution"].map((h, i) => (
                      <TableCell key={i} sx={tableStyles.headCell}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bugEntries.map((entry) => (
                    <TableRow key={entry.title} sx={tableStyles.row}>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.title}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#94a3b8" : "#64748b" }}>{entry.description}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.owner} size="small" sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#e2e8f0" : "#1e293b", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.isUnplanned} size="small" sx={{ bgcolor: entry.isUnplanned === "Yes" ? "#ef444420" : "#22c55e20", color: entry.isUnplanned === "Yes" ? "#ef4444" : "#22c55e", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.actualSP}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.estimatedSP}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.priority} size="small" sx={{ bgcolor: getPriorityColor(entry.priority) + "20", color: getPriorityColor(entry.priority), textTransform: "uppercase", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip label={entry.status} size="small" sx={{ bgcolor: getStatusColor(entry.status) + "20", color: getStatusColor(entry.status), textTransform: "uppercase", ...tableStyles.chip }} />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Icon icon="lucide:clock" style={{ fontSize: 14, color: isDark ? "#94a3b8" : "#64748b" }} />
                          <Typography sx={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", fontFamily: "monospace" }}>
                            {entry.timeUntilResolution}
                          </Typography>
                        </Stack>
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

  

  const renderBoardDetailView = () => {
    if (!selectedBoard) return null;
    const project = selectedBoard;

    const todoTasks = project.tasks.filter(t => t.status === "todo");
    const inProgressTasks = project.tasks.filter(t => t.status === "in-progress");
    const reviewTasks = project.tasks.filter(t => t.status === "review");
    const doneTasks = project.tasks.filter(t => t.status === "done");

    const columns = [
      { title: "To Do", status: "todo" as Task["status"], tasks: todoTasks, color: "#64748b", icon: "lucide:circle" },
      { title: "In Progress", status: "in-progress" as Task["status"], tasks: inProgressTasks, color: "#3b82f6", icon: "lucide:loader-circle" },
      { title: "Review", status: "review" as Task["status"], tasks: reviewTasks, color: "#8b5cf6", icon: "lucide:eye" },
      { title: "Done", status: "done" as Task["status"], tasks: doneTasks, color: "#22c55e", icon: "lucide:check-circle" }
    ];

    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              bgcolor: isDark ? "#0B1220" : "#ffffff",
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToBoards}
                  sx={{
                    color: isDark ? "#94a3b8" : "#64748b", transition: "all 0.3s ease",
                    "&:hover": { transform: "scale(1.2) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{project.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{project.description} • {project.tasks.length} total tasks</Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Chip label={project.status} sx={{ bgcolor: getStatusColor(project.status) + "20", color: getStatusColor(project.status), ...tableStyles.chip }} />
                <Chip label={`Progress: ${project.progress}%`} sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#ffffff" : "#0f172a", ...tableStyles.chip }} />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto", pb: 2 }}>
            <Grid container spacing={isMobile ? 1 : 2} sx={{ flexWrap: "nowrap", minWidth: isMobile ? "500px" : "auto" }}>
              {columns.map((column, colIndex) => (
                <Grid item xs={12} sm={6} md={3} key={column.status} sx={{ minWidth: isMobile ? 180 : 280 }}>
                  <Slide in timeout={600 + colIndex * 100} direction="up">
                    <Paper
                      elevation={0}
                      sx={{
                        p: isMobile ? 1 : 2, borderRadius: 3,
                        border: "1px solid",
                        borderColor: isDark ? "#1e293b" : "#e2e8f0",
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                        height: "100%", minHeight: 250,
                        "&:hover": { borderColor: column.color, boxShadow: `0 8px 30px ${alpha(column.color, 0.1)}` },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1.5, borderBottom: `2px solid ${alpha(column.color, 0.2)}` }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Icon icon={column.icon} style={{ fontSize: isMobile ? 14 : 18, color: column.color }} />
                          <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{column.title}</Typography>
                        </Stack>
                        <Chip label={column.tasks.length} size="small" sx={{ bgcolor: column.color + "20", color: column.color, fontWeight: 700, minWidth: 24, height: 24 }} />
                      </Box>
                      <Stack spacing={isMobile ? 1 : 1.5} sx={{ maxHeight: 500, overflowY: "auto", pr: 0.5 }}>
                        {column.tasks.length === 0 ? (
                          <Box sx={{ p: 2, textAlign: "center", border: "1px dashed", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2, color: isDark ? "#64748b" : "#94a3b8", fontSize: isMobile ? 10 : 13 }}>
                            No tasks
                          </Box>
                        ) : (
                          column.tasks.map((task, taskIndex) => (
                            <Grow key={task.id} in timeout={800 + colIndex * 100 + taskIndex * 50}>
                              <Card
                                elevation={0}
                                sx={{
                                  p: isMobile ? 1 : 1.5, borderRadius: 2,
                                  border: "1px solid",
                                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                                  bgcolor: isDark ? "#0B1220" : "#ffffff",
                                  cursor: "pointer",
                                  "&:hover": { transform: "scale(1.02) translateY(-4px)", boxShadow: `0 8px 30px ${alpha(PRIMARY_COLOR, 0.12)}`, borderColor: PRIMARY_COLOR },
                                }}
                                onClick={() => { setSelectedTaskCard(task); setSelectedBoard(null); }}
                              >
                                <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mb: 0.5 }}>{task.title}</Typography>
                                {!isMobile && <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b", mb: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.description}</Typography>}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Chip label={task.priority} size="small" sx={{ bgcolor: getPriorityColor(task.priority) + "20", color: getPriorityColor(task.priority), fontSize: isMobile ? 6 : 9, fontWeight: 600, height: isMobile ? 16 : 22, borderRadius: "4px" }} />
                                  <Typography sx={{ fontSize: isMobile ? 8 : 10, color: isDark ? "#64748b" : "#94a3b8" }}>{task.owner}</Typography>
                                </Box>
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

  

const renderWorkspaceDetail = () => {
  if (!selectedWorkspace) return null;

  // ✅ FIX: When view is "sprints", show the Sprints table design
  if (view === "sprints") {
    return renderSprintTableForWorkspace();
  }

  const priorityChipSx = (priority: string) => {
    const color = getPriorityColor(priority);
    return {
      bgcolor: alpha(color, 0.15), color: color, fontWeight: 700,
      fontSize: { xs: 10, sm: 11, md: 12 },
      height: { xs: 22, sm: 24, md: 26 },
      borderRadius: "6px", letterSpacing: "0.02em",
      "& .MuiChip-label": { px: { xs: 1, sm: 1.25 } },
    };
  };

  const statusChipSx = (status: string) => {
    const color = getStatusColor(status);
    return {
      bgcolor: alpha(color, 0.15), color: color, fontWeight: 700,
      fontSize: { xs: 10, sm: 11, md: 12 },
      height: { xs: 22, sm: 24, md: 26 },
      borderRadius: "6px", letterSpacing: "0.02em",
      "& .MuiChip-label": { px: { xs: 1, sm: 1.25 } },
    };
  };

  interface CombinedGroup {
    taskGroupID: number;
    groupName: string;
    sprintName?: string;
    sprintGoals?: string;
    sprintTimeLineStart?: string;
    sprintTimelineEnd?: string;
    tasks: WorkspaceTaskGroupTask[];
    hasSprintInfo: boolean;
  }

  const combinedMap = new Map<number, CombinedGroup>();

  sprintTaskGroupInfo.forEach((info) => {
    combinedMap.set(info.taskGroupID, {
      taskGroupID: info.taskGroupID,
      groupName: info.groupname || "Ungrouped",
      sprintName: info.sprintname,
      sprintGoals: info.sprintGoals,
      sprintTimeLineStart: info.sprintTimeLineStart,
      sprintTimelineEnd: info.sprintTimelineEnd,
      tasks: [],
      hasSprintInfo: true,
    });
  });

  workspaceTaskGroups.forEach((group) => {
    if (combinedMap.has(group.taskGroupID)) {
      const existing = combinedMap.get(group.taskGroupID)!;
      existing.tasks.push(...group.tasks);
      if (!existing.groupName || existing.groupName === "Ungrouped") {
        existing.groupName = group.taskGroupName;
      }
    } else {
      combinedMap.set(group.taskGroupID, {
        taskGroupID: group.taskGroupID,
        groupName: group.taskGroupName,
        tasks: group.tasks,
        hasSprintInfo: false,
      });
    }
  });

  const combinedGroups = Array.from(combinedMap.values());

  return (
    <Box>
      <Slide in timeout={500} direction="down">
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
            border: "1px solid",
            borderColor: isDark ? "#1e293b" : "#e2e8f0",
            bgcolor: isDark ? "#0B1220" : "#ffffff",
            position: "relative", overflow: "hidden",
            "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)}, transparent)` },
          }}
        >
          <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={handleBackToWorkspaces}
                sx={{
                  color: isDark ? "#94a3b8" : "#64748b", transition: "all 0.3s ease",
                  "&:hover": { transform: "scale(1.15) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                }}
              >
                <Icon icon="lucide:arrow-left" style={{ fontSize: 22 }} />
              </IconButton>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap">
                  <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", lineHeight: 1.2 }}>
                    {selectedWorkspace.workspaceName}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mt: 0.5 }}>
                  {selectedWorkspace.organizationname} • Org #{selectedWorkspace.organizationID}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Task Groups</Typography>
                <Typography sx={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: PRIMARY_COLOR, lineHeight: 1.1 }}>{combinedGroups.length}</Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Slide>

      {sprintTaskGroupInfoLoading && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress size={24} sx={{ color: PRIMARY_COLOR }} />
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1.5 }}>Loading sprint info...</Typography>
        </Box>
      )}

      {!sprintTaskGroupInfoLoading && sprintTaskGroupInfoError && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444" }} />
          <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load sprint info</Typography>
          <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{sprintTaskGroupInfoError}</Typography>
        </Box>
      )}

      {workspaceTaskGroupsLoading && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress size={24} sx={{ color: PRIMARY_COLOR }} />
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1.5 }}>Loading workspace tasks...</Typography>
        </Box>
      )}

      {!workspaceTaskGroupsLoading && workspaceTaskGroupsError && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444" }} />
          <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load workspace tasks</Typography>
          <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{workspaceTaskGroupsError}</Typography>
        </Box>
      )}

      {!workspaceTaskGroupsLoading && !workspaceTaskGroupsError && combinedGroups.length === 0 && (
        <Fade in timeout={700}>
          <Card
            elevation={0}
            sx={{
              p: 6, textAlign: "center",
              border: "1px dashed",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: 3,
              bgcolor: isDark ? "#0B1220" : "#ffffff",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon icon="lucide:clipboard-x" style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
            <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mt: 2, mb: 1 }}>No Tasks Found</Typography>
            <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto" }}>
              This workspace doesn't have any tasks yet.
            </Typography>
          </Card>
        </Fade>
      )}

      {!workspaceTaskGroupsLoading && !workspaceTaskGroupsError && combinedGroups.map((group, groupIndex) => {
        const info = sprintTaskInfo[group.taskGroupID];
        const isLoadingTaskInfo = sprintTaskInfoLoading[group.taskGroupID];

        const dynCols = sprintDynamicColumns[group.taskGroupID] || [];
        const isLoadingCols = sprintDynamicColumnsLoading[group.taskGroupID];

        const dynamicDetails = info?.detailList || [];
        const dynamicColValues = info?.colvalueList || [];

        const mergedColumns = buildMergedTaskColumns(dynCols);

        const colValueLookup = new Map<string, ApiColumnValue>();
        dynamicColValues.forEach((cv) => {
          colValueLookup.set(`${cv.additionalColumnID}:${cv.taskID}`, cv);
        });

        const isLoading = isLoadingTaskInfo || isLoadingCols;
        const hasDynamicData = dynCols.length > 0 || dynamicDetails.length > 0;

        return (
          <Fade key={group.taskGroupID} in timeout={600 + groupIndex * 100}>
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }} flexWrap="wrap">
                <Box sx={{ width: 28, height: 28, borderRadius: 1.25, bgcolor: alpha(PRIMARY_COLOR, 0.12), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon icon="lucide:folder-tree" style={{ fontSize: 15, color: PRIMARY_COLOR }} />
                </Box>
                <Typography sx={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", letterSpacing: "0.01em" }}>{group.groupName}</Typography>
                <Chip
                  label={`${(hasDynamicData ? dynamicDetails.length : group.tasks.length)} task${(hasDynamicData ? dynamicDetails.length : group.tasks.length) !== 1 ? "s" : ""}`}
                  size="small"
                  sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, fontSize: 10, height: 22, borderRadius: "6px" }}
                />
              </Stack>

              {hasDynamicData ? (
                isLoading ? (
                  <Card elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 3, bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
                    <CircularProgress size={22} sx={{ color: PRIMARY_COLOR }} />
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1 }}>Loading task info...</Typography>
                  </Card>
                ) : (
                  <Box sx={{ overflowX: "auto" }}>
                    <TableContainer sx={{ ...tableStyles.container, minWidth: isMobile ? "900px" : "auto" }}>
                      <Table size={isMobile ? "small" : "medium"}>
                        <TableHead>
                          <TableRow>
                            {mergedColumns.map((col) => (
                              <TableCell key={col.key} sx={tableStyles.headCell}>{col.name}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicDetails.map((task, taskIdx) => (
                            <Grow key={task.taskID} in timeout={300 + taskIdx * 60}>
                              <TableRow sx={tableStyles.row}>
                                {mergedColumns.map((col) => {
                                  const cv = col.isCore ? undefined : colValueLookup.get(`${col.id}:${task.taskID}`);
                                  return (
                                    <TableCell key={`${task.taskID}-${col.key}`} sx={tableStyles.bodyCell}>
                                      {getTaskColumnValue(task, col, cv, { getPriorityColor, getStatusColor, isDark, isMobile, onFileClick: handleSubTaskFileClick })}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            </Grow>
                          ))}
                          {dynamicDetails.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={mergedColumns.length + 1} sx={{ py: 3, textAlign: "center" }}>
                                <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>No tasks found in this group.</Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )
              ) : group.tasks.length > 0 ? (
                <Box sx={{ overflowX: "auto" }}>
                  <TableContainer sx={{ ...tableStyles.container, minWidth: isMobile ? "900px" : "auto" }}>
                    <Table size={isMobile ? "small" : "medium"}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableStyles.headCell}>Task Name</TableCell>
                          <TableCell sx={tableStyles.headCell}>Task Description</TableCell>
                          <TableCell sx={tableStyles.headCell}>Owner</TableCell>
                          <TableCell sx={tableStyles.headCell}>Is Unplanned</TableCell>
                          <TableCell sx={tableStyles.headCell} align="center">Actual SP</TableCell>
                          <TableCell sx={tableStyles.headCell} align="center">Estimated SP</TableCell>
                          <TableCell sx={tableStyles.headCell}>Priority</TableCell>
                          <TableCell sx={tableStyles.headCell}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.tasks.map((task, taskIdx) => (
                          <Grow key={task.taskID} in timeout={300 + taskIdx * 60}>
                            <TableRow sx={tableStyles.row}>
                              <TableCell sx={{ ...tableStyles.bodyCell, pl: 2 }} padding="checkbox">
                                <Checkbox size="small" sx={{ color: isDark ? "#475569" : "#94a3b8", "&.Mui-checked": { color: PRIMARY_COLOR } }} />
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell}>
                                <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{task.taskName}</Typography>
                              </TableCell>
                              <TableCell sx={{ ...tableStyles.bodyCell, maxWidth: 320 }}>
                                <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#cbd5e1" : "#334155", lineHeight: 1.5 }}>{task.taskDescription}</Typography>
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Avatar src={task.ownerProfilePicture || undefined} sx={{ width: 28, height: 28, bgcolor: isDark ? "#334155" : "#cbd5e1", fontSize: 11, fontWeight: 700, color: isDark ? "#e2e8f0" : "#0f172a" }}>
                                    {task.owner.charAt(0).toUpperCase()}
                                  </Avatar>
                                </Stack>
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell}>
                                <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#cbd5e1" : "#334155" }}>{task.isUnplanned ? "Yes" : "No"}</Typography>
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell} align="center">
                                <Typography sx={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{task.actualSP}</Typography>
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell} align="center">
                                <Typography sx={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{task.estimatedSP}</Typography>
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell}>
                                <Chip label={task.priority} size="small" sx={priorityChipSx(task.priority)} />
                              </TableCell>
                              <TableCell sx={tableStyles.bodyCell}>
                                <Chip label={task.status} size="small" sx={statusChipSx(task.status)} />
                              </TableCell>
                            </TableRow>
                          </Grow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Card elevation={0} sx={{ p: 3, textAlign: "center", border: "1px dashed", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 3, bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
                  <Icon icon="lucide:inbox" style={{ fontSize: 32, color: isDark ? "#64748b" : "#94a3b8", display: "block", margin: "0 auto 8px" }} />
                  <Typography sx={{ fontSize: isMobile ? 11 : 13, color: isDark ? "#94a3b8" : "#64748b" }}>No tasks found in this group.</Typography>
                </Card>
              )}
            </Box>
          </Fade>
        );
      })}
    </Box>
  );
};





const renderSprintTableForWorkspace = () => {
  if (!selectedWorkspace) return null;

  const usingSprintGroups = sprintGroups.length > 0;
  const effectiveLoading = usingSprintGroups ? sprintGroupsLoading : sprintTaskGroupInfoLoading;
  const effectiveError = usingSprintGroups ? sprintGroupsError : sprintTaskGroupInfoError;

  // Header bar (shared)
  const header = (
    <Slide in timeout={500} direction="down">
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
          border: "1px solid",
          borderColor: isDark ? "#1e293b" : "#e2e8f0",
          bgcolor: isDark ? "#0B1220" : "#ffffff",
          position: "relative", overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0, height: "3px",
            background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)}, transparent)`,
          },
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={handleBackToWorkspaces}
              sx={{
                color: isDark ? "#94a3b8" : "#64748b",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.15) rotate(-10deg)",
                  color: PRIMARY_COLOR,
                  backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                },
              }}
            >
              <Icon icon="lucide:arrow-left" style={{ fontSize: 22 }} />
            </IconButton>
            <Box>
              <Typography
                sx={{
                  fontSize: isMobile ? 18 : 24,
                  fontWeight: 700,
                  color: isDark ? "#ffffff" : "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                Sprints
              </Typography>
              <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mt: 0.5 }}>
                {selectedWorkspace.workspaceName} • {selectedWorkspace.organizationname}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );

  if (effectiveLoading) {
    return (
      <Box>
        {header}
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress size={28} sx={{ color: PRIMARY_COLOR }} />
          <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mt: 2 }}>
            Loading sprints...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (effectiveError) {
    return (
      <Box>
        {header}
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444" }} />
          <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load sprints</Typography>
          <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{effectiveError}</Typography>
        </Box>
      </Box>
    );
  }

  // ✅ Render one table PER sprint group using GetSprintInfoList data
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {header}

      {sprintGroups.length === 0 ? (
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 8, textAlign: "center",
              border: "1px dashed",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: 3,
              bgcolor: isDark ? "#0B1220" : "#ffffff",
            }}
          >
            <Typography sx={{ fontSize: isMobile ? 13 : 15, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
              No Data Found
            </Typography>
          </Paper>
        </Fade>
      ) : (
        sprintGroups.map((group, groupIndex) => {
          const info = sprintInfoData[group.SprintGroupID];
          const isLoadingInfo = sprintInfoLoading[group.SprintGroupID];
          const infoError = sprintInfoError[group.SprintGroupID];

          const dynamicColumns = info?.colList || [];
          const dynamicDetails = info?.detailList || [];
          const dynamicColValues = info?.colvalueList || [];

          const mergedColumns = buildMergedSprintInfoColumns(dynamicColumns);

          const colValueLookup = new Map<string, ApiSprintInfoColumnValue>();
          dynamicColValues.forEach((cv) => {
            colValueLookup.set(`${cv.additionalColumnID}:${cv.sprintID}`, cv);
          });

          return (
            <Fade key={group.SprintGroupID} in timeout={500 + groupIndex * 100}>
              <Box
                sx={{
                  mb: 4,
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  overflowX: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }} flexWrap="wrap">
                  <Box sx={{ width: 28, height: 28, borderRadius: 1.25, bgcolor: alpha(PRIMARY_COLOR, 0.12), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon icon="lucide:git-branch" style={{ fontSize: 15, color: PRIMARY_COLOR }} />
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", letterSpacing: "0.01em" }}>
                    {group.GroupName}
                  </Typography>
                  <Chip
                    label={`${dynamicDetails.length} sprint${dynamicDetails.length !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, fontSize: 10, height: 22, borderRadius: "6px" }}
                  />
                </Stack>

                {isLoadingInfo ? (
                  <Card elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 3, bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
                    <CircularProgress size={22} sx={{ color: PRIMARY_COLOR }} />
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1 }}>Loading sprint info...</Typography>
                  </Card>
                ) : infoError ? (
                  <Card elevation={0} sx={{ p: 3, textAlign: "center", border: "1px solid", borderColor: "#ef4444", borderRadius: 3, bgcolor: isDark ? "rgba(239,68,68,0.05)" : "#fef2f2" }}>
                    <Icon icon="lucide:alert-circle" style={{ fontSize: 24, color: "#ef4444" }} />
                    <Typography sx={{ fontSize: 12, color: "#ef4444", mt: 1 }}>{infoError}</Typography>
                  </Card>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      display: "block",
                      overflowX: "auto",
                      overflowY: "hidden",
                      WebkitOverflowScrolling: "touch",
                      boxSizing: "border-box",
                      pb: 1,
                      "&::-webkit-scrollbar": { height: "10px" },
                      "&::-webkit-scrollbar-track": {
                        background: isDark ? "#0F1828" : "#f1f5f9",
                        borderRadius: "6px",
                        margin: "0 8px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: alpha(PRIMARY_COLOR, 0.4),
                        borderRadius: "6px",
                        border: `2px solid ${isDark ? "#0F1828" : "#f1f5f9"}`,
                        "&:hover": { background: alpha(PRIMARY_COLOR, 0.7) },
                      },
                    }}
                  >
                    <TableContainer
                      sx={{
                        ...tableStyles.container,
                        width: "max-content",
                        minWidth: "100%",
                        overflow: "visible",
                      }}
                    >
                      <Table
                        size={isMobile ? "small" : "medium"}
                        sx={{ minWidth: isMobile ? 900 : 1100, tableLayout: "auto" }}
                      >
                        <TableHead>
                          <TableRow>
                            {mergedColumns.map((col) => (
                              <TableCell
                                key={col.key}
                                sx={{
                                  ...tableStyles.headCell,
                                  whiteSpace: "nowrap",
                                  minWidth:
                                    col.keyname === "SPRINT_NAME" ? 200
                                    : col.keyname === "GOALS" ? 260
                                    : col.keyname === "SPRINT_TIMELINE" ? 220
                                    : col.keyname === "SPRINT_STATUS" || col.keyname === "LBL" ? 130
                                    : 130,
                                }}
                              >
                                {col.name}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicDetails.map((sprint, sprintIdx) => (
                            <Grow key={sprint.sprintID} in timeout={300 + sprintIdx * 60}>
                              <TableRow sx={tableStyles.row}>
                                {mergedColumns.map((col) => {
                                  const cv = col.isCore
                                    ? undefined
                                    : colValueLookup.get(`${col.id}:${sprint.sprintID}`);
                                  return (
                                    <TableCell
                                      key={`${sprint.sprintID}-${col.key}`}
                                      sx={{
                                        ...tableStyles.bodyCell,
                                        whiteSpace:
                                          col.keyname === "GOALS" || col.keyname === "SPRINT_NAME"
                                            ? "normal"
                                            : "nowrap",
                                        minWidth:
                                          col.keyname === "SPRINT_NAME" ? 200
                                          : col.keyname === "GOALS" ? 260
                                          : col.keyname === "SPRINT_TIMELINE" ? 220
                                          : col.keyname === "SPRINT_STATUS" || col.keyname === "LBL" ? 130
                                          : 130,
                                        maxWidth: col.keyname === "GOALS" ? 400 : col.keyname === "SPRINT_NAME" ? 280 : "none",
                                      }}
                                    >
                                      {getSprintInfoColumnValue(sprint, col, cv, {
                                        getStatusColor,
                                        isDark,
                                        isMobile,
                                        onFileClick: handleSubTaskFileClick,
                                      })}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            </Grow>
                          ))}
                          {dynamicDetails.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={mergedColumns.length} sx={{ py: 5, textAlign: "center", borderBottom: "none" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                  <Icon icon="lucide:inbox" style={{ fontSize: 32, color: isDark ? "#64748b" : "#94a3b8" }} />
                                  <Typography sx={{ fontSize: isMobile ? 13 : 14, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                                    No Sprints Added
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            </Fade>
          );
        })
      )}
    </Box>
  );
};






  const renderBugGroupView = () => {
    if (!selectedWorkspace) return null;

    if (bugGroupsLoading) {
      return (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
          </Box>
          <Box sx={{ py: 4, textAlign: "center" }}>
            <CircularProgress size={24} sx={{ color: PRIMARY_COLOR }} />
            <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1.5 }}>Loading bug groups...</Typography>
          </Box>
        </Box>
      );
    }

    if (bugGroupsError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block", margin: "0 auto" }} />
          <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load bug groups</Typography>
          <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{bugGroupsError}</Typography>
        </Box>
      );
    }

    if (bugGroups.length === 0) {
      return (
        <Fade in timeout={700}>
          <Card
            elevation={0}
            sx={{
              p: 6, textAlign: "center",
              border: "1px dashed",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: 3,
              bgcolor: isDark ? "#0B1220" : "#ffffff",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon icon="lucide:bug" style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
            <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mt: 2, mb: 1 }}>No Bug Groups Found</Typography>
            <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto" }}>
              This workspace doesn't have any bug groups yet.
            </Typography>
          </Card>
        </Fade>
      );
    }

    return (
      // ✅ SCROLL FIX: hard-clip the page width so it can NEVER expand horizontally
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {bugGroups.map((group, groupIndex) => {
          const info = bugInfo[group.bugGroupID];
          const isLoadingInfo = bugInfoLoading[group.bugGroupID];
          const infoError = bugInfoError[group.bugGroupID];

          const dynamicColumns = info?.colList || [];
          const dynamicDetails = info?.detailList || [];
          const dynamicColValues = info?.colvalueList || [];

          const mergedColumns = buildMergedBugColumns(dynamicColumns);

          const colValueLookup = new Map<string, ApiBugColumnValue>();
          dynamicColValues.forEach((cv) => {
            colValueLookup.set(`${cv.additionalColumnID}:${cv.bugID}`, cv);
          });

          return (
            <Fade key={group.bugGroupID} in timeout={500 + groupIndex * 100}>
              {/* ✅ SCROLL FIX: each group wrapper constrained + minWidth 0 */}
              <Box
                sx={{
                  mb: 4,
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  overflowX: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }} flexWrap="wrap">
                  <Box sx={{ width: 28, height: 28, borderRadius: 1.25, bgcolor: alpha("#ef4444", 0.12), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon icon="lucide:bug" style={{ fontSize: 15, color: "#ef4444" }} />
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", letterSpacing: "0.01em" }}>{group.groupname}</Typography>
                  <Chip
                    label={`${dynamicDetails.length} bug${dynamicDetails.length !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, fontSize: 10, height: 22, borderRadius: "6px" }}
                  />
                </Stack>

                {isLoadingInfo ? (
                  <Card elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 3, bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
                    <CircularProgress size={22} sx={{ color: PRIMARY_COLOR }} />
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 1 }}>Loading bug info...</Typography>
                  </Card>
                ) : infoError ? (
                  <Card elevation={0} sx={{ p: 3, textAlign: "center", border: "1px solid", borderColor: "#ef4444", borderRadius: 3, bgcolor: isDark ? "rgba(239,68,68,0.05)" : "#fef2f2" }}>
                    <Icon icon="lucide:alert-circle" style={{ fontSize: 24, color: "#ef4444" }} />
                    <Typography sx={{ fontSize: 12, color: "#ef4444", mt: 1 }}>{infoError}</Typography>
                  </Card>
                ) : (
                 
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      display: "block",
                      overflowX: "auto",
                      overflowY: "hidden",
                      WebkitOverflowScrolling: "touch",
                      boxSizing: "border-box",
                      pb: 1,
                      "&::-webkit-scrollbar": { height: "10px" },
                      "&::-webkit-scrollbar-track": {
                        background: isDark ? "#0F1828" : "#f1f5f9",
                        borderRadius: "6px",
                        margin: "0 8px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: alpha(PRIMARY_COLOR, 0.4),
                        borderRadius: "6px",
                        border: `2px solid ${isDark ? "#0F1828" : "#f1f5f9"}`,
                        "&:hover": { background: alpha(PRIMARY_COLOR, 0.7) },
                      },
                    }}
                  >
                   
                    <TableContainer
                      sx={{
                        ...tableStyles.container,
                        width: "max-content",
                        minWidth: "100%",
                        overflow: "visible",
                      }}
                    >
                      <Table
                        size={isMobile ? "small" : "medium"}
                        sx={{ minWidth: isMobile ? 900 : 1100, tableLayout: "auto" }}
                      >
                        <TableHead>
                          <TableRow>
                           
                            {mergedColumns.map((col) => (
                              <TableCell
                                key={col.key}
                                sx={{
                                  ...tableStyles.headCell,
                                  whiteSpace: "nowrap",
                                  minWidth:
                                    col.keyname === "NAME" ? 200
                                    : col.keyname === "DESCRIPTION" ? 240
                                    : col.keyname === "REPORTER" ? 90
                                    : col.keyname === "TIME_RESOLUTION" ? 160
                                    : col.keyname === "PRIORITY" || col.keyname === "STATUS" || col.keyname === "LBL" ? 110
                                    : 130,
                                }}
                              >
                                {col.name}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dynamicDetails.map((bug, bugIdx) => (
                            <Grow key={bug.bugID} in timeout={300 + bugIdx * 60}>
                              <TableRow sx={tableStyles.row}>
                               
                                {mergedColumns.map((col) => {
                                  const cv = col.isCore ? undefined : colValueLookup.get(`${col.id}:${bug.bugID}`);
                                  return (
                                    <TableCell
                                      key={`${bug.bugID}-${col.key}`}
                                      sx={{
                                        ...tableStyles.bodyCell,
                                        whiteSpace: col.keyname === "DESCRIPTION" || col.keyname === "NAME" ? "normal" : "nowrap",
                                        minWidth:
                                          col.keyname === "NAME" ? 200
                                          : col.keyname === "DESCRIPTION" ? 240
                                          : col.keyname === "REPORTER" ? 90
                                          : col.keyname === "TIME_RESOLUTION" ? 160
                                          : col.keyname === "PRIORITY" || col.keyname === "STATUS" || col.keyname === "LBL" ? 110
                                          : 130,
                                        maxWidth: col.keyname === "DESCRIPTION" ? 360 : col.keyname === "NAME" ? 280 : "none",
                                      }}
                                    >
                                      {getBugColumnValue(bug, col, cv, { getPriorityColor, getStatusColor, isDark, isMobile, onFileClick: handleSubTaskFileClick })}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            </Grow>
                          ))}
                          {dynamicDetails.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={mergedColumns.length + 1} sx={{ py: 5, textAlign: "center", borderBottom: "none" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                  <Icon icon="lucide:inbox" style={{ fontSize: 32, color: isDark ? "#64748b" : "#94a3b8" }} />
                                  <Typography sx={{ fontSize: isMobile ? 13 : 14, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>No Bugs Added</Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            </Fade>
          );
        })}
      </Box>
    );
  };


  const renderProjectDetail = () => {
    if (!selectedProject) return null;
    const project = selectedProject;
    const allTasks = projectTasks.length > 0 ? projectTasks : project.tasks;

    if (projectTasksLoading) return <ProjectDetailSkeleton isDark={isDark} isMobile={isMobile} />;

    if (projectTasksError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
            <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load tasks</Typography>
            <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{projectTasksError}</Typography>
          </Box>
        </Box>
      );
    }

    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter((t) => t.status === "done").length;
    const inProgressTasks = allTasks.filter((t) => t.status === "in-progress").length;
    const highPriorityTasks = allTasks.filter((t) => t.priority === "high").length;
    const totalSubtasks = allTasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
    const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const statCards = [
      { label: "Total Tasks", value: totalTasks, icon: "lucide:list-checks", color: PRIMARY_COLOR, bg: alpha(PRIMARY_COLOR, 0.08) },
      { label: "In Progress", value: inProgressTasks, icon: "lucide:loader-circle", color: "#3b82f6", bg: alpha("#3b82f6", 0.08) },
      { label: "Completed", value: doneTasks, icon: "lucide:check-circle-2", color: "#22c55e", bg: alpha("#22c55e", 0.08) },
      { label: "High Priority", value: highPriorityTasks, icon: "lucide:flame", color: "#ef4444", bg: alpha("#ef4444", 0.08) },
    ];

    if (allTasks.length === 0) {
      return (
        <Box>
          <Slide in timeout={500} direction="down">
            <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, mb: 3, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
              <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    onClick={handleBackToProjects}
                    sx={{
                      color: isDark ? "#94a3b8" : "#64748b", transition: "all 0.3s ease",
                      "&:hover": { transform: "scale(1.2) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                    }}
                  >
                    <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                  </IconButton>
                  <Box>
                    <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{project.name}</Typography>
                    <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{project.description}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Slide>

          <Fade in timeout={700}>
            <Card
              elevation={0}
              sx={{
                p: 6, textAlign: "center",
                border: "1px dashed",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
                borderRadius: 3,
                bgcolor: isDark ? "#0B1220" : "#ffffff",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon icon="lucide:clipboard-x" style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
              <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mb: 1, mt: 2 }}>No Tasks Found</Typography>
              <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto" }}>
                This project doesn't have any tasks yet. Tasks will appear here once they are created and assigned.
              </Typography>
            </Card>
          </Fade>
        </Box>
      );
    }

    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              bgcolor: isDark ? "#0B1220" : "#ffffff",
              position: "relative", overflow: "hidden",
              "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)}, transparent)` },
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToProjects}
                  sx={{
                    color: isDark ? "#94a3b8" : "#64748b", transition: "all 0.3s ease",
                    "&:hover": { transform: "scale(1.15) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 22 }} />
                </IconButton>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap">
                    <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", lineHeight: 1.2 }}>{project.name}</Typography>
                    <Chip label={project.status} size="small" sx={{ bgcolor: getStatusColor(project.status) + "20", color: getStatusColor(project.status), textTransform: "uppercase", fontSize: 10, fontWeight: 700, height: 22, borderRadius: "6px", letterSpacing: "0.04em" }} />
                  </Stack>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mt: 0.5 }}>{project.description}</Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "row" : "row"} spacing={isMobile ? 2 : 3} alignItems="center" sx={{ mt: isMobile ? 1 : 0 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Progress</Typography>
                  <Typography sx={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: PRIMARY_COLOR, lineHeight: 1.1 }}>{project.progress}%</Typography>
                </Box>
                <Box sx={{ width: 1, height: 36, bgcolor: isDark ? "#1e293b" : "#e2e8f0" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tasks</Typography>
                  <Typography sx={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", lineHeight: 1.1 }}>{totalTasks}</Typography>
                </Box>
              </Stack>
            </Stack>
            <Box sx={{ mt: 2.5 }}>
              <Box sx={{ width: "100%", height: 6, borderRadius: 3, bgcolor: isDark ? "#1e293b" : "#f1f5f9", overflow: "hidden" }}>
                <Box sx={{ width: `${project.progress}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.6)})`, transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
              </Box>
            </Box>
          </Paper>
        </Slide>

        <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
          {statCards.map((stat, idx) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Grow in timeout={600 + idx * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2, borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    bgcolor: isDark ? "#0B1220" : "#ffffff",
                    display: "flex", alignItems: "center",
                    gap: isMobile ? 1 : 1.5,
                    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": { transform: "translateY(-4px)", borderColor: alpha(stat.color, 0.4), boxShadow: `0 12px 32px ${alpha(stat.color, 0.12)}` },
                  }}
                >
                  <Box sx={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 2, bgcolor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon icon={stat.icon} style={{ fontSize: isMobile ? 16 : 20, color: stat.color }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: isMobile ? 9 : 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: isDark ? "#64748b" : "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stat.label}</Typography>
                    <Typography sx={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", lineHeight: 1.1 }}>{stat.value}</Typography>
                  </Box>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        <Fade in timeout={700}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff", overflow: "hidden" }}>
            <Box sx={{ px: isMobile ? 2 : 3, py: 2, borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, bgcolor: isDark ? "#0F1828" : "#f8fafc" }}>
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(PRIMARY_COLOR, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon icon="lucide:clipboard-list" style={{ fontSize: 18, color: PRIMARY_COLOR }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", lineHeight: 1.2 }}>Project Tasks</Typography>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>{allTasks.length} task{allTasks.length !== 1 ? "s" : ""} • {totalSubtasks} subtask{totalSubtasks !== 1 ? "s" : ""}</Typography>
                </Box>
              </Stack>
              <Chip label={`${completionPct}% complete`} size="small" sx={{ bgcolor: alpha(PRIMARY_COLOR, 0.1), color: PRIMARY_COLOR, fontWeight: 700, fontSize: 11, height: 26, borderRadius: "8px" }} />
            </Box>

            <Box sx={{ overflowX: "auto" }}>
              <TableContainer sx={{ minWidth: isMobile ? "800px" : "auto" }}>
                <Table size={isMobile ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...tableStyles.headCell, width: "28%" }}>Task</TableCell>
                      <TableCell sx={tableStyles.headCell}>Owner</TableCell>
                      <TableCell sx={tableStyles.headCell}>Priority</TableCell>
                      <TableCell sx={tableStyles.headCell}>Status</TableCell>
                      {!isMobile && (
                        <>
                          <TableCell sx={tableStyles.headCell}>Timeline</TableCell>
                          <TableCell sx={tableStyles.headCell}>Users</TableCell>
                          <TableCell sx={tableStyles.headCell}>Type</TableCell>
                          <TableCell sx={tableStyles.headCell}>Dev Status</TableCell>
                          <TableCell sx={tableStyles.headCell}>Document</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allTasks.slice(0, isMobile ? 5 : 10).map((task) => {
                      const isExpanded = selectedTask?.id === task.id;

                      return (
                        <React.Fragment key={task.id}>
                          <TableRow
                            sx={{
                              ...tableStyles.row,
                              cursor: "pointer",
                              bgcolor: isExpanded ? (isDark ? alpha(PRIMARY_COLOR, 0.06) : alpha(PRIMARY_COLOR, 0.03)) : "transparent",
                            }}
                            onClick={() => handleTaskClick(task)}
                          >
                            <TableCell sx={{ ...tableStyles.bodyCell, width: "28%" }}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Typography
                                  sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", cursor: "pointer", "&:hover": { color: PRIMARY_COLOR } }}
                                >
                                  {task.title}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={tableStyles.bodyCell}>
                              <Chip label={task.owner} size="small" sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#e2e8f0" : "#1e293b", ...tableStyles.chip }} />
                            </TableCell>
                            <TableCell sx={tableStyles.bodyCell}>
                              <Chip label={task.priority} size="small" sx={{ bgcolor: getPriorityColor(task.priority) + "20", color: getPriorityColor(task.priority), textTransform: "uppercase", ...tableStyles.chip }} />
                            </TableCell>
                            <TableCell sx={tableStyles.bodyCell}>
                              <Chip label={task.status} size="small" sx={{ bgcolor: getStatusColor(task.status) + "20", color: getStatusColor(task.status), textTransform: "uppercase", ...tableStyles.chip }} />
                            </TableCell>
                            {!isMobile && (
                              <>
                                <TableCell sx={tableStyles.bodyCell}>
                                  <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{task.timeline || formatDate(new Date().toISOString())}</Typography>
                                </TableCell>
                                <TableCell sx={tableStyles.bodyCell}>
                                  <Stack direction="row" spacing={0.5}>
                                    {task.users.slice(0, 3).map((user, idx) => (
                                      <Tooltip key={idx} title={user}>
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: idx % 2 === 0 ? PRIMARY_COLOR : "#22c55e", fontSize: 10, fontWeight: 600 }}>
                                          {user.charAt(0).toUpperCase()}
                                        </Avatar>
                                      </Tooltip>
                                    ))}
                                    {task.users.length > 3 && (
                                      <Typography sx={{ fontSize: 10, color: isDark ? "#94a3b8" : "#64748b", alignSelf: "center", ml: 0.5 }}>+{task.users.length - 3}</Typography>
                                    )}
                                  </Stack>
                                </TableCell>
                                <TableCell sx={tableStyles.bodyCell}>
                                  <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{task.type}</Typography>
                                </TableCell>
                                <TableCell sx={tableStyles.bodyCell}>
                                  <Chip label={task.devStatus} size="small" sx={{ bgcolor: getStatusColor(task.devStatus as any) + "20", color: getStatusColor(task.devStatus as any), ...tableStyles.chip }} />
                                </TableCell>
                                <TableCell sx={tableStyles.bodyCell}>
                                  {task.document || task.attachmentLink ? (
                                    <Button
                                      size="small"
                                      startIcon={<Icon icon="lucide:file" style={{ fontSize: 14 }} />}
                                      sx={{
                                        fontSize: 11, color: PRIMARY_COLOR, textTransform: "none",
                                        "&:hover": { transform: "scale(1.1) translateY(-2px)", color: PRIMARY_DARK, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                                      }}
                                      onClick={(e) => { e.stopPropagation(); handleAttachmentClick(task); }}
                                    >
                                      View
                                    </Button>
                                  ) : (
                                    <Typography sx={{ fontSize: 12, color: isDark ? "#4b5563" : "#94a3b8" }}>—</Typography>
                                  )}
                                </TableCell>
                              </>
                            )}
                          </TableRow>

                          {/* ❌ REMOVED: expanded subtask row (isExpanded && <TableRow>...</TableRow>) */}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Fade>
      </Box>
    );
  };


  const renderSprintDetail = () => {
   if (!selectedSprint) return null;
  const sprint = selectedSprint;

  const sprintEntries = [
    { name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate, status: sprint.status, goals: sprint.goals || ["No goals defined"] },
    { name: `${sprint.name} - Extended`, startDate: sprint.startDate, endDate: sprint.endDate, status: sprint.status, goals: sprint.goals || ["No goals defined"] },
    { name: `${sprint.name} - Final`, startDate: sprint.startDate, endDate: sprint.endDate, status: sprint.status, goals: sprint.goals || ["No goals defined"] }
  ];


    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, mb: 3, borderRadius: 3, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToSprints}
                  sx={{
                    color: isDark ? "#94a3b8" : "#64748b",
                    "&:hover": { transform: "scale(1.2) rotate(-10deg)", color: PRIMARY_COLOR, backgroundColor: alpha(PRIMARY_COLOR, 0.1) },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>Sprint Details</Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{sprint.name} • {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
                <Chip label={sprint.status} sx={{ bgcolor: getStatusColor(sprint.status) + "20", color: getStatusColor(sprint.status), ...tableStyles.chip }} />
                <Chip label={`${sprint.tasks.length} Tasks`} sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#ffffff" : "#0f172a", ...tableStyles.chip }} />
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer sx={{ ...tableStyles.container, minWidth: isMobile ? "400px" : "auto" }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableStyles.headCell}>Sprint</TableCell>
                    <TableCell sx={tableStyles.headCell}>Goals</TableCell>
                    <TableCell sx={tableStyles.headCell}>Sprint Timeline</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sprintEntries.map((entry) => (
                    <TableRow key={entry.name} sx={tableStyles.row}>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{entry.name}</Typography>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        {entry.goals && entry.goals.length > 0 ? (
                          <Box>
                            {entry.goals.slice(0, isMobile ? 1 : 3).map((goal, goalIndex) => (
                              <Typography key={goalIndex} sx={{ fontSize: isMobile ? 11 : 12, color: isDark ? "#e2e8f0" : "#1e293b", mb: goalIndex < entry.goals.length - 1 ? 0.5 : 0 }}>{goal}</Typography>
                            ))}
                            {isMobile && entry.goals.length > 1 && (
                              <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>+{entry.goals.length - 1} more</Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: isMobile ? 11 : 12, color: isDark ? "#94a3b8" : "#64748b", fontStyle: "italic" }}>No goals defined</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Typography sx={{ fontSize: isMobile ? 11 : 12, color: isDark ? "#ffffff" : "#0f172a" }}>{formatDate(entry.startDate)} - {formatDate(entry.endDate)}</Typography>
                        <Typography sx={{ fontSize: isMobile ? 10 : 11, color: isDark ? "#94a3b8" : "#64748b", mt: 0.5 }}>
                          {Math.ceil((new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </Typography>
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

 
  const renderBoardView = () => {
    if (boardLoading) return <BoardViewSkeleton isDark={isDark} isMobile={isMobile} />;

    if (boardError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
            <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load board tasks</Typography>
            <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{boardError}</Typography>
          </Box>
        </Box>
      );
    }

    if (!boardData || boardData.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Icon icon="lucide:clipboard" style={{ fontSize: 48, color: isDark ? "#64748b" : "#94a3b8", display: "block" }} />
            <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", mt: 2 }}>No board tasks found for this user.</Typography>
          </Box>
        </Box>
      );
    }

    const boardTasks: Task[] = boardData.flatMap((category) =>
      category.details.map((detail) => ({
        id: `board_${detail.taskID}`,
        title: detail.taskTitle,
        description: detail.taskDescription || "No description",
        status: mapBoardStatus(category.categoryname),
        priority: mapBoardPriority(detail.priorityName),
        assignee: detail.assignedTo,
        sprintId: `sprint_${detail.projectTaskID}`,
        createdAt: detail.createDate || new Date().toISOString(),
        owner: detail.assignedTo || "-",
        type: category.categoryname,
        devStatus: "To Do",
        document: detail.attachmentLink || undefined,
        attachmentLink: detail.attachmentLink || undefined,
        createDate: detail.createDate || new Date().toISOString(),
        categoryName: category.categoryname,
        timeline: detail.createDate || new Date().toISOString(),
        users: [detail.assignedTo || "-"],
        subtasks: [],
      }))
    );

    const todoTasks = boardTasks.filter(t => t.status === "todo");
    const inProgressTasks = boardTasks.filter(t => t.status === "in-progress");
    const reviewTasks = boardTasks.filter(t => t.status === "review");
    const doneTasks = boardTasks.filter(t => t.status === "done");

    const columns = [
      { title: "To Do", status: "todo" as Task["status"], tasks: todoTasks, color: "#64748b", icon: "lucide:circle" },
      { title: "In Progress", status: "in-progress" as Task["status"], tasks: inProgressTasks, color: "#3b82f6", icon: "lucide:loader-circle" },
      { title: "Review", status: "review" as Task["status"], tasks: reviewTasks, color: "#8b5cf6", icon: "lucide:eye" },
      { title: "Done", status: "done" as Task["status"], tasks: doneTasks, color: "#22c55e", icon: "lucide:check-circle" }
    ];

    const categoryStats = boardData.map(cat => ({
      name: cat.categoryname,
      count: cat.details.length,
      color: cat.categoryColorCode || BOARD_PRIORITY_COLORS[cat.categoryname] || "#64748b"
    }));

    const hasAnyAttachment = boardTasks.some(task => task.attachmentLink && task.attachmentLink.trim() !== "");

    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3, mb: 3, borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              bgcolor: isDark ? "#0B1220" : "#ffffff",
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 2, bgcolor: alpha(PRIMARY_COLOR, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon icon="lucide:layout-dashboard" style={{ fontSize: isMobile ? 20 : 24, color: PRIMARY_COLOR }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>Board Tasks</Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>
                    {boardTasks.length} total tasks • {boardData.length} categories
                    {hasAnyAttachment && " • 📎 Attachments available"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 1 : 2} alignItems={isMobile ? "flex-start" : "center"}>
                {categoryStats.slice(0, isMobile ? 2 : 4).map((stat, idx) => (
                  <Zoom key={stat.name} in timeout={600 + idx * 100}>
                    <Chip
                      label={`${stat.name}: ${stat.count}`}
                      sx={{
                        bgcolor: alpha(stat.color, 0.15), color: stat.color,
                        border: `1px solid ${alpha(stat.color, 0.3)}`,
                        ...tableStyles.chip,
                        "&:hover": { transform: "scale(1.05)", boxShadow: `0 4px 16px ${alpha(stat.color, 0.2)}` },
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Zoom>
                ))}
              </Stack>
            </Stack>

            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}` }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Overall Progress</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                  {boardTasks.length > 0 ? Math.round((doneTasks.length / boardTasks.length) * 100) : 0}%
                </Typography>
              </Box>
              <Box sx={{ width: "100%", height: 6, borderRadius: 3, bgcolor: isDark ? "#1e293b" : "#e2e8f0", overflow: "hidden", position: "relative" }}>
                <Box sx={{ width: `${boardTasks.length > 0 ? Math.round((doneTasks.length / boardTasks.length) * 100) : 0}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.6)})`, transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
              </Box>
            </Box>
          </Paper>
        </Slide>

        <Fade in timeout={700}>
          <Box sx={{ overflowX: "auto", pb: 2 }}>
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              sx={{
                flexWrap: "nowrap",
                minWidth: isMobile ? "500px" : "auto",
                maxHeight: "calc(100vh - 350px)",
                overflowY: "auto",
                px: 0.5,
                "&::-webkit-scrollbar": { width: "6px", height: "6px" },
                "&::-webkit-scrollbar-track": { background: isDark ? "#1e293b" : "#f1f5f9", borderRadius: "3px" },
                "&::-webkit-scrollbar-thumb": { background: PRIMARY_COLOR, borderRadius: "3px" },
                "&::-webkit-scrollbar-thumb:hover": { background: PRIMARY_DARK },
              }}
            >
              {columns.map((column, colIndex) => (
                <Grid item xs={12} sm={6} md={3} key={column.status} sx={{ minWidth: isMobile ? 200 : 280, maxWidth: isMobile ? 280 : 350, flexShrink: 0 }}>
                  <Slide in timeout={600 + colIndex * 100} direction="up">
                    <Paper
                      elevation={0}
                      sx={{
                        p: isMobile ? 1 : 2, borderRadius: 3,
                        border: "1px solid",
                        borderColor: isDark ? "#1e293b" : "#e2e8f0",
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                        height: "100%", minHeight: 300, maxHeight: "calc(100vh - 420px)",
                        display: "flex", flexDirection: "column",
                        "&:hover": { borderColor: column.color, boxShadow: `0 12px 40px ${alpha(column.color, 0.12)}`, transform: "translateY(-4px)" },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1.5, borderBottom: `2px solid ${alpha(column.color, 0.2)}`, flexShrink: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: alpha(column.color, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon icon={column.icon} style={{ fontSize: isMobile ? 14 : 16, color: column.color }} />
                          </Box>
                          <Typography sx={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{column.title}</Typography>
                        </Stack>
                        <Badge badgeContent={column.tasks.length} sx={{ "& .MuiBadge-badge": { bgcolor: column.color, color: "#fff", fontWeight: 700, fontSize: isMobile ? 10 : 12, minWidth: 24, height: 24, borderRadius: "12px" } }} />
                      </Box>

                      <Stack
                        spacing={isMobile ? 1 : 1.5}
                        sx={{
                          flex: 1, overflowY: "auto", overflowX: "hidden", pr: 0.5,
                          "&::-webkit-scrollbar": { width: "4px" },
                          "&::-webkit-scrollbar-track": { background: isDark ? "#1e293b" : "#f1f5f9", borderRadius: "2px" },
                          "&::-webkit-scrollbar-thumb": { background: alpha(column.color, 0.5), borderRadius: "2px" },
                        }}
                      >
                        {column.tasks.length === 0 ? (
                          <Box sx={{ p: 3, textAlign: "center", border: "1px dashed", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 2, color: isDark ? "#64748b" : "#94a3b8", fontSize: isMobile ? 10 : 13 }}>
                            <Icon icon="lucide:inbox" style={{ fontSize: 32, opacity: 0.5, display: "block", margin: "0 auto 8px" }} />
                            No tasks
                          </Box>
                        ) : (
                          column.tasks.map((task, taskIndex) => {
                            const hasAttachment = !!(task.attachmentLink && task.attachmentLink.trim() !== "");
                            const priorityColor = getPriorityColor(task.priority);
                            return (
                              <Grow key={task.id} in timeout={800 + colIndex * 100 + taskIndex * 50}>
                                <Card
                                  elevation={0}
                                  sx={{
                                    p: isMobile ? 1.2 : 1.8, borderRadius: 2.5,
                                    border: "1px solid",
                                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                                    bgcolor: isDark ? "#0B1220" : "#ffffff",
                                    cursor: "pointer",
                                    position: "relative", overflow: "hidden", flexShrink: 0,
                                    "&:hover": { transform: "scale(1.03) translateY(-6px)", boxShadow: `0 12px 40px ${alpha(PRIMARY_COLOR, 0.15)}`, borderColor: PRIMARY_COLOR },
                                  }}
                                  onClick={() => { setSelectedTaskCard(task); setSelectedBoard(null); }}
                                >
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                    <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", flex: 1, mr: 1, wordBreak: "break-word" }}>{task.title}</Typography>
                                    <Chip label={task.priority} size="small" sx={{ bgcolor: alpha(priorityColor, 0.12), color: priorityColor, fontSize: isMobile ? 7 : 9, fontWeight: 700, height: isMobile ? 18 : 24, borderRadius: "4px", flexShrink: 0 }} />
                                  </Box>
                                  <Typography sx={{ fontSize: isMobile ? 10 : 12, color: isDark ? "#94a3b8" : "#64748b", mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {task.description || "No description"}
                                  </Typography>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                      <Icon icon="lucide:user" style={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }} />
                                      <Typography sx={{ fontSize: isMobile ? 8 : 10, color: isDark ? "#64748b" : "#94a3b8" }}>{task.owner}</Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                      <Icon icon="lucide:calendar" style={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }} />
                                      <Typography sx={{ fontSize: isMobile ? 8 : 10, color: isDark ? "#64748b" : "#94a3b8" }}>
                                        {task.createDate ? formatDate(task.createDate) : formatDate(new Date().toISOString())}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                  {task.categoryName && (
                                    <Box sx={{ mt: 1 }}>
                                      <Chip label={task.categoryName} size="small" sx={{ bgcolor: alpha(BOARD_PRIORITY_COLORS[task.categoryName] || "#64748b", 0.12), color: BOARD_PRIORITY_COLORS[task.categoryName] || "#64748b", fontSize: isMobile ? 7 : 9, fontWeight: 600, height: 18, borderRadius: "4px" }} />
                                    </Box>
                                  )}
                                  {hasAttachment && (
                                    <Box
                                      sx={{
                                        mt: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                        gap: 0.5, cursor: "pointer", p: 0.5, borderRadius: 1,
                                        bgcolor: alpha(PRIMARY_COLOR, 0.05), transition: "all 0.3s ease", width: "100%",
                                        "&:hover": { bgcolor: alpha(PRIMARY_COLOR, 0.12), transform: "scale(1.02)" },
                                      }}
                                      onClick={(e) => { e.stopPropagation(); handleAttachmentClick(task); }}
                                    >
                                      <Icon icon="lucide:paperclip" style={{ fontSize: 12, color: PRIMARY_COLOR }} />
                                      <Typography sx={{ fontSize: isMobile ? 8 : 10, color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "2px" }}>View Attachment</Typography>
                                    </Box>
                                  )}
                                </Card>
                              </Grow>
                            );
                          })
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

 

  const renderUserTable = () => (
    <>
      <Fade in timeout={600}>
        <Box sx={{ overflowX: "auto" }}>
<TableContainer sx={{ ...tableStyles.container, minWidth: isMobile ? "560px" : "auto" }}>
              <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableStyles.headCell}>User</TableCell>
                  {!isMobile && <TableCell sx={tableStyles.headCell}>Email</TableCell>}
                  <TableCell sx={tableStyles.headCell}>Organization</TableCell>
                  <TableCell sx={tableStyles.headCell}>Role</TableCell>
                  <TableCell sx={tableStyles.headCell} align="center">Projects</TableCell>
                  <TableCell sx={tableStyles.headCell} align="center">Tasks</TableCell>
                  <TableCell sx={tableStyles.headCell} align="center">Sprints</TableCell>
                  <TableCell sx={tableStyles.headCell} align="center">Workspaces</TableCell>
                  <TableCell sx={tableStyles.headCell} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} sx={{ ...tableStyles.row, cursor: "pointer" }} onClick={() => setSelectedUser(user)}>
                    <TableCell sx={{ ...tableStyles.bodyCell, py: isMobile ? 1.25 : 1.75 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ width: isMobile ? 28 : 34, height: isMobile ? 28 : 34, bgcolor: user.avatar, fontSize: isMobile ? 10 : 13, fontWeight: 600 }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", lineHeight: 1.3 }}>{user.username}</Typography>
                          {isMobile && <Typography sx={{ fontSize: 9, color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.3 }}>{user.email}</Typography>}
                        </Box>
                      </Stack>
                    </TableCell>
                    {!isMobile && <TableCell sx={{ ...tableStyles.bodyCell, color: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}>{user.email}</TableCell>}
                    <TableCell sx={tableStyles.bodyCell}>
                      <Chip label={user.organization} size="small" sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#e2e8f0" : "#1e293b", ...tableStyles.chip }} />
                    </TableCell>
                    <TableCell sx={tableStyles.bodyCell}>
                      <Chip icon={<Icon icon={getRoleIcon(user.role)} style={{ fontSize: isMobile ? 10 : 14 }} />} label={user.role} size="small" sx={{ bgcolor: getRoleColor(user.role) + "20", color: getRoleColor(user.role), ...tableStyles.chip, "& .MuiChip-icon": { color: getRoleColor(user.role) } }} />
                    </TableCell>
                    <TableCell sx={{ ...tableStyles.bodyCell, textAlign: "center" }}>
                      <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{user.projectcount ?? 0}</Typography>
                    </TableCell>
                    <TableCell sx={{ ...tableStyles.bodyCell, textAlign: "center" }}>
                      <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{user.projecttaskcount ?? 0}</Typography>
                    </TableCell>
                    <TableCell sx={{ ...tableStyles.bodyCell, textAlign: "center" }}>
                      <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{user.sprintcount ?? 0}</Typography>
                    </TableCell>
                    <TableCell sx={{ ...tableStyles.bodyCell, textAlign: "center" }}>
                      <Typography sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{user.projectworkspacecount ?? 0}</Typography>
                    </TableCell>
                    <TableCell sx={{ ...tableStyles.bodyCell, textAlign: "center" }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                        sx={{
                          borderRadius: 2, textTransform: "none",
                          fontSize: isMobile ? 9 : 11, fontWeight: 600,
                          px: isMobile ? 1.5 : 2, py: 0.5,
                          bgcolor: PRIMARY_COLOR, boxShadow: "none",
                          "&:hover": { transform: "translateY(-1px)", bgcolor: PRIMARY_DARK, boxShadow: `0 4px 12px ${alpha(PRIMARY_COLOR, 0.3)}` },
                        }}
                      >
                        {isMobile ? "View" : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>

      <Fade in timeout={700}>
        <Box sx={{ mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            component="div"
            sx={{
              color: isDark ? "#94a3b8" : "#64748b",
              "& .MuiTablePagination-select": { color: isDark ? "#ffffff" : "#0f172a" },
              "& .MuiTablePagination-selectIcon": { color: isDark ? "#94a3b8" : "#64748b" },
              "& .MuiTablePagination-actions button": {
                color: isDark ? "#94a3b8" : "#64748b",
                "&:hover": { transform: "scale(1.2)", color: PRIMARY_COLOR },
              },
            }}
          />
        </Box>
      </Fade>
    </>
  );

  

  const renderUserDetail = () => {
    if (!selectedUser) return null;
    const user = selectedUser;
    const projects = userProjects;
    const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);

    const renderProjects = () => {
      if (userProjectsLoading) return <ProjectsGridSkeleton isDark={isDark} isMobile={isMobile} />;

      if (userProjectsError) {
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
              <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load projects</Typography>
              <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{userProjectsError}</Typography>
            </Box>
          </Box>
        );
      }

      if (projects.length === 0) {
        return (
          <Fade in timeout={700}>
            <Card
              elevation={0}
              sx={{
                p: 6, textAlign: "center",
                border: "1px dashed",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
                borderRadius: 3,
                bgcolor: isDark ? "#0B1220" : "#ffffff",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon icon="lucide:folder-x" style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
              <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mt: 2, mb: 1 }}>No Projects Found</Typography>
              <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto" }}>
                This user doesn't have any projects yet. Projects will appear here once they are created and assigned.
              </Typography>
            </Card>
          </Fade>
        );
      }

      return (
        <Grid container spacing={isMobile ? 1 : 2}>
          {projects.slice(0, isMobile ? 6 : 9).map((project, index) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <Grow in timeout={800 + index * 100}>
                <Card
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2.5, borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    bgcolor: isDark ? "#0B1220" : "#ffffff",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                    "&:hover": { transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-12px) scale(1.03)", boxShadow: `0 24px 64px ${alpha(PRIMARY_COLOR, 0.2)}`, borderColor: PRIMARY_COLOR },
                  }}
                  onClick={() => handleProjectClick(project)}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{project.name}</Typography>
                      <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#94a3b8" : "#64748b", mt: 0.5 }}>{project.description}</Typography>
                    </Box>
                    <Chip label={project.status} size="small" sx={{ bgcolor: getStatusColor(project.status) + "20", color: getStatusColor(project.status), textTransform: "uppercase", ...tableStyles.chip }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      
                    </Stack>
                  
                  </Box>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      );
    };

    const renderSprints = () => {
      if (userProjectsError || workspacesError) {
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
              <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load sprints</Typography>
              <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{userProjectsError || workspacesError}</Typography>
            </Box>
          </Box>
        );
      }

      if (projects.length === 0) {
        return (
          <Box>
            {renderWorkspaceList("Workspaces", "lucide:git-branch", "No Sprints Found", "This user doesn't have any sprints yet.")}
          </Box>
        );
      }

      return (
        <Box>
          {projects.slice(0, isMobile ? 3 : 5).map((project, pIndex) => (
            <Box key={project.id} sx={{ mb: 3 }}>
              <Grid container spacing={isMobile ? 1 : 2}>
                {project.sprints.slice(0, isMobile ? 3 : 4).map((sprint, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={sprint.id}>
                    <Fade in timeout={600 + pIndex * 100 + index * 80}>
                      <Card
                        elevation={0}
                        sx={{
                          p: isMobile ? 1.5 : 2, borderRadius: 3,
                          border: "1px solid",
                          borderColor: isDark ? "#1e293b" : "#e2e8f0",
                          bgcolor: isDark ? "#0B1220" : "#ffffff",
                          cursor: "pointer", position: "relative", overflow: "hidden",
                          "&:hover": { transform: isMobile ? "translateY(-4px) scale(1.02)" : "translateY(-8px) scale(1.03)", boxShadow: `0 16px 48px ${alpha(PRIMARY_COLOR, 0.15)}`, borderColor: PRIMARY_COLOR },
                        }}
                        onClick={() => handleSprintClick(sprint)}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{sprint.name}</Typography>
                            <Typography sx={{ fontSize: isMobile ? 8 : 11, color: isDark ? "#94a3b8" : "#64748b" }}>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</Typography>
                          </Box>
                          <Chip label={sprint.status} size="small" sx={{ bgcolor: getStatusColor(sprint.status) + "20", color: getStatusColor(sprint.status), textTransform: "uppercase", ...tableStyles.chip }} />
                        </Box>
                        <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                          <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#94a3b8" : "#64748b" }}>{sprint.tasks.length} tasks</Typography>
                          <Typography sx={{ fontSize: isMobile ? 9 : 12, color: isDark ? "#94a3b8" : "#64748b" }}>{sprint.tasks.filter((t) => t.status === "done").length} done</Typography>
                        </Box>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          {workspaces.length > 0 && (
            <Box sx={{ mt: 4 }}>
              {renderWorkspaceList("Workspaces", "lucide:git-branch", "No Workspaces Found", "This user doesn't have any workspaces yet.")}
            </Box>
          )}
        </Box>
      );
    };

    const renderTasks = () => {
      if (userProjectsLoading || workspacesLoading) return <ProjectsGridSkeleton isDark={isDark} isMobile={isMobile} />;

      if (userProjectsError || workspacesError) {
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
              <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load sprint tasks</Typography>
              <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{userProjectsError || workspacesError}</Typography>
            </Box>
          </Box>
        );
      }

      if (projects.length === 0 && workspaces.length === 0) {
        return (
          <Fade in timeout={700}>
            <Card
              elevation={0}
              sx={{
                p: 6, textAlign: "center",
                border: "1px dashed",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
                borderRadius: 3,
                bgcolor: isDark ? "#0B1220" : "#ffffff",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon icon="lucide:check-square" style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
              <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mt: 2, mb: 1 }}>No Sprint Tasks Found</Typography>
              <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto" }}>
                This user doesn't have any sprint tasks yet.
              </Typography>
            </Card>
          </Fade>
        );
      }

      const sprintTaskCards: Array<{ id: string; title: string; description: string; status: Task["status"]; priority: Task["priority"]; assignee: string; projectName: string; workspaceName: string }> = [];

      projects.forEach((project) => {
        project.tasks.forEach((task) => {
          sprintTaskCards.push({
            id: `${project.id}_${task.id}`,
            title: task.title, description: task.description,
            status: task.status, priority: task.priority,
            assignee: task.assignee, projectName: project.name, workspaceName: "",
          });
        });
      });

      if (sprintTaskCards.length === 0 && workspaces.length > 0) {
        return renderWorkspaceList("Workspaces", "lucide:check-square", "No Sprint Tasks Found", "This user doesn't have any sprint tasks yet.");
      }

      return (
        <Grid container spacing={isMobile ? 1 : 2}>
          {sprintTaskCards.slice(0, isMobile ? 6 : 12).map((card, index) => (
            <Grid item xs={12} sm={6} lg={4} key={card.id}>
              <Slide in timeout={800 + index * 80} direction="up">
                <Card
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2, borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    bgcolor: isDark ? "#0B1220" : "#ffffff",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                    "&:hover": { transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-10px) scale(1.03)", boxShadow: `0 20px 56px ${alpha(PRIMARY_COLOR, 0.15)}`, borderColor: PRIMARY_COLOR },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{card.title}</Typography>
                    <Chip label={card.priority} size="small" sx={{ bgcolor: getPriorityColor(card.priority) + "20", color: getPriorityColor(card.priority), textTransform: "uppercase", ...tableStyles.chip }} />
                  </Box>
                  <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#94a3b8" : "#64748b", mb: 1 }}>{card.description}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip label={card.status} size="small" sx={{ bgcolor: getStatusColor(card.status) + "20", color: getStatusColor(card.status), ...tableStyles.chip }} />
                    <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#94a3b8" : "#64748b" }}>{card.assignee}</Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: isMobile ? 8 : 10, color: isDark ? "#64748b" : "#94a3b8" }}>{card.projectName}</Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      );
    };

    const renderBugs = () => {
      if (userProjectsLoading) return <ProjectsGridSkeleton isDark={isDark} isMobile={isMobile} />;

      if (userProjectsError) {
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
              <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load bugs</Typography>
              <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{userProjectsError}</Typography>
            </Box>
          </Box>
        );
      }

      if (projects.length === 0) {
        if (workspaces.length > 0) {
          return renderWorkspaceList("Workspaces", "lucide:bug", "No Projects Found", "This user doesn't have any projects with bugs yet. Check the workspaces below.");
        }

        return (
          <Fade in timeout={700}>
            <Card
              elevation={0}
              sx={{
                p: 6, textAlign: "center",
                border: "1px dashed",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
                borderRadius: 3,
                bgcolor: isDark ? "#0B1220" : "#ffffff",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon icon="lucide:bug" style={{ fontSize: 64, color: isDark ? "#4b5563" : "#94a3b8" }} />
              <Typography sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a", mt: 2, mb: 1 }}>No Projects Found</Typography>
              <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 400, mx: "auto" }}>
                This user doesn't have any projects with bugs yet.
              </Typography>
            </Card>
          </Fade>
        );
      }

      return (
        <Box>
          <Grid container spacing={isMobile ? 1 : 2}>
            {projects.flatMap((project, pIndex) =>
              project.bugs.slice(0, isMobile ? 4 : 8).map((bug, index) => (
                <Grid item xs={12} sm={6} lg={4} key={bug.id}>
                  <Slide in timeout={800 + pIndex * 100 + index * 80} direction="up">
                    <Card
                      elevation={0}
                      sx={{
                        p: isMobile ? 1.5 : 2, borderRadius: 3,
                        border: "1px solid",
                        borderColor: isDark ? "#1e293b" : "#e2e8f0",
                        bgcolor: isDark ? "#0B1220" : "#ffffff",
                        cursor: "pointer", position: "relative", overflow: "hidden",
                        "&:hover": { transform: isMobile ? "translateY(-6px) scale(1.02)" : "translateY(-10px) scale(1.03)", boxShadow: `0 20px 56px ${alpha("#ef4444", 0.15)}`, borderColor: "#ef4444" },
                      }}
                      onClick={() => handleBugCardClick(bug)}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography sx={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>{bug.title}</Typography>
                        <Chip label={bug.severity} size="small" sx={{ bgcolor: getPriorityColor(bug.severity) + "20", color: getPriorityColor(bug.severity), textTransform: "uppercase", ...tableStyles.chip }} />
                      </Box>
                      <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#94a3b8" : "#64748b", mb: 1 }}>{bug.description}</Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Chip label={bug.status} size="small" sx={{ bgcolor: getStatusColor(bug.status) + "20", color: getStatusColor(bug.status), ...tableStyles.chip }} />
                        <Typography sx={{ fontSize: isMobile ? 9 : 11, color: isDark ? "#94a3b8" : "#64748b" }}>{bug.assignee}</Typography>
                      </Box>
                    </Card>
                  </Slide>
                </Grid>
              ))
            )}
          </Grid>

          {workspaces.length > 0 && (
            <Box sx={{ mt: 4 }}>
              {renderWorkspaceList("Workspaces", "lucide:bug", "No Workspaces Found", "This user doesn't have any workspaces yet.")}
            </Box>
          )}
        </Box>
      );
    };

    const renderBoards = () => (
      <Box>
        <Typography
          sx={{
            color: isDark ? "#ffffff" : "#0f172a",
            fontSize: isMobile ? 16 : 18, fontWeight: 700, mb: 3, textAlign: "center",
          }}
        >
          {user.username}'s Board Tasks
        </Typography>
        {renderBoardView()}
      </Box>
    );

    return (
      <Box>
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 4, mb: 4, borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              bgcolor: isDark ? "#0B1220" : "#ffffff",
              position: "relative", overflow: "hidden",
            }}
          >
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "center" : "center"} justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction={isMobile ? "column" : "row"} alignItems="center" spacing={isMobile ? 2 : 3}>
                <Zoom in timeout={800}>
                  <Avatar sx={{ width: isMobile ? 56 : 72, height: isMobile ? 56 : 72, bgcolor: user.avatar, fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Zoom>
                <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                  <Typography sx={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>{user.username}</Typography>
                  <Typography sx={{ fontSize: isMobile ? 12 : 14, color: isDark ? "#94a3b8" : "#64748b" }}>{user.email}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <Chip label={user.organization} sx={{ bgcolor: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#ffffff" : "#0f172a", ...tableStyles.chip }} />
                    <Chip icon={<Icon icon={getRoleIcon(user.role)} style={{ fontSize: isMobile ? 12 : 14 }} />} label={user.role} sx={{ bgcolor: getRoleColor(user.role) + "20", color: getRoleColor(user.role), ...tableStyles.chip, "& .MuiChip-icon": { color: getRoleColor(user.role) } }} />
                    {user.isProductOwner && <Chip label="Product Owner" sx={{ bgcolor: "#22c55e20", color: "#22c55e", ...tableStyles.chip }} />}
                  </Stack>
                </Box>
              </Stack>
              <Stack direction={isMobile ? "row" : "row"} spacing={isMobile ? 1 : 2} flexWrap="wrap" justifyContent="center">
                {[
                  { label: "Projects", value: user.projectcount ?? projects.length, icon: "lucide:folder", color: PRIMARY_COLOR },
                  { label: "SprntTasks", value: user.projecttaskcount ?? totalTasks, icon: "lucide:check-square", color: "#22c55e" },
                  { label: "Sprints", value: user.sprintcount ?? 0, icon: "lucide:git-branch", color: "#8b5cf6" },
                  { label: "Workspaces", value: user.projectworkspacecount ?? 0, icon: "lucide:layout-dashboard", color: "#f59e0b" },
                ].map((stat, idx) => (
                  <Zoom key={stat.label} in timeout={700 + idx * 100}>
                    <Card sx={{ p: isMobile ? 1 : 2, borderRadius: 2, border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", bgcolor: isDark ? "#0B1220" : "#ffffff", textAlign: "center", minWidth: isMobile ? 50 : 80, "&:hover": { transform: "scale(1.15) translateY(-6px)", boxShadow: `0 12px 40px ${alpha(stat.color, 0.25)}`, borderColor: stat.color } }}>
                      <Typography sx={{ fontSize: isMobile ? 14 : 22, fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                      <Typography sx={{ fontSize: isMobile ? 8 : 11, color: isDark ? "#94a3b8" : "#64748b" }}>{stat.label}</Typography>
                    </Card>
                  </Zoom>
                ))}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Refresh All Data">
                  <IconButton
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{
                      color: PRIMARY_COLOR,
                      bgcolor: alpha(PRIMARY_COLOR, 0.08),
                      "&:hover": { bgcolor: alpha(PRIMARY_COLOR, 0.15), transform: "rotate(180deg)" },
                      transition: "all 0.4s ease",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        animation: refreshing ? "spin 1s linear infinite" : "none",
                        "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
                      }}
                    >
                      <Icon icon="lucide:refresh-cw" style={{ fontSize: 20 }} />
                    </Box>
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  onClick={handleBackToUsers}
                  startIcon={<Icon icon="lucide:arrow-left" style={{ fontSize: isMobile ? 14 : 18 }} />}
                  sx={{
                    borderRadius: 2, textTransform: "none",
                    fontSize: isMobile ? 12 : 14, fontWeight: 600,
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": { transform: "scale(1.08) translateX(-6px)", bgcolor: PRIMARY_DARK, boxShadow: `0 12px 40px ${alpha(PRIMARY_COLOR, 0.4)}` },
                  }}
                >
                  Back to All Users
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={isMobile ? 0.5 : 1} sx={{ flexWrap: "wrap", gap: isMobile ? 0.5 : 1 }}>
            {(["projects", "sprints", "tasks", "bugs", "boards"] as ViewType[]).map((item, idx) => (
              <Grow key={item} in timeout={1200 + idx * 100}>
                <Chip
                  label={item === "tasks" ? "Sprint tasks" : item.charAt(0).toUpperCase() + item.slice(1)}
                  onClick={() => {
                    setView(item);
                    setSelectedTaskCard(null);
                    setSelectedBugCard(null);
                    setSelectedBoard(null);
                    setSelectedTask(null);
                    if (item !== "boards") setBoardData([]);
                  }}
                  icon={
                    <Icon
                      icon={`lucide:${
                        item === "projects" ? "folder"
                        : item === "sprints" ? "git-branch"
                        : item === "tasks" ? "check-square"
                        : item === "bugs" ? "bug"
                        : "layout-dashboard"
                      }`}
                      style={{ fontSize: isMobile ? 12 : 16 }}
                    />
                  }
                  sx={{
                    px: isMobile ? 1 : 1.5, py: isMobile ? 1 : 1.5,
                    borderRadius: 2, fontSize: isMobile ? 9 : 13, fontWeight: 600,
                    bgcolor: view === item ? PRIMARY_COLOR : isDark ? "#0B1220" : "#ffffff",
                    color: view === item ? "#ffffff" : isDark ? "#94a3b8" : "#64748b",
                    border: "1px solid",
                    borderColor: view === item ? PRIMARY_COLOR : isDark ? "#1e293b" : "#e2e8f0",
                    "&:hover": { transform: view === item ? "scale(1.08)" : "scale(1.12) translateY(-4px)", boxShadow: view === item ? `0 8px 32px ${alpha(PRIMARY_COLOR, 0.4)}` : `0 4px 24px ${alpha(PRIMARY_COLOR, 0.12)}` },
                    "& .MuiChip-icon": { color: view === item ? "#ffffff" : "inherit" },
                  }}
                />
              </Grow>
            ))}
          </Stack>
        </Box>

        <Box>
          {selectedTaskCard ? (
            renderTaskDetailView()
          ) : selectedBugCard ? (
            renderBugDetailView()
          ) : selectedBoard ? (
            renderBoardDetailView()
          ) : selectedWorkspace ? (
            view === "bugs" ? renderBugGroupView() : renderWorkspaceDetail()
          ) : selectedProject ? (
            renderProjectDetail()
          ) : selectedSprint ? (
            renderSprintDetail()
          ) : (
            <>
              {userProjectsLoading ? (
                <ProjectsGridSkeleton isDark={isDark} isMobile={isMobile} />
              ) : userProjectsError ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
                    <Typography sx={{ color: "#ef4444", mt: 2 }}>Failed to load projects</Typography>
                    <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>{userProjectsError}</Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  {view === "projects" && renderProjects()}
                  {view === "sprints" && renderSprints()}
                  {view === "tasks" && renderTasks()}
                  {view === "bugs" && renderBugs()}
                  {view === "boards" && renderBoards()}
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  };

 

  if (loading) {
    return (
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ minHeight: "100vh", bgcolor: isDark ? "#0B1220" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 3 }}>
          <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>Loading users...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ minHeight: "100vh", bgcolor: isDark ? "#0B1220" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Icon icon="lucide:alert-circle" style={{ fontSize: 48, color: "#ef4444", display: "block" }} />
            <Typography sx={{ color: "#ef4444", fontSize: 18, fontWeight: 600, mt: 2 }}>Failed to load users</Typography>
            <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", textAlign: "center" }}>{error}</Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ bgcolor: PRIMARY_COLOR, "&:hover": { bgcolor: PRIMARY_DARK }, mt: 2 }}>
              Retry
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: isDark ? "#0B1220" : "#f8fafc",
          p: isMobile ? 1 : 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!selectedUser ? (
          <>
            <Grow in timeout={600}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  mb: 3, p: isMobile ? 2 : 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                  bgcolor: isDark ? "#0B1220" : "#ffffff",
                  position: "relative", overflow: "hidden",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Zoom in timeout={800}>
                    <Box sx={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 2, bgcolor: PRIMARY_COLOR, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon icon="lucide:users" style={{ fontSize: isMobile ? 18 : 24, color: "#fff" }} />
                    </Box>
                  </Zoom>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: isMobile ? 14 : 18, fontWeight: 700,
                        color: isDark ? "#ffffff" : "#0f172a",
                        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.6)}, ${PRIMARY_COLOR})`,
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Team Dashboard
                    </Typography>
                    <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: isMobile ? 11 : 13 }}>
                      {users.length} team members • Click on any user to view details
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: isMobile ? 1 : 0 }}>
                  <Chip
                    label={`${users.length} Users`}
                    sx={{
                      bgcolor: isDark ? "#1e293b" : "#f1f5f9",
                      color: isDark ? "#ffffff" : "#0f172a",
                      fontWeight: 600,
                    }}
                  />
                  <Tooltip title="Refresh All Data">
                    <IconButton
                      onClick={handleRefresh}
                      disabled={refreshing}
                      sx={{
                        color: PRIMARY_COLOR,
                        bgcolor: alpha(PRIMARY_COLOR, 0.08),
                        "&:hover": { bgcolor: alpha(PRIMARY_COLOR, 0.15), transform: "rotate(180deg)" },
                        transition: "all 0.4s ease",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          animation: refreshing ? "spin 1s linear infinite" : "none",
                          "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
                        }}
                      >
                        <Icon icon="lucide:refresh-cw" style={{ fontSize: 20 }} />
                      </Box>
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Grow>

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
                      bgcolor: isDark ? "#0B1220" : "#ffffff",
                      "& fieldset": { borderColor: isDark ? "#1e293b" : "#e2e8f0" },
                      "&:hover": { "& fieldset": { borderColor: isDark ? "#2a3a5c" : "#94a3b8" } },
                      "&.Mui-focused": {
                        boxShadow: `0 12px 40px ${alpha(PRIMARY_COLOR, 0.15)}`,
                        "& fieldset": { borderColor: PRIMARY_COLOR },
                      },
                    },
                    "& .MuiInputBase-input": { color: isDark ? "#ffffff" : "#0f172a", fontSize: isMobile ? 13 : 16 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="lucide:search" style={{ fontSize: isMobile ? 14 : 17, color: isDark ? "#64748b" : "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Fade>

            <Box>
              <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a", fontSize: isMobile ? 14 : 16, fontWeight: 600, mb: 2 }}>
                All Team Members
              </Typography>
              {filteredUsers.length === 0 ? (
                <Zoom in timeout={600}>
                  <Card sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 3, bgcolor: isDark ? "#0B1220" : "#ffffff" }}>
                    <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>No users found matching your search.</Typography>
                  </Card>
                </Zoom>
              ) : (
                renderUserTable()
              )}
            </Box>
          </>
        ) : (
          renderUserDetail()
        )}
      </Box>

      <Dialog
        open={attachmentDialogOpen}
        onClose={handleAttachmentDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, bgcolor: isDark ? "#0B1220" : "#ffffff", border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}` },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`, pb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
            <Icon icon="lucide:file" style={{ fontSize: 20, verticalAlign: "middle", marginRight: 8 }} />
            {selectedAttachment?.title || "Attachment"}
          </Typography>
          <IconButton onClick={handleAttachmentDialogClose} sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
            <Icon icon="lucide:x" style={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, minHeight: 200 }}>
          {selectedAttachment?.url && selectedAttachment.url.trim() !== "" ? (
            <Box sx={{ textAlign: "center" }}>
              {isImageUrl(selectedAttachment.url) ? (
                <Box component="img" src={selectedAttachment.url} alt={selectedAttachment.title} sx={{ maxWidth: "100%", maxHeight: 500, borderRadius: 2, border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}` }} />
              ) : isAbsoluteUrl(selectedAttachment.url) ? (
                <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <Icon icon="lucide:file-text" style={{ fontSize: 66, color: PRIMARY_COLOR, opacity: 0.7 }} />
                  <Typography sx={{ mt: 2, color: isDark ? "#94a3b8" : "#64748b", mb: 2 }}>File attachment available</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" component="a" href={selectedAttachment.url} download target="_blank" rel="noopener noreferrer" startIcon={<Icon icon="lucide:download" style={{ fontSize: 18 }} />} sx={{ bgcolor: PRIMARY_COLOR, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: PRIMARY_DARK, transform: "scale(1.05)" } }}>
                      Download File
                    </Button>
                    <Button variant="outlined" component="a" href={selectedAttachment.url} target="_blank" rel="noopener noreferrer" startIcon={<Icon icon="lucide:external-link" style={{ fontSize: 18 }} />} sx={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR, textTransform: "none", fontWeight: 600, "&:hover": { borderColor: PRIMARY_DARK, backgroundColor: alpha(PRIMARY_COLOR, 0.08), transform: "scale(1.05)" } }}>
                      Open in New Tab
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <Icon icon="lucide:link" style={{ fontSize: 66, color: PRIMARY_COLOR, opacity: 0.7 }} />
                  <Typography sx={{ mt: 2, color: isDark ? "#94a3b8" : "#64748b", mb: 2 }}>External link</Typography>
                  <Button variant="contained" component="a" href={selectedAttachment.url} target="_blank" rel="noopener noreferrer" startIcon={<Icon icon="lucide:external-link" style={{ fontSize: 18 }} />} sx={{ bgcolor: PRIMARY_COLOR, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: PRIMARY_DARK, transform: "scale(1.05)" } }}>
                    Open Link
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Icon icon="lucide:file-x" style={{ fontSize: 64, color: isDark ? "#64748b" : "#94a3b8" }} />
              <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", mt: 2, mb: 1 }}>No attachment available</Typography>
              <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13 }}>There is no file or link attached to this task.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`, p: 2 }}>
          <Button onClick={handleAttachmentDialogClose} sx={{ color: isDark ? "#94a3b8" : "#64748b", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: alpha(PRIMARY_COLOR, 0.08) } }}>
            Close
          </Button>
          {selectedAttachment?.url && selectedAttachment.url.trim() !== "" && (
            <Button variant="contained" component="a" href={selectedAttachment.url} target="_blank" rel="noopener noreferrer" startIcon={<Icon icon="lucide:external-link" style={{ fontSize: 16 }} />} sx={{ bgcolor: PRIMARY_COLOR, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: PRIMARY_DARK, transform: "scale(1.05)" } }}>
              Open in New Tab
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}