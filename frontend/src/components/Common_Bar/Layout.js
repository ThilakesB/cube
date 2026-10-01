import React from 'react';
import { Grid, Box } from '@mui/material';
import Navbar from './NavBar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Grid container sx={{ height: '100vh', overflowY: "hidden", backgroundColor: "#F8F9FD" }}>
      <Box sx={{ width: '100%', flexShrink: 0 }}>
        <Navbar />
      </Box>
      <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 100px)' }}>
        <Box sx={{ width: '260px', flexShrink: 0, height: '100%', backgroundColor: 'white', borderRight: '1px solid #e0e0e0' }}>
          <Sidebar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 2, pl: 3, height: '100%', overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Grid>
  );
};

export default Layout;
