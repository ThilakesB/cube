with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AdminEmployee.js", "r") as f:
    content = f.read()

imports_to_add = """
import PeopleIcon from '@mui/icons-material/People';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Checkbox, IconButton } from '@mui/material';
"""

# Find imports block end
import_end = content.rfind('import')
import_end_line = content.find('\n', import_end) + 1

content = content[:import_end_line] + imports_to_add + content[import_end_line:]

# Find return block
return_start = content.find('return (')
return_end = content.rfind(');', return_start) + 2

new_return = """return (
    <Grid container sx={{ height: '100vh', overflowY: "auto", backgroundColor: "#F8F9FD" }}>
      <Grid item lg={12} xs={12} sx={{ flexShrink: 0 }}>
        <Navbar />
      </Grid>
      <Grid container item lg={12} xs={12} sx={{ height: 'calc(100vh - 100px)' }}>
        <Grid item lg={2} md={2} sm={2} xs={12} sx={{ height: '100%' }}>
          <Sidebar />
        </Grid>
        <Grid item lg={10} md={10} sm={10} xs={12} sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
          
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
        </Grid>
        
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
      </Grid>
    </Grid>
  );"""

content = content[:return_start] + new_return + content[return_end:]

with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AdminEmployee.js", "w") as f:
    f.write(content)
