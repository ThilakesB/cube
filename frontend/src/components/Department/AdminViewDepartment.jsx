import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  Button,
  Chip,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DomainIcon from "@mui/icons-material/Domain";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { API_BASE_URL } from "../../config/api";

const AdminDepartmentView = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/departments`);
      if (response.ok) {
        const apiDepts = await response.json();
        const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
        
        // Merge without duplicates
        const apiNames = new Set(apiDepts.map((d) => (d.departmentName || d.department_name || "").toLowerCase()));
        const uniqueLocal = localDepts.filter(
          (d) => !apiNames.has((d.departmentName || d.department_name || "").toLowerCase())
        );
        const combined = [...apiDepts, ...uniqueLocal];
        setDepartmentList(combined);
        setFilteredList(combined);
      } else {
        const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
        setDepartmentList(localDepts);
        setFilteredList(localDepts);
      }
    } catch (err) {
      console.warn("Could not fetch departments from backend:", err);
      const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
      setDepartmentList(localDepts);
      setFilteredList(localDepts);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredList(departmentList);
    } else {
      const filtered = departmentList.filter((d) => {
        const dName = (d.departmentName || d.department_name || "").toLowerCase();
        const section = (d.section || "").toLowerCase();
        const head = (d.headOfDepartment || d.head_of_department || d.manager || "").toLowerCase();
        return (
          dName.includes(term.toLowerCase()) ||
          section.includes(term.toLowerCase()) ||
          head.includes(term.toLowerCase())
        );
      });
      setFilteredList(filtered);
    }
    setPage(0);
  };

  const handleDeleteDepartment = async (dept) => {
    const dName = dept.departmentName || dept.department_name || "Department";
    const dId = dept.id || dName;

    if (!window.confirm(`Are you sure you want to delete "${dName}"?`)) {
      return;
    }

    try {
      if (dId) {
        await fetch(`${API_BASE_URL}/api/departments/${encodeURIComponent(dId)}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.warn("Error deleting department from backend:", err);
    }

    const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
    const updated = localDepts.filter(
      (d) => (d.departmentName || d.department_name || "") !== dName
    );
    localStorage.setItem("departmentData", JSON.stringify(updated));

    fetchDepartments();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedRows = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Grid container style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12}>
        <TopBar />
      </Grid>

      <Grid container>
        {/* Sidebar */}
        <Grid item xs={12} sm={3} md={2}>
          <Sidebar />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} sm={9} md={10} style={{ padding: "32px" }}>
          <Box sx={{ maxWidth: "1350px", mx: "auto" }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Departments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dashboard / Department Management
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/adddepartment"
                variant="contained"
                startIcon={<span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>}
                sx={{
                  background: "#004E69",
                  color: "white",
                  height: "44px",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": { background: "#003A4F" },
                }}
              >
                Add Department
              </Button>
            </Box>

            {/* Search and stats panel */}
            <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8} md={6}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Search by Department, Section, or Manager..."
                      value={searchTerm}
                      onChange={handleSearch}
                      sx={{
                        bgcolor: "#fff",
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={6} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
                    <Chip
                      icon={<DomainIcon />}
                      label={`Total Departments: ${filteredList.length}`}
                      sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 600 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Department Table */}
            <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }}>
                      Department Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }}>
                      Section / Division
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }}>
                      Head / Manager
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }}>
                      Parent Dept
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }} align="center">
                      Staff Count
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }}>
                      Budget / Expense
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }}>
                      Inventory & Assets
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px" }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.length > 0 ? (
                    displayedRows.map((dept, index) => {
                      const dName = dept.departmentName || dept.department_name || "Untitled";
                      const section = dept.section || "—";
                      const head = dept.headOfDepartment || dept.head_of_department || dept.manager || "Data Not Available";
                      const parent = dept.parentDepartment || dept.parent_department || "General";
                      const staff = dept.staffCount || dept.staff_count || "0";
                      const budget = dept.budgetExpense || dept.budget_expense || "—";
                      const inventory = dept.inventoryResources || dept.inventory_resources || "—";

                      return (
                        <TableRow
                          key={dept.id || index}
                          sx={{
                            backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F8FAFC",
                            "&:hover": { backgroundColor: "#F1F5F9" },
                          }}
                        >
                          <TableCell>
                            <Typography sx={{ fontWeight: 700, color: "#004E69", fontSize: "14px" }}>
                              {dName}
                            </Typography>
                            {dept.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {dept.description}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: "13px", color: "#334155" }}>
                              {section}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                              {head}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: "13px", color: "#64748b" }}>
                              {parent}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Chip
                              label={`${staff} Members`}
                              size="small"
                              sx={{
                                bgcolor: parseInt(staff, 10) > 0 ? "#E6F4EA" : "#F1F5F9",
                                color: parseInt(staff, 10) > 0 ? "#137333" : "#64748B",
                                fontWeight: 600,
                                fontSize: "12px",
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                              {budget}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Tooltip title={inventory} arrow>
                              <Typography sx={{ fontSize: "13px", color: "#64748b", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {inventory}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteDepartment(dept)}
                              sx={{
                                "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                          No departments found. Click <strong>+ Add Department</strong> to create one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      count={filteredList.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartmentView;
