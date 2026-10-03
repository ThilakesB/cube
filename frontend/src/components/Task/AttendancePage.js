import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  Alert,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  Bolt,
  GroupAdd,
  PlaylistAddCheck,
  Refresh,
  Person,
  AccessTime,
  DoneAll
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import Navbar from '../Common_Bar/NavBar';
import TopBar from '../Common_Bar/TopBar';
import Sidebar from '../Common_Bar/Sidebar';

// Month names for dropdown
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: { main: '#004E69' },
    secondary: { main: '#FF902F' },
    success: { main: '#55CE63' },
  }
});

// Validate and fix attendance data
const validateAttendanceData = (backendData) => {
  if (!Array.isArray(backendData)) return [];
  return backendData.map((employee) => {
    const validatedAttendance = (employee.attendance || []).map((entry) => {
      const daysInMonth = new Date(entry.year, entry.month, 0).getDate();
      if (!entry.days || !Array.isArray(entry.days)) {
        return {
          ...entry,
          days: Array(daysInMonth).fill(false),
        };
      }
      if (entry.days.length !== daysInMonth) {
        const fixedDays = Array(daysInMonth).fill(false);
        entry.days.forEach((status, index) => {
          if (index < daysInMonth) fixedDays[index] = status;
        });
        return {
          ...entry,
          days: fixedDays,
        };
      }
      return entry;
    });

    const attendanceByMonth = {};
    validatedAttendance.forEach((entry) => {
      const key = `${entry.year}-${entry.month}`;
      if (!attendanceByMonth[key]) {
        attendanceByMonth[key] = entry;
      } else {
        entry.days.forEach((status, index) => {
          if (status) attendanceByMonth[key].days[index] = status;
        });
      }
    });

    return {
      ...employee,
      attendance: Object.values(attendanceByMonth),
    };
  });
};

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  
  // 5-Second Express Punch states
  const [expressStaffId, setExpressStaffId] = useState('');
  const [expressStatus, setExpressStatus] = useState('Present');
  const [punchLoading, setPunchLoading] = useState(false);
  const [punchFeedback, setPunchFeedback] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Batch Multi-Select Modal states
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [batchStatus, setBatchStatus] = useState('Present');
  const [batchLoading, setBatchLoading] = useState(false);

  // Bulk mark all confirm dialog
  const [bulkAllDialogOpen, setBulkAllDialogOpen] = useState(false);

  // Add Employee Dialog
  const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowMonthSelections, setRowMonthSelections] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const employeesPerPage = 6;
  const navigate = useNavigate();

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch registered employees list for quick dropdown
  const fetchEmployeesList = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`);
      if (res.ok) {
        const emps = await res.json();
        setEmployeesList(emps || []);
        if (emps && emps.length > 0 && !expressStaffId) {
          const firstCode = emps[0].staff_id || emps[0].staffId || String(emps[0].id);
          setExpressStaffId(firstCode);
        }
      }
    } catch (err) {
      console.warn('Could not fetch employees list:', err);
    }
  }, [expressStaffId]);

  const fetchAttendanceData = useCallback(async () => {
    let token = localStorage.getItem('token') || 'erp_session_token';
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employee-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validatedData = validateAttendanceData(response.data.data || []);
      setAttendanceData(validatedData);
      setFilteredData(validatedData);
      const initialSelections = {};
      const currentM = new Date().getMonth() + 1;
      validatedData.forEach((employee) => {
        initialSelections[employee._id] = currentM;
      });
      setRowMonthSelections(initialSelections);
    } catch (err) {
      console.error('Error fetching attendance data:', err.message);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else if (err.code === 'ERR_NETWORK') {
        setError(`Cannot connect to backend on ${API_BASE_URL}.`);
      } else {
        setError('Failed to fetch attendance data: ' + err.message);
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchEmployeesList();
    fetchAttendanceData();
  }, [fetchEmployeesList, fetchAttendanceData]);

  // ⚡ 5-Second Express Clock In / Out Action
  const handleExpressPunch = async (actionType) => {
    if (!expressStaffId) {
      setError('Please select an employee for fast punch.');
      return;
    }
    setError('');
    setPunchLoading(true);
    setPunchFeedback(null);

    const selectedEmp = employeesList.find(
      (e) => (e.staff_id || e.staffId || String(e.id)) === expressStaffId
    );
    const empName = selectedEmp
      ? `${selectedEmp.first_name || ''} ${selectedEmp.last_name || ''}`.trim()
      : 'Staff Member';

    try {
      const response = await axios.post(`${API_BASE_URL}/api/attendance/quick-clock-in`, {
        employee_id: expressStaffId,
        employee_name: empName,
        action: actionType, // 'check_in' or 'check_out'
        status: expressStatus,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0]
      });

      if (response.data && response.data.status === 'success') {
        setPunchFeedback({
          type: 'success',
          msg: response.data.message || `⚡ ${empName} recorded successfully!`
        });
        await fetchAttendanceData();
      }
    } catch (err) {
      console.error('Express punch failed:', err);
      setPunchFeedback({
        type: 'error',
        msg: 'Failed to record fast punch: ' + (err.response?.data?.detail || err.message)
      });
    } finally {
      setPunchLoading(false);
    }
  };

  // ⚡ 1-Click Mark All Registered Staff Present Today
  const handleBulkMarkAll = async () => {
    setPunchLoading(true);
    setBulkAllDialogOpen(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/attendance/bulk`, {
        mark_all: true,
        status: 'Present',
        date: new Date().toISOString().split('T')[0]
      });

      if (response.data && response.data.status === 'success') {
        setPunchFeedback({
          type: 'success',
          msg: `⚡ ${response.data.message || 'All employees marked present for today!'}`
        });
        await fetchAttendanceData();
      }
    } catch (err) {
      console.error('Bulk mark all failed:', err);
      setError('Bulk attendance failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setPunchLoading(false);
    }
  };

  // ⚡ Batch Selected Employees Check-in
  const handleBatchSelectedPunch = async () => {
    if (selectedStaffIds.length === 0) {
      setError('Please select at least one employee.');
      return;
    }
    setBatchLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/attendance/bulk`, {
        employee_ids: selectedStaffIds,
        status: batchStatus,
        date: new Date().toISOString().split('T')[0]
      });

      if (response.data && response.data.status === 'success') {
        setPunchFeedback({
          type: 'success',
          msg: `⚡ Marked ${selectedStaffIds.length} employees as ${batchStatus} for today!`
        });
        setBatchModalOpen(false);
        setSelectedStaffIds([]);
        await fetchAttendanceData();
      }
    } catch (err) {
      console.error('Batch selection failed:', err);
      setError('Failed to mark selected attendance: ' + (err.response?.data?.detail || err.message));
    } finally {
      setBatchLoading(false);
    }
  };

  // Toggle selection in batch modal
  const handleToggleStaffSelection = (id) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStaff = () => {
    if (selectedStaffIds.length === employeesList.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(
        employeesList.map((e) => e.staff_id || e.staffId || String(e.id))
      );
    }
  };

  // Add Employee directly
  const handleAddEmployee = async () => {
    if (!newEmployeeName.trim()) {
      setError('Employee name is required');
      return;
    }
    const token = localStorage.getItem('token') || 'erp_session_token';
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const newAttendance = [{
        month: currentMonth,
        year: currentYear,
        days: Array(daysInMonth).fill(false),
      }];

      const response = await axios.post(
        `${API_BASE_URL}/api/employee-attendance/add`,
        { name: newEmployeeName, attendance: newAttendance },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newEmployee = {
        ...response.data.data,
        attendance: newAttendance,
      };
      setAttendanceData((prevData) => [...prevData, newEmployee]);
      setFilteredData((prevData) => [...prevData, newEmployee]);
      setRowMonthSelections((prev) => ({
        ...prev,
        [newEmployee._id]: currentMonth,
      }));
      setAddEmployeeDialogOpen(false);
      setNewEmployeeName('');
      setError('');
      fetchEmployeesList();
    } catch (err) {
      console.error('Error adding employee:', err.message);
      setError('Failed to add employee: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save attendance cell change to backend
  const handleSaveAttendance = async (employeeIndex, month, updatedDays) => {
    const token = localStorage.getItem('token') || 'erp_session_token';
    try {
      const employee = filteredData[employeeIndex];
      if (!employee) return;
      const currentY = new Date().getFullYear();
      const daysInMonth = new Date(currentY, month, 0).getDate();
      const attendanceForBackend = [{
        month,
        year: currentY,
        days: updatedDays.slice(0, daysInMonth),
      }];

      await axios.post(
        `${API_BASE_URL}/api/employee-attendance/${employee._id}`,
        { attendance: attendanceForBackend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
    } catch (err) {
      console.error('Error saving attendance:', err.message);
      setError('Failed to save attendance: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleAttendance = (employeeIndex, month, dayIndex) => {
    const employee = filteredData[employeeIndex];
    if (!employee) return;
    const currentY = new Date().getFullYear();
    const monthData = employee.attendance.find((m) => m.month === month) || {
      month,
      year: currentY,
      days: Array(new Date(currentY, month, 0).getDate()).fill(false),
    };
    const currentStatus = monthData.days[dayIndex] || false;
    const newStatus = !currentStatus;

    setConfirmAction({
      employeeIndex,
      month,
      dayIndex,
      newStatus,
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!confirmAction) return;
    const { employeeIndex, month, dayIndex, newStatus } = confirmAction;
    const updatedData = [...filteredData];
    const employee = updatedData[employeeIndex];
    if (!employee) return;

    let monthData = employee.attendance.find((m) => m.month === month);
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, month, 0).getDate();

    if (!monthData) {
      monthData = {
        month,
        year: currentYear,
        days: Array(daysInMonth).fill(false),
      };
      monthData.days[dayIndex] = newStatus;
      employee.attendance.push(monthData);
    } else {
      let updatedDays = [...monthData.days];
      if (updatedDays.length !== daysInMonth) {
        const fixedDays = Array(daysInMonth).fill(false);
        updatedDays.forEach((status, index) => {
          if (index < daysInMonth) fixedDays[index] = status;
        });
        updatedDays = fixedDays;
      }
      updatedDays[dayIndex] = newStatus;
      monthData.days = updatedDays;
    }

    setAttendanceData(updatedData);
    setFilteredData(updatedData);
    handleSaveAttendance(employeeIndex, month, monthData.days);
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleRowMonthChange = (employeeId, month) => {
    setRowMonthSelections((prev) => ({
      ...prev,
      [employeeId]: parseInt(month),
    }));
  };

  const handleSearch = () => {
    let filtered = attendanceData;
    if (selectedEmployeeName.trim()) {
      filtered = filtered.filter((employee) =>
        employee.name.toLowerCase().includes(selectedEmployeeName.toLowerCase())
      );
    }
    if (selectedMonth || selectedYear) {
      filtered = filtered.map((employee) => ({
        ...employee,
        attendance: employee.attendance.filter((month) => {
          const isMonthMatch = !selectedMonth || month.month === parseInt(selectedMonth);
          const isYearMatch = !selectedYear || month.year === parseInt(selectedYear);
          return isMonthMatch && isYearMatch;
        }),
      })).filter((employee) => employee.attendance.length > 0);
    }
    setFilteredData(filtered);
    setCurrentPage(1);
    setError('');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(filteredData.length / employeesPerPage) || 1;
  const currentEmployees = filteredData.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} md={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={12} sm={9} md={10} sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <Box sx={{ maxWidth: '1440px', mx: 'auto' }}>
              
              {/* Top Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight="800" color="#004E69" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ color: '#004E69' }} /> Attendance Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time employee clock-in, daily punch kiosk & monthly attendance matrix
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<Bolt sx={{ color: '#FFD700' }} />}
                    onClick={() => setBulkAllDialogOpen(true)}
                    sx={{
                      backgroundColor: '#004E69',
                      '&:hover': { backgroundColor: '#003A4F' },
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      px: 2.2,
                      boxShadow: '0 4px 10px rgba(0, 78, 105, 0.2)'
                    }}
                  >
                    ⚡ Mark All Present (1-Click)
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PlaylistAddCheck />}
                    onClick={() => setBatchModalOpen(true)}
                    sx={{
                      backgroundColor: '#55CE63',
                      '&:hover': { backgroundColor: '#44b552' },
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      px: 2,
                      boxShadow: '0 4px 10px rgba(85, 206, 99, 0.2)'
                    }}
                  >
                    Batch Select Staff
                  </Button>
                  <Button
                    component={Link}
                    to="/addattendance"
                    variant="contained"
                    sx={{
                      backgroundColor: '#FF902F',
                      '&:hover': { backgroundColor: '#e07d24' },
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      px: 2
                    }}
                  >
                    + Detailed Form
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GroupAdd />}
                    onClick={() => setAddEmployeeDialogOpen(true)}
                    sx={{
                      borderColor: '#004E69',
                      color: '#004E69',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      '&:hover': { borderColor: '#003A4F', bgcolor: 'rgba(0, 78, 105, 0.04)' }
                    }}
                  >
                    + Add Staff
                  </Button>
                </Box>
              </Box>

              {/* Feedback Alerts */}
              {punchFeedback && (
                <Alert
                  severity={punchFeedback.type}
                  onClose={() => setPunchFeedback(null)}
                  sx={{ mb: 2.5, borderRadius: '10px', fontWeight: 600 }}
                >
                  {punchFeedback.msg}
                </Alert>
              )}

              {error && (
                <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2.5, borderRadius: '10px' }}>
                  {error}
                </Alert>
              )}

              {/* ⚡ 5-SECOND EXPRESS ATTENDANCE KIOSK PANEL */}
              <Card sx={{ mb: 3.5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: '#004E69', px: 3, py: 1.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Bolt sx={{ color: '#FFD700', fontSize: '26px' }} />
                    <Typography variant="subtitle1" fontWeight="800" color="#ffffff">
                      5-Second Express Punch Kiosk
                    </Typography>
                    <Chip
                      label="Fast 1-Click Clock In"
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 700, fontSize: '11px' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" sx={{ color: '#FFD700' }} />
                      <span style={{ fontWeight: '700', color: '#ffffff' }}>{currentTime}</span> | {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                    <IconButton size="small" onClick={fetchAttendanceData} sx={{ color: '#ffffff' }}>
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3, bgcolor: '#ffffff' }}>
                  <Grid container spacing={2.5} alignItems="center">
                    {/* Employee Selector */}
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="express-emp-select-label">Choose Staff / Employee</InputLabel>
                        <Select
                          labelId="express-emp-select-label"
                          label="Choose Staff / Employee"
                          value={expressStaffId}
                          onChange={(e) => setExpressStaffId(e.target.value)}
                        >
                          {employeesList.length === 0 ? (
                            <MenuItem value="" disabled>
                              <em>No employees registered. Add staff first.</em>
                            </MenuItem>
                          ) : (
                            employeesList.map((emp) => {
                              const code = emp.staff_id || emp.staffId || String(emp.id);
                              const name = `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.name || 'Employee';
                              return (
                                <MenuItem key={code} value={code}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600 }}>{name}</span>
                                    <Chip label={code} size="small" sx={{ height: '20px', fontSize: '10px', bgcolor: '#f1f5f9', ml: 1 }} />
                                  </Box>
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Status Preset */}
                    <Grid item xs={12} sm={6} md={2.5}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="express-status-label">Punch Status</InputLabel>
                        <Select
                          labelId="express-status-label"
                          label="Punch Status"
                          value={expressStatus}
                          onChange={(e) => setExpressStatus(e.target.value)}
                        >
                          <MenuItem value="Present">🟢 Present</MenuItem>
                          <MenuItem value="Late">🟡 Late</MenuItem>
                          <MenuItem value="Half Day">🟣 Half Day</MenuItem>
                          <MenuItem value="Work From Home">🔵 Work From Home</MenuItem>
                          <MenuItem value="Absent">🔴 Absent</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Instant Action Buttons */}
                    <Grid item xs={12} sm={6} md={5.5}>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          disabled={punchLoading || employeesList.length === 0}
                          onClick={() => handleExpressPunch('check_in')}
                          startIcon={punchLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
                          sx={{
                            backgroundColor: '#55CE63',
                            '&:hover': { backgroundColor: '#44b552' },
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2.5,
                            py: 1,
                            flex: 1,
                            boxShadow: '0 4px 10px rgba(85, 206, 99, 0.2)'
                          }}
                        >
                          ⚡ Clock In (Present)
                        </Button>

                        <Button
                          variant="contained"
                          disabled={punchLoading || employeesList.length === 0}
                          onClick={() => handleExpressPunch('check_out')}
                          startIcon={<AccessTime />}
                          sx={{
                            backgroundColor: '#FF902F',
                            '&:hover': { backgroundColor: '#e07d24' },
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2.5,
                            py: 1,
                            flex: 1,
                            boxShadow: '0 4px 10px rgba(255, 144, 47, 0.2)'
                          }}
                        >
                          ⚡ Clock Out
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, pt: 1.8, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      💡 Tip: Employees can choose their name and tap <b>Clock In</b> in under 5 seconds. All timestamps sync instantly with PostgreSQL.
                    </Typography>
                    <Link to="/attendance-report" style={{ fontSize: '13px', color: '#004E69', fontWeight: 'bold', textDecoration: 'none' }}>
                      View Full Attendance Log & Reports →
                    </Link>
                  </Box>
                </CardContent>
              </Card>

              {/* Monthly Matrix Search & Filter Bar */}
              <Box sx={{ p: 2.5, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Filter Staff by Name"
                      placeholder="Search employee name..."
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={selectedEmployeeName}
                      onChange={(e) => setSelectedEmployeeName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="month-select-label">Select Month</InputLabel>
                      <Select
                        labelId="month-select-label"
                        label="Select Month"
                        value={selectedMonth || ''}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>All Months</em>
                        </MenuItem>
                        {monthNames.map((name, index) => (
                          <MenuItem key={index} value={index + 1}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Year"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={selectedYear}
                      placeholder={String(new Date().getFullYear())}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSearch}
                      sx={{
                        backgroundColor: '#004E69',
                        '&:hover': { backgroundColor: '#003A4F' },
                        height: '40px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '8px'
                      }}
                    >
                      Apply Filter
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Monthly Sheet Table */}
              <Card sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="700" color="#1e293b">
                    Monthly Attendance Matrix ({filteredData.length} Staff Members)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ color: '#55CE63', fontWeight: 'bold' }}>✔</span>
                      <Typography variant="caption" color="text.secondary">Present</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ color: '#e11d48', fontWeight: 'bold' }}>✘</span>
                      <Typography variant="caption" color="text.secondary">Absent / Off</Typography>
                    </Box>
                  </Box>
                </Box>

                {filteredData.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      No employees or attendance records found in the database.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setAddEmployeeDialogOpen(true)}
                      sx={{ mt: 2, bgcolor: '#004E69', textTransform: 'none', borderRadius: '8px' }}
                    >
                      + Add First Employee
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#004E69' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#ffffff', fontWeight: 700, minWidth: '160px' }}>Employee Name</TableCell>
                          <TableCell sx={{ color: '#ffffff', fontWeight: 700, minWidth: '130px' }}>Month</TableCell>
                          {Array.from({ length: 31 }, (_, dayIndex) => (
                            <TableCell key={`day-${dayIndex}`} align="center" sx={{ color: '#ffffff', fontWeight: 700, p: 0.8, minWidth: '32px' }}>
                              {dayIndex + 1}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentEmployees.map((employee, empIndex) => {
                          const selectedMonthForEmployee = rowMonthSelections[employee._id] || new Date().getMonth() + 1;
                          const currentYear = new Date().getFullYear();
                          const monthData = (employee.attendance || []).find(
                            (month) => month.month === selectedMonthForEmployee
                          ) || {
                            month: selectedMonthForEmployee,
                            year: currentYear,
                            days: Array(new Date(currentYear, selectedMonthForEmployee, 0).getDate()).fill(false),
                          };
                          const totalDays = new Date(monthData.year, monthData.month, 0).getDate();

                          return (
                            <TableRow key={`attendance-${employee._id}`} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#f8fafc' } }}>
                              <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Person sx={{ color: '#004E69', fontSize: '18px' }} />
                                  <span>{employee.name}</span>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <FormControl fullWidth size="small">
                                  <Select
                                    value={selectedMonthForEmployee}
                                    onChange={(e) => handleRowMonthChange(employee._id, e.target.value)}
                                    sx={{ height: '32px', fontSize: '12px' }}
                                  >
                                    {monthNames.map((name, index) => (
                                      <MenuItem key={index} value={index + 1} sx={{ fontSize: '12px' }}>
                                        {name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              {Array.from({ length: 31 }, (_, dayIndex) => {
                                if (dayIndex < totalDays) {
                                  const isChecked = monthData.days && monthData.days[dayIndex] === true;
                                  return (
                                    <TableCell key={`attendance-checkbox-${dayIndex}`} align="center" sx={{ p: 0.2 }}>
                                      <Tooltip title={`Day ${dayIndex + 1}: ${isChecked ? 'Present (Click to toggle)' : 'Absent (Click to toggle)'}`}>
                                        <Checkbox
                                          size="small"
                                          checked={isChecked}
                                          onChange={() => toggleAttendance((currentPage - 1) * employeesPerPage + empIndex, selectedMonthForEmployee, dayIndex)}
                                          icon={<span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 'bold' }}>-</span>}
                                          checkedIcon={<span style={{ color: '#55CE63', fontSize: '16px', fontWeight: 'bold' }}>✔</span>}
                                          sx={{ p: 0.4 }}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                  );
                                }
                                return (
                                  <TableCell key={`attendance-blank-${dayIndex}`} align="center" sx={{ bgcolor: '#f1f5f9', p: 0.2 }}>
                                    <span style={{ color: '#e2e8f0' }}>·</span>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {filteredData.length > employeesPerPage && (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* ⚡ 1-Click Mark All Present Confirm Dialog */}
        <Dialog open={bulkAllDialogOpen} onClose={() => setBulkAllDialogOpen(false)} PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 800, color: '#004E69' }}>
            ⚡ 1-Click Mark All Employees Present
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark all registered staff members ({employeesList.length} employees) as <b>Present</b> for today ({new Date().toISOString().split('T')[0]})?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setBulkAllDialogOpen(false)} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkMarkAll}
              variant="contained"
              sx={{ backgroundColor: '#004E69', '&:hover': { backgroundColor: '#003A4F' }, borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
            >
              Yes, Mark All Present
            </Button>
          </DialogActions>
        </Dialog>

        {/* ⚡ Batch Staff Multi-Select Modal */}
        <Dialog open={batchModalOpen} onClose={() => setBatchModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '14px' } }}>
          <DialogTitle sx={{ bgcolor: '#004E69', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>⚡ Batch Mark Attendance</span>
            <Chip label={`${selectedStaffIds.length} Selected`} size="small" sx={{ bgcolor: '#ffffff', color: '#004E69', fontWeight: 700 }} />
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button size="small" onClick={handleSelectAllStaff} startIcon={<DoneAll />}>
                {selectedStaffIds.length === employeesList.length ? 'Deselect All' : 'Select All Staff'}
              </Button>

              <FormControl size="small" sx={{ width: '160px' }}>
                <InputLabel id="batch-status-label">Status</InputLabel>
                <Select
                  labelId="batch-status-label"
                  label="Status"
                  value={batchStatus}
                  onChange={(e) => setBatchStatus(e.target.value)}
                >
                  <MenuItem value="Present">🟢 Present</MenuItem>
                  <MenuItem value="Late">🟡 Late</MenuItem>
                  <MenuItem value="Half Day">🟣 Half Day</MenuItem>
                  <MenuItem value="Work From Home">🔵 Work From Home</MenuItem>
                  <MenuItem value="Absent">🔴 Absent</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Paper variant="outlined" sx={{ maxHeight: '280px', overflowY: 'auto', borderRadius: '8px' }}>
              <List dense>
                {employeesList.map((emp) => {
                  const code = emp.staff_id || emp.staffId || String(emp.id);
                  const name = `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.name || 'Employee';
                  const isChecked = selectedStaffIds.includes(code);
                  return (
                    <ListItem key={code} button onClick={() => handleToggleStaffSelection(code)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={isChecked} tabIndex={-1} disableRipple />
                      </ListItemIcon>
                      <ListItemText
                        primary={<span style={{ fontWeight: 600 }}>{name}</span>}
                        secondary={`${code} • ${emp.designation || 'Staff'}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setBatchModalOpen(false)} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleBatchSelectedPunch}
              disabled={batchLoading || selectedStaffIds.length === 0}
              variant="contained"
              sx={{ backgroundColor: '#55CE63', '&:hover': { backgroundColor: '#44b552' }, borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
            >
              {batchLoading ? <CircularProgress size={18} color="inherit" /> : `Mark ${selectedStaffIds.length} as ${batchStatus}`}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Employee Dialog */}
        <Dialog open={addEmployeeDialogOpen} onClose={() => setAddEmployeeDialogOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
          <DialogTitle sx={{ fontWeight: 700, color: '#004E69' }}>Add New Employee</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              label="Full Employee Name"
              placeholder="e.g. Robert Smith"
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAddEmployeeDialogOpen(false)} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              variant="contained"
              sx={{ backgroundColor: '#004E69', '&:hover': { backgroundColor: '#003A4F' }, borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
            >
              Add Staff
            </Button>
          </DialogActions>
        </Dialog>

        {/* Attendance Toggle Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Confirm Attendance Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark this day as <b>{confirmAction?.newStatus ? 'Present' : 'Absent'}</b>?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmToggle}
              variant="contained"
              sx={{ backgroundColor: '#55CE63', '&:hover': { backgroundColor: '#44b552' }, borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </ThemeProvider>
  );
};

export default AttendancePage;
