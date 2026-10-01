import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";



const Projects = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeComponent, setActiveComponent] = useState("projects");
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
  const [searchTerm, setSearchTerm] = useState(""); // Added search term state
  const [filteredProjects, setFilteredProjects] = useState([]); // Added filtered projects state

  // Toggle the project section
  // const handleProjectsClick = () => setShowCreateProject(!showCreateProject);

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
    setSearchTerm(""); // Clear search term when closing the popup
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

  // Save project details to localStorage
  const handleSave = () => {
    if (!formData.projectName || !formData.client) {
      alert("Project Name and Client are required.");
      return;
    }

    // File validation
    if (formData.files && formData.files.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    const existingProjects = JSON.parse(localStorage.getItem("projectData")) || [];
    const updatedProjects = [...existingProjects, formData];
    localStorage.setItem("projectData", JSON.stringify(updatedProjects));
    setStoredProjects(updatedProjects);

    console.log("Project saved:", formData);
    handleClosePopup();
  };

  // Load projects on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("projectData")) || [];
    setStoredProjects(storedData);
    setFilteredProjects(storedData); // Initialize filtered projects
  }, []);

  // Filter projects based on search term
  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredProjects(storedProjects); // If search term is empty, show all projects
    } else {
      const filtered = storedProjects.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
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
 
  const handleTaskboard=()=>{
    setShowCreateProject(false);
    setActiveComponent("taskBoard");
  }
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
           display:'flex'
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
  
              padding: 2,
              minHeight: "100vh",
              backgroundColor: "#ffffff",
          
            
          }}
        >
    <Container>
      <Box sx={{ padding: 2 }}>
        {/* Navigation Buttons */}
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={12} sm={4} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleProjectButtonClick}
              sx={{
                backgroundColor: showCreateProject ? "#004E69" : "white",
                color: showCreateProject ? "white" : "black",
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
                backgroundColor: "white",
                color: "black",
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
       
        {showCreateProject && activeComponent === "project" &&(
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">Projects</Typography>
                <Typography>Dashboard / Projects</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
                }
                onClick={handleOpenPopup}
                sx={{
                  backgroundColor: "#FF902F",
                  borderRadius: "50px",
                  "&:hover": {
                    backgroundColor: "#FF902F",
                  },
                  color: "white",
                }}
              >
                Create Project
              </Button>
            </Box>
            {/* Search Section */}
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <TextField
                placeholder="Project Name"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              />
              <TextField placeholder="Employee Name" fullWidth />
              <TextField placeholder="Designation" fullWidth />
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#55CE63",
                width: "50%",
                marginTop: 3,
                padding: 1.5,
              }}
              onClick={handleSearch} // Trigger search when clicked
            >
              SEARCH
            </Button>

            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Projects:</Typography>
              {filteredProjects.length ? (
                filteredProjects.map((project, idx) => (
                  <Box key={idx} sx={{ padding: 2, border: "1px solid #ccc", marginBottom: 2 }}>
                    {Object.entries(project).map(([key, value]) => (
                      <Typography key={key}  sx={{ fontWeight: key === "projectName" ? "bold" : "normal" }}>
                        {`${key.replace(/([A-Z])/g, " $1")}: ${value}`}
                      </Typography>
                    ))}
                  </Box>
                ))
              ) : (
                <Typography>No projects found.</Typography>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Create Project Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <Button onClick={handleSave} color="primary">
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

