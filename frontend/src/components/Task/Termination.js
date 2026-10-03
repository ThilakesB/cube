import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { API_BASE_URL } from '../../config/api';



const EmployeeInputFields = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [terminationData, setTerminationData] = useState([]);
  const [filteredTerminationData, setFilteredTerminationData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    employeeName: "",
    noticeDate: "",
    terminatedDate: "",
    reason: "",
  });

  // Load data from backend when the component mounts
  const fetchTerminations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terminations`);
      if (response.ok) {
        const data = await response.json();
        const items = data.terminations || [];
        setTerminationData(items);
        setFilteredTerminationData(items);
      }
    } catch (error) {
      console.error('Error fetching terminations:', error);
    }
  };

  useEffect(() => {
    fetchTerminations();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddNew = () => {
    setOpen(true); // Open the dialog
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terminations/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchTerminations();
      }
    } catch (error) {
      console.error('Error adding termination:', error);
    }
    setFormData({ employeeName: "", noticeDate: "", terminatedDate: "", reason: "" });
    setOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredTerminationData(terminationData); // If search term is empty, show all records
    } else {
      const filtered = terminationData.filter((data) =>
        data.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTerminationData(filtered);
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={3} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>


 
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Termination
        </Typography>
        <Typography>Configuration / Termination</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <TextField
              placeholder="Employee Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              placeholder="Department Name"
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="From"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="To"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNew}
              fullWidth
            >
              Add New
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#55CE63",
                width: "100%",
                padding: 1.5,
              }}
              onClick={handleSearch}
            >
              SEARCH
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Display the stored termination data */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Termination Records
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Notice Date</TableCell>
                <TableCell>Terminated Date</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTerminationData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.employeeName}</TableCell>
                  <TableCell>{data.noticeDate}</TableCell>
                  <TableCell>{data.terminatedDate}</TableCell>
                  <TableCell>{data.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Add Termination
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon color="error" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Termination Employee Name"
                name="employeeName"
                placeholder="Employee Name"
                variant="outlined"
                value={formData.employeeName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Date"
                name="noticeDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={formData.noticeDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Terminated Date"
                name="terminatedDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={formData.terminatedDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                placeholder="Reason"
                multiline
                rows={4}
                variant="outlined"
                value={formData.reason}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box width="100%" textAlign="center">
            <Button
              variant="contained"
              color="warning"
              onClick={handleSubmit}
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
    </Grid>
        </Grid>
      </Grid>
  );
};

export default EmployeeInputFields;























