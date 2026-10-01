import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Button, Avatar, TextField, Menu, MenuItem, Divider, InputAdornment, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { monitorAuthState } from "../Backend/authentication";
import happy from '../../assets/Happy-Emoji-PNG 1.png'

const Navbar = () => {
  // State to store the current date and authentication state
  const [currentDate, setCurrentDate] = useState("");
  
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  // const [authState, setAuthState] = useState(null);

  // Fetch auth state
 /* const fetchAuthState = async () => {
    const state = await monitorAuthState();
    setAuthState(state);
  };*/

  useEffect(() => {
    // Update date on component mount
    const date = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(`Today is ${date.toLocaleDateString("en-US", options)}`);

    // Fetch authentication state
   // fetchAuthState();
  }, []);
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#F8F9FD",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          height: "70px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
             
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "20px", fontFamily: "Lato" }}>
                CubeAiSolutions
              </Typography>
              <img
                src={happy}
                alt="CubeAi Logo"
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "8px",
                }}
              />
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, fontSize: "12px", fontFamily: "Lato", color: "#262626" }}
            >
              {currentDate}
            </Typography>
          </Box>



          <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: { xs: 2, md: 6 } }}>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <TextField
                size="small"
                placeholder="Search pages, parties, invoices..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "400px",
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#c0c0c0" },
                  },
                }}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={handleNotifOpen}>
                <Badge badgeContent={8} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifClose}
                PaperProps={{ style: { width: '350px' } }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleNotifClose}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Leave Request</Typography>
                    <Typography variant="body2" color="textSecondary">@Robert Fox has applied for leave</Typography>
                    <Typography variant="caption" color="textSecondary">Just Now</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotifClose}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Check In Issue</Typography>
                    <Typography variant="body2" color="textSecondary">@Alexa shared a message regarding check in issue</Typography>
                    <Typography variant="caption" color="textSecondary">11:16 AM</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotifClose}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Password Update successfully</Typography>
                    <Typography variant="body2" color="textSecondary">Your password has been updated successfully</Typography>
                    <Typography variant="caption" color="textSecondary">Yesterday</Typography>
                  </Box>
                </MenuItem>
              </Menu>

              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '30px', padding: '4px 16px 4px 4px' }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: "#3f51b5", mr: 1 }}>A</Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', mr: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black', lineHeight: 1 }}>
                    Administrator
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'gray' }}>
                    Admin
                  </Typography>
                </Box>
              </Box>

              <IconButton component={Link} to="/logout" sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", p: 1, ml: 1 }}>
                <LogoutIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;