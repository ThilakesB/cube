import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskView from "../Task/TaskView";
import TaskBoard from "../Task/Taskboard";
import {
  Button,
  Grid,
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  LinearProgress,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  InputAdornment,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Layout from "../Common_Bar/Layout";
import { API_BASE_URL } from "../../config/api";

const Projects = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("project");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  const [storedProjects, setStoredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Pagination for table view
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Sweet Delete Dialog Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async () => {
    const storedData = JSON.parse(localStorage.getItem("projectData")) || [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (response.ok) {
        const apiProjects = await response.json();
        const apiNames = new Set(
          apiProjects.map((p) => (p.projectName || p.project_name || "").toLowerCase())
        );
        const uniqueLocal = storedData.filter(
          (p) => !apiNames.has((p.projectName || p.project_name || "").toLowerCase())
        );
        const merged = [...apiProjects, ...uniqueLocal];
        setStoredProjects(merged);
        applyFilters(merged, searchTerm, statusFilter);
        return;
      }
    } catch (e) {
      console.warn("Could not fetch projects from backend:", e);
    }
    setStoredProjects(storedData);
    applyFilters(storedData, searchTerm, statusFilter);
  };

  const applyFilters = (projects, search, status) => {
    let result = [...projects];

    if (status !== "ALL") {
      result = result.filter((p) => {
        const pStatus = (p.status || "Ongoing").toLowerCase();
        if (status === "ONGOING") return pStatus === "ongoing" || pStatus === "active" || pStatus === "in progress";
        if (status === "UPCOMING") return pStatus === "upcoming" || pStatus === "planned" || pStatus === "pipeline";
        if (status === "COMPLETED") return pStatus === "completed" || pStatus === "done";
        if (status === "ON_HOLD") return pStatus === "on hold" || pStatus === "paused" || pStatus === "in review";
        return true;
      });
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((p) => {
        const name = (p.projectName || p.project_name || "").toLowerCase();
        const client = (p.client || "").toLowerCase();
        const lead = (p.projectLead || p.project_lead || "").toLowerCase();
        const code = (p.projectCode || p.project_code || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return name.includes(query) || client.includes(query) || lead.includes(query) || code.includes(query) || cat.includes(query);
      });
    }

    setFilteredProjects(result);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(storedProjects, term, statusFilter);
    setPage(0);
  };

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
      applyFilters(storedProjects, searchTerm, newStatus);
      setPage(0);
    }
  };

  const handleOpenDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    const projName = projectToDelete.projectName || projectToDelete.project_name || "Project";
    const projIdentifier = projectToDelete.id || projName;

    try {
      if (projIdentifier) {
        await fetch(`${API_BASE_URL}/api/projects/${encodeURIComponent(projIdentifier)}`, {
          method: "DELETE",
        });
      }
    } catch (e) {
      console.warn("Error deleting project from backend:", e);
    }

    const existing = JSON.parse(localStorage.getItem("projectData")) || [];
    const updated = existing.filter(
      (p) => (p.projectName || p.project_name || "") !== projName
    );
    localStorage.setItem("projectData", JSON.stringify(updated));

    setDeleteModalOpen(false);
    setProjectToDelete(null);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Compute 4 Dynamic KPI Summary Metrics
  const totalCount = storedProjects.length;
  const ongoingCount = storedProjects.filter((p) => {
    const s = (p.status || "Ongoing").toLowerCase();
    return s === "ongoing" || s === "active" || s === "in progress";
  }).length;
  const upcomingCount = storedProjects.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === "upcoming" || s === "planned" || s === "pipeline";
  }).length;
  const completedCount = storedProjects.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === "completed" || s === "done";
  }).length;
  const onHoldCount = storedProjects.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === "on hold" || s === "paused" || s === "in review";
  }).length;

  const kpiCards = [
    {
      title: "Total Projects",
      count: totalCount,
      icon: <AssignmentTurnedInRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Ongoing / Active",
      count: ongoingCount,
      icon: <PlayCircleFilledRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "ONGOING",
    },
    {
      title: "Upcoming Pipeline",
      count: upcomingCount,
      icon: <PendingActionsRoundedIcon sx={{ color: "#FFB300", fontSize: 28 }} />,
      bg: "#FFF8E1",
      border: "#FFE082",
      filterValue: "UPCOMING",
    },
    {
      title: "Completed Projects",
      count: completedCount,
      icon: <CheckCircleRoundedIcon sx={{ color: "#E91E63", fontSize: 28 }} />,
      bg: "#FCE4EC",
      border: "#F8BBD0",
      filterValue: "COMPLETED",
    },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 4 }}>
        {/* Navigation Tabs Header */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
          <Button
            variant={activeComponent === "project" ? "contained" : "outlined"}
            onClick={() => setActiveComponent("project")}
            sx={{
              backgroundColor: activeComponent === "project" ? "#7B61FF" : "white",
              color: activeComponent === "project" ? "white" : "#475569",
              fontWeight: 700,
              height: "40px",
              borderRadius: "10px",
              borderColor: activeComponent === "project" ? "#7B61FF" : "#E2E8F0",
              textTransform: "none",
              boxShadow: activeComponent === "project" ? "0 2px 6px rgba(123, 97, 255, 0.25)" : "none",
              "&:hover": {
                backgroundColor: activeComponent === "project" ? "#624BCC" : "#F8FAFC",
                borderColor: "#7B61FF",
              },
            }}
          >
            Projects Dashboard
          </Button>
          <Button
            variant={activeComponent === "taskView" ? "contained" : "outlined"}
            onClick={() => setActiveComponent("taskView")}
            sx={{
              backgroundColor: activeComponent === "taskView" ? "#7B61FF" : "white",
              color: activeComponent === "taskView" ? "white" : "#475569",
              fontWeight: 700,
              height: "40px",
              borderRadius: "10px",
              borderColor: activeComponent === "taskView" ? "#7B61FF" : "#E2E8F0",
              textTransform: "none",
              "&:hover": {
                backgroundColor: activeComponent === "taskView" ? "#624BCC" : "#F8FAFC",
              },
            }}
          >
            Task View
          </Button>
          <Button
            variant={activeComponent === "taskBoard" ? "contained" : "outlined"}
            onClick={() => setActiveComponent("taskBoard")}
            sx={{
              backgroundColor: activeComponent === "taskBoard" ? "#7B61FF" : "white",
              color: activeComponent === "taskBoard" ? "white" : "#475569",
              fontWeight: 700,
              height: "40px",
              borderRadius: "10px",
              borderColor: activeComponent === "taskBoard" ? "#7B61FF" : "#E2E8F0",
              textTransform: "none",
              "&:hover": {
                backgroundColor: activeComponent === "taskBoard" ? "#624BCC" : "#F8FAFC",
              },
            }}
          >
            Task Board
          </Button>
        </Box>

        {/* Project Dashboard Main View */}
        {activeComponent === "project" && (
          <>
            {/* Page Header (Employee Section Styling) */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#0F172A" }}>
                  <FolderSpecialRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} /> Project Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
                  Track active projects, deadlines, team allocations, milestones and deliverables.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                {/* Cards / Table View Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "#FFFFFF",
                    p: 0.5,
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<ViewModuleRoundedIcon fontSize="small" />}
                    onClick={() => setViewMode("cards")}
                    sx={{
                      bgcolor: viewMode === "cards" ? "#7B61FF" : "transparent",
                      color: viewMode === "cards" ? "#FFFFFF" : "#64748B",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      "&:hover": {
                        bgcolor: viewMode === "cards" ? "#624BCC" : "#F1F5F9",
                      },
                    }}
                  >
                    Cards
                  </Button>
                  <Button
                    size="small"
                    startIcon={<TableRowsRoundedIcon fontSize="small" />}
                    onClick={() => setViewMode("table")}
                    sx={{
                      bgcolor: viewMode === "table" ? "#7B61FF" : "transparent",
                      color: viewMode === "table" ? "#FFFFFF" : "#64748B",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      "&:hover": {
                        bgcolor: viewMode === "table" ? "#624BCC" : "#F1F5F9",
                      },
                    }}
                  >
                    Table
                  </Button>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<FileDownloadOutlinedIcon />}
                  sx={{
                    textTransform: "none",
                    borderColor: "#e0e0e0",
                    color: "black",
                    borderRadius: "10px",
                    fontWeight: 600,
                    height: "40px",
                  }}
                >
                  Export
                </Button>

                <Button
                  component={Link}
                  to="/addproject"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#7B61FF",
                    borderRadius: "10px",
                    fontWeight: 600,
                    height: "40px",
                    px: 2.5,
                    boxShadow: "0 2px 6px rgba(123, 97, 255, 0.25)",
                    "&:hover": { backgroundColor: "#624BCC" },
                  }}
                >
                  Add New Project
                </Button>
              </Box>
            </Box>

            {/* 4 KPI Dashboard Cards (Exact Employee Theme Pattern) */}
            <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
              {kpiCards.map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card
                    onClick={() => {
                      setStatusFilter(stat.filterValue);
                      applyFilters(storedProjects, searchTerm, stat.filterValue);
                    }}
                    sx={{
                      p: 2.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: "16px",
                      border: `1px solid ${statusFilter === stat.filterValue ? stat.border : "#e0e0e0"}`,
                      backgroundColor: "#FFFFFF",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 20px -4px rgba(0, 0, 0, 0.08)",
                        borderColor: "#7B61FF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        backgroundColor: stat.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "gray", fontSize: "12px", letterSpacing: "0.02em" }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: "800", color: "#0F172A", mt: 0.2, lineHeight: 1.1 }}>
                        {stat.count}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Search and Status Filter Bar (Employee Section Style) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                p: 2,
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <TextField
                size="small"
                placeholder="Search by Project, Code, Client or Lead..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#7B61FF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", md: "380px" },
                  "& fieldset": { border: "none" },
                  backgroundColor: "#F8F9FD",
                  borderRadius: "10px",
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "gray", fontWeight: 600, mr: 1 }}>
                  Status:
                </Typography>
                {[
                  { label: `All (${totalCount})`, val: "ALL" },
                  { label: `Ongoing (${ongoingCount})`, val: "ONGOING" },
                  { label: `Upcoming (${upcomingCount})`, val: "UPCOMING" },
                  { label: `Completed (${completedCount})`, val: "COMPLETED" },
                  { label: `On Hold (${onHoldCount})`, val: "ON_HOLD" },
                ].map((tab) => (
                  <Chip
                    key={tab.val}
                    label={tab.label}
                    onClick={() => {
                      setStatusFilter(tab.val);
                      applyFilters(storedProjects, searchTerm, tab.val);
                    }}
                    sx={{
                      fontWeight: 600,
                      fontSize: "12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      bgcolor: statusFilter === tab.val ? "#7B61FF" : "#F8F9FD",
                      color: statusFilter === tab.val ? "#FFFFFF" : "#475569",
                      "&:hover": {
                        bgcolor: statusFilter === tab.val ? "#624BCC" : "#EDE9FE",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* VIEW MODE: CARDS VIEW */}
            {viewMode === "cards" && (
              <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "17px" }}>
                    Projects Catalog ({filteredProjects.length})
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Showing live projects matching selected filters
                  </Typography>
                </Box>

                {filteredProjects.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredProjects.map((project, idx) => {
                      const pName = project.projectName || project.project_name || "Untitled Project";
                      const pCode = project.projectCode || project.project_code || `PRJ-${project.id || idx + 1}`;
                      const client = project.client || "Data Not Available";
                      const clientEmail = project.clientEmail || project.client_email;
                      const category = project.category || "Software Development";
                      const sDate = project.startDate || project.start_date || "Data Not Available";
                      const eDate = project.endDate || project.end_date || "Data Not Available";
                      const duration = project.duration || "Data Not Available";
                      const budget = project.budget || "Data Not Available";
                      const priority = project.priority || "Medium";
                      const lead = project.projectLead || project.project_lead || "Data Not Available";
                      const members = project.teamMembers || project.team_members || "Data Not Available";
                      const rate = project.rate || "Data Not Available";
                      const status = project.status || "Ongoing";
                      const progress = project.progress !== undefined ? project.progress : 0;
                      const desc = project.jobDescription || project.job_description;

                      // Status chip colors matching Employee theme
                      let statusBg = "#E8F5E9";
                      let statusColor = "#2E7D32";
                      if (status.toLowerCase() === "ongoing" || status.toLowerCase() === "active") {
                        statusBg = "#E0F2FE";
                        statusColor = "#0284C7";
                      } else if (status.toLowerCase() === "upcoming") {
                        statusBg = "#FFF8E1";
                        statusColor = "#F57F17";
                      } else if (status.toLowerCase() === "completed") {
                        statusBg = "#E8F5E9";
                        statusColor = "#2E7D32";
                      } else if (status.toLowerCase() === "on hold") {
                        statusBg = "#FCE4EC";
                        statusColor = "#C2185B";
                      }

                      return (
                        <Grid item xs={12} md={6} lg={4} key={project.id || idx}>
                          <Card
                            sx={{
                              borderRadius: "16px",
                              border: "1px solid #e0e0e0",
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              backgroundColor: "#ffffff",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.08)",
                                borderColor: "#7B61FF",
                              },
                            }}
                          >
                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                              {/* Header: Project Name & Code */}
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                                <Box>
                                  <Chip
                                    label={pCode}
                                    size="small"
                                    sx={{ bgcolor: "#F4F0FF", color: "#7B61FF", fontWeight: 700, fontSize: "11px", mb: 0.8, borderRadius: "6px" }}
                                  />
                                  <Typography variant="h6" fontWeight="700" sx={{ color: "#0F172A", lineHeight: 1.3, fontSize: "17px" }}>
                                    {pName}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={status}
                                  size="small"
                                  sx={{
                                    backgroundColor: statusBg,
                                    color: statusColor,
                                    fontWeight: "700",
                                    fontSize: "12px",
                                    borderRadius: "8px",
                                  }}
                                />
                              </Box>

                              <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                                {category} • Client: <strong style={{ color: "#334155" }}>{client}</strong>
                                {clientEmail && ` (${clientEmail})`}
                              </Typography>

                              {/* Progress Bar */}
                              <Box sx={{ mb: 2.5, p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", border: "1px solid #F1F5F9" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                                  <Typography variant="caption" fontWeight="600" color="#475569">Milestone Completion</Typography>
                                  <Typography variant="caption" fontWeight="800" color="#7B61FF">{progress}%</Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={progress}
                                  sx={{
                                    height: 7,
                                    borderRadius: 4,
                                    bgcolor: "#E2E8F0",
                                    "& .MuiLinearProgress-bar": {
                                      bgcolor: progress === 100 ? "#00C853" : progress > 50 ? "#7B61FF" : "#FFB300",
                                      borderRadius: 4,
                                    },
                                  }}
                                />
                              </Box>

                              <Divider sx={{ mb: 2, borderColor: "#F1F5F9" }} />

                              {/* Project Details Grid */}
                              <Grid container spacing={1.5}>
                                <Grid item xs={6}>
                                  <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                    <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#94A3B8" }} />
                                    <Typography variant="caption" color="text.secondary">Target Date</Typography>
                                  </Box>
                                  <Typography variant="body2" fontWeight="600" color="#1e293b" fontSize="13px">
                                    {eDate}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                    <AttachMoneyOutlinedIcon sx={{ fontSize: 13, color: "#94A3B8" }} />
                                    <Typography variant="caption" color="text.secondary">Budget / Rate</Typography>
                                  </Box>
                                  <Typography variant="body2" fontWeight="600" color="#1e293b" fontSize="13px">
                                    {budget !== "Data Not Available" ? budget : rate}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ mt: 0.5 }}>
                                  <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                    <PersonOutlineRoundedIcon sx={{ fontSize: 13, color: "#94A3B8" }} />
                                    <Typography variant="caption" color="text.secondary">Lead</Typography>
                                  </Box>
                                  <Typography variant="body2" fontWeight="600" color="#7B61FF" fontSize="13px">
                                    {lead}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ mt: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary" display="block">Priority</Typography>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      px: 1,
                                      py: 0.2,
                                      borderRadius: "6px",
                                      backgroundColor: priority === "High" ? "#FEE2E2" : "#F1F5F9",
                                      color: priority === "High" ? "#DC2626" : "#475569",
                                      fontSize: "11px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {priority}
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContent>

                            <Divider sx={{ borderColor: "#F1F5F9" }} />

                            <CardActions sx={{ justifyContent: "space-between", px: 2.5, py: 1.5, backgroundColor: "#FAFBFD" }}>
                              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
                                Team: <strong>{members}</strong>
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDelete(project)}
                                sx={{
                                  color: "#EF4444",
                                  bgcolor: "#FEE2E2",
                                  borderRadius: "8px",
                                  width: 32,
                                  height: 32,
                                  "&:hover": { bgcolor: "#FCA5A5", color: "#B91C1C" },
                                }}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Box sx={{ p: 6, textAlign: "center", backgroundColor: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                    <FolderSpecialRoundedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1.5 }} />
                    <Typography color="text.secondary" sx={{ mb: 2, fontSize: "15px", fontWeight: 500 }}>
                      No projects found matching the filter criteria.
                    </Typography>
                    <Button
                      component={Link}
                      to="/addproject"
                      variant="contained"
                      sx={{ backgroundColor: "#7B61FF", "&:hover": { backgroundColor: "#624BCC" }, textTransform: "none", borderRadius: "10px", fontWeight: 600 }}
                    >
                      + Create New Project
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* VIEW MODE: TABLE VIEW (Employee Table Style) */}
            {viewMode === "table" && (
              <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", boxShadow: "none", overflow: "hidden", mb: 4, bgcolor: "#FFFFFF" }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#F8F9FD" }}>
                    <TableRow>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>CODE</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PROJECT NAME</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>CLIENT</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>LEAD</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DEADLINE</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PROGRESS</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                      <TableCell align="center"><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ACTIONS</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, idx) => {
                      const pName = project.projectName || project.project_name || "Untitled Project";
                      const pCode = project.projectCode || project.project_code || `PRJ-${project.id || idx + 1}`;
                      const client = project.client || "—";
                      const lead = project.projectLead || project.project_lead || "—";
                      const eDate = project.endDate || project.end_date || "—";
                      const progress = project.progress !== undefined ? project.progress : 0;
                      const status = project.status || "Ongoing";

                      let statusBg = "#E8F5E9";
                      let statusColor = "#2E7D32";
                      if (status.toLowerCase() === "ongoing" || status.toLowerCase() === "active") {
                        statusBg = "#E0F2FE";
                        statusColor = "#0284C7";
                      } else if (status.toLowerCase() === "upcoming") {
                        statusBg = "#FFF8E1";
                        statusColor = "#F57F17";
                      } else if (status.toLowerCase() === "on hold") {
                        statusBg = "#FCE4EC";
                        statusColor = "#C2185B";
                      }

                      return (
                        <TableRow key={project.id || idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ fontWeight: 700, color: "#7B61FF", fontSize: "13px" }}>{pCode}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "14px" }}>{pName}</TableCell>
                          <TableCell sx={{ fontSize: "13px", color: "#334155" }}>{client}</TableCell>
                          <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{lead}</TableCell>
                          <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{eDate}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "#E2E8F0",
                                  "& .MuiLinearProgress-bar": { bgcolor: "#7B61FF" },
                                }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#7B61FF" }}>{progress}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.4, borderRadius: "12px", bgcolor: statusBg, color: statusColor, fontSize: "12px", fontWeight: "bold" }}>
                              {status}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDelete(project)}
                              sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", "&:hover": { bgcolor: "#FEE2E2" } }}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: "#F44336" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 8, 15]}
                  component="div"
                  count={filteredProjects.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                />
              </TableContainer>
            )}
          </>
        )}

        {/* TaskView Section */}
        {activeComponent === "taskView" && <TaskView />}
        {activeComponent === "taskBoard" && <TaskBoard />}
      </Box>

      {/* Sweet & Short Delete Confirmation Dialog (Matching Employee UX) */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            mx: 2,
          },
        }}
      >
        <Box sx={{ p: 3.5, position: "relative", width: "100%", boxSizing: "border-box" }}>
          <IconButton
            onClick={() => setDeleteModalOpen(false)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#9CA3AF",
              "&:hover": { color: "#374151", bgcolor: "#F3F4F6" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", pt: 0.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                color: "#EF4444",
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#111827", mb: 1 }}>
              Delete Project
            </Typography>

            <Typography sx={{ fontWeight: 400, fontSize: "14px", color: "#6B7280", lineHeight: 1.5, px: 1, mb: 3 }}>
              Are you sure you want to delete{" "}
              <Typography component="span" sx={{ fontWeight: 600, color: "#1F2937", fontSize: "14px" }}>
                "{projectToDelete?.projectName || projectToDelete?.project_name || "this project"}"
              </Typography>
              ? This action cannot be undone.
            </Typography>

            <Box sx={{ display: "flex", width: "100%", gap: 1.5, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteModalOpen(false)}
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  bgcolor: "#FFFFFF",
                  "&:hover": { bgcolor: "#F9FAFB", borderColor: "#D1D5DB" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDelete}
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  bgcolor: "#DC2626",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  boxShadow: "0 1px 3px 0 rgba(220, 38, 38, 0.35)",
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Layout>
  );
};

export default Projects;
