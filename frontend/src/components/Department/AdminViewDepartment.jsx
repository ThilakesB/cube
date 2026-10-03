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
  Dialog,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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

  // Sweet custom delete dialog state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

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

  const openDeleteModal = (dept) => {
    setDeptToDelete(dept);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deptToDelete) return;
    const dName = deptToDelete.departmentName || deptToDelete.department_name || "Department";
    const dId = deptToDelete.id || dName;

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

    setDeleteModalOpen(false);
    setDeptToDelete(null);
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

  // 4 Dynamic Dashboard KPI Cards
  const totalDepartments = departmentList.length;
  const totalStaff = departmentList.reduce(
    (acc, d) => acc + (parseInt(d.staffCount || d.staff_count, 10) || 0),
    0
  );
  const activeDivisions = new Set(
    departmentList.map((d) => d.section || d.parentDepartment || d.parent_department).filter(Boolean)
  ).size || (totalDepartments > 0 ? 1 : 0);

  const appointedLeads = departmentList.filter((d) => {
    const head = d.headOfDepartment || d.head_of_department || d.manager;
    return head && head !== "Data Not Available" && head.trim() !== "";
  }).length;

  const dashboardCards = [
    {
      id: "total_depts",
      label: "TOTAL DEPARTMENTS",
      value: totalDepartments,
      subtitle: "Active operational units",
      icon: <CorporateFareRoundedIcon sx={{ fontSize: 26, color: "#4F46E5" }} />,
      iconBg: "#EEF2FF",
      borderAccent: "#E0E7FF",
      trendText: "100% Active",
      trendColor: "#4F46E5",
    },
    {
      id: "total_staff",
      label: "TOTAL WORKFORCE",
      value: totalStaff,
      subtitle: "Allocated staff members",
      icon: <GroupsRoundedIcon sx={{ fontSize: 26, color: "#059669" }} />,
      iconBg: "#ECFDF5",
      borderAccent: "#D1FAE5",
      trendText: "Full capacity",
      trendColor: "#059669",
    },
    {
      id: "divisions",
      label: "ACTIVE DIVISIONS",
      value: activeDivisions,
      subtitle: "Functional sections",
      icon: <HubRoundedIcon sx={{ fontSize: 26, color: "#7C3AED" }} />,
      iconBg: "#F5F3FF",
      borderAccent: "#EDE9FE",
      trendText: "Structured",
      trendColor: "#7C3AED",
    },
    {
      id: "leads",
      label: "DEPARTMENT LEADS",
      value: appointedLeads,
      subtitle: "Appointed managers",
      icon: <SupervisorAccountRoundedIcon sx={{ fontSize: 26, color: "#D97706" }} />,
      iconBg: "#FFFBEB",
      borderAccent: "#FEF3C7",
      trendText: `${appointedLeads}/${totalDepartments} Assigned`,
      trendColor: "#D97706",
    },
  ];

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
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
        <Grid item xs={12} sm={9} md={10} sx={{ padding: { xs: 2, sm: 3.5 }, backgroundColor: "#F8FAFC" }}>
          <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
            {/* Header */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              mb={3.5}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Departments Directory
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.3 }}>
                  Manage departmental structures, headcount distribution, and leadership assignments
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                {/* View Switchers */}
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "#FFFFFF",
                    p: 0.5,
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Button
                    component={Link}
                    to="/"
                    size="small"
                    startIcon={<ViewModuleRoundedIcon fontSize="small" />}
                    sx={{
                      color: "#64748B",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
                    }}
                  >
                    Cards
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<TableRowsRoundedIcon fontSize="small" />}
                    sx={{
                      bgcolor: "#004E69",
                      color: "#FFFFFF",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#003A4F" },
                    }}
                  >
                    Table
                  </Button>
                </Box>

                <Button
                  component={Link}
                  to="/adddepartment"
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #004E69 0%, #0284C7 100%)",
                    color: "white",
                    height: "40px",
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    px: 2.5,
                    boxShadow: "0 2px 6px rgba(0, 78, 105, 0.25)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #003A4F 0%, #0369A1 100%)",
                      boxShadow: "0 4px 10px rgba(0, 78, 105, 0.35)",
                    },
                  }}
                >
                  Add Department
                </Button>
              </Box>
            </Box>

            {/* 4 Dashboard KPI Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {dashboardCards.map((metric) => (
                <Grid item xs={12} sm={6} lg={3} key={metric.id}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 20px -4px rgba(0, 0, 0, 0.08)",
                        borderColor: metric.borderAccent,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#64748B",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            {metric.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "28px",
                              fontWeight: 800,
                              color: "#0F172A",
                              lineHeight: 1.15,
                              mt: 0.6,
                              mb: 0.4,
                            }}
                          >
                            {metric.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94A3B8", fontWeight: 500, fontSize: "12px" }}
                          >
                            {metric.subtitle}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            backgroundColor: metric.iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {metric.icon}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mt: 2,
                          pt: 1.5,
                          borderTop: "1px solid #F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <TrendingUpRoundedIcon sx={{ fontSize: 16, color: metric.trendColor }} />
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: metric.trendColor,
                            }}
                          >
                            {metric.trendText}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "11px" }}>
                          Live sync
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Search and Filters Bar */}
            <Card
              sx={{
                mb: 3,
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                bgcolor: "#FFFFFF",
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8} md={6}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Search by Department, Division, or Manager..."
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: <SearchRoundedIcon sx={{ color: "#94A3B8", mr: 1, fontSize: 20 }} />,
                      }}
                      sx={{
                        bgcolor: "#F8FAFC",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: "#CBD5E1" },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={6} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
                    <Chip
                      icon={<CorporateFareRoundedIcon sx={{ fontSize: "16px !important" }} />}
                      label={`Showing ${filteredList.length} of ${departmentList.length} Units`}
                      sx={{
                        bgcolor: "#F1F5F9",
                        color: "#334155",
                        fontWeight: 600,
                        fontSize: "12px",
                        borderRadius: "8px",
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Department Table */}
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                overflow: "hidden",
                bgcolor: "#FFFFFF",
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }}>
                      Department Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }}>
                      Section / Division
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }}>
                      Head / Manager
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }}>
                      Parent Dept
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }} align="center">
                      Staff Count
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }}>
                      Budget / Expense
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }}>
                      Inventory & Assets
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "13px", py: 2 }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.length > 0 ? (
                    displayedRows.map((dept, index) => {
                      const dName = dept.departmentName || dept.department_name || "Untitled";
                      const section = dept.section || "—";
                      const head = dept.headOfDepartment || dept.head_of_department || dept.manager || "Unassigned";
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
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: "#004E69", fontSize: "14px" }}>
                              {dName}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={section}
                              size="small"
                              sx={{
                                bgcolor: "#EFF6FF",
                                color: "#1D4ED8",
                                fontWeight: 600,
                                fontSize: "11px",
                                borderRadius: "6px",
                              }}
                            />
                          </TableCell>

                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                              {head}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "13px", color: "#64748B" }}>
                              {parent}
                            </Typography>
                          </TableCell>

                          <TableCell align="center" sx={{ py: 2 }}>
                            <Chip
                              label={`${staff} Staff`}
                              size="small"
                              sx={{
                                bgcolor: "#ECFDF5",
                                color: "#059669",
                                fontWeight: 700,
                                fontSize: "11px",
                                borderRadius: "6px",
                              }}
                            />
                          </TableCell>

                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "13px", color: "#334155" }}>
                              {budget}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ py: 2 }}>
                            <Tooltip title={inventory} arrow>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  color: "#64748B",
                                  maxWidth: "140px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {inventory}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          <TableCell align="center" sx={{ py: 2 }}>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteModal(dept)}
                              sx={{
                                color: "#EF4444",
                                bgcolor: "#FEE2E2",
                                borderRadius: "8px",
                                width: 32,
                                height: 32,
                                "&:hover": { bgcolor: "#FCA5A5", color: "#B91C1C" },
                                transition: "all 0.2s",
                              }}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                          No departments found matching search criteria.
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

      {/* Sweet Compact Delete Department Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            mx: 2,
          },
        }}
      >
        <Box sx={{ p: 3.5, position: "relative", width: "100%", boxSizing: "border-box" }}>
          <IconButton
            onClick={() => setDeleteModalOpen(false)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#9CA3AF",
              "&:hover": { color: "#374151", bgcolor: "#F3F4F6" },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", pt: 0.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                color: "#EF4444",
              }}
            >
              <DeleteOutlineRoundedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#111827", mb: 1 }}>
              Delete Department
            </Typography>

            <Typography sx={{ fontWeight: 400, fontSize: "14px", color: "#6B7280", lineHeight: 1.5, px: 1, mb: 3 }}>
              Are you sure you want to delete{" "}
              <Typography component="span" sx={{ fontWeight: 600, color: "#1F2937", fontSize: "14px" }}>
                "{deptToDelete?.departmentName || deptToDelete?.department_name || "this department"}"
              </Typography>
              ? This action cannot be undone.
            </Typography>

            <Box sx={{ display: "flex", width: "100%", gap: 1.5, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteModalOpen(false)}
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  bgcolor: "#FFFFFF",
                  "&:hover": { bgcolor: "#F9FAFB", borderColor: "#D1D5DB" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDelete}
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  bgcolor: "#DC2626",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  boxShadow: "0 1px 3px 0 rgba(220, 38, 38, 0.35)",
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Grid>
  );
};

export default AdminDepartmentView;
