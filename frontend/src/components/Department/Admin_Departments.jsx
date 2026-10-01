import React from "react";
import {Typography,IconButton,Button,Card,CardContent,CardActions,Grid,} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const AdminDepartments = () => {
  const departments = [
    { name: "Administrator", employees: 1 },
    { name: "Manager", employees: 2 },
    { name: "Human Resources", employees: 25 },
    { name: "Information Tech", employees: 120 },
    { name: "Finance", employees: 50 },
    { name: "Sales/CRM", employees: 80 },
  ];

  return (
    <Grid >
      {/* Navbar */}
      <Grid item xs={12}>
        <Navbar />
      </Grid>

      {/* TopBar */}
      <Grid item xs={12}>
        <TopBar />
      </Grid>

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
          padding: { xs: 2, sm: 3 },
          overflowY: "auto",
        }}
      >
        <Grid container spacing={3}>
          {departments.map((dept, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* Department Card */}
              <Card
                sx={{
                  backgroundColor: "#FFF7F7",
                  height: "170px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "10px",
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <CardContent>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#333",
                        }}
                      >
                        {dept.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton>
                        <MoreHorizOutlinedIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ marginTop: "auto", paddingX: 2 }}>
                  <Button
                    sx={{
                      backgroundColor: "#005366",
                      color: "#fff",
                      width: "100%",
                      textTransform: "none",
                      borderRadius: "10px",
                      "&:hover": {
                        backgroundColor: "#003d4d",
                      },
                    }}
                  >
                    <Typography>
                      {dept.employees} Employee{dept.employees > 1 ? "s" : ""}
                    </Typography>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartments;
