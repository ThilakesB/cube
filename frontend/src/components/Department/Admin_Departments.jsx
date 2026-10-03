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
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
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

  return (
    <Grid>
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
            padding: { xs: 2, sm: 4 },
            minHeight: "100vh",
            backgroundColor: "#f9fafb",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Department Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dashboard / Department Cards
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/adddepartment"
              variant="contained"
              sx={{
                background: "#004E69",
                color: "white",
                height: "44px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { background: "#003A4F" },
              }}
            >
              + Add Department
            </Button>
          </Box>

          <Grid container spacing={3}>
            {departments.length > 0 ? (
              departments.map((dept, index) => {
                const name = dept.departmentName || dept.department_name || "Department";
                const staff = dept.staffCount || dept.staff_count || "0";
                const section = dept.section || "";
                const manager = dept.headOfDepartment || dept.head_of_department || dept.manager || "";

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={dept.id || index}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {/* Department Card */}
                    <Card
                      sx={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        height: "190px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "12px",
                        boxShadow: "none",
                        padding: 2.5,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "#004E69",
                            }}
                          >
                            {name}
                          </Typography>
                          <IconButton size="small">
                            <MoreHorizOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {section && (
                          <Typography variant="body2" color="text.secondary">
                            Section: <strong>{section}</strong>
                          </Typography>
                        )}
                        {manager && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Head: {manager}
                          </Typography>
                        )}
                      </CardContent>

                      <CardActions sx={{ p: 0, mt: "auto" }}>
                        <Button
                          component={Link}
                          to="/department"
                          sx={{
                            backgroundColor: "#004E69",
                            color: "#fff",
                            width: "100%",
                            textTransform: "none",
                            borderRadius: "8px",
                            height: "38px",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "#003A4F",
                            },
                          }}
                        >
                          <Typography variant="body2" fontWeight="600">
                            {staff} Member{parseInt(staff, 10) === 1 ? "" : "s"}
                          </Typography>
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fff", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                  <Typography color="text.secondary">
                    No departments available. Click <strong>+ Add Department</strong> to create one.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartments;
