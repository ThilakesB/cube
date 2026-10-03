import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { API_BASE_URL } from "../../config/api";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/departments`);
        if (response.ok) {
          const apiDepts = await response.json();
          const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
          const apiNames = new Set(apiDepts.map((d) => (d.departmentName || d.department_name || "").toLowerCase()));
          const uniqueLocal = localDepts.filter(
            (d) => !apiNames.has((d.departmentName || d.department_name || "").toLowerCase())
          );
          setDepartments([...apiDepts, ...uniqueLocal]);
        }
      } catch (err) {
        console.warn("Could not fetch departments:", err);
        const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
        setDepartments(localDepts);
      }
    };
    fetchDepartments();
  }, []);

  // Compute 4 Dynamic Dashboard KPI metrics
  const totalDepartments = departments.length;
  const totalStaff = departments.reduce(
    (acc, d) => acc + (parseInt(d.staffCount || d.staff_count, 10) || 0),
    0
  );
  const activeDivisions = new Set(
    departments.map((d) => d.section || d.parentDepartment || d.parent_department).filter(Boolean)
  ).size || (totalDepartments > 0 ? 1 : 0);

  const appointedLeads = departments.filter((d) => {
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
      {/* Navbar */}
      <Grid item xs={12}>
        <Navbar />
      </Grid>

      {/* TopBar */}
      <Grid item xs={12}>
        <TopBar />
      </Grid>

      <Grid container>
        {/* Sidebar */}
        <Grid item xs={12} sm={3} md={2}>
          <Sidebar />
        </Grid>

        {/* Main Content */}
        <Grid
          item
          xs={12}
          sm={9}
          md={10}
          sx={{
            padding: { xs: 2, sm: 3.5 },
            minHeight: "calc(100vh - 120px)",
            backgroundColor: "#F8FAFC",
          }}
        >
          <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
            {/* Page Header */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              mb={3.5}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#0F172A",
                    letterSpacing: "-0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  Department Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.3 }}>
                  Overview of organizational branches, staff allocations & leadership structure
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
                    variant="contained"
                    size="small"
                    startIcon={<ViewModuleRoundedIcon fontSize="small" />}
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
                    Cards
                  </Button>
                  <Button
                    component={Link}
                    to="/department"
                    size="small"
                    startIcon={<TableRowsRoundedIcon fontSize="small" />}
                    sx={{
                      color: "#64748B",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
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

            {/* 4 Dashboard Metric Cards */}
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

            {/* Department Cards Section Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "17px" }}>
                All Departments ({departments.length})
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Click a department to inspect member details
              </Typography>
            </Box>

            {/* Department Grid Cards */}
            <Grid container spacing={2.5}>
              {departments.length > 0 ? (
                departments.map((dept, index) => {
                  const name = dept.departmentName || dept.department_name || "Department";
                  const staff = parseInt(dept.staffCount || dept.staff_count, 10) || 0;
                  const section = dept.section || "General Division";
                  const manager = dept.headOfDepartment || dept.head_of_department || dept.manager || "Unassigned";

                  return (
                    <Grid item xs={12} sm={6} md={4} key={dept.id || index}>
                      <Card
                        sx={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: "16px",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                          padding: 2.5,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.08)",
                            borderColor: "#CBD5E1",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1.5}>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: "10px",
                                  bgcolor: "#F0F9FF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#0284C7",
                                }}
                              >
                                <CorporateFareRoundedIcon sx={{ fontSize: 22 }} />
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: "17px",
                                  fontWeight: 700,
                                  color: "#0F172A",
                                }}
                              >
                                {name}
                              </Typography>
                            </Box>
                            <Chip
                              label={section}
                              size="small"
                              sx={{
                                bgcolor: "#F1F5F9",
                                color: "#475569",
                                fontWeight: 600,
                                fontSize: "11px",
                                borderRadius: "6px",
                              }}
                            />
                          </Box>

                          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: "#64748B" }} />
                              <Typography variant="body2" sx={{ color: "#475569", fontSize: "13px" }}>
                                Head: <strong>{manager}</strong>
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <AccountTreeOutlinedIcon sx={{ fontSize: 18, color: "#64748B" }} />
                              <Typography variant="body2" sx={{ color: "#475569", fontSize: "13px" }}>
                                Division: {section}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>

                        <CardActions sx={{ p: 0, mt: 2.5 }}>
                          <Button
                            component={Link}
                            to="/department"
                            sx={{
                              backgroundColor: "#004E69",
                              color: "#FFFFFF",
                              width: "100%",
                              textTransform: "none",
                              borderRadius: "10px",
                              height: "40px",
                              fontWeight: 600,
                              fontSize: "13.5px",
                              display: "flex",
                              justifyContent: "space-between",
                              px: 2,
                              "&:hover": {
                                backgroundColor: "#003A4F",
                              },
                            }}
                          >
                            <span>View Details</span>
                            <Chip
                              label={`${staff} Staff`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                fontSize: "11px",
                                height: "22px",
                              }}
                            />
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 6,
                      textAlign: "center",
                      bgcolor: "#FFFFFF",
                      borderRadius: "16px",
                      border: "1px dashed #CBD5E1",
                    }}
                  >
                    <CorporateFareRoundedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#334155" }}>
                      No departments available
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5, mb: 2.5 }}>
                      Get started by adding your first company department.
                    </Typography>
                    <Button
                      component={Link}
                      to="/adddepartment"
                      variant="contained"
                      sx={{
                        bgcolor: "#004E69",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: "10px",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#003A4F" },
                      }}
                    >
                      + Add Department
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartments;
