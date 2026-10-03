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
  Divider,
  Chip,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
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
  borderRadius: '12px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const AddAttendance = () => {
  const navigate = useNavigate();

  const [employeesList, setEmployeesList] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmpObj, setSelectedEmpObj] = useState(null);

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    remarks: ''
  });

  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  // Fetch registered employees from backend / database
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees`);
        if (response.ok) {
          const data = await response.json();
          setEmployeesList(data || []);
        } else {
          // Fallback to local storage
          const localEmps = JSON.parse(localStorage.getItem('employees')) || [];
          setEmployeesList(localEmps);
        }
      } catch (err) {
        console.warn('Error fetching employees from backend:', err);
        const localEmps = JSON.parse(localStorage.getItem('employees')) || [];
        setEmployeesList(localEmps);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // When an employee is chosen from the dropdown
  const handleEmployeeSelect = (event) => {
    const empIdOrStaffId = event.target.value;
    if (!empIdOrStaffId) {
      setSelectedEmpObj(null);
      setFormData((prev) => ({ ...prev, employeeName: '', employeeId: '' }));
      return;
    }

    const emp = employeesList.find(
      (e) => (e.staff_id || e.staffId || String(e.id)) === empIdOrStaffId
    );

    if (emp) {
      const fullName = `${emp.first_name || emp.firstname || ''} ${emp.last_name || emp.lastname || ''}`.trim() || emp.name || 'Employee';
      const staffCode = emp.staff_id || emp.staffId || `EMP-${emp.id}`;

      setSelectedEmpObj(emp);
      setFormData((prev) => ({
        ...prev,
        employeeName: fullName,
        employeeId: staffCode
      }));
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.employeeName.trim() || !formData.employeeId.trim() || !formData.date) {
      setError('Please select an employee and provide the attendance date.');
      return;
    }

    setError('');

    try {
      try {
        await fetch(`${API_BASE_URL}/api/attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (backendErr) {
        console.warn('Backend not reachable, saving locally:', backendErr);
      }

      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
      const updatedRecords = [...existingRecords, formData];
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      setOpenModal(true);
    } catch (err) {
      console.error('Error saving attendance record:', err);
      setError('Failed to save attendance record.');
    }
  };

  const handleCancel = () => {
    navigate('/attendance');
  };

  const handleContinue = () => {
    setOpenModal(false);
    navigate('/attendance');
  };

  return (
    <GlobalFormLayout title="Record Employee Attendance" backLink="/attendance">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '900px', mx: 'auto' }}>
        {/* Section 1: Employee Selection */}
        <Card sx={{ mb: 3, border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#004E69' }}>
                1. Select Employee
              </Typography>
              <Button
                component={Link}
                to="/employeeAdd"
                size="small"
                variant="outlined"
                sx={{
                  color: '#004E69',
                  borderColor: '#004E69',
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#003A4F', bgcolor: 'rgba(0, 78, 105, 0.04)' }
                }}
              >
                + Add New Employee
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Choose Stored Employee *
                </Typography>
                {loadingEmployees ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">Loading registered employees...</Typography>
                  </Box>
                ) : (
                  <FormControl fullWidth>
                    <Select
                      value={selectedEmpObj ? (selectedEmpObj.staff_id || selectedEmpObj.staffId || String(selectedEmpObj.id)) : ''}
                      onChange={handleEmployeeSelect}
                      displayEmpty
                      sx={{
                        height: '50px',
                        borderRadius: '10px',
                        border: '1px solid #D0D0D0',
                        bgcolor: '#ffffff'
                      }}
                    >
                      <MenuItem value="">
                        <em>-- Select from Employee Dataset --</em>
                      </MenuItem>
                      {employeesList.map((emp) => {
                        const fullName = `${emp.first_name || emp.firstname || ''} ${emp.last_name || emp.lastname || ''}`.trim() || emp.name || 'Unnamed';
                        const staffCode = emp.staff_id || emp.staffId || `EMP-${emp.id}`;
                        const role = emp.designation || emp.role || '';
                        return (
                          <MenuItem key={emp.id || staffCode} value={staffCode}>
                            <strong>{fullName}</strong> ({staffCode}) {role ? `— ${role}` : ''}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Staff / Employee ID
                </Typography>
                <TextField
                  value={formData.employeeId}
                  onChange={handleChange('employeeId')}
                  placeholder="e.g. EMP-001"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    '& .MuiInputBase-root': { height: '50px', bgcolor: '#F8FAFC' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Selected Employee Info Preview */}
              {selectedEmpObj && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="#0369A1">
                      Selected: <strong>{formData.employeeName}</strong>
                    </Typography>
                    {selectedEmpObj.role && (
                      <Chip label={`Role: ${selectedEmpObj.role}`} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0284C7' }} />
                    )}
                    {selectedEmpObj.designation && (
                      <Chip label={`Designation: ${selectedEmpObj.designation}`} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0284C7' }} />
                    )}
                    {selectedEmpObj.official_email && (
                      <Typography variant="caption" color="text.secondary">
                        Email: {selectedEmpObj.official_email}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Section 2: Attendance Information */}
        <Card sx={{ mb: 3, border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#004E69', mb: 2 }}>
              2. Attendance & Schedule Details
            </Typography>

            <Grid container spacing={3}>
              {/* Date */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Attendance Date *
                </Typography>
                <TextField
                  type="date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Status / Record Type *
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.status}
                    onChange={handleChange('status')}
                    sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0' }}
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                    <MenuItem value="Half Day">Half Day</MenuItem>
                    <MenuItem value="Leave">Leave</MenuItem>
                    <MenuItem value="On Duty">On Duty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Check-in Time */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Check-in Time
                </Typography>
                <TextField
                  type="time"
                  value={formData.checkInTime}
                  onChange={handleChange('checkInTime')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Check-out Time */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Check-out Time
                </Typography>
                <TextField
                  type="time"
                  value={formData.checkOutTime}
                  onChange={handleChange('checkOutTime')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0',
                    '& .MuiInputBase-root': { height: '50px' },
                    '& .MuiInputBase-input': { padding: '0 14px' }
                  }}
                />
              </Grid>

              {/* Remarks */}
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Remarks / Notes
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  value={formData.remarks}
                  onChange={handleChange('remarks')}
                  placeholder="Optional notes or reason for leave / on duty..."
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #D0D0D0'
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 4 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: '220px',
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
            Save Attendance Record
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleCancel}
            sx={{
              minWidth: '130px',
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
              Attendance for <strong>{formData.employeeName}</strong> has been saved.
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
            Continue
          </Button>
        </Box>
      </Modal>
    </GlobalFormLayout>
  );
};

export default AddAttendance;
