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
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import Layout from "../Common_Bar/Layout";

const initialUserData = [
  { id: 1, name: "Vignesh Lead", email: "vignesh@cubeai.com", role: "Software Engineer", dept: "Engineering", staffId: "EMP-101", joinDate: "2023-04-12", status: "Active" },
  { id: 2, name: "Tarah Shrophire", email: "tarah@cubeai.com", role: "UI/UX Designer", dept: "Design", staffId: "EMP-102", joinDate: "2023-06-01", status: "Active" },
  { id: 3, name: "Bobby Admin", email: "bobby@cubeai.com", role: "Project Manager", dept: "Operations", staffId: "EMP-103", joinDate: "2022-09-15", status: "Active" },
  { id: 4, name: "Loren Gatlin", email: "loren@cubeai.com", role: "Data Analyst", dept: "Analytics", staffId: "EMP-104", joinDate: "2023-11-20", status: "Active" },
  { id: 5, name: "Nandhini Tech", email: "nandhini@cubeai.com", role: "Machine Learning Engineer", dept: "AI Labs", staffId: "EMP-105", joinDate: "2024-01-10", status: "Active" },
  { id: 6, name: "Sabarish Dev", email: "sabarish@cubeai.com", role: "Software Engineer", dept: "Engineering", staffId: "EMP-106", joinDate: "2024-02-18", status: "Active" },
  { id: 7, name: "Harshini HR", email: "harshini@cubeai.com", role: "HR Executive", dept: "Human Resources", staffId: "EMP-107", joinDate: "2023-01-08", status: "Active" },
  { id: 8, name: "Dharun Core", email: "dharun@cubeai.com", role: "Full Stack Engineer", dept: "Engineering", staffId: "EMP-108", joinDate: "2024-03-01", status: "Active" },
];

const UserReport = () => {
  const [users, setUsers] = useState(initialUserData);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchDept = deptFilter === "ALL" || u.dept === deptFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchSearch && matchRole && matchDept && matchStatus;
  });

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === "Active").length;
  const deptCount = new Set(users.map((u) => u.dept)).size;
  const rolesCount = new Set(users.map((u) => u.role)).size;

  const kpiCards = [
    {
      title: "Total Staff Profiles",
      count: `${totalUsers} Users`,
      subtext: "Enterprise user directory",
      icon: <PeopleAltRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Active Accounts",
      count: `${activeCount} Active`,
      subtext: "100% security verified",
      icon: <CheckCircleRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "Active",
    },
    {
      title: "Departments",
      count: `${deptCount} Units`,
      subtext: "Across engineering & admin",
      icon: <CorporateFareRoundedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
      bg: "#E0F2FE",
      border: "#BAE6FD",
      filterValue: "ALL",
    },
    {
      title: "Designation Roles",
      count: `${rolesCount} Roles`,
      subtext: "Engineering, design, PM, AI",
      icon: <BadgeRoundedIcon sx={{ color: "#F59E0B", fontSize: 28 }} />,
      bg: "#FEF3C7",
      border: "#FDE68A",
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
              <PeopleAltRoundedIcon sx={{ color: "#F59E0B", fontSize: 28 }} /> User & Workforce Directory Report
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Directory of employee roles, designations, department mapping, and account status.
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
              Export Users
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
            placeholder="Search employee name, email, role, ID..."
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
              width: { xs: "100%", md: "340px" },
              "& fieldset": { border: "none" },
              backgroundColor: "#F8F9FD",
              borderRadius: "10px",
            }}
          />

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                <MenuItem value="Project Manager">Project Manager</MenuItem>
                <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                <MenuItem value="Machine Learning Engineer">Machine Learning Engineer</MenuItem>
                <MenuItem value="HR Executive">HR Executive</MenuItem>
                <MenuItem value="Full Stack Engineer">Full Stack Engineer</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Analytics">Analytics</MenuItem>
                <MenuItem value="AI Labs">AI Labs</MenuItem>
                <MenuItem value="Human Resources">Human Resources</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || roleFilter !== "ALL" || deptFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("ALL");
                  setDeptFilter("ALL");
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
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>USER / EMPLOYEE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STAFF ID</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DESIGNATION / ROLE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DEPARTMENT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>EMAIL ADDRESS</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>JOIN DATE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((u) => (
                  <TableRow key={u.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: "12px", bgcolor: "#FEF3C7", color: "#F59E0B" }}>
                          {u.name[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>{u.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{u.staffId}</TableCell>
                    <TableCell sx={{ fontSize: "13px", fontWeight: 600, color: "#7B61FF" }}>{u.role}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{u.dept}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{u.email}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{u.joinDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "8px",
                          bgcolor: "#E8F5E9",
                          color: "#2E7D32",
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
              count={filteredUsers.length}
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
            {filteredUsers.map((u) => (
              <Grid item xs={12} sm={6} md={4} key={u.id}>
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
                        label={u.dept}
                        size="small"
                        sx={{ bgcolor: "#F4F0FF", color: "#7B61FF", fontWeight: 700, fontSize: "11px", borderRadius: "6px" }}
                      />
                      <Chip
                        label={u.status}
                        size="small"
                        sx={{
                          bgcolor: "#E8F5E9",
                          color: "#2E7D32",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <Avatar sx={{ width: 42, height: 42, fontSize: "16px", bgcolor: "#FEF3C7", color: "#F59E0B" }}>
                        {u.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "16px", lineHeight: 1.2 }}>
                          {u.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#7B61FF", fontWeight: 600 }}>
                          {u.role}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                      Email: <strong>{u.email}</strong> • ID: {u.staffId}
                    </Typography>

                    <Box sx={{ p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Staff ID</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>{u.staffId}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Joined</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B" }}>{u.joinDate}</Typography>
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

export default UserReport;