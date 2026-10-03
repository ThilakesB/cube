import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TablePagination,
  FormControl,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import Layout from "../Common_Bar/Layout";

const initialDailyData = [
  { id: 1, empName: "John Doe", staffId: "EMP-001", dept: "HR", date: "2025-02-15", checkIn: "09:02 AM", checkOut: "06:05 PM", status: "Present", location: "Office", duration: "9h 03m" },
  { id: 2, empName: "Jane Smith", staffId: "EMP-002", dept: "Finance", date: "2025-02-15", checkIn: "08:55 AM", checkOut: "06:10 PM", status: "Present", location: "Remote", duration: "9h 15m" },
  { id: 3, empName: "Alex Johnson", staffId: "EMP-003", dept: "IT", date: "2025-02-15", checkIn: "09:45 AM", checkOut: "06:30 PM", status: "Late", location: "Office", duration: "8h 45m" },
  { id: 4, empName: "Emily Davis", staffId: "EMP-004", dept: "Marketing", date: "2025-02-15", checkIn: "—", checkOut: "—", status: "On Leave", location: "Home", duration: "0h 00m" },
  { id: 5, empName: "Chris Martin", staffId: "EMP-005", dept: "Sales", date: "2025-02-15", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present", location: "Remote", duration: "9h 00m" },
  { id: 6, empName: "Sophia Brown", staffId: "EMP-006", dept: "Support", date: "2025-02-15", checkIn: "09:12 AM", checkOut: "06:15 PM", status: "Present", location: "Office", duration: "9h 03m" },
  { id: 7, empName: "Michael Wilson", staffId: "EMP-007", dept: "IT", date: "2025-02-15", checkIn: "08:50 AM", checkOut: "06:00 PM", status: "Present", location: "Remote", duration: "9h 10m" },
  { id: 8, empName: "Emma Thomas", staffId: "EMP-008", dept: "HR", date: "2025-02-15", checkIn: "—", checkOut: "—", status: "On Leave", location: "Home", duration: "0h 00m" },
  { id: 9, empName: "Liam Anderson", staffId: "EMP-009", dept: "Finance", date: "2025-02-15", checkIn: "09:35 AM", checkOut: "06:10 PM", status: "Late", location: "Office", duration: "8h 35m" },
];

const DailyReport = () => {
  const [records, setRecords] = useState(initialDailyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.dept.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = deptFilter === "ALL" || r.dept === deptFilter;
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchLocation = locationFilter === "ALL" || r.location === locationFilter;

    return matchSearch && matchDept && matchStatus && matchLocation;
  });

  const totalLogs = records.length;
  const presentCount = records.filter((r) => r.status === "Present").length;
  const remoteCount = records.filter((r) => r.location === "Remote").length;
  const lateCount = records.filter((r) => r.status === "Late").length;

  const kpiCards = [
    {
      title: "Logged Workforce",
      count: `${totalLogs} Staff`,
      subtext: "Today's attendance log",
      icon: <TodayRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Present On-Time",
      count: `${presentCount} Present`,
      subtext: "Standard shift compliance",
      icon: <CheckCircleRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "Present",
    },
    {
      title: "Remote Check-ins",
      count: `${remoteCount} Remote`,
      subtext: "WFH / Hybrid employees",
      icon: <HomeWorkRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
      bg: "#E0F2FE",
      border: "#BAE6FD",
      filterValue: "ALL",
    },
    {
      title: "Late Arrivals",
      count: `${lateCount} Late`,
      subtext: "Over 15 mins past shift",
      icon: <AccessTimeFilledRoundedIcon sx={{ color: "#F59E0B", fontSize: 28 }} />,
      bg: "#FEF3C7",
      border: "#FDE68A",
      filterValue: "Late",
    },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 4 }}>
        {/* Top Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Button
              component={Link}
              to="/report"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                color: "#64748B",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "13px",
                p: 0,
                mb: 0.5,
                "&:hover": { color: "#7B61FF", bgcolor: "transparent" },
              }}
            >
              Back to Reports Hub
            </Button>
            <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#0F172A" }}>
              <TodayRoundedIcon sx={{ color: "#8B5CF6", fontSize: 28 }} /> Daily Attendance & Shift Report
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Real-time daily punch records, office vs remote distribution, and working hour logs.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                bgcolor: "#FFFFFF",
                p: 0.5,
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Button
                size="small"
                startIcon={<TableRowsRoundedIcon fontSize="small" />}
                onClick={() => setViewMode("table")}
                sx={{
                  bgcolor: viewMode === "table" ? "#7B61FF" : "transparent",
                  color: viewMode === "table" ? "#FFFFFF" : "#64748B",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: viewMode === "table" ? "#624BCC" : "#F1F5F9" },
                }}
              >
                Table
              </Button>
              <Button
                size="small"
                startIcon={<ViewModuleRoundedIcon fontSize="small" />}
                onClick={() => setViewMode("cards")}
                sx={{
                  bgcolor: viewMode === "cards" ? "#7B61FF" : "transparent",
                  color: viewMode === "cards" ? "#FFFFFF" : "#64748B",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: viewMode === "cards" ? "#624BCC" : "#F1F5F9" },
                }}
              >
                Cards
              </Button>
            </Box>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderColor: "#e0e0e0",
                color: "#334155",
                borderRadius: "10px",
                fontWeight: 600,
                height: "40px",
                "&:hover": { borderColor: "#7B61FF", bgcolor: "#F8F9FD" },
              }}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        {/* 4 KPI Metric Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {kpiCards.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                onClick={() => {
                  if (stat.filterValue !== "ALL") {
                    setStatusFilter(stat.filterValue);
                  } else {
                    setStatusFilter("ALL");
                  }
                }}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: "16px",
                  border: `1px solid ${statusFilter === stat.filterValue ? "#7B61FF" : stat.border}`,
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 20px -4px rgba(0, 0, 0, 0.08)",
                    borderColor: "#7B61FF",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    backgroundColor: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "gray", fontSize: "12px", letterSpacing: "0.02em" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "800", color: "#0F172A", mt: 0.2, lineHeight: 1.1 }}>
                    {stat.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", fontSize: "11px" }}>
                    {stat.subtext}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search & Filter Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            p: 2.5,
            mb: 3.5,
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <TextField
            size="small"
            placeholder="Search employee, ID, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#7B61FF" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: "320px" },
              "& fieldset": { border: "none" },
              backgroundColor: "#F8F9FD",
              borderRadius: "10px",
            }}
          />

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Locations</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || deptFilter !== "ALL" || statusFilter !== "ALL" || locationFilter !== "ALL") && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setDeptFilter("ALL");
                  setStatusFilter("ALL");
                  setLocationFilter("ALL");
                }}
                sx={{ textTransform: "none", color: "#EF4444", fontWeight: 600 }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>

        {/* VIEW MODE: TABLE */}
        {viewMode === "table" && (
          <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", boxShadow: "none", overflow: "hidden", mb: 4, bgcolor: "#FFFFFF" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#F8F9FD" }}>
                <TableRow>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>EMPLOYEE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STAFF ID</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DEPARTMENT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DATE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>CHECK IN</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>CHECK OUT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>WORK DURATION</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>LOCATION</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                  <TableRow key={r.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: "11px", bgcolor: "#EDE9FE", color: "#8B5CF6" }}>
                          {r.empName[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>{r.empName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{r.staffId}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{r.dept}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{r.date}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#10B981", fontWeight: 600 }}>{r.checkIn}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#3B82F6", fontWeight: 600 }}>{r.checkOut}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>{r.duration}</TableCell>
                    <TableCell>
                      <Chip label={r.location} size="small" sx={{ fontSize: "11px", bgcolor: "#F1F5F9", color: "#475569", borderRadius: "6px" }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "8px",
                          bgcolor: r.status === "Present" ? "#E8F5E9" : r.status === "Late" ? "#FEF3C7" : "#FEE2E2",
                          color: r.status === "Present" ? "#2E7D32" : r.status === "Late" ? "#B45309" : "#DC2626",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 8, 15]}
              component="div"
              count={filteredRecords.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        )}

        {/* VIEW MODE: CARDS */}
        {viewMode === "cards" && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredRecords.map((r) => (
              <Grid item xs={12} sm={6} md={4} key={r.id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px -4px rgba(0,0,0,0.08)",
                      borderColor: "#7B61FF",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Chip
                        label={r.dept}
                        size="small"
                        sx={{ bgcolor: "#F4F0FF", color: "#7B61FF", fontWeight: 700, fontSize: "11px", borderRadius: "6px" }}
                      />
                      <Chip
                        label={r.status}
                        size="small"
                        sx={{
                          bgcolor: r.status === "Present" ? "#E8F5E9" : r.status === "Late" ? "#FEF3C7" : "#FEE2E2",
                          color: r.status === "Present" ? "#2E7D32" : r.status === "Late" ? "#B45309" : "#DC2626",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "16px", mb: 0.5 }}>
                      {r.empName}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                      ID: <strong>{r.staffId}</strong> • Shift: {r.date}
                    </Typography>

                    <Box sx={{ p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Punch Times</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>{r.checkIn} - {r.checkOut}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Total Hours</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#7B61FF" }}>{r.duration}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default DailyReport;
