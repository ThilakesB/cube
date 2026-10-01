import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PeopleIcon from '@mui/icons-material/People';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Box, Button, Card, CardContent, Grid, IconButton, LinearProgress, Paper, TextField, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PieChart } from '@mui/x-charts/PieChart';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Img from '../../assets/8deceac56443041edd2d47c9dae21163.png';
import SettingsIcon from '@mui/icons-material/Settings';
import Navbar from '../Common_Bar/NavBar';
import Sidebar from '../Common_Bar/Sidebar';
import Layout from '../Common_Bar/Layout';


const Dashboard = () => {
  const Navigate = useNavigate();

  const handleStaffClick = () => {
    Navigate('/employee');
  };

  const handleProjectClick = () => {
    Navigate('/task');
  };

  const handleTeamClick = () => {
    Navigate('/department');
  };

  const card = [
    { id: 1, num: 0, ty1: 'Total no of staffs', ty2: '', icon: <PeopleIcon sx={{ height: '35px', width: '50px', color: '#F29425' }} />, col: '#FFF4E8', icon2: null, fun: handleStaffClick },
    { id: 2, num: 0, ty1: 'Total Projects', ty2: '', icon: <FileCopyIcon sx={{ height: '35px', width: '50px', color: '#248CD8' }} />, col: '#E8F5FF', icon2: null, fun: handleProjectClick },
    { id: 3, num: 0, ty1: 'Ongoing Projects', ty2: '', icon: <RocketLaunchIcon sx={{ height: '35px', width: '50px', color: '#A601FF' }} />, col: '#F9EFFF', icon2: null, fun: handleTeamClick },
    { id: 4, num: 0, ty1: 'Total Departments', icon: <ReduceCapacityIcon sx={{ height: '35px', width: '50px', color: '#10A142' }} />, col: '#ECFFF2', fun: handleTeamClick }
  ];

  const data2 = [];

  function createData(sl_no, team, teamLead, projects, progress) {
    return { sl_no, team, teamLead, projects, progress };
  }

  const rows = [];

  const secondTable = [];

   

  return (
    <Layout>

          <Typography variant='h4' fontWeight={'bold'} color={'#004E69'} sx={{ mb: 2 }}>Dashboard</Typography>
          <Grid container spacing={2}>
            {card.map((card) => (
            <Grid item lg={3} md={6} sm={6} xs={12} key={card.id} flexWrap={'wrap'}>
              <Card sx={{ minWidth: "250px", minHeight: "150px", borderRadius: '15px', cursor: "pointer", border: "1px solid #e0e0e0", boxShadow: "none" }} onClick={card.fun} >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant='h5' fontWeight={"bold"}>{card.num}</Typography>
                      <Typography variant='body1' fontWeight={"bold"} margin={"3px"}>{card.ty1}</Typography>
                    </Box>
                    <Box bgcolor={card.col} borderRadius={'50%'} sx={{ display: "flex", justifyContent: "center", alignItems: "center",height:'50px' }}>
                      {card.icon}
                    </Box>
                  </Box>

                  <Box sx={{display:'flex'}}>
                  <Typography marginTop={"8px"} color={'green'}>{card.icon2}</Typography>
                  <Typography marginTop={"8px"}>{card.ty2}</Typography>
                  </Box>
                
                </CardContent>
              </Card>
            </Grid>
          ))}

       <Grid item lg={7} sm={6}>
       <Paper sx={{ border: "1px solid #e0e0e0", boxShadow: "none", borderRadius: "10px", overflow: "hidden" }}>
  <TableContainer sx={{ maxHeight: 300,scrollbarWidth: 'thin', '&::-webkit-scrollbar': { width: '8px', backgroundColor: '#f5f5f5' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#aaa', borderRadius: '4px' }}} bgcolor={"white"}> {/* Reduced height */}
    
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell align='center' ><Typography fontWeight={'bold'}>S/N</Typography></TableCell>
          <TableCell align="center"><Typography fontWeight={'bold'}>Team</Typography></TableCell>
          <TableCell align="center"><Typography fontWeight={'bold'}>Team Lead</Typography></TableCell>
          <TableCell align="center"><Typography fontWeight={'bold'}>Ongoing Projects</Typography></TableCell>
          <TableCell align="center"><Typography fontWeight={'bold'}>Process</Typography></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.sl_no}>
            <TableCell align='center'>{row.sl_no}</TableCell>
            <TableCell align="center">{row.team}</TableCell>
            <TableCell align="center">{row.teamLead}</TableCell>
            <TableCell align="center">{row.projects}</TableCell>
            <TableCell align="center">
                <Box
                    sx={{
                    display: "flex",
                    alignItems: "center", // Align items vertically in the center
                    gap: "10px", // Add spacing between progress bar and text
                    justifyContent: "flex-start", // Keep items together
                    }}
                >
                    <LinearProgress
                    variant="determinate"
                    value={row.progress}
                    sx={{
                        width: "80px", // Set a fixed width for consistency
                        borderRadius: "5px",
                        height: "8px",
                        backgroundColor: "#161D2E",
                        "& .MuiLinearProgress-bar": {
                        backgroundColor: "#4B93E7", // Color of the progress bar
                        },
                    }}
                    />
                    <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: "15px",
                        color: "#4B93E7",
                        whiteSpace: "nowrap", // Prevent text from wrapping
                    }}
                    >
                    {row.progress}%
                    </Typography>
                </Box>
                </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  </Paper>
</Grid>

<Grid lg={5} sm={3} padding={"15px"}  sx={{display:"flex",justifyContent:{lg:'center',sm:'flex-start'},marginLeft:{lg:0,sm:'30px'}}} >

<Box sx={{maxHeight:"300px",display:"flex",justifyContent:"center",bgcolor:"white",borderRadius:"15px",border:'1px solid #e0e0e0',width:"500px"}}>
<div>
      <Typography variant="h6" align="center"  color={'#004E69'}>
        Project Status
      </Typography>
      <PieChart 
      sx={{marginTop:'-90px', cursor: "pointer"}}
        series={[
          {
            data: data2,
            width: 500,
            height: 200,
            innerRadius: 40,
            outerRadius: 80,
          },
        ]}
        height={350}
        width={300}
        slotProps={{
          legend: { hidden: false },

       
        }}
       
      />
    </div>
       </Box>


</Grid> 

<Grid lg={12} sm={12}>
    <Typography sx={{fontWeight:700,fontSize:"20px"}}>Attendence</Typography>
<TableContainer sx={{ border: "1px solid #e0e0e0", borderRadius: "10px", maxHeight: 400,mt:3 ,scrollbarWidth: 'thin', '&::-webkit-scrollbar': { width: '8px', backgroundColor: '#f5f5f5' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#aaa', borderRadius: '4px' } }} bgcolor={"white"}> {/* Reduced height */}
    
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell align='left'><Typography fontWeight={'bold'}>Employee Name</Typography></TableCell>
          <TableCell align="left"><Typography fontWeight={'bold'}>Designation</Typography></TableCell>
          <TableCell align="left"><Typography fontWeight={'bold'}>Type</Typography></TableCell>
          <TableCell align="left"><Typography fontWeight={'bold'}>CheckIntime</Typography></TableCell>
          <TableCell align="left"><Typography fontWeight={'bold'}>Status</Typography></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {secondTable.map((row) => (
          <TableRow key={row.sl_no}>
            <TableCell align='left' sx={{borderBottom:"none"}}> <Box sx={{display:'flex',alignItems:"center"}}>
                                     <Box
                                        component="img"
                                        src={row.img}
                                        alt="u2"
                                        sx={{ height: "50px", width: "50px", borderRadius: "100%" }}
                                    /><Typography sx={{marginLeft:"10px",fontSize:"20px"}}>{row.name}</Typography>

            </Box></TableCell>
            <TableCell align="left" sx={{borderBottom:"none"}}><Typography sx={{fontSize:"20px"}}>{row.designation}</Typography></TableCell>
            <TableCell align="left" sx={{borderBottom:"none"}}><Typography sx={{fontSize:"20px"}}>{row.type}</Typography></TableCell>
            <TableCell align="left" sx={{borderBottom:"none"}}><Typography sx={{fontSize:"20px" }}>{row.CheckIntime}</Typography></TableCell>
            <TableCell align="left" sx={{ borderBottom:"none",color: row.status === "late" ? "#F45B69" : "#3FC28A" ,fontSize:"20px"   }}>{row.status}</TableCell>
            </TableRow>
      
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  </Grid>
  </Grid>
</Layout>
  );
}

export default Dashboard;
