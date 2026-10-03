import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskView from "../Task/TaskView";
import TaskBoard from "../Task/Taskboard";
import {
  Button,
  Grid,
  Box,
  Container,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { API_BASE_URL } from "../../config/api";

const Projects = () => {
  const [showCreateProject, setShowCreateProject] = useState(true);
  const [activeComponent, setActiveComponent] = useState("project");

  const [storedProjects, setStoredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filteredProjects, setFilteredProjects] = useState([]);

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
  };

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
      applyFilters(storedProjects, searchTerm, newStatus);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectToDelete) => {
    const projName = projectToDelete.projectName || projectToDelete.project_name || "Project";
    const projIdentifier = projectToDelete.id || projName;

    if (!window.confirm(`Are you sure you want to delete "${projName}"?`)) {
      return;
    }

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

    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Compute KPI summary metrics
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

  const handleTaskViewClick = () => {
    setShowCreateProject(false);
    setActiveComponent("taskView");
  };

  const handleProjectButtonClick = () => {
    setShowCreateProject(true);
    setActiveComponent("project");
  };

  const handleTaskboard = () => {
    setShowCreateProject(false);
    setActiveComponent("taskBoard");
  };

  return (
    <Grid container>
      {/* Navbar */}
      <Grid item xs={12}>
        <Navbar />
      </Grid>

      {/* TopBar */}
      <Grid item xs={12}>
        <TopBar />
      </Grid>

      <Grid container>
        {/* Sidebar */}
        <Grid item xs={12} sm={3} md={2} sx={{ display: "flex" }}>
          <Sidebar />
        </Grid>

        {/* Main Content */}
        <Grid
          item
          xs={12}
          sm={9}
          md={10}
          sx={{
            padding: 3,
            minHeight: "100vh",
            backgroundColor: "#f9fafb",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ paddingY: 1 }}>
              {/* Navigation Header Tabs */}
              <Grid container spacing={2} justifyContent="flex-start" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleProjectButtonClick}
                    sx={{
                      backgroundColor: showCreateProject && activeComponent === "project" ? "#004E69" : "white",
                      color: showCreateProject && activeComponent === "project" ? "white" : "black",
                      fontWeight: "bold",
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      "&:hover": { backgroundColor: "#004E69", color: "white" }
                    }}
                  >
                    Projects Dashboard
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: activeComponent === "taskView" ? "#004E69" : "white",
                      color: activeComponent === "taskView" ? "white" : "black",
                      fontWeight: "bold",
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      "&:hover": { backgroundColor: "#004E69", color: "white" }
                    }}
                    onClick={handleTaskViewClick}
                  >
                    Task View
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: activeComponent === "taskBoard" ? "#004E69" : "white",
                      color: activeComponent === "taskBoard" ? "white" : "black",
                      fontWeight: "bold",
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      "&:hover": { backgroundColor: "#004E69", color: "white" }
                    }}
                    onClick={handleTaskboard}
                  >
                    Task Board
                  </Button>
                </Grid>
              </Grid>

              {/* Project Dashboard Section */}
              {showCreateProject && activeComponent === "project" && (
                <>
                  {/* Top Bar with Title & Create Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="#1e293b">
                        Project Management Dashboard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Track active project durations, upcoming deliveries, milestones & budgets
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      to="/addproject"
                      variant="contained"
                      startIcon={<span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>}
                      sx={{
                        backgroundColor: "#FF902F",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#e07d24" },
                        color: "white",
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 3,
                        height: "44px"
                      }}
                    >
                      + Create New Project
                    </Button>
                  </Box>

                  {/* KPI Summary Cards */}
                  <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    {/* Total */}
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "none", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight="600">TOTAL PROJECTS</Typography>
                            <Typography variant="h4" fontWeight="bold" color="#004E69">{totalCount}</Typography>
                          </Box>
                          <AssignmentIcon sx={{ color: "#004E69", fontSize: "36px", opacity: 0.8 }} />
                        </Box>
                      </Card>
                    </Grid>

                    {/* Ongoing */}
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card sx={{ borderRadius: "12px", border: "1px solid #BAE6FD", bgcolor: "#F0F9FF", boxShadow: "none", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="#0369A1" fontWeight="700">ONGOING / ACTIVE</Typography>
                            <Typography variant="h4" fontWeight="bold" color="#0284C7">{ongoingCount}</Typography>
                          </Box>
                          <PlayCircleOutlineIcon sx={{ color: "#0284C7", fontSize: "36px" }} />
                        </Box>
                      </Card>
                    </Grid>

                    {/* Upcoming */}
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card sx={{ borderRadius: "12px", border: "1px solid #FED7AA", bgcolor: "#FFF7ED", boxShadow: "none", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="#C2410C" fontWeight="700">UPCOMING PIPELINE</Typography>
                            <Typography variant="h4" fontWeight="bold" color="#EA580C">{upcomingCount}</Typography>
                          </Box>
                          <EventNoteIcon sx={{ color: "#EA580C", fontSize: "36px" }} />
                        </Box>
                      </Card>
                    </Grid>

                    {/* Completed */}
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card sx={{ borderRadius: "12px", border: "1px solid #BBF7D0", bgcolor: "#F0FDF4", boxShadow: "none", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="#15803D" fontWeight="700">COMPLETED</Typography>
                            <Typography variant="h4" fontWeight="bold" color="#16A34A">{completedCount}</Typography>
                          </Box>
                          <CheckCircleOutlineIcon sx={{ color: "#16A34A", fontSize: "36px" }} />
                        </Box>
                      </Card>
                    </Grid>

                    {/* On Hold */}
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card sx={{ borderRadius: "12px", border: "1px solid #FEF08A", bgcolor: "#FEFCE8", boxShadow: "none", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="#A16207" fontWeight="700">ON HOLD / REVIEW</Typography>
                            <Typography variant="h4" fontWeight="bold" color="#CA8A04">{onHoldCount}</Typography>
                          </Box>
                          <PauseCircleOutlineIcon sx={{ color: "#CA8A04", fontSize: "36px" }} />
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Filter Tabs & Search Bar */}
                  <Card sx={{ mb: 3.5, borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "none" }}>
                    <CardContent sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={7}>
                          <Tabs
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "14px", minWidth: "100px" },
                              "& .Mui-selected": { color: "#004E69" },
                              "& .MuiTabs-indicator": { backgroundColor: "#004E69", height: 3 }
                            }}
                          >
                            <Tab label={`All (${totalCount})`} value="ALL" />
                            <Tab label={`Ongoing (${ongoingCount})`} value="ONGOING" />
                            <Tab label={`Upcoming (${upcomingCount})`} value="UPCOMING" />
                            <Tab label={`Completed (${completedCount})`} value="COMPLETED" />
                            <Tab label={`On Hold (${onHoldCount})`} value="ON_HOLD" />
                          </Tabs>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <TextField
                            placeholder="Search by Project, Code, Client or Lead..."
                            fullWidth
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{
                              bgcolor: "#fff",
                              "& .MuiOutlinedInput-root": { borderRadius: "8px" }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Projects List Grid */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: "700", mb: 2.5, color: "#1e293b" }}>
                      Projects Catalog ({filteredProjects.length})
                    </Typography>

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
                          const desc = project.jobDescription || project.job_description || "Data Not Available";

                          // Color based on status
                          let statusBg = "#E0F2FE";
                          let statusColor = "#0369A1";
                          if (status.toLowerCase() === "ongoing" || status.toLowerCase() === "active") {
                            statusBg = "#E0F2FE";
                            statusColor = "#0284C7";
                          } else if (status.toLowerCase() === "upcoming") {
                            statusBg = "#FFF7ED";
                            statusColor = "#EA580C";
                          } else if (status.toLowerCase() === "completed") {
                            statusBg = "#DCFCE7";
                            statusColor = "#15803D";
                          } else if (status.toLowerCase() === "on hold") {
                            statusBg = "#FEF9C3";
                            statusColor = "#A16207";
                          }

                          return (
                            <Grid item xs={12} md={6} lg={4} key={project.id || idx}>
                              <Card
                                elevation={0}
                                sx={{
                                  borderRadius: "14px",
                                  border: "1px solid #E2E8F0",
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "100%",
                                  backgroundColor: "#ffffff",
                                  transition: "transform 0.2s, box-shadow 0.2s",
                                  "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                                    borderColor: "#CBD5E1"
                                  },
                                }}
                              >
                                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                  {/* Header: Project Name & Code */}
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                    <Box>
                                      <Chip
                                        label={pCode}
                                        size="small"
                                        sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 700, fontSize: "11px", mb: 0.5 }}
                                      />
                                      <Typography variant="h6" fontWeight="700" sx={{ color: "#004E69", lineHeight: 1.3 }}>
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
                                        borderRadius: "6px"
                                      }}
                                    />
                                  </Box>

                                  <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 1.5 }}>
                                    {category} • Client: <strong>{client}</strong>
                                    {clientEmail && ` (${clientEmail})`}
                                  </Typography>

                                  {/* Progress Bar */}
                                  <Box sx={{ mb: 2, p: 1.5, bgcolor: "#F8FAFC", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                      <Typography variant="caption" fontWeight="600" color="#475569">Progress & Completion</Typography>
                                      <Typography variant="caption" fontWeight="700" color="#004E69">{progress}%</Typography>
                                    </Box>
                                    <LinearProgress
                                      variant="determinate"
                                      value={progress}
                                      sx={{
                                        height: 7,
                                        borderRadius: 4,
                                        bgcolor: "#E2E8F0",
                                        "& .MuiLinearProgress-bar": {
                                          bgcolor: progress === 100 ? "#16A34A" : progress > 50 ? "#0284C7" : "#FF902F",
                                          borderRadius: 4
                                        }
                                      }}
                                    />
                                  </Box>

                                  <Divider sx={{ mb: 2 }} />

                                  {/* Project Metadata Grid */}
                                  <Grid container spacing={1.5} sx={{ fontSize: "0.85rem" }}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary" display="block">Timeline Duration</Typography>
                                      <Typography variant="body2" fontWeight="600" color="#1e293b">
                                        {duration !== "Data Not Available" ? duration : `${sDate} → ${eDate}`}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary" display="block">Priority & Budget</Typography>
                                      <Typography variant="body2" fontWeight="600" color="#1e293b">
                                        {priority} • {budget !== "Data Not Available" ? budget : rate}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary" display="block">Project Lead</Typography>
                                      <Typography variant="body2" fontWeight="600" color="#004E69">{lead}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary" display="block">Team Members</Typography>
                                      <Tooltip title={members} arrow>
                                        <Typography variant="body2" fontWeight="500" color="#334155" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {members}
                                        </Typography>
                                      </Tooltip>
                                    </Grid>
                                    {desc !== "Data Not Available" && (
                                      <Grid item xs={12} sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">Scope & Deliverables</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxHeight: "40px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                          {desc}
                                        </Typography>
                                      </Grid>
                                    )}
                                  </Grid>
                                </CardContent>

                                <Divider />

                                <CardActions sx={{ justifyContent: "space-between", px: 2.5, py: 1.5, backgroundColor: "#FAFAFA" }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Target: <strong>{eDate}</strong>
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteProject(project)}
                                    sx={{
                                      textTransform: "none",
                                      fontWeight: "700",
                                      borderRadius: "6px",
                                      px: 1.5,
                                      py: 0.5
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Box sx={{ p: 6, textAlign: "center", backgroundColor: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                        <Typography color="text.secondary" sx={{ mb: 2, fontSize: "15px" }}>
                          No projects found matching the filter criteria.
                        </Typography>
                        <Button
                          component={Link}
                          to="/addproject"
                          variant="contained"
                          sx={{ backgroundColor: "#004E69", '&:hover': { backgroundColor: "#003A4F" }, textTransform: "none" }}
                        >
                          + Create New Project
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>

            {/* TaskView Section */}
            {activeComponent === "taskView" && <TaskView />}
            {activeComponent === "taskBoard" && <TaskBoard />}
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Projects;
