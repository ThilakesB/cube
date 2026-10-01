import React from "react";
import { Box, List, ListItem, ListItemIcon, Button, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

// Importing Material-UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PayrollIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  const location = useLocation(); // Get the current location

  // Function to determine if the current route matches the link
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Employee', path: '/employee', icon: <PeopleIcon /> },
    { name: 'Department', path: '/department', icon: <BusinessIcon /> },
    { name: 'Project', path: '/projects', icon: <WorkIcon /> },
    { name: 'Attendance', path: '/attendance', icon: <AssignmentIcon /> },
    { name: 'Payroll', path: '/payroll', icon: <PayrollIcon /> },
    { name: 'Holiday', path: '/holidays', icon: <PublicIcon /> },
    { name: 'Reports', path: '/report', icon: <AssessmentIcon /> },
    { name: 'Configuration', path: '/configuration', icon: <TuneIcon /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        padding: 0,
        borderRight: "1px solid #e0e0e0",
        minHeight: "100vh",
      }}
    >
      <List>
        {navItems.map((item) => (
          <Button
            key={item.name}
            component={Link}
            to={item.path}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              padding: 2,
              textTransform: "none",
              backgroundColor: isActive(item.path) ? "#f0f0f0" : "transparent",
            }}
          >
            <ListItemIcon sx={{ color: "black" }}>
              {item.icon}
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
                fontWeight: "700",
                color: "black",
                textDecoration: isActive(item.path) ? "underline" : "none",
              }}
            >
              {item.name}
            </Typography>
          </Button>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
