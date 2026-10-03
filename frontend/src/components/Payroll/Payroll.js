import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Modal,
  Box,
  IconButton,
  Grid,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import emp1 from "../../assets/emp1.png";
import emp2 from "../../assets/emp2.png";
import emp3 from "../../assets/emp3.png";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";



const employees = [
  {
    name: "Bernardo Galaviz",
    id: "FT-0007",
    email: "bernardogalaviz@example.com",
    mobile: "9876543210",
    joinDate: "1 Jan 2013",
    role: "Web Developer",
    salary: 45000,
    image: emp1,
  },
  {
    name: "Jeffrey Warden",
    id: "FT-0008",
    email: "jeffreywarden@example.com",
    mobile: "9876543211",
    joinDate: "1 Feb 2015",
    role: "UI Designer",
    salary: 40000,
    image: emp2,
  },
  {
    name: "John Doe",
    id: "FT-0009",
    email: "johndoe@example.com",
    mobile: "9876543212",
    joinDate: "1 Mar 2017",
    role: "Backend Developer",
    salary: 48000,
    image: emp3,
  },
  
];

const Payroll = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [formData, setFormData] = useState({
    netSalary: "",
    basic: "",
    da: "",
    hra: "",
    conveyance: "",
    allowance: "",
    medicalAllowance: "",
    earningsOthers: "",
    tds: "",
    esi: "",
    pf: "",
    leave: "",
    profTax: "",
    labourWelfare: "",
    deductionsOthers: "",
  });
  const [filters, setFilters] = useState({
    name: "",
    id: "",
    role: "",
  });
  const initialEmployees = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('payrollData')) || [];
      return [...employees, ...stored];
    } catch (e) {
      return employees;
    }
  };
  const [allEmployeesList, setAllEmployeesList] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);

  const fetchSalaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/salaries`);
      if (response.ok) {
        const apiSalaries = await response.json();
        const stored = JSON.parse(localStorage.getItem('payrollData')) || [];
        const combined = [...apiSalaries, ...stored];
        const uniqueIds = new Set(combined.map(e => e.id));
        const remainingDefault = employees.filter(e => !uniqueIds.has(e.id));
        const all = [...combined, ...remainingDefault];
        setAllEmployeesList(all);
        setFilteredEmployees(all);
      }
    } catch (err) {
      console.warn("Could not fetch salaries from backend:", err);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const itemsPerPage = 5; // Display 5 items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const generateSlip = (id) => {
    // Redirect to the slip page with the employee ID
    navigate(`/slip/${id}`);
  };

  const handleFilter = () => {
    const { name, id, role } = filters;
    const filtered = allEmployeesList.filter(
      (emp) =>
        (emp.name || "").toLowerCase().includes(name.toLowerCase()) &&
        (emp.id || "").toLowerCase().includes(id.toLowerCase()) &&
        (!role || emp.role === role)
    );
    setFilteredEmployees(filtered);
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted:", {
      employee: selectedEmployee,
      ...formData,
    });
    handleClose();
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={3} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>



      <div style={{ padding: "20px" }}>
        <h2>Payroll</h2>
        <p>Admin/ Payroll/ Employee Salary</p>

        {/* Search Section */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", color: "#D3D3D4" }}>
          <TextField
            label="Employee Name"
            name="name"
            variant="outlined"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <TextField
            label="Employee ID"
            name="id"
            variant="outlined"
            value={filters.id}
            onChange={handleFilterChange}
          />
          <Select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            displayEmpty
            style={{ minWidth: "200px" }}
          >
            <MenuItem value="">Select Designation</MenuItem>
            {[...new Set(allEmployeesList.map((emp) => emp.role))].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          <Button
            component={Link}
            to="/addsalary"
            variant="contained"
            sx={{ backgroundColor: "#FF902F", textTransform: "none", "&:hover": { backgroundColor: "#e07d24" } }}
          >
            Add Salary
          </Button>
        </div>

        <Button
          variant="contained"
          onClick={handleFilter}
          sx={{
            backgroundColor: "green",
            width: "40%",
            "&:hover": {
              backgroundColor: "darkgreen", // Optional: Darker shade for hover
            },
          }}
        >
          Search
        </Button>

        {/* Employee Table */}
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                      <img
                        src={emp.image}
                        alt={`${emp.name}'s image`}
                        style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
                      />
                      {emp.name}
                    </div>
                  </TableCell>

                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.mobile}</TableCell>
                  <TableCell>{emp.joinDate}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>₹{emp.salary}</TableCell>
                  <TableCell>
                  <Button
                variant="contained"
                sx={{ backgroundColor: "#FF902F" }}
                onClick={() => generateSlip(emp.id)} // This will redirect to the slip page
              >
                Generate Slip
              </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} entries
          </Box>
          <Pagination
            count={Math.ceil(filteredEmployees.length / itemsPerPage)} // Corrected count
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>


      {/* Add Staff Salary Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            width: "80%",
            maxWidth: 800,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Add Staff Salary</h3>
           <Button onClick={handleClose} sx={{ minWidth: 0, padding: 0 }}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323">
                   <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                 </svg>
               </Button>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <Select
              displayEmpty
              value={selectedEmployee || ""}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{ flex: 1 }}
            >
              <MenuItem value="">Select Staff</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.name}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Net Salary"
              name="netSalary"
              variant="outlined"
              fullWidth
              value={formData.netSalary}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: "40px" }}>
            {/* Earnings Section */}
            <div style={{ flex: 1 }}>
              <h4>Earnings</h4>
              {["Basic", "DA(40%)", "HRA(15%)", "Conveyance", "Allowance", "Medical Allowance", "Others"].map((label, index) => (
                <TextField
                  key={index}
                  label={label}
                  name={label.toLowerCase().replace(/[\(\)% ]/g, "")}
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: "20px" }}
                  value={formData[label.toLowerCase().replace(/[\(\)% ]/g, "")]}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* Deductions Section */}
            <div style={{ flex: 1 }}>
              <h4>Deductions</h4>
              {["TDS", "ESI", "PF", "Leave", "Prof.tax", "Labour Welfare", "Others"].map((label, index) => (
                <TextField
                  key={index}
                  label={label}
                  name={label.toLowerCase().replace(/[\(\)% ]/g, "")}
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: "20px" }}
                  value={formData[label.toLowerCase().replace(/[\(\)% ]/g, "")]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="primary">
              Add More
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
        
          </div>
        </Box>
        
      </Modal>
      
    </div>
    </Grid>
        </Grid>
      </Grid>
  );
};

export default Payroll;
