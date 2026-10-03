import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Slider,
  Chip
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
  width: 420,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const AddProject = () => {
  const navigate = useNavigate();

  const [employeesList, setEmployeesList] = useState([]);
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
    client: '',
    clientEmail: '',
    category: 'Software Development',
    startDate: '',
    endDate: '',
    duration: '',
    budget: '',
    rate: '$50/hr',
    priority: 'Medium',
    projectLead: '',
    teamMembers: '',
    status: 'Ongoing',
    progress: 0,
    jobDescription: ''
  });

  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  // Fetch registered employees for project lead selection
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees`);
        if (response.ok) {
          const data = await response.json();
          setEmployeesList(data || []);
        }
      } catch (err) {
        console.warn('Could not fetch employees for project lead:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Automatically calculate duration when start or end date changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        setFormData((prev) => ({ ...prev, duration: `${diffDays} Days (${Math.round(diffDays / 7)} Weeks)` }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSliderChange = (event, newValue) => {
    setFormData({ ...formData, progress: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.projectName.trim() || !formData.client.trim()) {
      setError('Project Name and Client Name are required.');
      return;
    }

    setError('');

    try {
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
    <GlobalFormLayout title="Create Enterprise Project" backLink="/projects">
      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: '950px', mx: 'auto', borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '950px', mx: 'auto' }}>
        {/* Card 1: Core Project Details */}
        <Card sx={{ mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#004E69', mb: 2 }}>
              1. Project Overview & Client Details
            </Typography>

            <Grid container spacing={3}>
              {/* Project Name */}
              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Project Name *
                </Typography>
                <TextField
                  value={formData.projectName}
                  onChange={handleChange('projectName')}
                  placeholder="e.g. AI-Powered Inventory System"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Project Code */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Project Code
                </Typography>
                <TextField
                  value={formData.projectCode}
                  onChange={handleChange('projectCode')}
                  placeholder="e.g. PRJ-2026-001"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#F8FAFC' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Client Name */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Client / Organization Name *
                </Typography>
                <TextField
                  value={formData.client}
                  onChange={handleChange('client')}
                  placeholder="e.g. Global Tech Solutions"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Client Email */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Client Contact / Email
                </Typography>
                <TextField
                  value={formData.clientEmail}
                  onChange={handleChange('clientEmail')}
                  placeholder="e.g. client@organization.com"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Category / Domain */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Project Category / Domain
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.category}
                    onChange={handleChange('category')}
                    sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0', bgcolor: '#fff' }}
                  >
                    <MenuItem value="Software Development">Software Development</MenuItem>
                    <MenuItem value="Mobile App (iOS/Android)">Mobile App (iOS/Android)</MenuItem>
                    <MenuItem value="AI & Machine Learning">AI & Machine Learning</MenuItem>
                    <MenuItem value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</MenuItem>
                    <MenuItem value="ERP / CRM Implementation">ERP / CRM Implementation</MenuItem>
                    <MenuItem value="UI/UX & Design Systems">UI/UX & Design Systems</MenuItem>
                    <MenuItem value="Consulting & Audit">Consulting & Audit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Project Status (Lifecycle)
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.status}
                    onChange={handleChange('status')}
                    sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0', bgcolor: '#fff' }}
                  >
                    <MenuItem value="Ongoing">🚀 Ongoing (Active Execution)</MenuItem>
                    <MenuItem value="Upcoming">📅 Upcoming (Pipeline / Planned)</MenuItem>
                    <MenuItem value="In Review">🔍 In Review / Quality Testing</MenuItem>
                    <MenuItem value="Completed">✅ Completed</MenuItem>
                    <MenuItem value="On Hold">⏸️ On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card 2: Timeline, Duration & Financials */}
        <Card sx={{ mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#004E69', mb: 2 }}>
              2. Timeline, Duration & Financial Metrics
            </Typography>

            <Grid container spacing={3}>
              {/* Start Date */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* End Date */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Target Completion Date
                </Typography>
                <TextField
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Duration */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Project Duration
                </Typography>
                <TextField
                  value={formData.duration}
                  onChange={handleChange('duration')}
                  placeholder="e.g. 90 Days / 12 Weeks"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#F8FAFC' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Budget */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Total Allocated Budget
                </Typography>
                <TextField
                  value={formData.budget}
                  onChange={handleChange('budget')}
                  placeholder="e.g. $45,000"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Billing Rate */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Rate / Billing Model
                </Typography>
                <TextField
                  value={formData.rate}
                  onChange={handleChange('rate')}
                  placeholder="e.g. $50/hr or Fixed Contract"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Priority */}
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Priority Level
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.priority}
                    onChange={handleChange('priority')}
                    sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0', bgcolor: '#fff' }}
                  >
                    <MenuItem value="Low">🟢 Low</MenuItem>
                    <MenuItem value="Medium">🟡 Medium</MenuItem>
                    <MenuItem value="High">🟠 High</MenuItem>
                    <MenuItem value="Urgent">🔴 Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Progress Slider */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                      Current Project Progress: <strong>{formData.progress}%</strong>
                    </Typography>
                    <Chip
                      label={formData.progress === 100 ? 'Completed' : formData.progress > 0 ? `${formData.progress}% In Progress` : 'Not Started'}
                      size="small"
                      sx={{
                        bgcolor: formData.progress === 100 ? '#E6F4EA' : '#E0F2FE',
                        color: formData.progress === 100 ? '#137333' : '#0369A1',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Slider
                    value={formData.progress}
                    onChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={5}
                    valueLabelDisplay="auto"
                    sx={{ color: '#004E69' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card 3: Team, Leadership & Scope */}
        <Card sx={{ mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#004E69', mb: 2 }}>
              3. Leadership, Team Allocation & Scope
            </Typography>

            <Grid container spacing={3}>
              {/* Project Lead */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Project Lead / Manager
                </Typography>
                {employeesList.length > 0 ? (
                  <FormControl fullWidth>
                    <Select
                      value={formData.projectLead}
                      onChange={handleChange('projectLead')}
                      displayEmpty
                      sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0', bgcolor: '#fff' }}
                    >
                      <MenuItem value="">
                        <em>-- Select Project Lead --</em>
                      </MenuItem>
                      {employeesList.map((emp) => {
                        const name = `${emp.first_name || emp.firstname || ''} ${emp.last_name || emp.lastname || ''}`.trim() || emp.name;
                        return (
                          <MenuItem key={emp.id || name} value={name}>
                            {name} ({emp.designation || emp.role || 'Staff'})
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    value={formData.projectLead}
                    onChange={handleChange('projectLead')}
                    placeholder="Enter project lead name"
                    fullWidth
                    sx={{
                      borderRadius: '10px',
                      border: '1px solid #D0D0D0',
                      '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                      '& .MuiInputBase-input': { padding: '0 14px' }
                    }}
                  />
                )}
              </Grid>

              {/* Team Members */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Allocated Team Members
                </Typography>
                <TextField
                  value={formData.teamMembers}
                  onChange={handleChange('teamMembers')}
                  placeholder="e.g. John Doe, Sarah Lee, Alex Chen"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#fff' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Description & Scope */}
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212', mb: 1 }}>
                  Scope of Work & Deliverables
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  value={formData.jobDescription}
                  onChange={handleChange('jobDescription')}
                  placeholder="Outline key milestones, architecture, client deliverables, and technical requirements..."
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    bgcolor: '#fff'
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 4 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: '180px',
              height: '48px',
              backgroundColor: '#004E69',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: '700',
              fontSize: '15px',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#003A4F' }
            }}
          >
            Save Project
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleCancel}
            sx={{
              minWidth: '120px',
              height: '48px',
              borderColor: '#004E69',
              color: '#004E69',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: '700',
              fontSize: '15px',
              '&:hover': { borderColor: '#003A4F', bgcolor: 'rgba(0, 78, 105, 0.04)' }
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
            sx={{ height: '160px', margin: '10px' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
            <Typography variant="h5" fontWeight="bold" color="#004E69">Congratulations</Typography>
            <Typography sx={{ color: 'gray', mt: 1, textAlign: 'center' }}>
              Project <strong>{formData.projectName}</strong> ({formData.projectCode}) has been created successfully.
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
              py: 1,
              '&:hover': { bgcolor: '#003A4F' }
            }}
          >
            View Projects Dashboard
          </Button>
        </Box>
      </Modal>
    </GlobalFormLayout>
  );
};

export default AddProject;
