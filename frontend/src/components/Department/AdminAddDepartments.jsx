import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import GlobalFormLayout from "../Common_Bar/GlobalFormLayout";
import { API_BASE_URL } from "../../config/api";

const AdminAddDepartment = () => {
  const navigate = useNavigate();

  const [employeesList, setEmployeesList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    departmentName: "",
    section: "",
    headOfDepartment: "",
    parentDepartment: "",
    staffCount: "",
    budgetExpense: "",
    inventoryResources: "",
    description: "",
  });

  // Fetch employees for Head of Department picker
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees`);
        if (response.ok) {
          const data = await response.json();
          setEmployeesList(data || []);
        }
      } catch (err) {
        console.warn("Could not fetch employees for department head picker:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.departmentName.trim()) {
      setError("Department Name is required.");
      return;
    }

    setError("");

    try {
      try {
        await fetch(`${API_BASE_URL}/api/departments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (backendErr) {
        console.warn("Backend not reachable, saving locally:", backendErr);
      }

      const existing = JSON.parse(localStorage.getItem("departmentData")) || [];
      localStorage.setItem("departmentData", JSON.stringify([...existing, formData]));
      setSuccess("Department created successfully!");
      setTimeout(() => navigate("/department"), 600);
    } catch (e) {
      console.error("Error creating department:", e);
      setError("Failed to create department.");
    }
  };

  const handleCancel = () => {
    navigate("/department");
  };

  return (
    <GlobalFormLayout title="Add Department" backLink="/department">
      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: "950px", mx: "auto", borderRadius: "10px" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, maxWidth: "950px", mx: "auto", borderRadius: "10px" }}>
          {success}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: "950px", mx: "auto" }}
      >
        {/* Card 1: Core Department Identification */}
        <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: "700", fontSize: "16px", color: "#004E69", mb: 2 }}>
              1. Department & Section Details
            </Typography>

            <Grid container spacing={3}>
              {/* Department Name */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Department Name *
                </Typography>
                <TextField
                  value={formData.departmentName}
                  onChange={handleChange("departmentName")}
                  placeholder="e.g. Engineering, Sales, Human Resources"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    "& .MuiInputBase-root": { height: "50px", bgcolor: "#fff" },
                    "& .MuiInputBase-input": { padding: "0 14px" },
                  }}
                />
              </Grid>

              {/* Section / Division */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Section / Division
                </Typography>
                <TextField
                  value={formData.section}
                  onChange={handleChange("section")}
                  placeholder="e.g. Frontend Team, QA Division, Accounts Section"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    "& .MuiInputBase-root": { height: "50px", bgcolor: "#fff" },
                    "& .MuiInputBase-input": { padding: "0 14px" },
                  }}
                />
              </Grid>

              {/* Head of Department / Manager */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Head of Department / Manager
                </Typography>
                {employeesList.length > 0 ? (
                  <FormControl fullWidth>
                    <Select
                      value={formData.headOfDepartment}
                      onChange={handleChange("headOfDepartment")}
                      displayEmpty
                      sx={{
                        height: "50px",
                        borderRadius: "10px",
                        border: "1px solid #D0D0D0",
                        bgcolor: "#fff",
                      }}
                    >
                      <MenuItem value="">
                        <em>-- Select or Enter Manager --</em>
                      </MenuItem>
                      {employeesList.map((emp) => {
                        const name = `${emp.first_name || emp.firstname || ""} ${emp.last_name || emp.lastname || ""}`.trim() || emp.name;
                        return (
                          <MenuItem key={emp.id || name} value={name}>
                            {name} ({emp.staff_id || emp.staffId || `ID:${emp.id}`})
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    value={formData.headOfDepartment}
                    onChange={handleChange("headOfDepartment")}
                    placeholder="Enter Head of Department Name"
                    fullWidth
                    sx={{
                      borderRadius: "10px",
                      border: "1px solid #D0D0D0",
                      "& .MuiInputBase-root": { height: "50px", bgcolor: "#fff" },
                      "& .MuiInputBase-input": { padding: "0 14px" },
                    }}
                  />
                )}
              </Grid>

              {/* Parent Department */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Parent Department
                </Typography>
                <TextField
                  value={formData.parentDepartment}
                  onChange={handleChange("parentDepartment")}
                  placeholder="e.g. Technology Division, Operations Head"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    "& .MuiInputBase-root": { height: "50px", bgcolor: "#fff" },
                    "& .MuiInputBase-input": { padding: "0 14px" },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card 2: Resource, Capacity & Financial Allocation */}
        <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: "700", fontSize: "16px", color: "#004E69", mb: 2 }}>
              2. Staff Count, Budget & Resource Management
            </Typography>

            <Grid container spacing={3}>
              {/* Staff Count */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Total Staff / Members Count
                </Typography>
                <TextField
                  type="number"
                  value={formData.staffCount}
                  onChange={handleChange("staffCount")}
                  placeholder="e.g. 15"
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    "& .MuiInputBase-root": { height: "50px", bgcolor: "#fff" },
                    "& .MuiInputBase-input": { padding: "0 14px" },
                  }}
                />
              </Grid>

              {/* Average Budget / Expense */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Average Expense / Budget Allocation
                </Typography>
                <TextField
                  value={formData.budgetExpense}
                  onChange={handleChange("budgetExpense")}
                  placeholder="e.g. $25,000 / month"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    "& .MuiInputBase-root": { height: "50px", bgcolor: "#fff" },
                    "& .MuiInputBase-input": { padding: "0 14px" },
                  }}
                />
              </Grid>

              {/* Inventory & Equipment Needs */}
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Department Inventory, Stores & Equipment Allocated
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  value={formData.inventoryResources}
                  onChange={handleChange("inventoryResources")}
                  placeholder="List hardware, software licenses, lab machines, stationery, and equipment in store..."
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    bgcolor: "#fff",
                  }}
                />
              </Grid>

              {/* Total Description */}
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212", mb: 1 }}>
                  Department Overview & Responsibilities
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Detail the operational scope, responsibilities, and objectives of the department..."
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #D0D0D0",
                    bgcolor: "#fff",
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: "20px", mt: 4, mb: 4 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: "160px",
              backgroundColor: "#004E69",
              borderRadius: "10px",
              color: "#fff",
              height: "48px",
              textTransform: "none",
              fontWeight: "700",
              fontSize: "15px",
              "&:hover": { backgroundColor: "#003A4F" },
            }}
          >
            Save Department
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              minWidth: "120px",
              borderColor: "#004E69",
              color: "#004E69",
              borderRadius: "10px",
              height: "48px",
              textTransform: "none",
              fontWeight: "700",
              fontSize: "15px",
              "&:hover": { borderColor: "#003A4F", bgcolor: "rgba(0, 78, 105, 0.04)" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </GlobalFormLayout>
  );
};

export default AdminAddDepartment;
