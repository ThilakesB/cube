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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import BudgetExpenses from "./BudgetExpenses";
import BudgetRevenue from "./BudgetRevenue";
import Sidebar from "../Common_Bar/Sidebar";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";


const Accounting = () => {
  const [showCreateBudget, setShowCreateBudget] = useState(false);

  const [budgetData, setBudgetData] = useState([]);
  const [filteredbudgetData, setFilteredBudgetData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false); // Dialog state
  const [formData, setFormData] = useState({
    budgetTitle: "",
    budgetType: "",
    startDate: "",
    endDate: "",
    rate: "",
    priority: "",
    revenueTitle: "",
    revenueAmount: "",
    overallRevenues: "",
    expenseTitle: "",
    expenseAmount: "",
    overallExpenses: "",
    expectedProfit: "",
    tax: "",
    budgetAmount: "",
  });
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeComponent, setActiveComponent] = useState("");

  // Load and save data from/to local storage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("budgetData")) || [];
    setBudgetData(storedData);
    setFilteredBudgetData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("budgetData", JSON.stringify(budgetData));
  }, [budgetData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddNew = () => setOpenPopup(true);
  const handleOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({
      budgetTitle: "",
      budgetType: "",
      startDate: "",
      endDate: "",
      rate: "",
      priority: "",
      revenueTitle: "",
      revenueAmount: "",
      overallRevenues: "",
      expenseTitle: "",
      expenseAmount: "",
      overallExpenses: "",
      expectedProfit: "",
      tax: "",
      budgetAmount: "",
    });
  };

  const handleSave = () => {
    const updatedData = [...budgetData, formData];
    setBudgetData(updatedData);
    setFilteredBudgetData(updatedData);
    handleClosePopup(); // Close popup after save
  };
const handleBudgetRevenue=()=>{
  setShowCreateBudget(false);
  setActiveComponent("budgetrevenue")
}
const handleBudgetExpenses=()=>{
  setShowCreateBudget(false);
  setActiveComponent("budgetexpenses")
}
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
      <Box mb={12}>
        <Typography variant="h6" fontWeight="bold">
          Accounting
        </Typography>
        <Typography>Admin / Accounting / Budgets</Typography>
      </Box>

      <Grid container spacing={2} justifyContent="flex-start">
        <Grid item xs={12} sm={4} md={6}>
          <Button
            variant="contained"
            fullWidth
          
            onClick={() => {
              setShowCreateBudget(true);
              setActiveComponent("budget");
            }}
            sx={{
              backgroundColor: showCreateProject ? "#004E69" : "white",
              color: showCreateProject ? "white" : "black",
            }}
          >
            Budgets
          </Button>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: activeComponent === "taskView" ? "#004E69" : "white",
              color: activeComponent === "taskView" ? "white" : "black",
            }}
            onClick={handleBudgetRevenue}
          >
            Budgets Revenues
          </Button>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "#004E69",
                color: "white",
              },
            }}
            onClick={handleBudgetExpenses}
          >
            Budgets Expenses
          </Button>
        </Grid>
      </Grid>
      {showCreateBudget && activeComponent === "budget" &&(

        <>
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
                        onClick={handleOpenPopup}
                        sx={{
                          backgroundColor: "#FF902F",
                          borderRadius: "50px",
                          "&:hover": {
                            backgroundColor: "#FF902F",
                          },
                          color: "white",
                        }}
                      >
                        Add Budgets
                      </Button>
                    </Box>
      {/* Displaying Saved Data */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Budget Title</TableCell>
              <TableCell>Budget Type</TableCell>
              <TableCell>Total Revenue</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Expenses</TableCell>
              <TableCell>Tax Amount</TableCell>
              <TableCell>Budeget Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.budgetTitle}</TableCell>
                <TableCell>{data.budgetType}</TableCell>
                <TableCell>{data.overallRevenues}</TableCell>
                <TableCell>{data.startDate}</TableCell>
                <TableCell>{data.endDate}</TableCell>
                <TableCell>{data.overallExpenses}</TableCell>
                <TableCell>{data.tax}</TableCell>
                <TableCell>{data.budgetAmount}</TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    onClick={() =>
                      setBudgetData(budgetData.filter((_, i) => i !== index))
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </> 
      )}
      {/* Dialog for adding new budget */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
  <DialogTitle>Add Budget</DialogTitle>
  <DialogContent>
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography>Budget Title</Typography>
      <TextField
        name="budgetTitle"
        label="Budget Title"
        fullWidth
        value={formData.budgetTitle}
        onChange={handleInputChange}
      />

      <Typography>Choose Budget Respect Type</Typography>
      <TextField
        name="budgetType"
        label="Choose Budget Respect Type"
        fullWidth
        value={formData.budgetType}
        onChange={handleInputChange}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>Start Date</Typography>
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            value={formData.startDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>End Date</Typography>
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            value={formData.endDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>Rate</Typography>
          <TextField
            name="rate"
            label="Rate"
            fullWidth
            value={formData.rate}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Priority</Typography>
          <TextField
            name="priority"
            label="Priority"
            fullWidth
            value={formData.priority}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">Expected Revenues</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>Revenue Title</Typography>
          <TextField
            name="revenueTitle"
            label="Revenue Title"
            fullWidth
            value={formData.revenueTitle}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Revenue Amount</Typography>
          <TextField
            name="revenueAmount"
            label="Revenue Amount"
            fullWidth
            value={formData.revenueAmount}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Typography>Overall Revenues (A)</Typography>
      <TextField
        name="overallRevenues"
        label="Overall Revenues"
        fullWidth
        value={formData.overallRevenues}
        onChange={handleInputChange}
      />

      <Typography variant="h6">Expected Expenses</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>Expenses Title</Typography>
          <TextField
            name="expenseTitle"
            label="Expenses Title"
            fullWidth
            value={formData.expenseTitle}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Expenses Amount</Typography>
          <TextField
            name="expenseAmount"
            label="Expenses Amount"
            fullWidth
            value={formData.expenseAmount}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Typography>Overall Expenses (B)</Typography>
      <TextField
        name="overallExpenses"
        label="Overall Expenses"
        fullWidth
        value={formData.overallExpenses}
        onChange={handleInputChange}
      />

      <Typography>Expected Profit (C = A - B)</Typography>
      <TextField
        name="expectedProfit"
        label="Expected Profit"
        fullWidth
        value={formData.expectedProfit}
        onChange={handleInputChange}
      />

      <Typography>Tax (D)</Typography>
      <TextField
        name="tax"
        label="Tax"
        fullWidth
        value={formData.tax}
        onChange={handleInputChange}
      />

      <Typography>Budget Amount (E = C - D)</Typography>
      <TextField
        name="budgetAmount"
        label="Budget Amount"
        fullWidth
        multiline
        value={formData.budgetAmount}
        onChange={handleInputChange}
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosePopup}>Cancel</Button>
    <Button onClick={handleSave} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog>
{activeComponent === "budgetrevenue" && <BudgetRevenue />}
{activeComponent === "budgetexpenses" && <BudgetExpenses />}
    </LocalizationProvider>
    </Grid>
        </Grid>
      </Grid>
  );
};

export default Accounting;


