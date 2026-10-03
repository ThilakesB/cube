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
  AvatarGroup,
  LinearProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import Layout from "../Common_Bar/Layout";

const initialProjectData = [
  {
    id: 1,
    title: "HRMS Enterprise Core",
    client: "Cube AI Solutions",
    startDate: "2024-11-05",
    endDate: "2025-04-10",
    projectLead: "Vignesh Lead",
    budget: "₹3,50,000",
    priority: "High",
    progress: 82,
    status: "Ongoing",
    members: ["Vignesh", "Bobby", "Anusha"],
  },
  {
    id: 2,
    title: "Cube Events & Ticketing",
    client: "Global Tech Summit",
    startDate: "2024-11-15",
    endDate: "2025-02-28",
    projectLead: "Bobby",
    budget: "₹1,80,000",
    priority: "Medium",
    progress: 100,
    status: "Completed",
    members: ["Bobby", "Harshini", "Dharun"],
  },
  {
    id: 3,
    title: "AI Logistics Route Optimizer",
    client: "SpeedX Logistics",
    startDate: "2025-01-10",
    endDate: "2025-06-30",
    projectLead: "Nandhini",
    budget: "₹5,20,000",
    priority: "High",
    progress: 45,
    status: "Ongoing",
    members: ["Nandhini", "Sabarish", "John"],
  },
  {
    id: 4,
    title: "FinTech Payroll Automation",
    client: "Apex Financials",
    startDate: "2025-01-20",
    endDate: "2025-05-15",
    projectLead: "Thilak Lead",
    budget: "₹4,10,000",
    priority: "High",
    progress: 60,
    status: "Ongoing",
    members: ["Thilak", "Vignesh"],
  },
  {
    id: 5,
    title: "Customer Support Portal v2",
    client: "Retail Hub Inc",
    startDate: "2024-10-01",
    endDate: "2024-12-20",
    projectLead: "Sabarish",
    budget: "₹1,20,000",
    priority: "Low",
    progress: 100,
    status: "Completed",
    members: ["Sabarish", "Loren"],
  },
];

const ProjectReport = () => {
  const [projects, setProjects] = useState(initialProjectData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectLead.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || p.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const totalProjects = projects.length;
  const ongoingCount = projects.filter((p) => p.status === "Ongoing").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const highPriorityCount = projects.filter((p) => p.priority === "High").length;

  const kpiCards = [
    {
      title: "Total Projects",
      count: `${totalProjects} Tracked`,
      subtext: "Across 4 enterprise clients",
      icon: <FolderSpecialRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Ongoing Projects",
      count: `${ongoingCount} Active`,
      subtext: "In active development sprint",
      icon: <PlayCircleOutlineRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
      bg: "#E0F2FE",
      border: "#BAE6FD",
      filterValue: "Ongoing",
    },
    {
      title: "Completed",
      count: `${completedCount} Delivered`,
      subtext: "100% milestone achievement",
      icon: <CheckCircleRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "Completed",
    },
    {
      title: "High Priority",
      count: `${highPriorityCount} Projects`,
      subtext: "Critical delivery timeline",
      icon: <AccountTreeRoundedIcon sx={{ color: "#EF4444", fontSize: 28 }} />,
      bg: "#FEE2E2",
      border: "#FECACA",
      filterValue: "ALL",
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
              <FolderSpecialRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} /> Project Performance & Milestone Report
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Comprehensive breakdown of project timelines, client deliverables, budgets, and team progress.
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
            placeholder="Search project title, client, or lead..."
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
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
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
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PROJECT NAME</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>CLIENT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PROJECT LEAD</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>TIMELINE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PROGRESS</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>BUDGET</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PRIORITY</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((proj) => (
                  <TableRow key={proj.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                      {proj.title}
                    </TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{proj.client}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: "11px", bgcolor: "#E0F2FE", color: "#0284C7" }}>
                          {proj.projectLead[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1E293B" }}>{proj.projectLead}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", color: "#64748B" }}>
                      {proj.startDate} <br />
                      <Typography component="span" sx={{ fontSize: "11px", color: "gray" }}>to {proj.endDate}</Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={proj.progress}
                          sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "#E2E8F0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: proj.progress === 100 ? "#00C853" : "#7B61FF",
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0F172A" }}>
                          {proj.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>{proj.budget}</TableCell>
                    <TableCell>
                      <Chip
                        label={proj.priority}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                          bgcolor: proj.priority === "High" ? "#FEE2E2" : proj.priority === "Medium" ? "#FEF3C7" : "#F1F5F9",
                          color: proj.priority === "High" ? "#DC2626" : proj.priority === "Medium" ? "#B45309" : "#475569",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={proj.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "8px",
                          bgcolor: proj.status === "Completed" ? "#E8F5E9" : "#E0F2FE",
                          color: proj.status === "Completed" ? "#2E7D32" : "#0284C7",
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
              count={filteredProjects.length}
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
            {filteredProjects.map((proj) => (
              <Grid item xs={12} sm={6} md={4} key={proj.id}>
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
                        label={proj.priority}
                        size="small"
                        sx={{
                          bgcolor: proj.priority === "High" ? "#FEE2E2" : "#FEF3C7",
                          color: proj.priority === "High" ? "#DC2626" : "#B45309",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                      <Chip
                        label={proj.status}
                        size="small"
                        sx={{
                          bgcolor: proj.status === "Completed" ? "#E8F5E9" : "#E0F2FE",
                          color: proj.status === "Completed" ? "#2E7D32" : "#0284C7",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "16px", mb: 0.5 }}>
                      {proj.title}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                      Client: <strong>{proj.client}</strong> • Lead: {proj.projectLead}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>Milestone Progress</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0F172A" }}>{proj.progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={proj.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#E2E8F0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: proj.progress === 100 ? "#00C853" : "#7B61FF",
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Budget</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>{proj.budget}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Deadline</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B" }}>{proj.endDate}</Typography>
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

export default ProjectReport;
