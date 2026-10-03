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
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Layout from "../Common_Bar/Layout";

const initialLeaveData = [
  { id: 1, empName: "John Doe", date: "2024-01-06", dept: "HR", leaveType: "Sick Leave", noOfDays: 2, remainingLeave: 5, status: "Approved", workLocation: "Office" },
  { id: 2, empName: "Jane Smith", date: "2024-01-05", dept: "Finance", leaveType: "Casual Leave", noOfDays: 1, remainingLeave: 4, status: "Pending", workLocation: "Home" },
  { id: 3, empName: "Alex Johnson", date: "2024-01-04", dept: "IT", leaveType: "Vacation", noOfDays: 5, remainingLeave: 7, status: "Approved", workLocation: "Home" },
  { id: 4, empName: "Emily Davis", date: "2024-01-03", dept: "Marketing", leaveType: "Medical Leave", noOfDays: 3, remainingLeave: 6, status: "Rejected", workLocation: "Office" },
  { id: 5, empName: "Chris Martin", date: "2024-01-02", dept: "Sales", leaveType: "Paternity Leave", noOfDays: 10, remainingLeave: 12, status: "Approved", workLocation: "Home" },
  { id: 6, empName: "Sophia Brown", date: "2023-12-28", dept: "Support", leaveType: "Casual Leave", noOfDays: 2, remainingLeave: 8, status: "Pending", workLocation: "Office" },
  { id: 7, empName: "Michael Wilson", date: "2023-12-26", dept: "IT", leaveType: "Sick Leave", noOfDays: 1, remainingLeave: 9, status: "Approved", workLocation: "Home" },
  { id: 8, empName: "Emma Thomas", date: "2023-12-24", dept: "HR", leaveType: "Maternity Leave", noOfDays: 20, remainingLeave: 25, status: "Approved", workLocation: "Home" },
  { id: 9, empName: "Liam Anderson", date: "2023-12-20", dept: "Finance", leaveType: "Casual Leave", noOfDays: 1, remainingLeave: 3, status: "Rejected", workLocation: "Home" },
  { id: 10, empName: "Olivia Garcia", date: "2023-12-18", dept: "Marketing", leaveType: "Vacation", noOfDays: 7, remainingLeave: 10, status: "Approved", workLocation: "Office" },
  { id: 11, empName: "Noah Martinez", date: "2023-12-15", dept: "Support", leaveType: "Medical Leave", noOfDays: 5, remainingLeave: 15, status: "Pending", workLocation: "Remote" },
  { id: 12, empName: "Ava Rodriguez", date: "2023-12-10", dept: "IT", leaveType: "Sick Leave", noOfDays: 2, remainingLeave: 6, status: "Approved", workLocation: "Home" },
];

const LeaveReport = () => {
  const [leaves, setLeaves] = useState(initialLeaveData);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredLeaves = leaves.filter((l) => {
    const matchSearch =
      l.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = deptFilter === "ALL" || l.dept === deptFilter;
    const matchType = typeFilter === "ALL" || l.leaveType === typeFilter;
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;

    return matchSearch && matchDept && matchType && matchStatus;
  });

  const totalRequests = leaves.length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  const kpiCards = [
    {
      title: "Total Leave Requests",
      count: `${totalRequests} Logs`,
      subtext: "Across all departments",
      icon: <EventBusyRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Approved Leaves",
      count: `${approvedCount} Approved`,
      subtext: "Verified by HR",
      icon: <CheckCircleRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "Approved",
    },
    {
      title: "Pending Requests",
      count: `${pendingCount} Pending`,
      subtext: "Awaiting management review",
      icon: <HourglassEmptyRoundedIcon sx={{ color: "#F59E0B", fontSize: 28 }} />,
      bg: "#FEF3C7",
      border: "#FDE68A",
      filterValue: "Pending",
    },
    {
      title: "Rejected Leaves",
      count: `${rejectedCount} Requests`,
      subtext: "Policy or quota limitations",
      icon: <CancelRoundedIcon sx={{ color: "#EF4444", fontSize: 28 }} />,
      bg: "#FEE2E2",
      border: "#FECACA",
      filterValue: "Rejected",
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
              <EventBusyRoundedIcon sx={{ color: "#EC4899", fontSize: 28 }} /> Employee Leave & Absence Report
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Audit staff leave balances, approved casual/sick leaves, and department absence distribution.
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
            placeholder="Search employee, department, leave type..."
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Leave Types</MenuItem>
                <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                <MenuItem value="Vacation">Vacation</MenuItem>
                <MenuItem value="Medical Leave">Medical Leave</MenuItem>
                <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
                <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || deptFilter !== "ALL" || typeFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setDeptFilter("ALL");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
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
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DEPARTMENT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>LEAVE TYPE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DATE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>NO OF DAYS</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>REMAINING</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>LOCATION</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((l) => (
                  <TableRow key={l.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: "11px", bgcolor: "#FCE7F3", color: "#EC4899" }}>
                          {l.empName[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>{l.empName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{l.dept}</TableCell>
                    <TableCell sx={{ fontSize: "13px", fontWeight: 600, color: "#7B61FF" }}>{l.leaveType}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{l.date}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>{l.noOfDays} Days</TableCell>
                    <TableCell sx={{ color: "#64748B", fontSize: "13px" }}>{l.remainingLeave} Days</TableCell>
                    <TableCell>
                      <Chip label={l.workLocation} size="small" sx={{ fontSize: "11px", bgcolor: "#F1F5F9", color: "#475569", borderRadius: "6px" }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "8px",
                          bgcolor: l.status === "Approved" ? "#E8F5E9" : l.status === "Pending" ? "#FEF3C7" : "#FEE2E2",
                          color: l.status === "Approved" ? "#2E7D32" : l.status === "Pending" ? "#B45309" : "#DC2626",
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
              count={filteredLeaves.length}
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
            {filteredLeaves.map((l) => (
              <Grid item xs={12} sm={6} md={4} key={l.id}>
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
                        label={l.dept}
                        size="small"
                        sx={{ bgcolor: "#F4F0FF", color: "#7B61FF", fontWeight: 700, fontSize: "11px", borderRadius: "6px" }}
                      />
                      <Chip
                        label={l.status}
                        size="small"
                        sx={{
                          bgcolor: l.status === "Approved" ? "#E8F5E9" : l.status === "Pending" ? "#FEF3C7" : "#FEE2E2",
                          color: l.status === "Approved" ? "#2E7D32" : l.status === "Pending" ? "#B45309" : "#DC2626",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "16px", mb: 0.5 }}>
                      {l.empName}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                      Type: <strong>{l.leaveType}</strong> • Applied: {l.date}
                    </Typography>

                    <Box sx={{ p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Duration</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>{l.noOfDays} Days</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Remaining Quota</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981" }}>{l.remainingLeave} Days</Typography>
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

export default LeaveReport;
