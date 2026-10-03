import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Menu,
  MenuItem,
  TableFooter,
  TablePagination,
  Select,
  FormControl,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { API_BASE_URL } from "../../config/api";

import emp1 from '../../assets/emp1.png';
import emp2 from '../../assets/emp2.png';
import emp3 from '../../assets/emp3.png';


const AdminDepartmentView = () => {
  const departments = [
    {
      img:emp1,
      name: "Bernardo Galaviz",
      id: "FT-0007",
      email: "bernardogalaviz@example.com",
      mobile: "9876543210",
      joinDate: "1 Jan 2013",
      role: "Web Developer",
      currentProject: "Digital AI",
      process: 55,
    },
    {
      img:emp2,
      name: "Jeffrey Warden",
      id: "FT-0006",
      email: "jeffreywarden@example.com",
      mobile: "9876543210",
      joinDate: "15 Jun 2013",
      role: "App Developer",
      currentProject: "Butcher Shop",
      process: 75,
    },
    {
      img:emp3,
      name: "Bernardo Galaviz",
      id: "FT-0007",
      email: "bernardogalaviz@example.com",
      mobile: "9876543210",
      joinDate: "1 Jan 2013",
      role: "Web Developer",
      currentProject: "Digital AI",
      process: 55,
    },
  ];

  const [departmentList, setDepartmentList] = useState(departments);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/departments`);
        if (response.ok) {
          const apiDepts = await response.json();
          const localDepts = JSON.parse(localStorage.getItem("departmentData")) || [];
          const combined = [...apiDepts, ...localDepts];
          if (combined.length > 0) {
            const formatted = combined.map((d, i) => ({
              img: emp1,
              name: d.manager || d.departmentName || "Manager",
              id: `DP-${1000 + (d.id || i)}`,
              email: `${(d.manager || 'manager').toLowerCase().replace(/\s+/g, '')}@example.com`,
              mobile: "9876543210",
              joinDate: "1 Jan 2024",
              role: d.departmentName || d.department_name || "Department",
              currentProject: d.parentDepartment || d.parent_department || "General",
              process: 70
            }));
            const uniqueRoles = new Set(formatted.map(d => d.role));
            const remainingDefault = departments.filter(d => !uniqueRoles.has(d.role));
            setDepartmentList([...formatted, ...remainingDefault]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch departments from backend:", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedRows = departmentList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#4D5154",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  Show
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid #D3D3D4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {departments.length}
                  </Box>
                  entries
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/adddepartment"
                variant="contained"
                sx={{
                  background: "#004E69",
                  color: "white",
                  height: "40px",
                  borderRadius: "10px",
                  width: "auto",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": { background: "#003A4F" }
                }}
              >
                Add New
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Employee ID
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Email
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Mobile
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Join Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Role
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Current Project
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Process
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.map((dept, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7",
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {/* <Avatar>{dept.name.charAt(0)}</Avatar> */}
                          <img src={dept.img} alt="emp"/>
                          <Typography
                            sx={{ fontWeight: 500, fontSize: "10.5px" }}
                          >
                            {dept.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.mobile}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.joinDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                      <FormControl
                            sx={{
                                width: "98.17px",
                                height: "23.13px",
                                borderRadius: "37.31px",
                                border: "0.75px solid #D3D3D4",
                            }}
                            >
                            <Select
                                value={dept.role}
                                onChange={(e) => {}}
                                sx={{
                                fontSize: "10.5px",
                                height: "100%",
                                borderRadius: "37.31px", // matching the border radius of FormControl
                                border: "0.75px solid #D3D3D4", // matching the border style
                                }}
                            >
                                <MenuItem value="Web Developer">Web Developer</MenuItem>
                                <MenuItem value="App Developer">App Developer</MenuItem>
                                <MenuItem value="Designer">Designer</MenuItem>
                            </Select>
                            </FormControl>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.currentProject}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={dept.process}
                            sx={{
                              width: "80px",
                              height: "8px",
                              borderRadius: 5,
                            }}
                          />
                          <Typography>{dept.process}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={handleMenuOpen}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                  <TableCell colSpan={5}>
                      <Typography>
                        Showing {page * rowsPerPage + 1} to{" "}
                        {Math.min((page + 1) * rowsPerPage, departments.length)}{" "}
                        of {departments.length} entries
                      </Typography>
                    </TableCell>
                    <TablePagination
                      rowsPerPageOptions={[7, 14, 21]}
                      count={departments.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartmentView;
