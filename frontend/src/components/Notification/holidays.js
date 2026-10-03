import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import UpcomingRoundedIcon from "@mui/icons-material/UpcomingRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import CloseIcon from "@mui/icons-material/Close";
import Layout from "../Common_Bar/Layout";
import dayjs from "dayjs";
import { API_BASE_URL } from "../../config/api";

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  // Pagination for table view
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Delete dialog
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const today = dayjs();

  const fetchHolidays = async () => {
    const localHolidays = JSON.parse(localStorage.getItem("holidaysData")) || [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/holidays`);
      if (response.ok) {
        const data = await response.json();
        const apiList = data.holidays || [];
        const apiNames = new Set(apiList.map((h) => (h.name || "").toLowerCase()));
        const uniqueLocal = localHolidays.filter(
          (h) => !apiNames.has((h.name || "").toLowerCase())
        );
        const merged = [...apiList, ...uniqueLocal];
        localStorage.setItem("holidaysData", JSON.stringify(merged));
        setHolidays(merged);
        applyFilters(merged, searchTerm, typeFilter);
        return;
      }
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
    setHolidays(localHolidays);
    applyFilters(localHolidays, searchTerm, typeFilter);
  };

  const applyFilters = (allHolidays, search, type) => {
    let result = [...allHolidays];

    if (type !== "ALL") {
      result = result.filter((h) => {
        const hDate = dayjs(h.date);
        if (type === "UPCOMING") return hDate.isAfter(today, "day") || hDate.isSame(today, "day");
        if (type === "PAST") return hDate.isBefore(today, "day");
        if (type === "THIS_MONTH") return hDate.month() === today.month() && hDate.year() === today.year();
        return true;
      });
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((h) => {
        const name = (h.name || "").toLowerCase();
        const day = (h.day || "").toLowerCase();
        const date = (h.date || "").toLowerCase();
        const type = (h.type || "").toLowerCase();
        return name.includes(query) || day.includes(query) || date.includes(query) || type.includes(query);
      });
    }

    // Sort by date ascending
    result.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
    setFilteredHolidays(result);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(holidays, term, typeFilter);
    setPage(0);
  };

  const handleOpenDelete = (holiday) => {
    setHolidayToDelete(holiday);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!holidayToDelete) return;
    const hName = holidayToDelete.name || "Holiday";
    const hId = holidayToDelete.id || hName;

    try {
      if (hId) {
        await fetch(`${API_BASE_URL}/api/holidays/${encodeURIComponent(hId)}`, {
          method: "DELETE",
        });
      }
    } catch (e) {
      console.warn("Error deleting holiday from backend:", e);
    }

    // Remove from local storage
    const existing = JSON.parse(localStorage.getItem("holidaysData")) || [];
    const updated = existing.filter((h) => (h.name || "") !== hName);
    localStorage.setItem("holidaysData", JSON.stringify(updated));

    setDeleteModalOpen(false);
    setHolidayToDelete(null);
    setSnackbar({ open: true, message: "Holiday deleted successfully", severity: "success" });
    fetchHolidays();
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Compute KPI metrics
  const totalCount = holidays.length;
  const upcomingCount = holidays.filter((h) => {
    const hDate = dayjs(h.date);
    return hDate.isAfter(today, "day") || hDate.isSame(today, "day");
  }).length;
  const pastCount = holidays.filter((h) => dayjs(h.date).isBefore(today, "day")).length;
  const thisMonthCount = holidays.filter((h) => {
    const hDate = dayjs(h.date);
    return hDate.month() === today.month() && hDate.year() === today.year();
  }).length;

  const kpiCards = [
    {
      title: "Total Holidays",
      count: totalCount,
      icon: <EventNoteRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} />,
      bg: "#F4F0FF",
      border: "#E9E3FF",
      filterValue: "ALL",
    },
    {
      title: "Upcoming",
      count: upcomingCount,
      icon: <UpcomingRoundedIcon sx={{ color: "#00C853", fontSize: 28 }} />,
      bg: "#E8F5E9",
      border: "#C8E6C9",
      filterValue: "UPCOMING",
    },
    {
      title: "Past Holidays",
      count: pastCount,
      icon: <HistoryRoundedIcon sx={{ color: "#FFB300", fontSize: 28 }} />,
      bg: "#FFF8E1",
      border: "#FFE082",
      filterValue: "PAST",
    },
    {
      title: "This Month",
      count: thisMonthCount,
      icon: <TodayRoundedIcon sx={{ color: "#E91E63", fontSize: 28 }} />,
      bg: "#FCE4EC",
      border: "#F8BBD0",
      filterValue: "THIS_MONTH",
    },
  ];

  // Date chip color helper
  const getDateChipStyle = (dateStr) => {
    const hDate = dayjs(dateStr);
    const isPast = hDate.isBefore(today, "day");
    const isToday = hDate.isSame(today, "day");
    if (isToday) return { bg: "#E8F5E9", color: "#2E7D32", label: "Today" };
    if (isPast) return { bg: "#F1F5F9", color: "#64748B", label: "Past" };
    return { bg: "#E0F2FE", color: "#0284C7", label: "Upcoming" };
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#0F172A" }}>
              <EventNoteRoundedIcon sx={{ color: "#7B61FF", fontSize: 28 }} /> Holidays Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Manage company holidays, public holidays, and optional leave days.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {/* Cards / Table View Toggle */}
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
            </Box>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderColor: "#e0e0e0",
                color: "black",
                borderRadius: "10px",
                fontWeight: 600,
                height: "40px",
              }}
            >
              Export
            </Button>

            <Button
              component={Link}
              to="/addholiday"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                backgroundColor: "#7B61FF",
                borderRadius: "10px",
                fontWeight: 600,
                height: "40px",
                px: 2.5,
                boxShadow: "0 2px 6px rgba(123, 97, 255, 0.25)",
                "&:hover": { backgroundColor: "#624BCC" },
              }}
            >
              Add New Holiday
            </Button>
          </Box>
        </Box>

        {/* 4 KPI Dashboard Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {kpiCards.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                onClick={() => {
                  setTypeFilter(stat.filterValue);
                  applyFilters(holidays, searchTerm, stat.filterValue);
                }}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: "16px",
                  border: `1px solid ${typeFilter === stat.filterValue ? stat.border : "#e0e0e0"}`,
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
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            p: 2,
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by holiday name, date, or day..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#7B61FF" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: "380px" },
              "& fieldset": { border: "none" },
              backgroundColor: "#F8F9FD",
              borderRadius: "10px",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "gray", fontWeight: 600, mr: 1 }}>
              Filter:
            </Typography>
            {[
              { label: `All (${totalCount})`, val: "ALL" },
              { label: `Upcoming (${upcomingCount})`, val: "UPCOMING" },
              { label: `Past (${pastCount})`, val: "PAST" },
              { label: `This Month (${thisMonthCount})`, val: "THIS_MONTH" },
            ].map((tab) => (
              <Chip
                key={tab.val}
                label={tab.label}
                onClick={() => {
                  setTypeFilter(tab.val);
                  applyFilters(holidays, searchTerm, tab.val);
                }}
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  bgcolor: typeFilter === tab.val ? "#7B61FF" : "#F8F9FD",
                  color: typeFilter === tab.val ? "#FFFFFF" : "#475569",
                  "&:hover": {
                    bgcolor: typeFilter === tab.val ? "#624BCC" : "#EDE9FE",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* VIEW MODE: CARDS VIEW */}
        {viewMode === "cards" && (
          <Box sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "17px" }}>
                Holiday Calendar ({filteredHolidays.length})
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Showing holidays matching selected filters
              </Typography>
            </Box>

            {filteredHolidays.length > 0 ? (
              <Grid container spacing={3}>
                {filteredHolidays.map((holiday, idx) => {
                  const hName = holiday.name || "Unnamed Holiday";
                  const hDate = holiday.date || "No Date";
                  const hDay = holiday.day || "";
                  const hType = holiday.type || "Public Holiday";
                  const hDescription = holiday.description || "";
                  const dateChip = getDateChipStyle(hDate);

                  // Type chip colors
                  let typeBg = "#F4F0FF";
                  let typeColor = "#7B61FF";
                  if (hType === "Company Holiday") {
                    typeBg = "#E0F2FE";
                    typeColor = "#0284C7";
                  } else if (hType === "Optional Holiday") {
                    typeBg = "#FFF8E1";
                    typeColor = "#F57F17";
                  }

                  return (
                    <Grid item xs={12} md={6} lg={4} key={holiday.id || idx}>
                      <Card
                        sx={{
                          borderRadius: "16px",
                          border: "1px solid #e0e0e0",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          backgroundColor: "#ffffff",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.08)",
                            borderColor: "#7B61FF",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                          {/* Header: Holiday Name & Type */}
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                            <Box>
                              <Chip
                                label={hType}
                                size="small"
                                sx={{ bgcolor: typeBg, color: typeColor, fontWeight: 700, fontSize: "11px", mb: 0.8, borderRadius: "6px" }}
                              />
                              <Typography variant="h6" fontWeight="700" sx={{ color: "#0F172A", lineHeight: 1.3, fontSize: "17px" }}>
                                {hName}
                              </Typography>
                            </Box>
                            <Chip
                              label={dateChip.label}
                              size="small"
                              sx={{
                                backgroundColor: dateChip.bg,
                                color: dateChip.color,
                                fontWeight: "700",
                                fontSize: "12px",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>

                          {hDescription && (
                            <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                              {hDescription}
                            </Typography>
                          )}

                          {/* Date Info Box */}
                          <Box sx={{ mb: 2, p: 1.5, bgcolor: "#F8F9FD", borderRadius: "10px", border: "1px solid #F1F5F9" }}>
                            <Grid container spacing={1.5}>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                  <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#94A3B8" }} />
                                  <Typography variant="caption" color="text.secondary">Date</Typography>
                                </Box>
                                <Typography variant="body2" fontWeight="600" color="#1e293b" fontSize="13px">
                                  {hDate}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                  <DateRangeRoundedIcon sx={{ fontSize: 13, color: "#94A3B8" }} />
                                  <Typography variant="caption" color="text.secondary">Day</Typography>
                                </Box>
                                <Typography variant="body2" fontWeight="600" color="#7B61FF" fontSize="13px">
                                  {hDay}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>

                          <Divider sx={{ borderColor: "#F1F5F9" }} />
                        </CardContent>

                        <CardActions sx={{ justifyContent: "space-between", px: 2.5, py: 1.5, backgroundColor: "#FAFBFD" }}>
                          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
                            Type: <strong>{hType}</strong>
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(holiday)}
                            sx={{
                              color: "#EF4444",
                              bgcolor: "#FEE2E2",
                              borderRadius: "8px",
                              width: 32,
                              height: 32,
                              "&:hover": { bgcolor: "#FCA5A5", color: "#B91C1C" },
                            }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ p: 6, textAlign: "center", backgroundColor: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                <EventNoteRoundedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1.5 }} />
                <Typography color="text.secondary" sx={{ mb: 2, fontSize: "15px", fontWeight: 500 }}>
                  No holidays found matching the filter criteria.
                </Typography>
                <Button
                  component={Link}
                  to="/addholiday"
                  variant="contained"
                  sx={{ backgroundColor: "#7B61FF", "&:hover": { backgroundColor: "#624BCC" }, textTransform: "none", borderRadius: "10px", fontWeight: 600 }}
                >
                  + Add New Holiday
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* VIEW MODE: TABLE VIEW */}
        {viewMode === "table" && (
          <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", boxShadow: "none", overflow: "hidden", mb: 4, bgcolor: "#FFFFFF" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#F8F9FD" }}>
                <TableRow>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DATE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>DAY</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>HOLIDAY NAME</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>TYPE</Typography></TableCell>
                  <TableCell><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>STATUS</Typography></TableCell>
                  <TableCell align="center"><Typography sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>ACTIONS</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHolidays.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((holiday, idx) => {
                  const hName = holiday.name || "Unnamed Holiday";
                  const hDate = holiday.date || "—";
                  const hDay = holiday.day || "—";
                  const hType = holiday.type || "Public Holiday";
                  const dateChip = getDateChipStyle(hDate);

                  // Type chip colors
                  let typeBg = "#F4F0FF";
                  let typeColor = "#7B61FF";
                  if (hType === "Company Holiday") {
                    typeBg = "#E0F2FE";
                    typeColor = "#0284C7";
                  } else if (hType === "Optional Holiday") {
                    typeBg = "#FFF8E1";
                    typeColor = "#F57F17";
                  }

                  return (
                    <TableRow key={holiday.id || idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: "4px",
                              backgroundColor: dateChip.color,
                              borderRadius: "3px",
                              marginRight: 1,
                              height: "30px",
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "13px" }}>{hDate}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px", color: "#334155" }}>{hDay}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "14px" }}>{hName}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-block", px: 1.5, py: 0.4, borderRadius: "12px", bgcolor: typeBg, color: typeColor, fontSize: "12px", fontWeight: "bold" }}>
                          {hType}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-block", px: 1.5, py: 0.4, borderRadius: "12px", bgcolor: dateChip.bg, color: dateChip.color, fontSize: "12px", fontWeight: "bold" }}>
                          {dateChip.label}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDelete(holiday)}
                          sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", "&:hover": { bgcolor: "#FEE2E2" } }}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: "#F44336" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 8, 15]}
              component="div"
              count={filteredHolidays.length}
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
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            mx: 2,
          },
        }}
      >
        <Box sx={{ p: 3.5, position: "relative", width: "100%", boxSizing: "border-box" }}>
          <IconButton
            onClick={() => setDeleteModalOpen(false)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#9CA3AF",
              "&:hover": { color: "#374151", bgcolor: "#F3F4F6" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", pt: 0.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                color: "#EF4444",
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#111827", mb: 1 }}>
              Delete Holiday
            </Typography>

            <Typography sx={{ fontWeight: 400, fontSize: "14px", color: "#6B7280", lineHeight: 1.5, px: 1, mb: 3 }}>
              Are you sure you want to delete{" "}
              <Typography component="span" sx={{ fontWeight: 600, color: "#1F2937", fontSize: "14px" }}>
                "{holidayToDelete?.name || "this holiday"}"
              </Typography>
              ? This action cannot be undone.
            </Typography>

            <Box sx={{ display: "flex", width: "100%", gap: 1.5, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteModalOpen(false)}
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  bgcolor: "#FFFFFF",
                  "&:hover": { bgcolor: "#F9FAFB", borderColor: "#D1D5DB" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDelete}
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  bgcolor: "#DC2626",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  boxShadow: "0 1px 3px 0 rgba(220, 38, 38, 0.35)",
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Holidays;
