import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
  Avatar,
  Paper,
  TableHead,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBackRounded,
  DownloadRounded,
  PrintRounded,
  FileDownloadRounded,
  AccountBalanceRounded,
  VerifiedUserRounded,
  ReceiptLongRounded,
  PersonOutlineRounded,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words";
import logo from "../../assets/cubeaisolutions.jpeg";
import Layout from "../Common_Bar/Layout";
import { API_BASE_URL } from "../../config/api";

const fallbackPayslip = {
  company: "CubeAISolutions Tech Pvt Ltd",
  address: "3864 Quiet Valley Lane, Technology Corridor",
  cityState: "Bangalore, Karnataka - 560100",
  email: "payroll@cubeaisolutions.com",
  panNo: "AACCC1234F",
  employeeName: "Bernardo Galaviz",
  designation: "Web Developer",
  employeeID: "FT-0007",
  joiningDate: "15 Jan 2023",
  salaryMonth: "October 2026",
  payslipNumber: "PAY-2026-00492",
  bankName: "HDFC Bank Ltd",
  accountNo: "•••••••• 4892",
  pfNo: "PF/KAR/009283/2023",
  basic: 35000,
  da: 4000,
  hra: 5000,
  conveyance: 1500,
  allowance: 2000,
  medicalAllowance: 1250,
  earningsOthers: 750,
  tds: 500,
  pf: 1800,
  esi: 450,
  leave: 0,
  profTax: 200,
  labourWelfare: 50,
  deductionsOthers: 0,
};

const Payslip = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployeeSalary = async () => {
      setLoading(true);
      try {
        let found = null;

        // Try backend
        try {
          const res = await fetch(`${API_BASE_URL}/api/salaries`);
          if (res.ok) {
            const list = await res.json();
            found = list.find((e) => String(e.id) === String(employeeId) || String(e.employee_id) === String(employeeId));
          }
        } catch (e) {
          console.warn("Backend salary lookup failed, checking local:", e);
        }

        // Try local storage
        if (!found) {
          const stored = JSON.parse(localStorage.getItem("payrollData")) || [];
          found = stored.find((e) => String(e.id) === String(employeeId));
        }

        if (found) {
          setEmployeeData(found);
        } else {
          // Default fallback
          setEmployeeData(fallbackPayslip);
        }
      } catch (err) {
        console.error(err);
        setEmployeeData(fallbackPayslip);
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeSalary();
  }, [employeeId]);

  const emp = employeeData || fallbackPayslip;

  // Compute breakdown numbers
  const basic = Number(emp.basic) || fallbackPayslip.basic;
  const da = Number(emp.da) || (basic > 20000 ? Math.round(basic * 0.1) : 0);
  const hra = Number(emp.hra) || (basic > 20000 ? Math.round(basic * 0.15) : 0);
  const conveyance = Number(emp.conveyance) || 1200;
  const allowance = Number(emp.allowance) || 1500;
  const medicalAllowance = Number(emp.medicalAllowance) || 1000;
  const earningsOthers = Number(emp.earningsOthers) || 0;

  const earningsList = [
    { name: "Basic Salary", amount: basic },
    { name: "Dearness Allowance (D.A.)", amount: da },
    { name: "House Rent Allowance (H.R.A.)", amount: hra },
    { name: "Conveyance Allowance", amount: conveyance },
    { name: "Special Allowance", amount: allowance },
    { name: "Medical Allowance", amount: medicalAllowance },
    ...(earningsOthers > 0 ? [{ name: "Other Earnings / Incentives", amount: earningsOthers }] : []),
  ];

  const tds = Number(emp.tds) || 500;
  const pf = Number(emp.pf) || Math.round(basic * 0.05);
  const esi = Number(emp.esi) || 350;
  const profTax = Number(emp.profTax) || 200;
  const leave = Number(emp.leave) || 0;
  const labourWelfare = Number(emp.labourWelfare) || 50;
  const deductionsOthers = Number(emp.deductionsOthers) || 0;

  const deductionsList = [
    { name: "Tax Deducted at Source (T.D.S.)", amount: tds },
    { name: "Provident Fund (P.F.)", amount: pf },
    { name: "Employees' State Insurance (E.S.I.)", amount: esi },
    { name: "Professional Tax (P.Tax)", amount: profTax },
    ...(leave > 0 ? [{ name: "Leave Deduction", amount: leave }] : []),
    ...(labourWelfare > 0 ? [{ name: "Labour Welfare Fund", amount: labourWelfare }] : []),
    ...(deductionsOthers > 0 ? [{ name: "Other Deductions", amount: deductionsOthers }] : []),
  ];

  const totalEarnings = earningsList.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = deductionsList.reduce((sum, item) => sum + item.amount, 0);
  const netSalary = Math.max(0, totalEarnings - totalDeductions);

  let netSalaryInWords = "";
  try {
    netSalaryInWords = toWords(netSalary) + " rupees only";
    netSalaryInWords = netSalaryInWords.charAt(0).toUpperCase() + netSalaryInWords.slice(1);
  } catch (e) {
    netSalaryInWords = `${netSalary} rupees only`;
  }

  const currentMonthYear = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const slipNumber = `PAY-${new Date().getFullYear()}-${(emp.id || "0007").replace(/[^0-9]/g, "").padStart(5, "0") || "00492"}`;

  const handleDownloadCSV = () => {
    const csvData = [
      ["CubeAISolutions Tech Pvt Ltd - Payslip"],
      [`Payslip For: ${currentMonthYear}`, `Slip No: ${slipNumber}`],
      [`Employee Name: ${emp.name || emp.employeeName}`, `Employee ID: ${emp.id || emp.employeeID}`],
      [`Designation: ${emp.role || emp.designation}`, `Date of Joining: ${emp.joinDate || emp.joiningDate}`],
      [],
      ["EARNINGS", "AMOUNT (INR)", "DEDUCTIONS", "AMOUNT (INR)"],
      ...Array.from({ length: Math.max(earningsList.length, deductionsList.length) }).map((_, i) => [
        earningsList[i]?.name || "",
        earningsList[i] ? earningsList[i].amount : "",
        deductionsList[i]?.name || "",
        deductionsList[i] ? deductionsList[i].amount : "",
      ]),
      [],
      ["Total Gross Earnings", totalEarnings, "Total Deductions", totalDeductions],
      ["Net Take-Home Salary", netSalary, `In Words: ${netSalaryInWords}`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvData.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Payslip_${emp.name || "Employee"}_${currentMonthYear.replace(" ", "_")}.csv`;
    link.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(123, 97, 255); // #7B61FF
    doc.text("CubeAISolutions Tech Pvt Ltd", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("3864 Quiet Valley Lane, Technology Corridor, Bangalore - 560100", 14, 26);
    doc.text(`Official Payslip - ${currentMonthYear} | Ref: ${slipNumber}`, 14, 32);

    // Employee Meta box
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(`Employee Name: ${emp.name || emp.employeeName}`, 14, 44);
    doc.text(`Employee ID: ${emp.id || emp.employeeID}`, 14, 50);
    doc.text(`Designation: ${emp.role || emp.designation}`, 120, 44);
    doc.text(`Joining Date: ${emp.joinDate || emp.joiningDate || "N/A"}`, 120, 50);

    // Earnings and Deductions Table
    const tableBody = Array.from({ length: Math.max(earningsList.length, deductionsList.length) }).map((_, i) => [
      earningsList[i]?.name || "",
      earningsList[i] ? `Rs. ${earningsList[i].amount.toLocaleString("en-IN")}` : "",
      deductionsList[i]?.name || "",
      deductionsList[i] ? `Rs. ${deductionsList[i].amount.toLocaleString("en-IN")}` : "",
    ]);

    autoTable(doc, {
      startY: 58,
      head: [["Earnings Item", "Amount", "Deductions Item", "Amount"]],
      body: tableBody,
      headStyles: { fillColor: [123, 97, 255], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { halign: "right" },
        3: { halign: "right" },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Gross Earnings: Rs. ${totalEarnings.toLocaleString("en-IN")}`, 14, finalY);
    doc.text(`Total Deductions: Rs. ${totalDeductions.toLocaleString("en-IN")}`, 120, finalY);

    // Net Salary Box
    doc.setFillColor(244, 240, 255);
    doc.rect(14, finalY + 6, 182, 18, "F");
    doc.setTextColor(123, 97, 255);
    doc.setFontSize(13);
    doc.text(`NET SALARY PAYABLE: Rs. ${netSalary.toLocaleString("en-IN")}`, 20, finalY + 18);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Amount in words: ${netSalaryInWords}`, 14, finalY + 32);
    doc.text("This is a computer-generated salary slip and requires no physical signature.", 14, finalY + 38);

    doc.save(`Payslip_${emp.name || "Employee"}_${currentMonthYear.replace(" ", "_")}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress sx={{ color: "#7B61FF" }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ pb: 6 }}>
        {/* Navigation & Action Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              startIcon={<ArrowBackRounded />}
              onClick={() => navigate("/payroll")}
              sx={{
                color: "#4B5563",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#F9FAFB" },
              }}
            >
              Back to Payroll
            </Button>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
                Staff Payslip
              </Typography>
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                Official Remuneration Statement • {currentMonthYear}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadRounded />}
              onClick={handleDownloadCSV}
              sx={{
                borderRadius: "10px",
                borderColor: "#E5E7EB",
                color: "#374151",
                backgroundColor: "white",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#F9FAFB", borderColor: "#D1D5DB" },
              }}
            >
              CSV
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadRounded />}
              onClick={handleDownloadPDF}
              sx={{
                borderRadius: "10px",
                borderColor: "#7B61FF",
                color: "#7B61FF",
                backgroundColor: "white",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#F4F0FF", borderColor: "#624BCC" },
              }}
            >
              Download PDF
            </Button>

            <Button
              variant="contained"
              startIcon={<PrintRounded />}
              onClick={handlePrint}
              sx={{
                borderRadius: "10px",
                backgroundColor: "#7B61FF",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                boxShadow: "0 4px 14px rgba(123, 97, 255, 0.35)",
                "&:hover": { backgroundColor: "#624BCC" },
              }}
            >
              Print Payslip
            </Button>
          </Box>
        </Box>

        {/* Printable Payslip Card */}
        <Card
          sx={{
            maxWidth: "960px",
            margin: "0 auto",
            borderRadius: "20px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          {/* Top Decorative Accent Bar */}
          <Box sx={{ height: "6px", background: "linear-gradient(90deg, #7B61FF 0%, #9079FF 50%, #004E69 100%)" }} />

          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {/* Header: Company & Slip Badge */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                pb: 3,
                borderBottom: "2px dashed #E5E7EB",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img
                  src={logo}
                  alt="CubeAI Logo"
                  style={{
                    height: "56px",
                    borderRadius: "10px",
                    objectFit: "contain",
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#004E69" }}>
                    CubeAISolutions Tech Pvt Ltd
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    3864 Quiet Valley Lane, Technology Corridor
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                    Bangalore, Karnataka - 560100 • PAN: AACCC1234F
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Chip
                  label={slipNumber}
                  sx={{
                    fontWeight: 800,
                    fontFamily: "monospace",
                    backgroundColor: "#F4F0FF",
                    color: "#7B61FF",
                    fontSize: "0.85rem",
                    borderRadius: "8px",
                    mb: 0.5,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827" }}>
                  Salary Slip for {currentMonthYear}
                </Typography>
                <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 0.5 }}>
                  <VerifiedUserRounded sx={{ fontSize: 14 }} /> Disbursed & Verified
                </Typography>
              </Box>
            </Box>

            {/* Employee Information Meta Grid */}
            <Box
              sx={{
                mt: 3,
                mb: 4,
                p: 2.5,
                borderRadius: "14px",
                backgroundColor: "#F9FAFB",
                border: "1px solid #F3F4F6",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Employee Name
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mt: 0.3 }}>
                    {emp.name || emp.employeeName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Employee ID
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#7B61FF", mt: 0.3 }}>
                    {emp.id || emp.employeeID}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Designation
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#374151", mt: 0.3 }}>
                    {emp.role || emp.designation}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Joining Date
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mt: 0.3 }}>
                    {emp.joinDate || emp.joiningDate || "15 Jan 2023"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Bank Account
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#4B5563", mt: 0.3 }}>
                    HDFC •••• 4892
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    PF Number
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#4B5563", mt: 0.3 }}>
                    PF/KAR/009283
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Payment Mode
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981", mt: 0.3 }}>
                    Direct Bank Deposit
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                    Days Payable
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827", mt: 0.3 }}>
                    30 / 30 Days
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Earnings & Deductions Tables */}
            <Grid container spacing={3}>
              {/* Left Column: Earnings */}
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      px: 2,
                      backgroundColor: "#F4F0FF",
                      borderBottom: "1px solid #E5E7EB",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#7B61FF" }}>
                      Gross Earnings
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#7B61FF" }}>
                      Amount (INR)
                    </Typography>
                  </Box>

                  <Table size="small">
                    <TableBody>
                      {earningsList.map((item, index) => (
                        <TableRow key={index} sx={{ "&:nth-of-type(even)": { backgroundColor: "#FAFAFA" } }}>
                          <TableCell sx={{ py: 1.2, color: "#374151", fontWeight: 500, fontSize: "0.88rem" }}>
                            {item.name}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.2, fontWeight: 700, color: "#111827", fontSize: "0.88rem" }}>
                            ₹{item.amount.toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#F9FAFB", borderTop: "2px solid #E5E7EB" }}>
                        <TableCell sx={{ py: 1.5, fontWeight: 800, color: "#111827" }}>
                          Total Gross Earnings
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5, fontWeight: 800, color: "#7B61FF", fontSize: "0.95rem" }}>
                          ₹{totalEarnings.toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>

              {/* Right Column: Deductions */}
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      px: 2,
                      backgroundColor: "#FEF2F2",
                      borderBottom: "1px solid #E5E7EB",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#DC2626" }}>
                      Statutory Deductions
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#DC2626" }}>
                      Amount (INR)
                    </Typography>
                  </Box>

                  <Table size="small">
                    <TableBody>
                      {deductionsList.map((item, index) => (
                        <TableRow key={index} sx={{ "&:nth-of-type(even)": { backgroundColor: "#FAFAFA" } }}>
                          <TableCell sx={{ py: 1.2, color: "#374151", fontWeight: 500, fontSize: "0.88rem" }}>
                            {item.name}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.2, fontWeight: 700, color: "#DC2626", fontSize: "0.88rem" }}>
                            ₹{item.amount.toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#F9FAFB", borderTop: "2px solid #E5E7EB" }}>
                        <TableCell sx={{ py: 1.5, fontWeight: 800, color: "#111827" }}>
                          Total Deductions
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5, fontWeight: 800, color: "#DC2626", fontSize: "0.95rem" }}>
                          ₹{totalDeductions.toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>

            {/* Net Salary Highlight Callout Box */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #FAF8FF 0%, #F4F0FF 100%)",
                border: "1.5px solid #DDD6FE",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "#7B61FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Net Take-Home Pay (Disbursed)
                </Typography>
                <Typography variant="body2" sx={{ color: "#4B5563", fontWeight: 600, mt: 0.5, fontStyle: "italic" }}>
                  Amount in words: <b>{netSalaryInWords}</b>
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#7B61FF" }}>
                  ₹{netSalary.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>

            {/* Signatures & Footer Note */}
            <Box sx={{ mt: 6, pt: 3, borderTop: "1px solid #E5E7EB" }}>
              <Grid container spacing={4} alignItems="flex-end">
                <Grid item xs={6}>
                  <Box sx={{ width: "160px", borderBottom: "1px solid #9CA3AF", pb: 0.5, mb: 1 }} />
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 700, textTransform: "uppercase" }}>
                    Employee Signature
                  </Typography>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Box sx={{ width: "160px", borderBottom: "1px solid #9CA3AF", pb: 0.5, mb: 1, ml: "auto" }} />
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 700, textTransform: "uppercase" }}>
                    Authorized Signatory (HR / Finance)
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#9CA3AF", mt: 4 }}>
                This is a computer-generated salary slip and does not require a physical seal or signature. Generated via CubeAI ERP.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Payslip;
