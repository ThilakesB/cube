import GlobalFormLayout from '../Common_Bar/GlobalFormLayout';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Grid,Typography,Box,TextField,Button,IconButton,InputBase,} from "@mui/material";
import Navbar from "../Common_Bar/NavBar";

import Sidebar from "../Common_Bar/Sidebar";

import SettingsIcon from "@mui/icons-material/Settings";
import { API_BASE_URL } from "../../config/api";

const AdminAddDepartment = () => {
  const navigate = useNavigate();  
  const [formData, setFormData] = useState({
    departmentName: "",
    manager: "",
    parentDepartment: "",
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    try {
      try {
        await fetch(`${API_BASE_URL}/api/departments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (backendErr) {
        console.warn('Backend not reachable, saving locally:', backendErr);
      }

      const existing = JSON.parse(localStorage.getItem("departmentData")) || [];
      localStorage.setItem("departmentData", JSON.stringify([...existing, formData]));
    } catch (e) {
      console.error(e);
    }
    navigate('/department');
  };

  const handleCancel = ()=>{
    navigate('/department');
  };

  return (
    <GlobalFormLayout title="Add Department" backLink="/department">
        {/* Form */}
                <Box
                component="form"
                style={{ maxWidth: "800px" }}
                onSubmit={handleSubmit}
                >
                {/* Department Name */}
                <Box sx={{ marginBottom: "20px" }}>
                    <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                    Department Name
                    </Typography>
                    <InputBase
                    value={formData.departmentName}
                    onChange={handleChange("departmentName")}
                    placeholder="Enter department name"
                    sx={{
                        width: "300px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                        padding: "10px",
                        border: "1px solid #ccc",
                    }}
                    />
                </Box>

                {/* Manager and Parent Department */}
                <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <Box>
                    <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                        Manager
                    </Typography>
                    <InputBase
                        value={formData.manager}
                        onChange={handleChange("manager")}
                        placeholder="Enter manager name"
                        sx={{
                        width: "300px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                        padding: "10px",
                        border: "1px solid #ccc",
                        }}
                    />
                    </Box>
                    <Box>
                    <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                        Parent Department
                    </Typography>
                    <InputBase
                        value={formData.parentDepartment}
                        onChange={handleChange("parentDepartment")}
                        placeholder="Enter parent department"
                        sx={{
                        width: "300px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                        padding: "10px",
                        border: "1px solid #ccc",
                        }}
                    />
                    </Box>
                </Box>

                {/* Buttons */}
                <Box style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                    <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        width: "130px",
                        backgroundColor: "#004E69",
                        borderRadius: "10px",
                        color: "#fff",
                        height: "46px",
                        textTransform: "none",
                    }}
                    >
                    Save & Close
                    </Button>
                    <Button
                    variant="contained"
                    onClick={handleCancel}
                    sx={{
                        width: "130px",
                        backgroundColor: "#004E69",
                        borderRadius: "10px",
                        color: "#fff",
                        height: "46px",
                        textTransform: "none",
                    }}
                    >
                    Cancel
                    </Button>
                </Box>
                </Box>
                </GlobalFormLayout>
  );
};

export default AdminAddDepartment;
