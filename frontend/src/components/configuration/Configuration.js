import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../Common_Bar/Layout";

// Material Icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

const CONFIG_MODULES = [
  // Talent Acquisition & Recruitment
  {
    id: "manage-jobs",
    title: "Manage Jobs",
    category: "Recruitment",
    path: "/manage-jobs-view",
    description: "Create, publish, and track company job openings, qualifications, and vacancy statuses.",
    icon: <WorkOutlineRoundedIcon />,
    color: "#2563EB", // Blue
    bgLight: "#EFF6FF",
    badge: "Hiring Pipeline",
    keywords: ["jobs", "openings", "vacancies", "recruitment", "hiring", "positions"],
  },
  {
    id: "manage-resume",
    title: "Manage Resume",
    category: "Recruitment",
    path: "/resume",
    description: "Screen candidate CVs, review qualifications, and maintain the central talent pool repository.",
    icon: <DescriptionOutlinedIcon />,
    color: "#0891B2", // Cyan
    bgLight: "#ECFEFF",
    badge: "Candidate Pool",
    keywords: ["resume", "cv", "applications", "applicants", "profiles"],
  },
  {
    id: "shortlist-candidates",
    title: "Shortlist Candidate",
    category: "Recruitment",
    path: "/shortlist",
    description: "Filter candidates through interview rounds, evaluate scores, and move prospects forward.",
    icon: <FactCheckOutlinedIcon />,
    color: "#7C3AED", // Violet
    bgLight: "#F5F3FF",
    badge: "Interviews",
    keywords: ["shortlist", "interview", "selection", "candidates", "evaluation"],
  },
  {
    id: "offer-approval",
    title: "Offer Approval",
    category: "Recruitment",
    path: "/offer-approval-view",
    description: "Manage formal job offer letters, salary approvals, sign-off status, and joinings.",
    icon: <VerifiedUserOutlinedIcon />,
    color: "#059669", // Emerald
    bgLight: "#ECFDF5",
    badge: "Offers",
    keywords: ["offer", "approval", "package", "salary offer", "joining"],
  },

  // Employee Lifecycle
  {
    id: "promotion",
    title: "Promotion",
    category: "Lifecycle",
    path: "/promotion",
    description: "Record career advancements, designation upgrades, salary level revisions, and promotion logs.",
    icon: <TrendingUpRoundedIcon />,
    color: "#0284C7", // Sky
    bgLight: "#F0F9FF",
    badge: "Career Growth",
    keywords: ["promotion", "advancement", "designation", "role change", "elevation"],
  },
  {
    id: "resignation",
    title: "Resignation",
    category: "Lifecycle",
    path: "/resignation-view",
    description: "Process employee resignation notices, track notice periods, handovers, and clearance.",
    icon: <ExitToAppRoundedIcon />,
    color: "#D97706", // Amber
    bgLight: "#FFFBEB",
    badge: "Offboarding",
    keywords: ["resignation", "exit", "notice period", "handover", "departure"],
  },
  {
    id: "termination",
    title: "Termination",
    category: "Lifecycle",
    path: "/termination",
    description: "Record employment terminations, document reason codes, exit interviews, and protocol.",
    icon: <PersonOffRoundedIcon />,
    color: "#DC2626", // Red
    bgLight: "#FEF2F2",
    badge: "HR Protocol",
    keywords: ["termination", "dismissal", "separation", "exit record"],
  },

  // Performance & Growth
  {
    id: "performance",
    title: "Performance Appraisal",
    category: "Performance",
    path: "/performance",
    description: "Track employee KPIs, review performance ratings, schedule reviews, and appraisal history.",
    icon: <AssessmentRoundedIcon />,
    color: "#4F46E5", // Indigo
    bgLight: "#EEF2FF",
    badge: "KPIs & Reviews",
    keywords: ["performance", "appraisal", "rating", "review", "kpi", "evaluation"],
  },
  {
    id: "training",
    title: "Training & Development",
    category: "Performance",
    path: "/training",
    description: "Schedule skill training programs, manage professional trainers, and track session costs.",
    icon: <SchoolRoundedIcon />,
    color: "#0D9488", // Teal
    bgLight: "#F0FDFA",
    badge: "Skill Upgrades",
    keywords: ["training", "trainer", "courses", "workshops", "skills"],
  },

  // Organization & System
  {
    id: "holidays",
    title: "Holiday Calendar",
    category: "System",
    path: "/holidays",
    description: "Configure corporate public holidays, calendar days-off, and company event dates.",
    icon: <EventNoteRoundedIcon />,
    color: "#EA580C", // Orange
    bgLight: "#FFF7ED",
    badge: "Calendar",
    keywords: ["holiday", "calendar", "festival", "leave days", "public holiday"],
  },
  {
    id: "settings",
    title: "System Settings",
    category: "System",
    path: "/settings",
    description: "Manage global ERP preferences, notification triggers, company details, and credentials.",
    icon: <SettingsOutlinedIcon />,
    color: "#475569", // Slate
    bgLight: "#F8FAFC",
    badge: "Preferences",
    keywords: ["settings", "system", "configuration", "notifications", "company", "erp"],
  },
];

const CATEGORIES = [
  { label: "All Modules", value: "All" },
  { label: "Recruitment", value: "Recruitment" },
  { label: "Employee Lifecycle", value: "Lifecycle" },
  { label: "Performance & Growth", value: "Performance" },
  { label: "System & Calendar", value: "System" },
];

const ConfigurationPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredModules = useMemo(() => {
    return CONFIG_MODULES.filter((module) => {
      const matchesCategory =
        selectedCategory === "All" || module.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        module.title.toLowerCase().includes(q) ||
        module.description.toLowerCase().includes(q) ||
        module.category.toLowerCase().includes(q) ||
        module.badge.toLowerCase().includes(q) ||
        module.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <Layout>
      <Box sx={{ pb: 6, maxWidth: "1400px", mx: "auto" }}>
        {/* Top Hero Banner */}
        <Card
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #003F5F 0%, #005F8A 50%, #0A7EA4 100%)",
            color: "#ffffff",
            borderRadius: "20px",
            p: { xs: 3, md: 4 },
            mb: 4,
            boxShadow: "0 10px 25px -5px rgba(0, 63, 95, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle background decorative shapes */}
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              right: 120,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              pointerEvents: "none",
            }}
          />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Chip
                  icon={<TuneIcon sx={{ fontSize: "16px !important", color: "#E0F2FE !important" }} />}
                  label="ERP System Control"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    color: "#ffffff",
                    fontWeight: 600,
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                />
                <Typography variant="caption" sx={{ color: "#BAE6FD", fontWeight: 500 }}>
                  v2.4 Enterprise
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                  mb: 1,
                }}
              >
                Configuration & Operations Hub
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  maxWidth: "680px",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                Centralized command center to configure organizational workflows, talent acquisition pipelines, employee lifecycle transitions, appraisal metrics, and system preferences.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "14px",
                    p: 2,
                    textAlign: "center",
                    minWidth: "110px",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff" }}>
                    {CONFIG_MODULES.length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#BAE6FD", fontWeight: 600 }}>
                    Modules
                  </Typography>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "14px",
                    p: 2,
                    textAlign: "center",
                    minWidth: "110px",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#38BDF8" }}>
                    4
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#BAE6FD", fontWeight: 600 }}>
                    Domains
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Filter & Search Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 3.5,
            backgroundColor: "#FFFFFF",
            p: 2,
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onChange={(e, newVal) => setSelectedCategory(newVal)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: "42px",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                minHeight: "40px",
                borderRadius: "10px",
                px: 2.2,
                py: 0.8,
                color: "#64748B",
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  color: "#004E69",
                  backgroundColor: "#E6F4FA",
                },
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {CATEGORIES.map((cat) => (
              <Tab key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Tabs>

          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search configuration module or feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: "320px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#F8FAFC",
                "&:hover fieldset": {
                  borderColor: "#004E69",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#004E69",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94A3B8", fontSize: "20px" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ minWidth: "auto", p: 0.5, color: "#94A3B8" }}
                  >
                    <ClearIcon sx={{ fontSize: "18px" }} />
                  </Button>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <Grid container spacing={2.5}>
            {filteredModules.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: item.color,
                      boxShadow: `0 12px 24px -6px ${item.color}25, 0 4px 8px -2px rgba(0, 0, 0, 0.05)`,
                      "& .module-icon-box": {
                        transform: "scale(1.08)",
                      },
                      "& .module-launch-btn": {
                        backgroundColor: item.color,
                        color: "#ffffff",
                      },
                      "& .module-arrow-icon": {
                        transform: "translateX(4px)",
                      },
                    },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <CardActionArea
                    sx={{
                      p: 2.5,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      {/* Top Header Row in Card */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          className="module-icon-box"
                          sx={{
                            backgroundColor: item.bgLight,
                            color: item.color,
                            width: 48,
                            height: 48,
                            borderRadius: "14px",
                            transition: "transform 0.25s ease",
                            "& svg": {
                              fontSize: "26px",
                            },
                          }}
                        >
                          {item.icon}
                        </Avatar>

                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            backgroundColor: item.bgLight,
                            color: item.color,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            borderRadius: "8px",
                            border: `1px solid ${item.color}30`,
                          }}
                        />
                      </Box>

                      {/* Title & Description */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#1E293B",
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          fontSize: "0.84rem",
                          lineHeight: 1.5,
                          mb: 2,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    {/* Bottom Launch Button */}
                    <Box
                      className="module-launch-btn"
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        px: 1.5,
                        borderRadius: "10px",
                        backgroundColor: "#F8FAFC",
                        color: "#334155",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        transition: "all 0.2s ease",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <span>Configure Module</span>
                      <ArrowForwardRoundedIcon
                        className="module-arrow-icon"
                        sx={{
                          fontSize: "18px",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty Search State */
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              border: "1px dashed #CBD5E1",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                backgroundColor: "#F1F5F9",
                color: "#64748B",
              }}
            >
              <SearchIcon sx={{ fontSize: "32px" }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
              No configuration modules match "{searchQuery}"
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
              Try searching for different keywords like "Jobs", "Appraisal", "Resignation", or "Settings".
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              sx={{
                borderRadius: "10px",
                borderColor: "#004E69",
                color: "#004E69",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#003F5F",
                  backgroundColor: "#E6F4FA",
                },
              }}
            >
              Reset Filters & Search
            </Button>
          </Box>
        )}

        {/* Quick Reference / Guidance Card */}
        <Box
          sx={{
            mt: 5,
            p: 3,
            borderRadius: "18px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <AutoFixHighRoundedIcon sx={{ color: "#004E69" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#004E69" }}>
                  Administrative Quick Tip
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                Need to add organizational departments, project rates, or manage base payroll parameters? You can also access Department Management or Payroll Settings directly from the left navigation bar.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                variant="contained"
                onClick={() => navigate("/department")}
                startIcon={<BusinessRoundedIcon />}
                sx={{
                  backgroundColor: "#004E69",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  boxShadow: "0 4px 12px rgba(0, 78, 105, 0.2)",
                  "&:hover": {
                    backgroundColor: "#003F5F",
                  },
                }}
              >
                Go to Departments
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default ConfigurationPage;
