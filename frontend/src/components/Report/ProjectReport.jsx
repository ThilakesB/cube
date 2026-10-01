import React, { useState } from "react";
import {Box,Typography,Button,TextField,Select,MenuItem,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,Grid,TableFooter,TablePagination, FormControl, FormHelperText,} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import emp1 from '../../assets/emp1.png';
import emp2 from '../../assets/emp2.png';
import emp3 from '../../assets/emp3.png';
import exp1 from '../../assets/expense_1.png'
import exp2 from '../../assets/expense_2.png'


const ProjectReport = () => {
  const initialData = [
    {
      title: "HRMS",
      client: "Vignesh",
      startDate: "5 Nov 2024",
      endDate:"10 Dec 2024",
      status: "Pending",
    },
    {
        title: "Cube Events",
        client: "Bobby",
        startDate: "5 Nov 2024",
        endDate:"10 Dec 2024",
        status: "Pending",
    },
    
  ];

  const statusOptions = ["Pending", "Approved"];


  const [filteredData, setFilteredData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const [searchText, setSearchText] = useState(""); // Search text for project title
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...filteredData];
    updatedData[index].status = newStatus;
    setFilteredData(updatedData);
  };

  const handleFilterChange = () => {
    let filtered = initialData;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (fromDateFilter) {
      const fromDate = new Date(fromDateFilter);
      fromDate.setHours(0, 0, 0, 0); // Set to midnight to ignore time
      filtered = filtered.filter((item) => {
        const purchaseDate = new Date(item.startDate); // Adjusted field for date comparison
        purchaseDate.setHours(0, 0, 0, 0); // Set to midnight to ignore time
        return purchaseDate >= fromDate;
      });
    }

    if (toDateFilter) {
      filtered = filtered.filter(
        (item) => new Date(item.startDate) <= new Date(toDateFilter) // Adjusted field for date comparison
      );
    }

    setFilteredData(filtered);
  };

  const displayedRows = filteredData.slice(
    page * rowsPerPage,
    Math.min((page + 1) * rowsPerPage, filteredData.length)
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
            <Typography sx={{ fontWeight: 400, fontSize: "20px" }}>
              Reporting / Project Report
            </Typography>
            {/* Project Report Section */}
            <Box sx={{ mt: 8 }}>
              <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                Project Report
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: "12px",
                  color: "#373B3E",
                  mt: 0.5,
                }}
              >
                Dashboard / Project Report
              </Typography>
              {/* Filters */}
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={3}>
                  <TextField
                      label="Search Project Title"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                  <FormControl fullWidth>
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        value={fromDateFilter}
                        onChange={(e) => setFromDateFilter(e.target.value)}
                        sx={{ backgroundColor: "#fff", height: "35px" }}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    <FormHelperText sx={{ position: 'absolute', top: '-20px' }}>From</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <FormControl fullWidth>
                        <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={toDateFilter}
                        onChange={(e) => setToDateFilter(e.target.value)}
                        sx={{ backgroundColor: "#fff", height: "35px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                        <FormHelperText sx={{ position: 'absolute', top: '-20px' }}>To</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        height: "35px",
                      }}
                      onClick={handleFilterChange}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ width: "100%", mt: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#4D5154",
                    width: "100%",
                    display: "flex",
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
                    {filteredData.length}
                  </Box>
                  entries
                </Typography>
              </Box>

              {/* Table */}
              <TableContainer component={Paper} sx={{mt:2}}>
                <Table>
                <TableHead>
                    <TableRow>
                        {[
                        "Project Title",
                        "Client Name",
                        "Start Date",
                        "End Date",
                        "Status",
                        "Team",
                        ].map((header, index) => (
                        <TableCell key={index} sx={{ fontWeight: "bold" }}>
                            <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontWeight: 700,
                                fontSize: "10px",
                            }}
                            >
                            {header}
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <ArrowUpwardIcon sx={{ fontSize: 16, height: 12 }} />
                                <ArrowDownwardIcon sx={{ fontSize: 16, height: 12 }} />
                            </Box>
                            </Box>
                        </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedRows.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7",
                        }}
                      >
                        <TableCell><Typography sx={{fontWeight:700,fontSize:"10px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}}>{row.title}</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight:500,fontSize:"10px",}}>{row.client}</Typography></TableCell>
                        <TableCell sx={{width:"150px"}}><Typography sx={{fontWeight:500,fontSize:"10px"}}>{row.startDate}</Typography></TableCell>
                        <TableCell sx={{width:"100px"}}><Typography sx={{fontWeight:500,fontSize:"10px"}}>{row.endDate}</Typography></TableCell>
                        <TableCell>
                            <Select
                                value={row.status}
                                onChange={(e) => handleStatusChange(index, e.target.value)}
                                size="small"
                                sx={{
                                width:"90px",
                                height:"23px",
                                backgroundColor: "#fff",
                                border: "0.7px solid #D3D3D4",
                                borderRadius: "35px",
                                color: row.status === "Pending" ? "red" : "green", // Apply conditional text color
                                fontWeight:500,
                                fontSize:"9px"
                                }}
                            >
                                {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                                ))}
                            </Select>
                            </TableCell>
                        <TableCell>
                            <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <AvatarGroup  style={{ height: "5px"}}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={emp1}
                                    sx={{ width: 20, height: 20 }} // Decrease the size of the Avatar
                                />
                                <Avatar
                                    alt="Travis Howard"
                                    src={emp2}
                                    sx={{ width: 20, height: 20 }} // Decrease the size of the Avatar
                                />
                                <Avatar
                                    alt="Agnes Walker"
                                    src={emp3}
                                    sx={{ width: 20, height: 20 }} // Decrease the size of the Avatar
                                />
                                <Avatar
                                    alt="Trevor Henderson"
                                    src={exp1}
                                    sx={{ width: 20, height: 20 }} // Decrease the size of the Avatar
                                />
                                <Avatar
                                    alt="Trevor Henderson"
                                    src={exp2}
                                    sx={{ width: 20, height: 20 }} // Decrease the size of the Avatar
                                />
                                </AvatarGroup>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                            </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography>
                          Showing {page * rowsPerPage + 1} to{" "}
                          {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
                          {filteredData.length} entries
                        </Typography>
                      </TableCell>
                      <TablePagination
                        rowsPerPageOptions={[7, 14, 21]}
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProjectReport;
