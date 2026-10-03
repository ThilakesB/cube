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
  CardActions,
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
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import Layout from "../Common_Bar/Layout";

const initialTaskData = [
  {
    id: 1,
    title: "Implement OAuth & JWT Auth Flow",
    project: "HRMS Enterprise Core",
    assignedTo: "Vignesh Lead",
    deadline: "2025-03-15",
    priority: "High",
    status: "Completed",
    estimatedHours: "16h",
  },
  {
    id: 2,
    title: "Design Responsive Payslip Generator",
    project: "FinTech Payroll Automation",
    assignedTo: "Tarah Shrophire",
    deadline: "2025-03-20",
    priority: "Medium",
    status: "In Progress",
    estimatedHours: "24h",
  },
  {
    id: 3,
    title: "Setup PostgreSQL Indexing on Attendance",
    project: "HRMS Enterprise Core",
    assignedTo: "Bobby",
    deadline: "2025-03-22",
    priority: "High",
    status: "Pending",
    estimatedHours: "8h",
  },
  {
    id: 4,
    title: "Event Seat Map Visualization",
    project: "Cube Events & Ticketing",
    assignedTo: "Harshini",
    deadline: "2025-03-25",
    priority: "Medium",
    status: "In Progress",
    estimatedHours: "32h",
  },
  {
    id: 5,
    title: "Export to CSV & PDF Engine for Reports",
    project: "Reporting Suite",
    assignedTo: "Thilakeswaran",
    deadline: "2025-03-28",
    priority: "High",
    status: "Completed",
    estimatedHours: "12h",
  },
  {
    id: 6,
    title: "Candidate Resume Parser Integration",
    project: "Recruitment Pipeline",
    assignedTo: "Nandhini",
    deadline: "2025-04-02",
    priority: "Low",
    status: "Pending",
    estimatedHours: "18h",
  },
];

const TaskReport = () => {
  const [tasks, setTasks] = useState(initialTaskData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const highPriorityCount = tasks.filter((t) => t.priority === "High").length;

  const kpiCards = [
    {
      title: "Total Tasks",
      count: `${totalTasks} Items`,
      subtext: "Sprint task allocation",
      icon: <AssignmentRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Completed Tasks",
      count: `${completedCount} Done`,
      subtext: "Verified and closed",
      icon: <CheckCircleRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "Completed",
    },
    {
      title: "In Progress",
      count: `${inProgressCount} Active`,
      subtext: "Currently in development",
      icon: <PendingActionsRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
      bg: "#E0F2FE",
      border: "#BAE6FD",
      filterValue: "In Progress",
    },
    {
      title: "High Priority",
      count: `${highPriorityCount} Urgent`,
      subtext: "Sprint critical path",
      icon: <PriorityHighRoundedIcon sx={{ color: "#EF4444", fontSize: 28 }} />,
      bg: "#FEE2E2",
      border: "#FECACA",
      filterValue: "ALL",
    },
  ];

  const handleToggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "Completed" ? "In Progress" : "Completed";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

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
              <AssignmentRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} /> Task Velocity & Assignment Report
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Monitor team task backlog, priority resolution, estimated effort, and sprint velocity.
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
            placeholder="Search task title, project, assignee..."
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="High">High Priority</MenuItem>
                <MenuItem value="Medium">Medium Priority</MenuItem>
                <MenuItem value="Low">Low Priority</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL") && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setPriorityFilter("ALL");
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
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>TASK NAME</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PROJECT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ASSIGNED TO</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DEADLINE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>EFFORT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PRIORITY</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                  <TableCell align="center"><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ACTION</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((t) => (
                  <TableRow key={t.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                      {t.title}
                    </TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>{t.project}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: "11px", bgcolor: "#EDE9FE", color: "#7B61FF" }}>
                          {t.assignedTo[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1E293B" }}>{t.assignedTo}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#334155" }}>{t.deadline}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#0F172A", fontSize: "13px" }}>{t.estimatedHours}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.priority}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                          bgcolor: t.priority === "High" ? "#FEE2E2" : t.priority === "Medium" ? "#FEF3C7" : "#F1F5F9",
                          color: t.priority === "High" ? "#DC2626" : t.priority === "Medium" ? "#B45309" : "#475569",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "8px",
                          bgcolor: t.status === "Completed" ? "#E8F5E9" : t.status === "In Progress" ? "#E0F2FE" : "#FEF3C7",
                          color: t.status === "Completed" ? "#2E7D32" : t.status === "In Progress" ? "#0284C7" : "#B45309",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleToggleStatus(t.id)}
                        sx={{
                          textTransform: "none",
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "6px",
                          color: t.status === "Completed" ? "#0284C7" : "#2E7D32",
                          bgcolor: t.status === "Completed" ? "#E0F2FE" : "#E8F5E9",
                          "&:hover": { bgcolor: t.status === "Completed" ? "#BAE6FD" : "#C8E6C9" },
                        }}
                      >
                        {t.status === "Completed" ? "Reopen" : "Complete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 8, 15]}
              component="div"
              count={filteredTasks.length}
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
            {filteredTasks.map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t.id}>
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
                        label={t.priority}
                        size="small"
                        sx={{
                          bgcolor: t.priority === "High" ? "#FEE2E2" : "#FEF3C7",
                          color: t.priority === "High" ? "#DC2626" : "#B45309",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                      <Chip
                        label={t.status}
                        size="small"
                        sx={{
                          bgcolor: t.status === "Completed" ? "#E8F5E9" : t.status === "In Progress" ? "#E0F2FE" : "#FEF3C7",
                          color: t.status === "Completed" ? "#2E7D32" : t.status === "In Progress" ? "#0284C7" : "#B45309",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "16px", mb: 0.5 }}>
                      {t.title}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                      Project: <strong>{t.project}</strong>
                    </Typography>

                    <Box sx={{ p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Assignee</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>{t.assignedTo}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Due Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#EF4444" }}>{t.deadline}</Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <Divider />
                  <CardActions sx={{ px: 2.5, py: 1.5, justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      onClick={() => handleToggleStatus(t.id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "12px",
                        color: t.status === "Completed" ? "#0284C7" : "#2E7D32",
                      }}
                    >
                      {t.status === "Completed" ? "Reopen Task" : "Mark as Completed"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default TaskReport;
