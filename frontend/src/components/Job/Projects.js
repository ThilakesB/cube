import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskView from "../Task/TaskView";
import TaskBoard from "../Task/Taskboard";
import {
  Button,
  Grid,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { API_BASE_URL } from "../../config/api";

const Projects = () => {
  const [showCreateProject, setShowCreateProject] = useState(true);
  const [activeComponent, setActiveComponent] = useState("project");
  const [openPopup, setOpenPopup] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    client: "",
    startDate: "",
    endDate: "",
    rate: "",
    priority: "",
    projectLead: "",
    teamMembers: "",
    jobDescription: "",
    files: null,
  });
  const [storedProjects, setStoredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Open/Close popup
  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({
      projectName: "",
      client: "",
      startDate: "",
      endDate: "",
      rate: "",
      priority: "",
      projectLead: "",
      teamMembers: "",
      jobDescription: "",
      files: null,
    });
    setSearchTerm("");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, files: e.target.files[0] });
  };

  // Save project details to backend and localStorage
  const handleSave = async () => {
    if (!formData.projectName || !formData.client) {
      alert("Project Name and Client are required.");
      return;
    }

    if (formData.files && formData.files.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (e) {
      console.warn("Failed to save project to backend:", e);
    }

    const existingProjects = JSON.parse(localStorage.getItem("projectData")) || [];
    const updatedProjects = [...existingProjects, formData];
    localStorage.setItem("projectData", JSON.stringify(updatedProjects));

    fetchProjects();
    handleClosePopup();
  };

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
        setFilteredProjects(merged);
        return;
      }
    } catch (e) {
      console.warn("Could not fetch projects from backend:", e);
    }
    setStoredProjects(storedData);
    setFilteredProjects(storedData);
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
        const response = await fetch(`${API_BASE_URL}/api/projects/${encodeURIComponent(projIdentifier)}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          console.warn("Backend delete response not ok, cleaning local state");
        }
      }
    } catch (e) {
      console.warn("Error deleting project from backend:", e);
    }

    // Remove from localStorage
    const existing = JSON.parse(localStorage.getItem("projectData")) || [];
    const updated = existing.filter(
      (p) => (p.projectName || p.project_name || "") !== projName
    );
    localStorage.setItem("projectData", JSON.stringify(updated));

    fetchProjects();
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search term
  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredProjects(storedProjects);
    } else {
      const filtered = storedProjects.filter((project) =>
        (project.projectName || project.project_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

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
        <Grid
          item
          xs={12}
          sm={3}
          md={2}
          sx={{
            display: "flex",
          }}
        >
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
          <Container maxWidth="lg">
            <Box sx={{ paddingY: 2 }}>
              {/* Navigation Buttons */}
              <Grid container spacing={2} justifyContent="flex-start">
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleProjectButtonClick}
                    sx={{
                      backgroundColor: showCreateProject && activeComponent === "project" ? "#004E69" : "white",
                      color: showCreateProject && activeComponent === "project" ? "white" : "black",
                      fontWeight: "bold",
                    }}
                  >
                    Projects
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
                      "&:hover": {
                        backgroundColor: "#004E69",
                        color: "white",
                      },
                    }}
                    onClick={handleTaskboard}
                  >
                    Task Board
                  </Button>
                </Grid>
              </Grid>

              {/* Project Section */}
              {showCreateProject && activeComponent === "project" && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="#333">
                        Projects
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dashboard / Projects
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      to="/addproject"
                      variant="contained"
                      startIcon={
                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
                      }
                      sx={{
                        backgroundColor: "#FF902F",
                        borderRadius: "50px",
                        "&:hover": {
                          backgroundColor: "#e07d24",
                        },
                        color: "white",
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 3,
                      }}
                    >
                      Create Project
                    </Button>
                  </Box>

                  {/* Search Section */}
                  <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
                    <TextField
                      placeholder="Search by Project Name..."
                      fullWidth
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#55CE63",
                        minWidth: "140px",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#46b653",
                        },
                      }}
                      onClick={handleSearch}
                    >
                      SEARCH
                    </Button>
                  </Box>

                  {/* Projects Grid Display */}
                  <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#1e293b" }}>
                      Projects ({filteredProjects.length})
                    </Typography>

                    {filteredProjects.length > 0 ? (
                      <Grid container spacing={3}>
                        {filteredProjects.map((project, idx) => {
                          const pName = project.projectName || project.project_name || "Untitled Project";
                          const client = project.client || "Data Not Available";
                          const sDate = project.startDate || project.start_date || "Data Not Available";
                          const eDate = project.endDate || project.end_date || "Data Not Available";
                          const priority = project.priority || "Medium";
                          const lead = project.projectLead || project.project_lead || "Data Not Available";
                          const members = project.teamMembers || project.team_members || "Data Not Available";
                          const rate = project.rate || "Data Not Available";
                          const status = project.status || "Active";
                          const desc = project.jobDescription || project.job_description || "Data Not Available";

                          return (
                            <Grid item xs={12} md={6} lg={4} key={project.id || idx}>
                              <Card
                                elevation={2}
                                sx={{
                                  borderRadius: "12px",
                                  border: "1px solid #e2e8f0",
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "100%",
                                  transition: "transform 0.2s, box-shadow 0.2s",
                                  "&:hover": {
                                    transform: "translateY(-3px)",
                                    boxShadow: 4,
                                  },
                                }}
                              >
                                <CardContent sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                                    <Typography variant="h6" fontWeight="bold" color="#004E69">
                                      {pName}
                                    </Typography>
                                    <Chip
                                      label={status}
                                      size="small"
                                      sx={{
                                        backgroundColor: status.toLowerCase() === "active" ? "#e6f4ea" : "#fef3c7",
                                        color: status.toLowerCase() === "active" ? "#137333" : "#b45309",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  </Box>

                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Client: <strong>{client}</strong>
                                  </Typography>

                                  <Divider sx={{ mb: 2 }} />

                                  <Grid container spacing={1} sx={{ fontSize: "0.85rem" }}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary">Start Date</Typography>
                                      <Typography variant="body2" fontWeight="500">{sDate}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary">End Date</Typography>
                                      <Typography variant="body2" fontWeight="500">{eDate}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ mt: 1 }}>
                                      <Typography variant="caption" color="text.secondary">Priority</Typography>
                                      <Typography variant="body2" fontWeight="500">{priority}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ mt: 1 }}>
                                      <Typography variant="caption" color="text.secondary">Rate</Typography>
                                      <Typography variant="body2" fontWeight="500">{rate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                      <Typography variant="caption" color="text.secondary">Project Lead</Typography>
                                      <Typography variant="body2" fontWeight="500">{lead}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                      <Typography variant="caption" color="text.secondary">Team Members</Typography>
                                      <Typography variant="body2" fontWeight="500">{members}</Typography>
                                    </Grid>
                                    {desc !== "Data Not Available" && (
                                      <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">Description</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxHeight: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                          {desc}
                                        </Typography>
                                      </Grid>
                                    )}
                                  </Grid>
                                </CardContent>

                                <Divider />

                                <CardActions sx={{ justifyContent: "flex-end", p: 1.5, backgroundColor: "#f8fafc" }}>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteProject(project)}
                                    sx={{
                                      textTransform: "none",
                                      fontWeight: "bold",
                                      borderRadius: "6px",
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
                      <Box sx={{ p: 4, textAlign: "center", backgroundColor: "white", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                        <Typography color="text.secondary">
                          No projects found. Click <strong>+ Create Project</strong> to add one.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>

            {/* Create Project Dialog */}
            <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
              <DialogTitle>Create Project</DialogTitle>
              <DialogContent>
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                  <TextField
                    name="projectName"
                    label="Project Name"
                    fullWidth
                    value={formData.projectName}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="client"
                    label="Client"
                    fullWidth
                    value={formData.client}
                    onChange={handleInputChange}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="rate"
                        label="Rate"
                        fullWidth
                        value={formData.rate}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="priority"
                        label="Priority"
                        fullWidth
                        value={formData.priority}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    name="projectLead"
                    label="Project Lead"
                    fullWidth
                    value={formData.projectLead}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="teamMembers"
                    label="Team Members"
                    fullWidth
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="jobDescription"
                    label="Job Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                  />
                  <Button variant="outlined" component="label">
                    Upload Files
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePopup}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>

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
