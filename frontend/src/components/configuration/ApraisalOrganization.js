import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

const Apraisal = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [date, setDate] = useState("");
  const [values, setValues] = useState({
    employeeName: "",
    status: "Active",
    technicalCompetencies: [
      { indicator: "Marketing", expectedValue: "Advanced", setValue: "None" },
      { indicator: "Management", expectedValue: "Advanced", setValue: "Beginner" },
      { indicator: "Administration", expectedValue: "Advanced", setValue: "Intermediate" },
      { indicator: "Presentation Skill", expectedValue: "Expert / Leader", setValue: "Advanced" },
      { indicator: "Quality Of Work", expectedValue: "Expert / Leader", setValue: "Expert / Leader" },
      { indicator: "Efficiency", expectedValue: "Expert / Leader", setValue: "Expert / Leader" },
    ],
    organizationalCompetencies: [
      { indicator: "Communication", expectedValue: "Advanced", setValue: "None" },
      { indicator: "Leadership", expectedValue: "Expert / Leader", setValue: "Beginner" },
      { indicator: "Adaptability", expectedValue: "Advanced", setValue: "Intermediate" },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSetValueChange = (index, newValue, isTechnical) => {
    const updatedCompetencies = isTechnical
      ? [...values.technicalCompetencies]
      : [...values.organizationalCompetencies];
    const key = isTechnical ? "technicalCompetencies" : "organizationalCompetencies";
    updatedCompetencies[index].setValue = newValue;
    setValues((prev) => ({ ...prev, [key]: updatedCompetencies }));
  };

  return (
    <Box
      p={3}
      sx={{
        height: "960px",
        width: "720px",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" mb={2}>
        Give Performance Appraisal
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth>
          <TextField
            label="Employee Name"
            variant="outlined"
            value={values.employeeName}
            onChange={(e) => setValues({ ...values, employeeName: e.target.value })}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange} 
       textColor="inherit" // Inherit text color
       indicatorColor="transparent" // Remove the indicator line
       sx={{ marginBottom: 2 }}>
  <Tab
    label="Technical"
    sx={{
      border: "1px solid #ccc",
      width: "240px",
      height: "46px",
      borderRadius: "8px",
      textAlign: "center",
      textDecoration: "none", // Remove underline
      color: selectedTab === 0 ? 'white' : '#004E69', // White text for selected tab
      backgroundColor: selectedTab === 0 ? "#FF902F" : "transparent", // Set background color for selected tab
      "&:hover": {
        backgroundColor: selectedTab === 0 ? "#FF902F" : "transparent", // Change background color on hover
      },
    }}
  />
  <Tab
    label="Organizational"
    sx={{
      border: "1px solid #ccc",
      width: "240px",
      height: "46px",
      borderRadius: "8px",
      textAlign: "center",
      ml: 2,
      textDecoration: "none", // Remove underline
      color: selectedTab === 1 ? 'white' : '#004E69', // White text for selected tab
      backgroundColor: selectedTab === 1 ? "#FF902F" : "transparent", // Set background color for selected tab
      "&:hover": {
        backgroundColor: selectedTab === 1 ? "#FF902F" : "transparent", // Change background color on hover
      },
    }}
  />
</Tabs>


      {selectedTab === 0 && (
        <>
          

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Indicator</TableCell>
                  <TableCell>Expected Value</TableCell>
                  <TableCell>Set Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.technicalCompetencies.map((competency, index) => (
                  <TableRow key={index}>
                    <TableCell>{competency.indicator}</TableCell>
                    <TableCell>{competency.expectedValue}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={competency.setValue}
                          onChange={(e) => handleSetValueChange(index, e.target.value, true)}
                        >
                          <MenuItem value="None">None</MenuItem>
                          <MenuItem value="Beginner">Beginner</MenuItem>
                          <MenuItem value="Intermediate">Intermediate</MenuItem>
                          <MenuItem value="Advanced">Advanced</MenuItem>
                          <MenuItem value="Expert / Leader">Expert / Leader</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {selectedTab === 1 && (
        <>
         

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Indicator</TableCell>
                  <TableCell>Expected Value</TableCell>
                  <TableCell>Set Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.organizationalCompetencies.map((competency, index) => (
                  <TableRow key={index}>
                    <TableCell>{competency.indicator}</TableCell>
                    <TableCell>{competency.expectedValue}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={competency.setValue}
                          onChange={(e) => handleSetValueChange(index, e.target.value, false)}
                        >
                          <MenuItem value="None">None</MenuItem>
                          <MenuItem value="Beginner">Beginner</MenuItem>
                          <MenuItem value="Intermediate">Intermediate</MenuItem>
                          <MenuItem value="Advanced">Advanced</MenuItem>
                          <MenuItem value="Expert / Leader">Expert / Leader</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Box mt={3} display="flex" alignItems="center" gap={2}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Apraisal;
