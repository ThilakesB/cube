import React, { useState, useEffect } from 'react';
import { Box, Button, Card, FormControl, InputAdornment, InputLabel, OutlinedInput, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Pagination, Paper, Grid,Dialog } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Common_Bar/NavBar';
import Sidebar from '../Common_Bar/Sidebar';
import EmployeeAction from './EmployeeAction';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteEmployee from './DeleteEmployee';
import EditIcon from '@mui/icons-material/Edit';

import PeopleIcon from '@mui/icons-material/People';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Checkbox, IconButton } from '@mui/material';
import Layout from '../Common_Bar/Layout';
import { API_BASE_URL } from '../../config/api';



const adminTable = [
    { no: 1, firstname: "Sandra",lastname:"Williams",gender:"Female", staffId: "0246AHR", role: "Admin", phoneNumber: "08130000000", designation:"Human Resources"},
    { no: 2, firstname: "Abubakar",lastname:"Ibrahim",gender:"Male",staffId: "0251ITO", role: "I.T", phoneNumber: "07062000033", designation:"Operations" },
    { no: 3, firstname: "Ikechukwu",lastname:"Ugbonna",gender:"Male", staffId: "0340ITO", role: "I.T", phoneNumber: "08130000000", designation:"Operations" },
    { no: 4, firstname: "Joshua",lastname:"Adewale",gender:"Male", staffId: "0146APM", role: "Admin", phoneNumber: "07038126632",designation:"Project Management"},
    { no: 5, firstname: "Fatimah",lastname:"Nasir",gender:"Female", staffId: "0226ACS", role: "Admin", phoneNumber: "08130000000", designation:"Customer Service" },
    { no: 6, firstname: "Hauwa",lastname:"Lateef",gender:"Female", staffId: "0124HR", role: "I.T", phoneNumber: "08130000000", designation:"Human Resources"},
    { no: 7, firstname: "Sandra",lastname:"Williams",gender:"Female", staffId: "0246AH", role: "Admin", phoneNumber: "08130000000", designation:"Human Resources" },
    { no: 8, firstname: "Sandra",lastname:"Williams",gender:"Female", staffId: "0246AH", role: "None", phoneNumber: "08130000000", designation:"Cleaning"},
    { no: 9, firstname: "Sandra",lastname:"Williams",gender:"Female", staffId: "0246PMO", role: "P.M", phoneNumber: "08130000000", designation:"Operations" },
    { no: 10, firstname: "Sunday",lastname:"Alison",gender:"Male", staffId: "0246AH", role: "None", phoneNumber: "08130000000", designation:"Security" },
    { no: 11, firstname: "John",lastname:"Doe",gender:"Male", staffId: "0256XYZ", role: "Admin", phoneNumber: "08130000001", designation:"Project Management"},
    { no: 12, firstname: "Jane",lastname:"Smith",gender:"Male", staffId: "0257XYZ", role: "I.T", phoneNumber: "08130000002", designation:"Project Management" },
];

const AdminEmployee = () => {

    const [data, setData] = useState(adminTable);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [staff, setStaff] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate=useNavigate();

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees`);
        if (response.ok) {
          const dbEmployees = await response.json();
          if (dbEmployees && dbEmployees.length > 0) {
            const dbStaffIds = new Set(dbEmployees.map(e => e.staffId || e.staff_id));
            const remainingDefault = adminTable.filter(e => !dbStaffIds.has(e.staffId));
            setData([...dbEmployees, ...remainingDefault]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch employees from backend:", err);
      }
    };

    useEffect(() => {
      fetchEmployees();
    }, []);

    const handlenavigate=()=>{
      navigate('/editemployee');
    }

    const handleStaffFilter = (event) => {
        setStaff(event.target.value);
        setPage(0); 
    };
    
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase()); 
        setPage(0);
    };

    const filterData = () => {
        return data.filter(staffMember => {
            const matchesSearch = Object.values(staffMember).some(value => 
                value ? value.toString().toLowerCase().includes(searchTerm) : false
            );
            const matchesStaffFilter = staff ? staffMember.role === staff : true;
            return matchesSearch && matchesStaffFilter;
        });
    };

    const filteredData = filterData();
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleChangePage = (event, newPage) => setPage(newPage - 1);

    
    const handleRequest=()=>{
      setDialogContent(<EmployeeAction/>)
      setOpen(true)
  }
  const clickClose = () => {
      console.log('Back to Home clicked'); // For debugging
      setOpen(false);
  };


  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteOpen(true);
  };

  const handleDeleteEmployee = async (staffId) => {
    try {
      await fetch(`${API_BASE_URL}/api/employees/${staffId}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Failed to delete employee on backend:", err);
    }
    const updatedData = data.filter(employee => (employee.staffId || employee.staff_id) !== staffId);
    setData(updatedData);
    console.log(`Employee with staff ID ${staffId} has been deleted.`);
    setDeleteOpen(false);
  };
  
  const handleCloseDialog = () => {
    setDeleteOpen(false);
  };

    return (
    <Layout>

          
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: "#7B61FF" }} /> Employee
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
                Manage all staff members, roles and departments.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: 'black', borderRadius: '10px' }}>
                Export
              </Button>
              <Button component={Link} to="/employeeAdd" variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none', backgroundColor: '#7B61FF', borderRadius: '10px', '&:hover': { backgroundColor: '#624BCC' } }}>
                Add New Staff
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[
              { title: "Total Staff", count: data.length, icon: <PeopleIcon sx={{ color: '#7B61FF' }}/>, bg: '#F4F0FF' },
              { title: "Admin Staff", count: data.filter(d => d.role === 'Admin').length, icon: <PeopleIcon sx={{ color: '#00C853' }}/>, bg: '#E8F5E9' },
              { title: "I.T Staff", count: data.filter(d => d.role === 'I.T').length, icon: <PeopleIcon sx={{ color: '#FFB300' }}/>, bg: '#FFF8E1' },
              { title: "Active Staff", count: data.length, icon: <PeopleIcon sx={{ color: '#E91E63' }}/>, bg: '#FCE4EC' }
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: '15px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                  <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: stat.bg }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{stat.title}</Typography>
                    <Typography variant="body1" sx={{ color: 'gray' }}>{stat.count}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Search and Filter Toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, backgroundColor: 'white', borderRadius: '15px', border: '1px solid #e0e0e0' }}>
            <TextField 
              size="small" 
              placeholder="Search by Code, Name or Phone..." 
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
              }}
              sx={{ width: '350px', '& fieldset': { border: 'none' }, backgroundColor: '#F8F9FD', borderRadius: '8px' }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'gray' }}>Filter:</Typography>
              <Select 
                size="small"
                value={staff} 
                onChange={handleStaffFilter} 
                displayEmpty
                sx={{ width: '150px', backgroundColor: 'white', '& fieldset': { borderColor: '#e0e0e0' }, borderRadius: '8px' }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="I.T">I.T</MenuItem>
                <MenuItem value="P.M">P.M</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0', borderRadius: '15px', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8F9FD' }}>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>S/N</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>NAME</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>GENDER</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>STAFF ID</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>CONTACT & PHONE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>ROLE & DESIGNATION</Typography></TableCell>
                  <TableCell align="center"><Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>ACTIONS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.no} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell padding="checkbox"><Checkbox /></TableCell>
                    <TableCell>{row.no}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.firstname} {row.lastname}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.staffId}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.phoneNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: row.role === 'Admin' ? '#E8F5E9' : '#FFF8E1', color: row.role === 'Admin' ? '#2E7D32' : '#F57F17', fontSize: '12px', fontWeight: 'bold' }}>
                        {row.role}
                      </Box>
                      <Typography variant="caption" display="block" color="gray" sx={{ mt: 0.5 }}>{row.designation}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                          <RemoveRedEyeOutlinedIcon fontSize="small" sx={{ color: '#7B61FF' }} />
                        </IconButton>
                        <IconButton onClick={handlenavigate} size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                          <EditIcon fontSize="small" sx={{ color: 'gray' }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)} size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                          <DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#F44336' }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page + 1} onChange={handleChangePage} color="primary" />
          </Box>
        
        <Dialog open={open} onClose={clickClose} PaperProps={{ sx: { width: '80%', maxWidth: 'none', height: 'auto' } }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column' }}>
            <Button sx={{ mt: -2, fontFamily: "lato", fontWeight: 500, fontSize: "14px", textDecoration: "underline", color: "inherit", "&:hover": { textDecoration: "underline", backgroundColor: "transparent" }, height: "auto", width: "auto" }} onClick={clickClose}>
              Back
            </Button>
          </Box>
          {dialogContent}
        </Dialog>
        
        <Dialog open={deleteOpen} onClose={handleCloseDialog} PaperProps={{ sx: { width: '75%', maxWidth: 'none', height: '542px', borderRadius: "25px", boxShadow: "5px 4px 50px 5px #3354F44D" } }}>
          <DeleteEmployee selectedEmployee={selectedEmployee} onDelete={handleDeleteEmployee} onClose={handleCloseDialog}/>        
        </Dialog>
      </Layout>
  );
};

export default AdminEmployee