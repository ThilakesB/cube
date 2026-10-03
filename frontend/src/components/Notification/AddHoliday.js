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

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddHoliday = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    day: 'Monday',
    type: 'Public Holiday',
    description: ''
  });

  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (field === 'date' && value) {
      const selectedDayIndex = new Date(value).getDay();
      setFormData({
        ...formData,
        date: value,
        day: daysOfWeek[selectedDayIndex] || formData.day
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.date) {
      setError('Please provide Holiday Name and Date.');
      return;
    }

    setError('');

    try {
      let savedHoliday = { ...formData };
      try {
        const response = await fetch(`${API_BASE_URL}/api/holidays`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const data = await response.json();
          if (data.holiday) {
            savedHoliday = data.holiday;
          }
        }
      } catch (backendErr) {
        console.warn('Backend not responding, persisting locally:', backendErr);
      }

      // Persist locally for immediate reflection
      const existingHolidays = JSON.parse(localStorage.getItem('holidaysData')) || [];
      const updatedHolidays = [
        ...existingHolidays.filter(
          (h) => (h.name || '').trim().toLowerCase() !== (savedHoliday.name || '').trim().toLowerCase()
        ),
        savedHoliday
      ];
      localStorage.setItem('holidaysData', JSON.stringify(updatedHolidays));

      setOpenModal(true);
    } catch (err) {
      console.error('Error saving holiday:', err);
      setError('Failed to save holiday.');
    }
  };

  const handleCancel = () => {
    navigate('/holidays');
  };

  const handleContinue = () => {
    setOpenModal(false);
    navigate('/holidays');
  };

  return (
    <GlobalFormLayout title="Add Holiday" backLink="/holidays">
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Holiday Name */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Holiday Name
            </Typography>
            <TextField
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="e.g. New Year's Day"
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

          {/* Holiday Date */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Holiday Date
            </Typography>
            <TextField
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
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

          {/* Day of Week */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Day of Week
            </Typography>
            <FormControl fullWidth sx={{ mt: '10px' }}>
              <Select
                value={formData.day}
                onChange={handleChange('day')}
                sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0' }}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Holiday Type */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Holiday Type
            </Typography>
            <FormControl fullWidth sx={{ mt: '10px' }}>
              <Select
                value={formData.type}
                onChange={handleChange('type')}
                sx={{ height: '50px', borderRadius: '10px', border: '1px solid #D0D0D0' }}
              >
                <MenuItem value="Public Holiday">Public Holiday</MenuItem>
                <MenuItem value="Company Holiday">Company Holiday</MenuItem>
                <MenuItem value="Optional Holiday">Optional Holiday</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '24px', color: '#121212' }}>
              Description / Notes
            </Typography>
            <TextField
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Enter notes or holiday information..."
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
              backgroundColor: '#7B61FF',
              borderRadius: '10px',
              textTransform: 'none',
              fontFamily: 'Lato',
              fontWeight: '700',
              fontSize: '14px',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(123, 97, 255, 0.25)',
              '&:hover': { backgroundColor: '#624BCC' }
            }}
          >
            Save Holiday
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleCancel}
            sx={{
              width: '130px',
              height: '46px',
              borderColor: '#E5E7EB',
              color: '#374151',
              borderRadius: '10px',
              textTransform: 'none',
              fontFamily: 'Lato',
              fontWeight: '700',
              fontSize: '14px',
              '&:hover': { backgroundColor: '#F9FAFB', borderColor: '#D1D5DB' }
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
              You have successfully added a new holiday.
            </Typography>
          </Box>
          <Button
            onClick={handleContinue}
            variant="contained"
            sx={{
              color: 'white',
              bgcolor: '#7B61FF',
              margin: '10px',
              textTransform: 'none',
              borderRadius: '10px',
              px: 4,
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(123, 97, 255, 0.25)',
              '&:hover': { bgcolor: '#624BCC' }
            }}
          >
            Continue
          </Button>
        </Box>
      </Modal>
    </GlobalFormLayout>
  );
};

export default AddHoliday;
