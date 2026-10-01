import React, { useState } from "react";
import {Box,Typography,Button,TextField,Select,MenuItem,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,Grid,TableFooter,TablePagination, FormHelperText, FormControl,} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import exp1 from '../../assets/expense_1.png'
import exp2 from '../../assets/expense_2.png'


const ExpenseReport = () => {
  const initialData = [
    {
      item: "Dell Laptop",
      purchaseFrom: "Amazon",
      purchaseDate: "5 Jan 2025",
      img:exp1,
      purchasedBy: "Loren Gatlin",
      amount: "₹45,000",
      paidBy: "Cash",
      status: "Pending",
    },
    {
      item: "Mac System",
      purchaseFrom: "Amazon",
      purchaseDate: "15 Jan 2025",
      img:exp2,
      purchasedBy: "Tarah Shrophire",
      amount: "₹1,25,999",
      paidBy: "Cheque",
      status: "Approved",
    },
    
  ];

  const statusOptions = ["Pending", "Approved"];


  const [filteredData, setFilteredData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const [buyerFilter, setBuyerFilter] = useState("");
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

    if (buyerFilter) {
      filtered = filtered.filter((item) => item.purchasedBy === buyerFilter);
    }

    if (fromDateFilter) {
        const fromDate = new Date(fromDateFilter);
        fromDate.setHours(0, 0, 0, 0); // Set to midnight to ignore time
      
        filtered = filtered.filter((item) => {
          const purchaseDate = new Date(item.purchaseDate);
          purchaseDate.setHours(0, 0, 0, 0); // Set to midnight to ignore time
          return purchaseDate >= fromDate;
        });
      }
      

    if (toDateFilter) {
      filtered = filtered.filter(
        (item) => new Date(item.purchaseDate) <= new Date(toDateFilter)
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
              Reporting / Expense Report
            </Typography>
            {/* Expense Report Section */}
            <Box sx={{ mt: 8 }}>
              <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                Expense Report
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
                Dashboard / Expense Report
              </Typography>
              {/* Filters */}
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={3}>
                    <Select
                     value={buyerFilter}
                      onChange={(e) => setBuyerFilter(e.target.value)}
                      displayEmpty
                      fullWidth
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">Select buyer</MenuItem>
                      <MenuItem value="Loren Gatlin">Loren Gatlin</MenuItem>
                      <MenuItem value="Tarah Shrophire">Tarah Shrophire</MenuItem>
                    </Select>
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
                        "Item",
                        "Purchase From",
                        "Purchase Date",
                        "Purchased By",
                        "Amount",
                        "Paid By",
                        "Status",
                        "Actions",
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
                        <TableCell><Typography sx={{fontWeight:700,fontSize:"10px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}}>{row.item}</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight:500,fontSize:"10px",}}>{row.purchaseFrom}</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight:500,fontSize:"10px"}}>{row.purchaseDate}</Typography></TableCell>
                        <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                <img src={row.img} alt="buyer"/>
                                <Typography sx={{ fontWeight:500, fontSize:"10px"}}>
                                    {row.purchasedBy}
                                </Typography>
                            </Box>
                        </TableCell>
                        <TableCell><Typography sx={{fontWeight:500,fontSize:"10px"}}>{row.amount}</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight:500,fontSize:"10px"}}>{row.paidBy}</Typography></TableCell>
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
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>
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

export default ExpenseReport;
