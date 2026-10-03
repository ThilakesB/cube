// DeleteEmployee.js
import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const DeleteEmployee = ({ selectedEmployee, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(selectedEmployee?.staffId || selectedEmployee?.staff_id);
  };

  const employeeName =
    [selectedEmployee?.firstname, selectedEmployee?.lastname].filter(Boolean).join(' ') ||
    selectedEmployee?.firstname ||
    selectedEmployee?.name ||
    'this employee';

  return (
    <Box sx={{ p: 3.5, position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      {/* Top close button */}
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="close"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: '#9CA3AF',
          transition: 'all 0.2s',
          '&:hover': { color: '#374151', bgcolor: '#F3F4F6' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Warning Icon & Confirmation Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 0.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            color: '#EF4444',
          }}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 26 }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            color: '#111827',
            mb: 1,
            letterSpacing: '-0.01em',
          }}
        >
          Delete Employee
        </Typography>

        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: 1.5,
            px: 1,
            mb: 3,
          }}
        >
          Are you sure you want to delete{' '}
          <Typography
            component="span"
            sx={{ fontWeight: 600, color: '#1F2937', fontSize: '14px' }}
          >
            "{employeeName}"
          </Typography>
          ? This action cannot be undone.
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', width: '100%', gap: 1.5, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
            sx={{
              py: 1,
              borderRadius: '8px',
              borderColor: '#E5E7EB',
              color: '#374151',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              bgcolor: '#FFFFFF',
              borderWidth: '1px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                bgcolor: '#F9FAFB',
                borderColor: '#D1D5DB',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            fullWidth
            sx={{
              py: 1,
              borderRadius: '8px',
              bgcolor: '#DC2626',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 1px 3px 0 rgba(220, 38, 38, 0.35)',
              '&:hover': {
                bgcolor: '#B91C1C',
                boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4)',
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DeleteEmployee;
