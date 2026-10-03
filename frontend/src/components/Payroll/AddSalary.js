import React, { useState } from 'react';
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

const AddSalary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    role: 'Web Developer',
    email: '',
    mobile: '',
    joinDate: new Date().toISOString().split('T')[0],
    basic: '',
    da: '',
    hra: '',
    conveyance: '',
    allowance: '',
    medicalAllowance: '',
    earningsOthers: '',
    tds: '',
    esi: '',
    pf: '',
    leave: '',
    profTax: '',
    labourWelfare: '',
    deductionsOthers: ''
  });

  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const calculateNetSalary = () => {
    const earnings =
      (Number(formData.basic) || 0) +
      (Number(formData.da) || 0) +
      (Number(formData.hra) || 0) +
      (Number(formData.conveyance) || 0) +
      (Number(formData.allowance) || 0) +
      (Number(formData.medicalAllowance) || 0) +
      (Number(formData.earningsOthers) || 0);

    const deductions =
      (Number(formData.tds) || 0) +
      (Number(formData.esi) || 0) +
      (Number(formData.pf) || 0) +
      (Number(formData.leave) || 0) +
      (Number(formData.profTax) || 0) +
      (Number(formData.labourWelfare) || 0) +
      (Number(formData.deductionsOthers) || 0);

    return Math.max(0, earnings - deductions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.id.trim() || !formData.basic) {
      setError('Please provide Employee Name, Employee ID, and Basic Salary.');
      return;
    }

    setError('');

    const netSalary = calculateNetSalary();
    const newRecord = {
      ...formData,
      salary: netSalary,
      netSalary: netSalary
    };

    try {
      try {
        await fetch(`${API_BASE_URL}/api/salaries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord)
        });
      } catch (backendErr) {
        console.warn('Backend not reachable, saving locally:', backendErr);
      }

      const existingPayroll = JSON.parse(localStorage.getItem('payrollData')) || [];
      const updatedPayroll = [...existingPayroll, newRecord];
      localStorage.setItem('payrollData', JSON.stringify(updatedPayroll));
      setOpenModal(true);
    } catch (err) {
      console.error('Error saving salary data:', err);
      setError('Failed to save salary details.');
    }
  };

  const handleCancel = () => {
    navigate('/payroll');
  };

  const handleContinue = () => {
    setOpenModal(false);
    navigate('/payroll');
  };

  return (
    <GlobalFormLayout title="Add Staff Salary" backLink="/payroll">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section 1: Staff Details */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#004E69' }}>
          Staff Information
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Employee Name
            </Typography>
            <TextField
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter employee full name"
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

          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Employee ID
            </Typography>
            <TextField
              value={formData.id}
              onChange={handleChange('id')}
              placeholder="e.g. FT-0010"
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

          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Role / Designation
            </Typography>
            <FormControl fullWidth sx={{ mt: '10px' }}>
              <Select
                value={formData.role}
                onChange={handleChange('role')}
                sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0' }}
              >
                <MenuItem value="Web Developer">Web Developer</MenuItem>
                <MenuItem value="UI Designer">UI Designer</MenuItem>
                <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                <MenuItem value="Project Management">Project Management</MenuItem>
                <MenuItem value="Human Resources">Human Resources</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Email Address
            </Typography>
            <TextField
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Enter email address"
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

          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Mobile Number
            </Typography>
            <TextField
              value={formData.mobile}
              onChange={handleChange('mobile')}
              placeholder="Enter mobile number"
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

          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Join Date
            </Typography>
            <TextField
              type="date"
              value={formData.joinDate}
              onChange={handleChange('joinDate')}
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
        </Grid>

        {/* Section 2: Earnings & Deductions */}
        <Grid container spacing={4}>
          {/* Earnings Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#004E69' }}>
              Earnings
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Basic Salary</Typography>
                <TextField
                  type="number"
                  value={formData.basic}
                  onChange={handleChange('basic')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>DA (Dearness Allowance)</Typography>
                <TextField
                  type="number"
                  value={formData.da}
                  onChange={handleChange('da')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>HRA (House Rent Allowance)</Typography>
                <TextField
                  type="number"
                  value={formData.hra}
                  onChange={handleChange('hra')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Conveyance</Typography>
                <TextField
                  type="number"
                  value={formData.conveyance}
                  onChange={handleChange('conveyance')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Medical Allowance</Typography>
                <TextField
                  type="number"
                  value={formData.medicalAllowance}
                  onChange={handleChange('medicalAllowance')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Other Allowances</Typography>
                <TextField
                  type="number"
                  value={formData.allowance}
                  onChange={handleChange('allowance')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Deductions Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#004E69' }}>
              Deductions
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>TDS</Typography>
                <TextField
                  type="number"
                  value={formData.tds}
                  onChange={handleChange('tds')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>ESI</Typography>
                <TextField
                  type="number"
                  value={formData.esi}
                  onChange={handleChange('esi')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>PF (Provident Fund)</Typography>
                <TextField
                  type="number"
                  value={formData.pf}
                  onChange={handleChange('pf')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Leave Deductions</Typography>
                <TextField
                  type="number"
                  value={formData.leave}
                  onChange={handleChange('leave')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Professional Tax</Typography>
                <TextField
                  type="number"
                  value={formData.profTax}
                  onChange={handleChange('profTax')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: '500', fontSize: '14px', color: '#121212' }}>Labour Welfare</Typography>
                <TextField
                  type="number"
                  value={formData.labourWelfare}
                  onChange={handleChange('labourWelfare')}
                  placeholder="0"
                  fullWidth
                  sx={{ mt: 1, borderRadius: '10px', border: '1px solid #D0D0D0', '& .MuiInputBase-root': { height: '46px' } }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Calculated Net Salary Display */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            backgroundColor: '#F8F9FD',
            borderRadius: '10px',
            border: '1px solid #E0E0E0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Calculated Net Salary:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#004E69' }}>
            ${calculateNetSalary().toLocaleString()}
          </Typography>
        </Box>

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
            Save Salary
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
              You have successfully saved the staff salary record.
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

export default AddSalary;
