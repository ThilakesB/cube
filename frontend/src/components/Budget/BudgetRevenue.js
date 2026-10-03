import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  FormControl,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { API_BASE_URL } from '../../config/api';


const BudgetRevenue = () => {
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeComponent, setActiveComponent] = useState("");
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Fetch data from backend
  const fetchRevenues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/budget-revenues`);
      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.revenues || []);
      }
    } catch (error) {
      console.error('Error fetching budget revenues:', error);
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddNew = () => setOpenPopup(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/budget-revenues/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchRevenues();
      }
    } catch (error) {
      console.error('Error saving budget revenue:', error);
    }
    handleClosePopup();
  };

  const handleDelete = async (id, index) => {
    if (id) {
      try {
        await fetch(`${API_BASE_URL}/api/budget-revenues/${id}`, { method: 'DELETE' });
        await fetchRevenues();
      } catch (error) {
        console.error('Error deleting budget revenue:', error);
      }
    } else {
      setBudgetData(budgetData.filter((_, i) => i !== index));
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Access the selected file
    if (file) {
      console.log("Selected file:", file.name); // Optional: Log the file name
      // Add any additional logic to handle the file, e.g., upload or validate
    }
  };
  return (
   
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        
        <Button
          variant="contained"
          startIcon={
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
          }
          onClick={handleAddNew}
          sx={{
            backgroundColor: "#FF902F",
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: "#FF902F",
            },
            color: "white",
          }}
        >
         Add Budget Revenue
        </Button>
      </Box>

      {/* Conditionally render TableContainer on desktop screens */}
      {isDesktop && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Notes</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Revenue Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.notes}</TableCell>
                  <TableCell>{data.category}</TableCell>
                  <TableCell>{data.amount}</TableCell>
                  <TableCell>{data.revenueDate}</TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(data.id || data._id, index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Adding Budgets */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add Budget Revenue
            <IconButton onClick={handleClosePopup}>
              <CloseIcon color="error" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Amount
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="amount"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Notes
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Revenue Date
                </Typography>
                <TextField
                  fullWidth
                  name="revenueDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.revenueDate || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Category
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="category"
                    value={formData.category || ""}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Category 1">Category 1</MenuItem>
                    <MenuItem value="Category 2">Category 2</MenuItem>
                    <MenuItem value="Category 3">Category 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
                 {/* Sub-Category Dropdown */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Sub-Category
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="subCategory"
                          value={formData.subCategory || ""}
                          onChange={handleInputChange}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select a Sub-Category
                          </MenuItem>
                          <MenuItem value="SubCategory 1">SubCategory 1</MenuItem>
                          <MenuItem value="SubCategory 2">SubCategory 2</MenuItem>
                          <MenuItem value="SubCategory 3">SubCategory 3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
              
                    {/* File Upload */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Attach File
                      </Typography>
                      <TextField
                        type="file"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          accept: ".pdf, .doc, .docx, .png, .jpg, .jpeg", // Specify allowed file types
                        }}
                        onChange={handleFileChange}
                      />
                    </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
   
  );
};

export default BudgetRevenue;


