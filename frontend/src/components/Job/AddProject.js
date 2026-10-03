import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GlobalFormLayout from '../Common_Bar/GlobalFormLayout';
import Img from '../../assets/Congratulations.jpg';
import { API_BASE_URL } from '../../config/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    startDate: '',
    endDate: '',
    rate: '',
    priority: 'Medium',
    projectLead: '',
    teamMembers: '',
    status: 'Active',
    jobDescription: ''
  });

  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.projectName.trim() || !formData.client.trim()) {
      setError('Project Name and Client Name are required.');
      return;
    }

    setError('');

    try {
      // Save to backend API
      try {
        await fetch(`${API_BASE_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (backendErr) {
        console.warn('Backend not reachable, saving locally:', backendErr);
      }

      const existingProjects = JSON.parse(localStorage.getItem('projectData')) || [];
      const updatedProjects = [...existingProjects, formData];
      localStorage.setItem('projectData', JSON.stringify(updatedProjects));
      setOpenModal(true);
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project data.');
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  const handleContinue = () => {
    setOpenModal(false);
    navigate('/projects');
  };

  return (
    <GlobalFormLayout title="Add New Project" backLink="/projects">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Project Name */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Project Name
            </Typography>
            <TextField
              value={formData.projectName}
              onChange={handleChange('projectName')}
              placeholder="Enter project name"
              fullWidth
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* Client Name */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Client Name
            </Typography>
            <TextField
              value={formData.client}
              onChange={handleChange('client')}
              placeholder="Enter client name"
              fullWidth
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Start Date
            </Typography>
            <TextField
              type="date"
              value={formData.startDate}
              onChange={handleChange('startDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              End Date
            </Typography>
            <TextField
              type="date"
              value={formData.endDate}
              onChange={handleChange('endDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* Rate / Budget */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Rate / Budget
            </Typography>
            <TextField
              value={formData.rate}
              onChange={handleChange('rate')}
              placeholder="e.g. $50/hour or $5000"
              fullWidth
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* Priority */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Priority
            </Typography>
            <FormControl fullWidth sx={{ mt: '10px' }}>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0' }}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Project Lead */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Project Leader
            </Typography>
            <TextField
              value={formData.projectLead}
              onChange={handleChange('projectLead')}
              placeholder="Enter project lead name"
              fullWidth
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Team Members
            </Typography>
            <TextField
              value={formData.teamMembers}
              onChange={handleChange('teamMembers')}
              placeholder="Enter team members"
              fullWidth
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0',
                '& .MuiInputBase-root': { height: '50px' },
                '& .MuiInputBase-input': { padding: '0 14px' }
              }}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Status
            </Typography>
            <FormControl fullWidth sx={{ mt: '10px' }}>
              <Select
                value={formData.status}
                onChange={handleChange('status')}
                sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0' }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Job Description */}
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Project Description
            </Typography>
            <TextField
              multiline
              rows={4}
              value={formData.jobDescription}
              onChange={handleChange('jobDescription')}
              placeholder="Enter project summary and details..."
              fullWidth
              sx={{
                mt: '10px',
                borderRadius: '10px',
                border: '1px solid #D0D0D0'
              }}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: '200px',
              height: '46px',
              backgroundColor: '#004E69',
              borderRadius: '10px',
              textTransform: 'none',
              fontFamily: 'Lato',
              fontWeight: '700',
              fontSize: '14px',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#003A4F' }
            }}
          >
            Save Project
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleCancel}
            sx={{
              width: '130px',
              height: '46px',
              backgroundColor: '#004E69',
              borderRadius: '10px',
              textTransform: 'none',
              fontFamily: 'Lato',
              fontWeight: '700',
              fontSize: '14px',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#003A4F' }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Success Modal */}
      <Modal
        open={openModal}
        onClose={handleContinue}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box
            component="img"
            src={Img}
            alt="Success"
            sx={{ height: '180px', margin: '10px' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
            <Typography variant="h5" fontWeight="bold">Congratulations</Typography>
            <Typography sx={{ color: 'gray', mt: 1, textAlign: 'center' }}>
              You have successfully created a new project.
            </Typography>
          </Box>
          <Button
            onClick={handleContinue}
            variant="contained"
            sx={{
              color: 'white',
              bgcolor: '#004E69',
              margin: '10px',
              textTransform: 'none',
              borderRadius: '10px',
              px: 4,
              '&:hover': { bgcolor: '#003A4F' }
            }}
          >
            Continue
          </Button>
        </Box>
      </Modal>
    </GlobalFormLayout>
  );
};

export default AddProject;
