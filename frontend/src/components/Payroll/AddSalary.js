import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircleRounded,
  ArrowBackRounded,
  SaveRounded,
  AttachMoneyRounded,
  CalculateRounded,
  PersonOutlineRounded,
  AccountBalanceWalletRounded,
  ReceiptLongRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GlobalFormLayout from "../Common_Bar/GlobalFormLayout";
import { API_BASE_URL } from "../../config/api";

const designations = [
  "Web Developer",
  "Backend Developer",
  "Frontend Engineer",
  "UI/UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "QA Engineer",
  "HR Specialist",
  "Financial Analyst",
  "Marketing Strategist",
];

const AddSalary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
    role: "Web Developer",
    email: "",
    mobile: "",
    joinDate: new Date().toISOString().split("T")[0],
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
    profTax: "200",
    labourWelfare: "50",
    deductionsOthers: "",
  });

  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Optional smart auto-calculation for DA & HRA when Basic is entered
      if (field === "basic" && Number(value) > 0) {
        const numBasic = Number(value);
        if (!prev.da) updated.da = String(Math.round(numBasic * 0.1));
        if (!prev.hra) updated.hra = String(Math.round(numBasic * 0.15));
        if (!prev.pf) updated.pf = String(Math.round(numBasic * 0.05));
      }
      return updated;
    });
  };

  const grossEarnings =
    (Number(formData.basic) || 0) +
    (Number(formData.da) || 0) +
    (Number(formData.hra) || 0) +
    (Number(formData.conveyance) || 0) +
    (Number(formData.allowance) || 0) +
    (Number(formData.medicalAllowance) || 0) +
    (Number(formData.earningsOthers) || 0);

  const totalDeductions =
    (Number(formData.tds) || 0) +
    (Number(formData.esi) || 0) +
    (Number(formData.pf) || 0) +
    (Number(formData.leave) || 0) +
    (Number(formData.profTax) || 0) +
    (Number(formData.labourWelfare) || 0) +
    (Number(formData.deductionsOthers) || 0);

  const netSalary = Math.max(0, grossEarnings - totalDeductions);
  const takeHomePercent = grossEarnings > 0 ? Math.round((netSalary / grossEarnings) * 100) : 100;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.id.trim() || !formData.basic) {
      setError("Please provide Employee Name, Employee ID, and Basic Salary.");
      return;
    }

    setError("");
    setSubmitting(true);

    const newRecord = {
      ...formData,
      salary: netSalary,
      netSalary: netSalary,
    };

    try {
      try {
        await fetch(`${API_BASE_URL}/api/salaries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRecord),
        });
      } catch (backendErr) {
        console.warn("Backend not reachable, saving locally:", backendErr);
      }

      const existingPayroll = JSON.parse(localStorage.getItem("payrollData")) || [];
      const updatedPayroll = [newRecord, ...existingPayroll.filter((e) => e.id !== newRecord.id)];
      localStorage.setItem("payrollData", JSON.stringify(updatedPayroll));
      setOpenModal(true);
    } catch (err) {
      console.error("Error saving salary data:", err);
      setError("Failed to save salary details. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    setOpenModal(false);
    navigate("/payroll");
  };

  return (
    <GlobalFormLayout title="Add Staff Salary" backLink="/payroll">
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section 1: Staff Profile */}
        <Card
          sx={{
            mb: 3.5,
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  backgroundColor: "#F4F0FF",
                  color: "#7B61FF",
                  display: "flex",
                }}
              >
                <PersonOutlineRounded />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                  Staff Information
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Primary identification and employment attributes
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                  Employee Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange("name")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                  Employee ID *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  placeholder="e.g. FT-0012"
                  value={formData.id}
                  onChange={handleChange("id")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                  Designation / Role *
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.role}
                    onChange={handleChange("role")}
                    sx={{ borderRadius: "10px", backgroundColor: "#F9FAFB" }}
                  >
                    {designations.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                  Official Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  placeholder="alex.m@cubeai.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                  Mobile Number
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={handleChange("mobile")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                  Joining Date
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange("joinDate")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section 2: Compensation & Breakdown */}
        <Grid container spacing={3.5} sx={{ mb: 3.5 }}>
          {/* Earnings Box */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "10px",
                      backgroundColor: "#F4F0FF",
                      color: "#7B61FF",
                      display: "flex",
                    }}
                  >
                    <AccountBalanceWalletRounded />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                      Gross Earnings
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>
                      Basic wages and regular salary allowances
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Basic Salary (₹) *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      type="number"
                      placeholder="e.g. 35000"
                      value={formData.basic}
                      onChange={handleChange("basic")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      DA (Dearness Allowance)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 4000"
                      value={formData.da}
                      onChange={handleChange("da")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      HRA (House Rent)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 5000"
                      value={formData.hra}
                      onChange={handleChange("hra")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Conveyance Allowance
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 1500"
                      value={formData.conveyance}
                      onChange={handleChange("conveyance")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Special Allowance
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 2000"
                      value={formData.allowance}
                      onChange={handleChange("allowance")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Medical Allowance
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 1000"
                      value={formData.medicalAllowance}
                      onChange={handleChange("medicalAllowance")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Other Earnings / Incentives
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 0"
                      value={formData.earningsOthers}
                      onChange={handleChange("earningsOthers")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #E5E7EB", display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#374151" }}>
                    Total Gross Earnings:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#7B61FF" }}>
                    ₹{grossEarnings.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Deductions Box */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "10px",
                      backgroundColor: "#FEF2F2",
                      color: "#DC2626",
                      display: "flex",
                    }}
                  >
                    <ReceiptLongRounded />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                      Statutory Deductions
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>
                      Taxes, retirement funds, and compliance cuts
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      TDS (Tax Deducted at Source)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 500"
                      value={formData.tds}
                      onChange={handleChange("tds")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      PF (Provident Fund)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 1800"
                      value={formData.pf}
                      onChange={handleChange("pf")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      ESI (Health Insurance)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 350"
                      value={formData.esi}
                      onChange={handleChange("esi")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Professional Tax (Prof. Tax)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 200"
                      value={formData.profTax}
                      onChange={handleChange("profTax")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Leave Deductions
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 0"
                      value={formData.leave}
                      onChange={handleChange("leave")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Labour Welfare Fund
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.labourWelfare}
                      onChange={handleChange("labourWelfare")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Other Deductions
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 0"
                      value={formData.deductionsOthers}
                      onChange={handleChange("deductionsOthers")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F9FAFB" } }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #E5E7EB", display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#374151" }}>
                    Total Deductions:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#DC2626" }}>
                    ₹{totalDeductions.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section 3: Live Take-Home Summary Card */}
        <Card
          sx={{
            mb: 4,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #FAF8FF 0%, #F4F0FF 100%)",
            border: "1.5px solid #DDD6FE",
            boxShadow: "0 4px 14px rgba(123, 97, 255, 0.08)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="caption" sx={{ color: "#7B61FF", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Live Net Remuneration Summary
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#7B61FF", mt: 0.5 }}>
                  ₹{netSalary.toLocaleString("en-IN")}
                  <Typography component="span" variant="body1" sx={{ color: "#6B7280", fontWeight: 600, ml: 1 }}>
                    / month net take-home
                  </Typography>
                </Typography>
                <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="caption" sx={{ color: "#4B5563", fontWeight: 600 }}>
                    Take-Home Ratio: {takeHomePercent}%
                  </Typography>
                  <Box sx={{ flexGrow: 1, maxWidth: 220 }}>
                    <LinearProgress
                      variant="determinate"
                      value={takeHomePercent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#E5E7EB",
                        "& .MuiLinearProgress-bar": { backgroundColor: "#7B61FF", borderRadius: 4 },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 1.5 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate("/payroll")}
                  sx={{
                    borderRadius: "10px",
                    borderColor: "#D1D5DB",
                    color: "#4B5563",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    py: 1.2,
                    "&:hover": { backgroundColor: "#F9FAFB" },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={<SaveRounded />}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "#7B61FF",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    px: 3.5,
                    py: 1.2,
                    boxShadow: "0 4px 14px rgba(123, 97, 255, 0.35)",
                    "&:hover": { backgroundColor: "#624BCC" },
                  }}
                >
                  {submitting ? "Saving..." : "Save Salary Record"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Compact Success Modal (< 400px) */}
      <Dialog
        open={openModal}
        onClose={handleContinue}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "380px",
            borderRadius: "16px",
            p: 1,
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#ECFDF5",
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
            }}
          >
            <CheckCircleRounded sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
            Salary Record Saved!
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1 }}>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            Remuneration structure for <b style={{ color: "#111827" }}>{formData.name}</b> ({formData.id}) has been configured successfully.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 2, display: "flex", gap: 1.5, justifyContent: "center" }}>
          <Button
            onClick={handleContinue}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: "10px",
              backgroundColor: "#7B61FF",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              py: 1,
              boxShadow: "0 4px 12px rgba(123, 97, 255, 0.3)",
              "&:hover": { backgroundColor: "#624BCC" },
            }}
          >
            Back to Payroll
          </Button>
        </DialogActions>
      </Dialog>
    </GlobalFormLayout>
  );
};

export default AddSalary;
