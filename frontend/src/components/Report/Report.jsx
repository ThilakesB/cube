import React from "react";
import {Typography, IconButton, Box, Button, Grid, TextField } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";


const Report = () => {
  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />

        

        <Grid container>
            {/* SideBar */}
          <Grid item xs={12} sm={3} md={2}>
            <Sidebar />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>
            {/* Reporting Section */}
            <Box sx={{ padding: "20px", flex: 1, overflowY: "auto" }}>
                <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                        Reporting
                </Typography>
                <Grid container spacing={4}>
                    {[
                        "Expense Report",
                        "Project Report",
                        "Task Report",
                        "User Report",
                        "Employee Report",
                        "Attendance Report",
                        "Leave Report",
                        "Daily Report",
                    ].map((report, index) => (
                    <Grid item xs={12} sm={4} md={3} lg={3} key={index}>
                        <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height:"95px",
                            backgroundColor: "#253D90",
                            color: "#fff",
                            textTransform: "none",
                            borderRadius: "14px",
                            boxShadow: "11px 4px 14px 0px #0000001F",
                        }}
                        >
                            {report}
                        </Button>
                    </Grid>
                        ))}
                    </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  );
};

export default Report;
