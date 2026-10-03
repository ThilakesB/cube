import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Box,
  IconButton,
  Grid,
  Pagination,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalanceWalletRounded,
  PeopleAltRounded,
  TrendingUpRounded,
  ReceiptLongRounded,
  SearchRounded,
  AddRounded,
  RefreshRounded,
  GridViewRounded,
  FormatListBulletedRounded,
  DeleteOutlineRounded,
  VisibilityRounded,
  FileDownloadRounded,
  WarningAmberRounded,
  BadgeRounded,
  CalendarTodayRounded,
  WorkOutlineRounded,
  AttachMoneyRounded,
} from "@mui/icons-material";
import emp1 from "../../assets/emp1.png";
import emp2 from "../../assets/emp2.png";
import emp3 from "../../assets/emp3.png";
import Layout from "../Common_Bar/Layout";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const initialDefaultEmployees = [
  {
    name: "Bernardo Galaviz",
    id: "FT-0007",
    email: "bernardogalaviz@example.com",
    mobile: "9876543210",
    joinDate: "2023-01-15",
    role: "Web Developer",
    basic: 35000,
    da: 4000,
    hra: 5000,
    allowance: 2000,
    tds: 500,
    pf: 500,
    salary: 45000,
    netSalary: 45000,
    image: emp1,
  },
  {
    name: "Jeffrey Warden",
    id: "FT-0008",
    email: "jeffreywarden@example.com",
    mobile: "9876543211",
    joinDate: "2023-03-01",
    role: "UI/UX Designer",
    basic: 30000,
    da: 3500,
    hra: 4500,
    allowance: 3000,
    tds: 500,
    pf: 500,
    salary: 40000,
    netSalary: 40000,
    image: emp2,
  },
  {
    name: "John Doe",
    id: "FT-0009",
    email: "johndoe@example.com",
    mobile: "9876543212",
    joinDate: "2022-08-10",
    role: "Backend Developer",
    basic: 38000,
    da: 4000,
    hra: 5500,
    allowance: 2000,
    tds: 800,
    pf: 700,
    salary: 48000,
    netSalary: 48000,
    image: emp3,
  },
  {
    name: "Sarah Jenkins",
    id: "FT-0010",
    email: "sarah.j@example.com",
    mobile: "9876543215",
    joinDate: "2023-06-20",
    role: "Product Manager",
    basic: 52000,
    da: 6000,
    hra: 8000,
    allowance: 4000,
    tds: 1500,
    pf: 1500,
    salary: 67000,
    netSalary: 67000,
    image: null,
  },
  {
    name: "Michael Chang",
    id: "FT-0011",
    email: "michael.c@example.com",
    mobile: "9876543216",
    joinDate: "2024-01-10",
    role: "DevOps Engineer",
    basic: 44000,
    da: 5000,
    hra: 6000,
    allowance: 3000,
    tds: 1000,
    pf: 1000,
    salary: 56000,
    netSalary: 56000,
    image: null,
  },
];

const Payroll = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sortBy: "default",
  });

  const [allEmployeesList, setAllEmployeesList] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("payrollData")) || [];
      const combined = [...stored];
      const uniqueIds = new Set(combined.map((e) => e.id));
      const remainingDefault = initialDefaultEmployees.filter(
        (e) => !uniqueIds.has(e.id)
      );
      return [...combined, ...remainingDefault];
    } catch (e) {
      return initialDefaultEmployees;
    }
  });

  const fetchSalaries = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/salaries`);
      if (response.ok) {
        const apiSalaries = await response.json();
        const stored = JSON.parse(localStorage.getItem("payrollData")) || [];
        const combined = [...apiSalaries, ...stored];
        const uniqueIds = new Set(combined.map((e) => e.id));
        const remainingDefault = initialDefaultEmployees.filter(
          (e) => !uniqueIds.has(e.id)
        );
        const all = [...combined, ...remainingDefault];
        setAllEmployeesList(all);
      }
    } catch (err) {
      console.warn("Could not fetch salaries from backend, using local store:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Filter and Sort
  const processedEmployees = allEmployeesList
    .filter((emp) => {
      const matchesSearch =
        !filters.search ||
        (emp.name || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (emp.id || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (emp.email || "").toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || emp.role === filters.role;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const salA = Number(a.netSalary || a.salary || 0);
      const salB = Number(b.netSalary || b.salary || 0);
      if (filters.sortBy === "salary-high") return salB - salA;
      if (filters.sortBy === "salary-low") return salA - salB;
      if (filters.sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      if (employeeToDelete.db_id || typeof employeeToDelete.id === "number") {
        await fetch(`${API_BASE_URL}/api/salaries/${employeeToDelete.db_id || employeeToDelete.id}`, {
          method: "DELETE",
        });
      }
    } catch (e) {
      console.warn("Delete backend sync skipped:", e);
    }

    const updated = allEmployeesList.filter((e) => e.id !== employeeToDelete.id);
    setAllEmployeesList(updated);

    try {
      const stored = JSON.parse(localStorage.getItem("payrollData")) || [];
      const updatedStored = stored.filter((e) => e.id !== employeeToDelete.id);
      localStorage.setItem("payrollData", JSON.stringify(updatedStored));
    } catch (e) {
      console.error(e);
    }

    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const exportCSV = () => {
    const headers = ["Employee ID,Name,Role,Email,Mobile,Join Date,Basic,Net Salary"];
    const rows = processedEmployees.map(
      (e) =>
        `"${e.id}","${e.name}","${e.role}","${e.email || ""}","${e.mobile || ""}","${e.joinDate || ""}","₹${e.basic || 0}","₹${e.netSalary || e.salary || 0}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `payroll_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // KPI Calculations
  const totalOutflow = allEmployeesList.reduce(
    (sum, e) => sum + (Number(e.netSalary || e.salary) || 0),
    0
  );
  const activeStaffCount = allEmployeesList.length;
  const avgSalary = activeStaffCount > 0 ? Math.round(totalOutflow / activeStaffCount) : 0;
  const totalDeductions = allEmployeesList.reduce((sum, e) => {
    const tds = Number(e.tds) || 0;
    const pf = Number(e.pf) || 0;
    const esi = Number(e.esi) || 0;
    const pt = Number(e.profTax) || 0;
    return sum + tds + pf + esi + pt;
  }, 0);

  const uniqueRoles = [...new Set(allEmployeesList.map((emp) => emp.role).filter(Boolean))];

  return (
    <Layout>
      <Box sx={{ pb: 6 }}>
        {/* Top Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, letterSpacing: "0.5px" }}>
              ADMIN / PAYROLL / SALARY DISBURSEMENT
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", mt: 0.5 }}>
              Payroll Management
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
              Monitor employee compensation, deductions, tax compliance, and generate payslips
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Tooltip title="Refresh Payroll Data">
              <IconButton
                onClick={fetchSalaries}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  color: "#4B5563",
                  "&:hover": { backgroundColor: "#F9FAFB" },
                }}
              >
                <RefreshRounded
                  sx={{
                    animation: isRefreshing ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              startIcon={<FileDownloadRounded />}
              onClick={exportCSV}
              sx={{
                borderColor: "#E5E7EB",
                color: "#374151",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                backgroundColor: "white",
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Export CSV
            </Button>

            <Button
              component={Link}
              to="/addsalary"
              variant="contained"
              startIcon={<AddRounded />}
              sx={{
                backgroundColor: "#7B61FF",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.92rem",
                borderRadius: "10px",
                px: 2.5,
                py: 1,
                boxShadow: "0 4px 14px rgba(123, 97, 255, 0.35)",
                "&:hover": { backgroundColor: "#624BCC" },
              }}
            >
              Add Staff Salary
            </Button>
          </Box>
        </Box>

        {/* 4 KPI Dashboard Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Card 1: Total Payroll Expense */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                p: 2.5,
                border: "1px solid #E9EDF4",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #FAF8FF 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600, fontSize: "0.85rem" }}>
                    Total Monthly Outflow
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#7B61FF", mt: 1 }}>
                    ₹{totalOutflow.toLocaleString("en-IN")}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <TrendingUpRounded sx={{ fontSize: 16 }} /> Active Payroll Budget
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#F4F0FF",
                    color: "#7B61FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountBalanceWalletRounded sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Card 2: Salaried Staff */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                p: 2.5,
                border: "1px solid #E9EDF4",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F6FCFD 100%)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600, fontSize: "0.85rem" }}>
                    Active Salaried Staff
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#004E69", mt: 1 }}>
                    {activeStaffCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 500, mt: 0.5, display: "block" }}>
                    100% on active roster
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#E0F2FE",
                    color: "#0284C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleAltRounded sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Card 3: Avg Monthly Compensation */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                p: 2.5,
                border: "1px solid #E9EDF4",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F9FFF8 100%)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600, fontSize: "0.85rem" }}>
                    Average Net Pay
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#059669", mt: 1 }}>
                    ₹{avgSalary.toLocaleString("en-IN")}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#059669", fontWeight: 500, mt: 0.5, display: "block" }}>
                    Per employee / month
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#ECFDF5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AttachMoneyRounded sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Card 4: Deductions & Compliance */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: "16px",
                p: 2.5,
                border: "1px solid #E9EDF4",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #FFFDF8 100%)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600, fontSize: "0.85rem" }}>
                    Taxes & Deductions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#D97706", mt: 1 }}>
                    ₹{totalDeductions.toLocaleString("en-IN")}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#B45309", fontWeight: 500, mt: 0.5, display: "block" }}>
                    TDS, PF, ESI, Prof Tax
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#FEF3C7",
                    color: "#D97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReceiptLongRounded sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Search & Filter Toolbar */}
        <Card
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "14px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search staff by name, ID, email..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ color: "#9CA3AF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                size="small"
                displayEmpty
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                sx={{ borderRadius: "10px", backgroundColor: "#F9FAFB" }}
              >
                <MenuItem value="">All Designations</MenuItem>
                {uniqueRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                size="small"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                sx={{ borderRadius: "10px", backgroundColor: "#F9FAFB" }}
              >
                <MenuItem value="default">Sort by: Default</MenuItem>
                <MenuItem value="salary-high">Salary: High to Low</MenuItem>
                <MenuItem value="salary-low">Salary: Low to High</MenuItem>
                <MenuItem value="name-asc">Name: A - Z</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box
                sx={{
                  display: "flex",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  p: 0.3,
                  backgroundColor: "#F9FAFB",
                }}
              >
                <Tooltip title="Table View">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode("table")}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: viewMode === "table" ? "white" : "transparent",
                      boxShadow: viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                      color: viewMode === "table" ? "#7B61FF" : "#6B7280",
                    }}
                  >
                    <FormatListBulletedRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Card Grid View">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode("grid")}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: viewMode === "grid" ? "white" : "transparent",
                      boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                      color: viewMode === "grid" ? "#7B61FF" : "#6B7280",
                    }}
                  >
                    <GridViewRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Content Section: Table vs Grid */}
        {processedEmployees.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "16px",
              border: "1px dashed #D1D5DB",
              backgroundColor: "white",
            }}
          >
            <ReceiptLongRounded sx={{ fontSize: 48, color: "#9CA3AF", mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#374151" }}>
              No payroll records found
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5, mb: 2 }}>
              Try adjusting your search criteria or add new staff salary records.
            </Typography>
            <Button
              component={Link}
              to="/addsalary"
              variant="contained"
              startIcon={<AddRounded />}
              sx={{
                backgroundColor: "#7B61FF",
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#624BCC" },
              }}
            >
              Add Staff Salary
            </Button>
          </Card>
        ) : viewMode === "table" ? (
          /* Table View */
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#374151", py: 2 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Join Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Basic Pay</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Net Salary</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#374151" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((emp) => {
                  const net = Number(emp.netSalary || emp.salary || 0);
                  const basic = Number(emp.basic || 0);

                  return (
                    <TableRow
                      key={emp.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Employee Info */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {emp.image ? (
                            <Avatar
                              src={emp.image}
                              alt={emp.name}
                              sx={{ width: 42, height: 42, border: "2px solid #F3F4F6" }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 42,
                                height: 42,
                                bgcolor: "#7B61FF",
                                fontWeight: 700,
                                fontSize: "1rem",
                              }}
                            >
                              {(emp.name || "U")[0]}
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
                              {emp.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6B7280" }}>
                              {emp.email || "No email"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Employee ID */}
                      <TableCell>
                        <Chip
                          label={emp.id}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontFamily: "monospace",
                            backgroundColor: "#F3F4F6",
                            color: "#374151",
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>

                      {/* Role / Designation */}
                      <TableCell>
                        <Chip
                          label={emp.role || "Staff"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: "#F4F0FF",
                            color: "#7B61FF",
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>

                      {/* Join Date */}
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#4B5563" }}>
                          {emp.joinDate || "—"}
                        </Typography>
                      </TableCell>

                      {/* Basic Pay */}
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                          {basic > 0 ? `₹${basic.toLocaleString("en-IN")}` : "—"}
                        </Typography>
                      </TableCell>

                      {/* Net Salary */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "8px",
                            backgroundColor: "#ECFDF5",
                            color: "#047857",
                            fontWeight: 800,
                            fontSize: "0.95rem",
                          }}
                        >
                          ₹{net.toLocaleString("en-IN")}
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ReceiptLongRounded sx={{ fontSize: 16 }} />}
                            onClick={() => navigate(`/slip/${emp.id}`)}
                            sx={{
                              backgroundColor: "#7B61FF",
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              borderRadius: "8px",
                              px: 1.5,
                              py: 0.6,
                              boxShadow: "0 2px 6px rgba(123, 97, 255, 0.25)",
                              "&:hover": { backgroundColor: "#624BCC" },
                            }}
                          >
                            Payslip
                          </Button>

                          <Tooltip title="Delete salary record">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEmployeeToDelete(emp);
                                setDeleteDialogOpen(true);
                              }}
                              sx={{
                                color: "#EF4444",
                                backgroundColor: "#FEF2F2",
                                borderRadius: "8px",
                                p: 0.8,
                                "&:hover": { backgroundColor: "#FEE2E2" },
                              }}
                            >
                              <DeleteOutlineRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* Cards Grid View */
          <Grid container spacing={2.5}>
            {currentItems.map((emp) => {
              const net = Number(emp.netSalary || emp.salary || 0);
              const basic = Number(emp.basic || 0);

              return (
                <Grid item xs={12} sm={6} md={4} key={emp.id}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(123, 97, 255, 0.12)",
                        borderColor: "#DDD6FE",
                      },
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Card Header: Avatar, Name, Role & Delete Button */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {emp.image ? (
                            <Avatar src={emp.image} alt={emp.name} sx={{ width: 48, height: 48 }} />
                          ) : (
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "#7B61FF",
                                fontWeight: 700,
                              }}
                            >
                              {(emp.name || "U")[0]}
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                              {emp.name}
                            </Typography>
                            <Chip
                              label={emp.id}
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 20,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                fontFamily: "monospace",
                                backgroundColor: "#F3F4F6",
                              }}
                            />
                          </Box>
                        </Box>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setEmployeeToDelete(emp);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{
                            color: "#9CA3AF",
                            "&:hover": { color: "#EF4444", backgroundColor: "#FEF2F2" },
                          }}
                        >
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Role & Details */}
                      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                        <Chip
                          icon={<WorkOutlineRounded style={{ fontSize: 14 }} />}
                          label={emp.role || "Employee"}
                          size="small"
                          sx={{ backgroundColor: "#F4F0FF", color: "#7B61FF", fontWeight: 600 }}
                        />
                        <Chip
                          icon={<CalendarTodayRounded style={{ fontSize: 14 }} />}
                          label={emp.joinDate || "Joined 2023"}
                          size="small"
                          sx={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}
                        />
                      </Box>

                      {/* Salary Callout Box */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "#F9FAFB",
                          border: "1px solid #F3F4F6",
                          mb: 2,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                          Monthly Net Compensation
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mt: 0.5 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: "#7B61FF" }}>
                            ₹{net.toLocaleString("en-IN")}
                          </Typography>
                          {basic > 0 && (
                            <Typography variant="caption" sx={{ color: "#6B7280" }}>
                              Basic: ₹{basic.toLocaleString("en-IN")}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ReceiptLongRounded />}
                        onClick={() => navigate(`/slip/${emp.id}`)}
                        sx={{
                          backgroundColor: "#7B61FF",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "10px",
                          py: 1,
                          mt: "auto",
                          boxShadow: "0 2px 8px rgba(123, 97, 255, 0.25)",
                          "&:hover": { backgroundColor: "#624BCC" },
                        }}
                      >
                        View / Generate Slip
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination & Count Footer */}
        {processedEmployees.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              px: 1,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Showing <b>{indexOfFirstItem + 1}</b> to{" "}
              <b>{Math.min(indexOfLastItem, processedEmployees.length)}</b> of{" "}
              <b>{processedEmployees.length}</b> staff payroll records
            </Typography>

            <Pagination
              count={Math.ceil(processedEmployees.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              sx={{
                "& .Mui-selected": {
                  backgroundColor: "#7B61FF !important",
                  color: "white",
                  fontWeight: 700,
                },
              }}
            />
          </Box>
        )}

        {/* Compact Delete Modal (< 400px) */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: "380px",
              borderRadius: "16px",
              p: 1,
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px auto",
              }}
            >
              <WarningAmberRounded sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
              Delete Salary Record?
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 1 }}>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Are you sure you want to delete the payroll entry for{" "}
              <b style={{ color: "#111827" }}>{employeeToDelete?.name}</b> (
              {employeeToDelete?.id})? This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 2, display: "flex", gap: 1.5, justifyContent: "center" }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "10px",
                borderColor: "#D1D5DB",
                color: "#4B5563",
                textTransform: "none",
                fontWeight: 600,
                py: 1,
                "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "10px",
                backgroundColor: "#DC2626",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                py: 1,
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
                "&:hover": { backgroundColor: "#B91C1C" },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Payroll;
