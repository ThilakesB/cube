import React from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const GlobalFormLayout = ({ title, backLink, children }) => {
  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <Link to={backLink} style={{ textDecoration: 'none' }}>
          <Button 
            sx={{
              width: "100px", 
              height: "40px", 
              ":focus": { outline: "transparent" }, 
              ":active": { background: "transparent" },
              mb: 2
            }}
          >
            <Typography sx={{
              fontWeight: "500", 
              fontSize: "16px", 
              color: "#384295",
              textTransform: "none",
              display: "flex",
              alignItems: "center"
            }}>
              <KeyboardArrowLeftIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />Back
            </Typography>
          </Button>
        </Link>

        <Card sx={{
          padding: { xs: "20px", md: "40px" },
          borderRadius: '15px',
          width: '100%',
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          maxWidth: '1200px',
        }}>
          <Typography sx={{
            fontFamily: "Nunito", 
            fontWeight: "800", 
            fontSize: "24px", 
            color: "#000000",
            mb: 4
          }}>
            {title}
          </Typography>
          
          {children}
        </Card>
      </Box>
    </Layout>
  );
};

export default GlobalFormLayout;
