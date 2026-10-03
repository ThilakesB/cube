import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Layout from "../Common_Bar/Layout";

const reportModules = [
  {
    title: "Expense Report",
    path: "/expense",
    description: "Track corporate expenditures, vendor purchases, payment methods, and invoice approval workflows.",
    icon: <ReceiptLongRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
    bg: "#F4F0FF",
    border: "#E9E3FF",
    badge: "Financial",
    metric: "₹1,70,999 Total",
    color: "#7B61FF",
  },
  {
    title: "Project Report",
    path: "/project",
    description: "Detailed visibility into project timelines, client deliverables, budgets, and milestone completion status.",
    icon: <FolderSpecialRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
    bg: "#E0F2FE",
    border: "#BAE6FD",
    badge: "Operations",
    metric: "18 Active Projects",
    color: "#0284C7",
  },
  {
    title: "Task Report",
    path: "/task",
    description: "Analyze task backlog, team allocations, sprint deadlines, priority distribution, and velocity.",
    icon: <AssignmentRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
    bg: "#E8F5E9",
    border: "#C8E6C9",
    badge: "Productivity",
    metric: "42 Pending Tasks",
    color: "#00C853",
  },
  {
    title: "User Report",
    path: "/user",
    description: "Overview of user credentials, system roles, designations, permissions, and directory profiles.",
    icon: <PeopleAltRoundedIcon sx={{ color: "#F59E0B", fontSize: 28 }} />,
    bg: "#FEF3C7",
    border: "#FDE68A",
    badge: "Directory",
    metric: "128 Accounts",
    color: "#F59E0B",
  },
  {
    title: "Employee Report",
    path: "/employee",
    description: "Staff master data, designation distribution, contact records, joining dates, and payroll allocations.",
    icon: <BadgeRoundedIcon sx={{ color: "#6366F1", fontSize: 28 }} />,
    bg: "#EEF2FF",
    border: "#E0E7FF",
    badge: "HR & Staff",
    metric: "95 Active Staff",
    color: "#6366F1",
  },
  {
    title: "Attendance Report",
    path: "/attendancedata",
    description: "Monthly attendance registers, check-in logs, biometric records, and working hour summaries.",
    icon: <EventNoteRoundedIcon sx={{ color: "#059669", fontSize: 28 }} />,
    bg: "#ECFDF5",
    border: "#D1FAE5",
    badge: "Attendance",
    metric: "1,240 Punch Logs",
    color: "#059669",
  },
  {
    title: "Leave Report",
    path: "/leave_report",
    description: "Monitor employee leave balances, sick/casual leaves, maternity/paternity requests, and approvals.",
    icon: <EventBusyRoundedIcon sx={{ color: "#EC4899", fontSize: 28 }} />,
    bg: "#FCE7F3",
    border: "#FBCFE8",
    badge: "Leaves",
    metric: "29 Requests Logged",
    color: "#EC4899",
  },
  {
    title: "Daily Report",
    path: "/daily_report",
    description: "Real-time logs of daily clock-in/out times, office vs remote attendance, and punctual check-ins.",
    icon: <TodayRoundedIcon sx={{ color: "#8B5CF6", fontSize: 28 }} />,
    bg: "#EDE9FE",
    border: "#DDD6FE",
    badge: "Daily Logs",
    metric: "98.4% On-Time",
    color: "#8B5CF6",
  },
];

const recentAuditLogs = [
  { module: "Expense Report", action: "Mac System invoice approved", user: "Tarah Shrophire", time: "10 mins ago", status: "Approved" },
  { module: "Project Report", action: "HRMS milestone reached 75%", user: "Vignesh Lead", time: "1 hour ago", status: "Ongoing" },
  { module: "Leave Report", action: "Medical Leave approved (3 days)", user: "Emily Davis", time: "3 hours ago", status: "Approved" },
  { module: "Task Report", action: "Sprint 4 Task assigned to Frontend", user: "John Doe", time: "5 hours ago", status: "Pending" },
  { module: "Daily Attendance", action: "Bulk clock-in check completed", user: "System Admin", time: "Today, 09:15 AM", status: "Completed" },
];

const Report = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const kpiCards = [
    {
      title: "Total Report Suites",
      count: "8 Modules",
      subtext: "All 8 reporting engines active",
      icon: <AssessmentRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
    },
    {
      title: "Monthly Expenses",
      count: "₹1,70,999",
      subtext: "12 Invoices audited",
      icon: <ReceiptLongRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
    },
    {
      title: "Active Projects",
      count: "18 Projects",
      subtext: "4 Milestones due this week",
      icon: <TrendingUpRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
      bg: "#E0F2FE",
      border: "#BAE6FD",
    },
    {
      title: "Workforce Health",
      count: "98.4%",
      subtext: "Daily attendance compliance",
      icon: <CheckCircleOutlineRoundedIcon sx={{ color: "#EC4899", fontSize: 28 }} />,
      bg: "#FCE7F3",
      border: "#FBCFE8",
    },
  ];

  const filteredModules = reportModules.filter((mod) => {
    const matchSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.badge.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === "ALL") return matchSearch;
    return matchSearch && mod.badge.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <Layout>
      <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#0F172A" }}>
              <AssessmentRoundedIcon sx={{ color: "#7B61FF", fontSize: 30 }} /> Reporting & Intelligence Hub
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Access consolidated reports for finance, projects, tasks, employees, attendance, and leave management.
            </Typography>
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
            Export All Summaries
          </Button>
        </Box>

        {/* 4 KPI Dashboard Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {kpiCards.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: "16px",
                  border: `1px solid ${stat.border}`,
                  backgroundColor: "#FFFFFF",
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

        {/* Search & Category Filter Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3.5,
            p: 2,
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <TextField
            size="small"
            placeholder="Search report by name, category, or description..."
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
              width: { xs: "100%", md: "400px" },
              "& fieldset": { border: "none" },
              backgroundColor: "#F8F9FD",
              borderRadius: "10px",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ color: "gray", fontWeight: 600, mr: 1 }}>
              Filter:
            </Typography>
            {[
              { label: "All (8)", val: "ALL" },
              { label: "Financial", val: "Financial" },
              { label: "Operations", val: "Operations" },
              { label: "Productivity", val: "Productivity" },
              { label: "HR & Staff", val: "HR" },
              { label: "Attendance & Leaves", val: "Attendance" },
            ].map((tab) => (
              <Chip
                key={tab.val}
                label={tab.label}
                onClick={() => setSelectedCategory(tab.val)}
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  bgcolor: selectedCategory === tab.val ? "#7B61FF" : "#F8F9FD",
                  color: selectedCategory === tab.val ? "#FFFFFF" : "#475569",
                  "&:hover": {
                    bgcolor: selectedCategory === tab.val ? "#624BCC" : "#EDE9FE",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Report Cards Bento Grid (All 8 Modules) */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "17px" }}>
              Report Suites ({filteredModules.length})
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Click any report to view deep-dive analytics, filters, and records
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredModules.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 28px -4px rgba(0, 0, 0, 0.09)",
                      borderColor: item.color,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.2,
                          borderRadius: "12px",
                          backgroundColor: item.bg,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          backgroundColor: item.bg,
                          color: item.color,
                          fontWeight: "700",
                          fontSize: "11px",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "17px", mb: 0.8 }}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#64748B", fontSize: "12.5px", lineHeight: 1.5, mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Box
                      sx={{
                        p: 1,
                        px: 1.5,
                        borderRadius: "10px",
                        backgroundColor: "#F8F9FD",
                        border: "1px solid #F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                        Metric:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: item.color, fontSize: "12px" }}>
                        {item.metric}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, backgroundColor: "#ffffff" }}>
                    <Button
                      component={Link}
                      to={item.path}
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                      sx={{
                        backgroundColor: "#7B61FF",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        py: 0.9,
                        fontSize: "13px",
                        boxShadow: "0 2px 6px rgba(123, 97, 255, 0.25)",
                        "&:hover": { backgroundColor: "#624BCC" },
                      }}
                    >
                      Open Report
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Audit & Reporting Activity */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "17px", mb: 2 }}>
            Recent Reporting & Audit Activity
          </Typography>
          <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", boxShadow: "none", overflow: "hidden", bgcolor: "#FFFFFF" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#F8F9FD" }}>
                <TableRow>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>REPORT MODULE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ACTIVITY / ACTION</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ACTOR / USER</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>TIMESTAMP</Typography></TableCell>
                  <TableCell align="center"><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAuditLogs.map((log, i) => (
                  <TableRow key={i} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                      {log.module}
                    </TableCell>
                    <TableCell sx={{ color: "#334155", fontSize: "13px" }}>{log.action}</TableCell>
                    <TableCell sx={{ color: "#64748B", fontSize: "13px", fontWeight: 500 }}>{log.user}</TableCell>
                    <TableCell sx={{ color: "#94A3B8", fontSize: "13px" }}>{log.time}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={log.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                          bgcolor: log.status === "Approved" || log.status === "Completed" ? "#E8F5E9" : "#FFF8E1",
                          color: log.status === "Approved" || log.status === "Completed" ? "#2E7D32" : "#F57F17",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Layout>
  );
};

export default Report;
