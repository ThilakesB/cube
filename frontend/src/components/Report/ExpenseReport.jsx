import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  TablePagination,
  FormControl,
  Card,
  CardContent,
  CardActions,
  Chip,
  InputAdornment,
  Avatar,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Layout from "../Common_Bar/Layout";

const initialExpenseData = [
  {
    id: 1,
    item: "Dell Laptop Precision 5570",
    purchaseFrom: "Amazon Business",
    purchaseDate: "2025-01-05",
    purchasedBy: "Loren Gatlin",
    amount: 45000,
    paidBy: "Corporate Card",
    status: "Pending",
    category: "IT Equipment",
  },
  {
    id: 2,
    item: "Apple Mac Studio M2",
    purchaseFrom: "Apple Store Online",
    purchaseDate: "2025-01-15",
    purchasedBy: "Tarah Shrophire",
    amount: 125999,
    paidBy: "Bank Transfer",
    status: "Approved",
    category: "Design Hardware",
  },
  {
    id: 3,
    item: "Ergonomic Office Chairs (x4)",
    purchaseFrom: "Featherlite",
    purchaseDate: "2025-01-22",
    purchasedBy: "John Doe",
    amount: 32000,
    paidBy: "Cheque",
    status: "Approved",
    category: "Office Supplies",
  },
  {
    id: 4,
    item: "Figma Enterprise License (Annual)",
    purchaseFrom: "Figma Inc",
    purchaseDate: "2025-02-01",
    purchasedBy: "Tarah Shrophire",
    amount: 54000,
    paidBy: "Corporate Card",
    status: "Approved",
    category: "Software Subscriptions",
  },
  {
    id: 5,
    item: "Logitech 4K Webcams (x3)",
    purchaseFrom: "Amazon Business",
    purchaseDate: "2025-02-10",
    purchasedBy: "Loren Gatlin",
    amount: 28500,
    paidBy: "Cash",
    status: "Pending",
    category: "Hardware",
  },
];

const ExpenseReport = () => {
  const [expenses, setExpenses] = useState(initialExpenseData);
  const [searchTerm, setSearchTerm] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filterExpenses = () => {
    return expenses.filter((item) => {
      const matchSearch =
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.purchaseFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.purchasedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBuyer = buyerFilter === "ALL" || item.purchasedBy === buyerFilter;
      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;

      let matchDate = true;
      if (fromDate) {
        matchDate = matchDate && new Date(item.purchaseDate) >= new Date(fromDate);
      }
      if (toDate) {
        matchDate = matchDate && new Date(item.purchaseDate) <= new Date(toDate);
      }

      return matchSearch && matchBuyer && matchStatus && matchDate;
    });
  };

  const filteredExpenses = filterExpenses();

  // Metrics
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedSpend = expenses.filter((e) => e.status === "Approved").reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = expenses.filter((e) => e.status === "Pending").length;
  const approvedCount = expenses.filter((e) => e.status === "Approved").length;

  const kpiCards = [
    {
      title: "Total Expenses",
      count: `₹${totalSpend.toLocaleString("en-IN")}`,
      subtext: `${expenses.length} claims registered`,
      icon: <AccountBalanceWalletRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Approved Value",
      count: `₹${approvedSpend.toLocaleString("en-IN")}`,
      subtext: `${approvedCount} items verified`,
      icon: <CheckCircleRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "Approved",
    },
    {
      title: "Pending Approvals",
      count: `${pendingCount} Invoices`,
      subtext: "Awaiting finance review",
      icon: <HourglassEmptyRoundedIcon sx={{ color: "#F59E0B", fontSize: 28 }} />,
      bg: "#FEF3C7",
      border: "#FDE68A",
      filterValue: "Pending",
    },
    {
      title: "Active Vendors",
      count: "4 Vendors",
      subtext: "Amazon, Apple, Figma, Featherlite",
      icon: <ShoppingBagOutlinedIcon sx={{ color: "#0284C7", fontSize: 28 }} />,
      bg: "#E0F2FE",
      border: "#BAE6FD",
      filterValue: "ALL",
    },
  ];

  const handleToggleStatus = (id) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "Approved" ? "Pending" : "Approved" } : item
      )
    );
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 4 }}>
        {/* Top Header & Breadcrumb */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Button
              component={Link}
              to="/report"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                color: "#64748B",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "13px",
                p: 0,
                mb: 0.5,
                "&:hover": { color: "#7B61FF", bgcolor: "transparent" },
              }}
            >
              Back to Reports Hub
            </Button>
            <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#0F172A" }}>
              <ReceiptLongRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} /> Expense & Procurement Report
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Track hardware purchases, subscriptions, vendor bills, and department expenses.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {/* Cards / Table Toggle */}
            <Box
              sx={{
                display: "flex",
                bgcolor: "#FFFFFF",
                p: 0.5,
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Button
                size="small"
                startIcon={<TableRowsRoundedIcon fontSize="small" />}
                onClick={() => setViewMode("table")}
                sx={{
                  bgcolor: viewMode === "table" ? "#7B61FF" : "transparent",
                  color: viewMode === "table" ? "#FFFFFF" : "#64748B",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: viewMode === "table" ? "#624BCC" : "#F1F5F9",
                  },
                }}
              >
                Table
              </Button>
              <Button
                size="small"
                startIcon={<ViewModuleRoundedIcon fontSize="small" />}
                onClick={() => setViewMode("cards")}
                sx={{
                  bgcolor: viewMode === "cards" ? "#7B61FF" : "transparent",
                  color: viewMode === "cards" ? "#FFFFFF" : "#64748B",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: viewMode === "cards" ? "#624BCC" : "#F1F5F9",
                  },
                }}
              >
                Cards
              </Button>
            </Box>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderColor: "#e0e0e0",
                color: "#334155",
                borderRadius: "10px",
                fontWeight: 600,
                height: "40px",
                "&:hover": { borderColor: "#7B61FF", bgcolor: "#F8F9FD" },
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* 4 KPI Metric Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {kpiCards.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                onClick={() => {
                  if (stat.filterValue !== "ALL") {
                    setStatusFilter(stat.filterValue);
                  } else {
                    setStatusFilter("ALL");
                  }
                }}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: "16px",
                  border: `1px solid ${statusFilter === stat.filterValue ? "#7B61FF" : stat.border}`,
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 20px -4px rgba(0, 0, 0, 0.08)",
                    borderColor: "#7B61FF",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    backgroundColor: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "gray", fontSize: "12px", letterSpacing: "0.02em" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "800", color: "#0F172A", mt: 0.2, lineHeight: 1.1 }}>
                    {stat.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", fontSize: "11px" }}>
                    {stat.subtext}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Advanced Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            p: 2.5,
            mb: 3.5,
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <TextField
            size="small"
            placeholder="Search items, vendors, buyers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#7B61FF" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: "280px" },
              "& fieldset": { border: "none" },
              backgroundColor: "#F8F9FD",
              borderRadius: "10px",
            }}
          />

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={buyerFilter}
                onChange={(e) => setBuyerFilter(e.target.value)}
                displayEmpty
                sx={{ borderRadius: "10px", bgcolor: "#F8F9FD", "& fieldset": { border: "none" } }}
              >
                <MenuItem value="ALL">All Buyers</MenuItem>
                <MenuItem value="Loren Gatlin">Loren Gatlin</MenuItem>
                <MenuItem value="Tarah Shrophire">Tarah Shrophire</MenuItem>
                <MenuItem value="John Doe">John Doe</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              helperText="From Date"
              FormHelperTextProps={{ sx: { m: 0, fontSize: "10px", color: "gray" } }}
              sx={{ width: 140, bgcolor: "#F8F9FD", borderRadius: "10px", "& fieldset": { border: "none" } }}
            />

            <TextField
              size="small"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              helperText="To Date"
              FormHelperTextProps={{ sx: { m: 0, fontSize: "10px", color: "gray" } }}
              sx={{ width: 140, bgcolor: "#F8F9FD", borderRadius: "10px", "& fieldset": { border: "none" } }}
            />

            {(searchTerm || buyerFilter !== "ALL" || statusFilter !== "ALL" || fromDate || toDate) && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setBuyerFilter("ALL");
                  setStatusFilter("ALL");
                  setFromDate("");
                  setToDate("");
                }}
                sx={{ textTransform: "none", color: "#EF4444", fontWeight: 600 }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>

        {/* VIEW MODE: TABLE */}
        {viewMode === "table" && (
          <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", boxShadow: "none", overflow: "hidden", mb: 4, bgcolor: "#FFFFFF" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#F8F9FD" }}>
                <TableRow>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ITEM & CATEGORY</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PURCHASE FROM</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PURCHASE DATE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PURCHASED BY</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>AMOUNT</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>PAYMENT METHOD</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                  <TableCell align="center"><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ACTION</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exp) => (
                  <TableRow key={exp.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                        {exp.item}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#7B61FF", fontWeight: 600 }}>
                        {exp.category}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{exp.purchaseFrom}</TableCell>
                    <TableCell sx={{ fontSize: "13px", color: "#64748B" }}>{exp.purchaseDate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: "11px", bgcolor: "#EDE9FE", color: "#7B61FF" }}>
                          {exp.purchasedBy[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1E293B" }}>{exp.purchasedBy}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#0F172A", fontSize: "14px" }}>
                      ₹{exp.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exp.paidBy}
                        size="small"
                        sx={{ bgcolor: "#F1F5F9", color: "#475569", fontSize: "11px", fontWeight: 600, borderRadius: "6px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exp.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "8px",
                          bgcolor: exp.status === "Approved" ? "#E8F5E9" : "#FEF3C7",
                          color: exp.status === "Approved" ? "#2E7D32" : "#B45309",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleToggleStatus(exp.id)}
                        sx={{
                          textTransform: "none",
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "6px",
                          color: exp.status === "Approved" ? "#B45309" : "#2E7D32",
                          bgcolor: exp.status === "Approved" ? "#FEF3C7" : "#E8F5E9",
                          "&:hover": { bgcolor: exp.status === "Approved" ? "#FDE68A" : "#C8E6C9" },
                        }}
                      >
                        {exp.status === "Approved" ? "Mark Pending" : "Approve"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 8, 15]}
              component="div"
              count={filteredExpenses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        )}

        {/* VIEW MODE: CARDS */}
        {viewMode === "cards" && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredExpenses.map((exp) => (
              <Grid item xs={12} sm={6} md={4} key={exp.id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px -4px rgba(0,0,0,0.08)",
                      borderColor: "#7B61FF",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Chip
                        label={exp.category}
                        size="small"
                        sx={{ bgcolor: "#F4F0FF", color: "#7B61FF", fontWeight: 700, fontSize: "11px", borderRadius: "6px" }}
                      />
                      <Chip
                        label={exp.status}
                        size="small"
                        sx={{
                          bgcolor: exp.status === "Approved" ? "#E8F5E9" : "#FEF3C7",
                          color: exp.status === "Approved" ? "#2E7D32" : "#B45309",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "16px", mb: 0.5 }}>
                      {exp.item}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                      Vendor: <strong>{exp.purchaseFrom}</strong> • Date: {exp.purchaseDate}
                    </Typography>

                    <Box sx={{ p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", mb: 2 }}>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>Total Invoice Amount</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                        ₹{exp.amount.toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>Buyer: <strong>{exp.purchasedBy}</strong></Typography>
                      <Chip label={exp.paidBy} size="small" sx={{ fontSize: "10px", borderRadius: "4px" }} />
                    </Box>
                  </CardContent>

                  <Divider />
                  <CardActions sx={{ px: 2.5, py: 1.5, justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      onClick={() => handleToggleStatus(exp.id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "12px",
                        color: exp.status === "Approved" ? "#B45309" : "#2E7D32",
                      }}
                    >
                      {exp.status === "Approved" ? "Mark Pending" : "Approve Invoice"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default ExpenseReport;
