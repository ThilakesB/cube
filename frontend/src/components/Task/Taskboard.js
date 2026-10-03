
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";

import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  LinearProgress,

} from "@mui/material";

import Followersimage2 from "../../assets/project-images/Followers-image2.png";
import Followersimage3 from "../../assets/project-images/Followers-image3.png";
import Followersimage4 from "../../assets/project-images/Followers-image4.png";
import Followersimage5 from "../../assets/project-images/Followers-image5.png";
import { API_BASE_URL } from '../../config/api';

const Taskboard = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
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
  const[showBox,setShowBox]=useState(false);

  // Open/Close popup
  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => {
    setOpenPopup(false);
    // Reset formData
    setFormData({
      taskName: "",
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
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      if (response.ok) {
        const data = await response.json();
        setStoredProjects(data.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Save task to backend
  const handleSave = async () => {
    if (!formData.taskName || !formData.client) {
      alert("Task Name and Client are required.");
      return;
    }

    // File validation
    if (formData.files && formData.files.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskName: formData.taskName,
          client: formData.client,
          startDate: formData.startDate,
          endDate: formData.endDate,
          rate: formData.rate,
          priority: formData.priority,
          projectLead: formData.projectLead,
          teamMembers: formData.teamMembers,
          jobDescription: formData.jobDescription,
        }),
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }

    console.log("Project saved:", formData);
    handleClosePopup();
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
  
  const handleToggleBox = () => {
    setShowBox((prev) => !prev);
    console.log("showBox state:", !showBox);
  };
  // Custom styled LinearProgress
const GreenLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    backgroundColor:"  #55CE63",
    
  },
  height: "15px", // Set height of the progress bar
  borderRadius: "7px",
});

  return (
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
          <Typography variant="h6" fontWeight="bold">Tasks Boards</Typography>
          <Typography>Dashboard / Tasks Board</Typography>
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
          Create Tasks
        </Button>
      </Box>
      <Box display="flex" gap={5}>
    <Box display="flex" style={{ marginTop: "30px" }}>
      <Typography variant="body1" style={{ marginTop:"10px" ,marginRight:"30px"}}>Lead</Typography>
   
      <img 
        src={Followersimage2} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 4 }} 
      />
      <img 
        src={Followersimage3} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 3 }} 
      />
      <img 
        src={Followersimage4} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 2 }} 
      />
      <img 
        src={Followersimage5} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 1 }} 
      />
    </Box>
    <Box display="flex" style={{ marginTop: "30px" }}>
      <Typography variant="body1" style={{ marginTop:"10px" ,marginRight:"30px"}}>Team</Typography>
   
      <img 
        src={Followersimage2} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 4 }} 
      />
      <img 
        src={Followersimage3} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 3 }} 
      />
      <img 
        src={Followersimage4} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 2 }} 
      />
      <img 
        src={Followersimage5} 
        alt="" 
        style={{ width: "40px", height: "40px", marginLeft: "-10px", zIndex: 1 }} 
      />
    </Box>
    </Box>
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2 ,marginTop:"30px"}}>
      <Typography>Progress:</Typography>
      <Box sx={{ flex: 1 }}>
        <GreenLinearProgress
          variant="determinate"
          value={30} // Progress set to 30%
        />
      </Box>
      <Typography>30%</Typography>
    </Box>
      {/* Create Task Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              name="taskName"
              label="Task Name"
              fullWidth
              value={formData.taskName}
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
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
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
    </>
  );
};

export default Taskboard;