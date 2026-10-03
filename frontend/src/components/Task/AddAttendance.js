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
  Chip,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import { Bolt, AccessTime, CheckCircle, GroupAdd, RestartAlt } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
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
  borderRadius: '16px',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consecutiveSavedCount, setConsecutiveSavedCount] = useState(0);

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkInTime: '09:00 AM',
    checkOutTime: '06:00 PM',
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

  // Preset shifts
  const applyPreset = (inTime, outTime, statusName = 'Present') => {
    setFormData((prev) => ({
      ...prev,
      checkInTime: inTime,
      checkOutTime: outTime,
      status: statusName
    }));
  };

  const applyCurrentTime = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFormData((prev) => ({
      ...prev,
      checkInTime: formatted,
      status: 'Present'
    }));
  };

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

  const saveRecord = async () => {
    if (!formData.employeeName.trim() || !formData.employeeId.trim() || !formData.date) {
      setError('Please select an employee and specify the attendance date.');
      return false;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
      const updatedRecords = [...existingRecords, formData];
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      return true;
    } catch (err) {
      console.error('Error saving attendance record:', err);
      setError('Failed to save attendance record.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await saveRecord();
    if (success) {
      setOpenModal(true);
    }
  };

  const handleSaveAndAddAnother = async () => {
    const success = await saveRecord();
    if (success) {
      setConsecutiveSavedCount((prev) => prev + 1);
      // Reset only employee field to allow fast 5-second consecutive entry
      setSelectedEmpObj(null);
      setFormData((prev) => ({
        ...prev,
        employeeName: '',
        employeeId: '',
        remarks: ''
      }));
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
    <GlobalFormLayout title="Record Attendance Entry" backLink="/attendance">
      {consecutiveSavedCount > 0 && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: '10px' }}>
          ⚡ <strong>{consecutiveSavedCount}</strong> attendance {consecutiveSavedCount === 1 ? 'record' : 'records'} saved to database! Ready for the next employee.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '900px', mx: 'auto' }}>
        
        {/* Quick Shift Timing Presets Bar */}
        <Box sx={{ mb: 2.5, p: 1.8, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bolt sx={{ color: '#16a34a' }} />
            <Typography variant="body2" fontWeight="700" color="#166534">
              5-Second Quick Timings:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="⚡ Current Clock Time"
              size="small"
              onClick={applyCurrentTime}
              sx={{ bgcolor: '#ffffff', border: '1px solid #86efac', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#dcfce7' } }}
            />
            <Chip
              label="Standard (09:00 AM - 06:00 PM)"
              size="small"
              onClick={() => applyPreset('09:00 AM', '06:00 PM')}
              sx={{ bgcolor: '#ffffff', border: '1px solid #86efac', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#dcfce7' } }}
            />
            <Chip
              label="Morning Shift (08:00 AM - 04:00 PM)"
              size="small"
              onClick={() => applyPreset('08:00 AM', '04:00 PM')}
              sx={{ bgcolor: '#ffffff', border: '1px solid #86efac', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#dcfce7' } }}
            />
          </Box>
        </Box>

        {/* Section 1: Employee Selection */}
        <Card sx={{ mb: 3, border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
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
                    <Typography variant="body2" color="text.secondary">Loading registered employees from database...</Typography>
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
                        <em>-- Select Employee From Database --</em>
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
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Section 2: Attendance Information */}
        <Card sx={{ mb: 3, border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: '700', fontSize: '16px', color: '#004E69', mb: 2 }}>
              2. Attendance & Timings
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
                    sx={{ height: '50px', borderRadius: '10px' }}
                  >
                    <MenuItem value="Present">🟢 Present</MenuItem>
                    <MenuItem value="Late">🟡 Late</MenuItem>
                    <MenuItem value="Half Day">🟣 Half Day</MenuItem>
                    <MenuItem value="Leave">🔵 Leave</MenuItem>
                    <MenuItem value="On Duty">🟠 On Duty</MenuItem>
                    <MenuItem value="Absent">🔴 Absent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Check-in Time */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212', mb: 1 }}>
                  Check-in Time
                </Typography>
                <TextField
                  value={formData.checkInTime}
                  onChange={handleChange('checkInTime')}
                  placeholder="09:00 AM"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
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
                  value={formData.checkOutTime}
                  onChange={handleChange('checkOutTime')}
                  placeholder="06:00 PM"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
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
                  rows={2}
                  value={formData.remarks}
                  onChange={handleChange('remarks')}
                  placeholder="Optional notes..."
                  fullWidth
                  sx={{
                    borderRadius: '10px'
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 4, flexWrap: 'wrap' }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              minWidth: '200px',
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
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Save Attendance'}
          </Button>

          <Button
            type="button"
            disabled={isSubmitting}
            variant="contained"
            onClick={handleSaveAndAddAnother}
            startIcon={<RestartAlt />}
            sx={{
              minWidth: '220px',
              height: '48px',
              backgroundColor: '#55CE63',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: '700',
              fontSize: '15px',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#44b552' }
            }}
          >
            ⚡ Save & Clock Next Staff
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
            sx={{ height: '150px', margin: '10px' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
            <Typography variant="h5" fontWeight="bold" color="#004E69">Success!</Typography>
            <Typography sx={{ color: 'gray', mt: 1, textAlign: 'center' }}>
              Attendance for <strong>{formData.employeeName}</strong> has been saved to the database.
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
            Go to Attendance Sheet
          </Button>
        </Box>
      </Modal>
    </GlobalFormLayout>
  );
};

export default AddAttendance;
