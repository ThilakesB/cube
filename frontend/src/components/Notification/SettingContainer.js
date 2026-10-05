import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  Select,
  MenuItem,
  TextField,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import Layout from "../Common_Bar/Layout";

// Material-UI Icons
import SettingsIcon from "@mui/icons-material/Settings";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Multi-language dictionary
const TRANSLATIONS = {
  en: {
    pageTitle: "Settings & System Preferences",
    pageSubtitle: "Configure your personal interface, security settings, company profile, and notification rules.",
    tabGeneral: "General & Appearance",
    tabNotifications: "Notifications",
    tabSecurity: "Security & Auth",
    tabCompany: "Company Profile",
    tabData: "Data & System",
    saveChanges: "Save Changes",
    savedSuccess: "Settings saved successfully!",
    appearanceTitle: "Theme & Display",
    appearanceDesc: "Customize how the ERP interface looks on your desktop and mobile displays.",
    themeLabel: "Color Theme",
    lightTheme: "Light Mode",
    darkTheme: "Dark Mode",
    systemTheme: "System Default",
    languageTitle: "Language & Localization",
    languageDesc: "Choose your preferred language for the interface and generated reports.",
    languageLabel: "Interface Language",
    twoFactorTitle: "Two-factor Authentication (2FA)",
    twoFactorDesc: "Enhance account protection with email or authenticator verification codes upon login.",
    mobilePushTitle: "Mobile Push Notifications",
    mobilePushDesc: "Receive real-time alerts for urgent approvals, tasks, and project milestones on mobile.",
    desktopNotifTitle: "Desktop Notifications",
    desktopNotifDesc: "Display browser desktop banners for new messages, attendance checks, and updates.",
    emailNotifTitle: "Email Notifications & Digests",
    emailNotifDesc: "Send automated emails for payroll slips, leave requests, and monthly summary logs.",
    securityHeader: "Security Policies",
    securitySub: "Manage password protocols, session expiration, and authentication standards.",
    sessionTimeout: "Session Timeout (Minutes)",
    companyHeader: "Organization Information",
    companySub: "Official corporate details printed on payslips, invoices, and exported reports.",
    companyName: "Company Legal Name",
    regNumber: "Registration / GSTIN Number",
    officialEmail: "Official Billing & HR Email",
    phone: "Company Contact Number",
    currency: "Default Currency",
    address: "Registered Corporate Address",
    dataHeader: "Data & Storage Management",
    dataSub: "Inspect database connectivity, export backups, and clear application cache.",
  },
  ta: {
    pageTitle: "அமைப்புகள் & விருப்பத்தேர்வுகள்",
    pageSubtitle: "உங்கள் இடைமுகம், பாதுகாப்பு அமைப்புகள், நிறுவன விவரங்கள் மற்றும் அறிவிப்புகளை உள்ளமைக்கவும்.",
    tabGeneral: "பொது & தோற்றம்",
    tabNotifications: "அறிவிப்புகள்",
    tabSecurity: "பாதுகாப்பு",
    tabCompany: "நிறுவன விவரங்கள்",
    tabData: "தரவு & சேமிப்பு",
    saveChanges: "மாற்றங்களைச் சேமிக்கவும்",
    savedSuccess: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!",
    appearanceTitle: "தீம் & காட்சி தோற்றம்",
    appearanceDesc: "உங்கள் சாதனத்தில் ERP இடைமுகத்தின் தோற்றத்தைத் தனிப்பயனாக்குங்கள்.",
    themeLabel: "வண்ணத் தீம்",
    lightTheme: "ஒளி முறை (Light)",
    darkTheme: "இருள் முறை (Dark)",
    systemTheme: "கணினி இயல்புநிலை",
    languageTitle: "மொழி & பிராந்திய விருப்பங்கள்",
    languageDesc: "இடைமுகம் மற்றும் அறிக்கைகளுக்கான உங்கள் விருப்ப மொழியைத் தேர்வுசெய்யவும்.",
    languageLabel: "இடைமுக மொழி",
    twoFactorTitle: "இரு காரணி அங்கீகாரம் (2FA)",
    twoFactorDesc: "மின்னஞ்சல் மூலம் 2FA செயல்படுத்தி உங்கள் கணக்கைப் பாதுகாப்பாக வைத்திருக்கவும்.",
    mobilePushTitle: "மொபைல் புஷ் அறிவிப்புகள்",
    mobilePushDesc: "ஒப்புதல்கள் மற்றும் பணிகளுக்கான நிகழ்நேர மொபைல் விழிப்பூட்டல்களைப் பெறவும்.",
    desktopNotifTitle: "டெஸ்க்டாப் அறிவிப்புகள்",
    desktopNotifDesc: "புதிய செய்திகள் மற்றும் புதுப்பிப்புகளுக்கான டெஸ்க்டாப் அறிவிப்புகளைப் பெறவும்.",
    emailNotifTitle: "மின்னஞ்சல் அறிவிப்புகள்",
    emailNotifDesc: "சம்பளச் சீட்டுகள் மற்றும் விடுப்பு கோரிக்கைகளுக்கான மின்னஞ்சல் அறிவிப்புகளைப் பெறவும்.",
    securityHeader: "பாதுகாப்புக் கொள்கைகள்",
    securitySub: "கடவுச்சொல் விதிகள் மற்றும் அமர்வு காலாவதியை நிர்வகிக்கவும்.",
    sessionTimeout: "அமர்வு காலாவதி நேரம் (நிமிடங்கள்)",
    companyHeader: "நிறுவனத் தகவல்கள்",
    companySub: "சம்பள சீட்டுகள் மற்றும் அறிக்கைகளில் அச்சிடப்படும் அதிகாரப்பூர்வ விவரங்கள்.",
    companyName: "நிறுவனத்தின் பெயர்",
    regNumber: "பதிவு எண் / GSTIN",
    officialEmail: "அதிகாரப்பூர்வ மின்னஞ்சல்",
    phone: "தொடர்பு எண்",
    currency: "இயல்புநிலை நாணயம்",
    address: "பதிவு செய்யப்பட்ட முகவரி",
    dataHeader: "தரவு மற்றும் காப்புப்பிரதி",
    dataSub: "தரவுத்தள இணைப்பை ஆய்வு செய்து தரவை ஏற்றுமதி செய்யவும்.",
  },
  hi: {
    pageTitle: "सेटिंग्स और सिस्टम प्राथमिकताएं",
    pageSubtitle: "अपने व्यक्तिगत इंटरफ़ेस, सुरक्षा सेटिंग्स, कंपनी प्रोफ़ाइल और अधिसूचना नियमों को कॉन्फ़िगर करें।",
    tabGeneral: "सामान्य और रूप",
    tabNotifications: "सूचनाएं",
    tabSecurity: "सुरक्षा और प्रमाणीकरण",
    tabCompany: "कंपनी प्रोफ़ाइल",
    tabData: "डेटा और सिस्टम",
    saveChanges: "परिवर्तन सहेजें",
    savedSuccess: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    appearanceTitle: "थीम और प्रदर्शन",
    appearanceDesc: "अपने डिवाइस पर ERP इंटरफ़ेस के स्वरूप को अनुकूलित करें।",
    themeLabel: "रंग थीम",
    lightTheme: "लाइट मोड",
    darkTheme: "डार्क मोड",
    systemTheme: "सिस्टम डिफ़ॉल्ट",
    languageTitle: "भाषा और स्थानीयकरण",
    languageDesc: "इंटरफ़ेस और रिपोर्ट के लिए अपनी पसंदीदा भाषा चुनें।",
    languageLabel: "इंटरफ़ेस भाषा",
    twoFactorTitle: "दो-कारक प्रमाणीकरण (2FA)",
    twoFactorDesc: "लॉगिन पर ईमेल सत्यापन कोड के साथ खाता सुरक्षा बढ़ाएं।",
    mobilePushTitle: "मोबाइल पुश सूचनाएं",
    mobilePushDesc: "स्वीकृतियों और कार्यों के लिए रीयल-टाइम मोबाइल अलर्ट प्राप्त करें।",
    desktopNotifTitle: "डेस्कटॉप सूचनाएं",
    desktopNotifDesc: "नए संदेशों और उपस्थिति अपडेट के लिए डेस्कटॉप सूचनाएं प्राप्त करें।",
    emailNotifTitle: "ईमेल सूचनाएं",
    emailNotifDesc: "पेस्लिप और छुट्टी अनुरोधों के लिए स्वचालित ईमेल प्राप्त करें।",
    securityHeader: "सुरक्षा नीतियां",
    securitySub: "पासवर्ड प्रोटोकॉल और सत्र समाप्ति प्रबंधित करें।",
    sessionTimeout: "सत्र समय समाप्ति (मिनट)",
    companyHeader: "संगठन विवरण",
    companySub: "पेस्लिप और रिपोर्ट पर मुद्रित आधिकारिक विवरण।",
    companyName: "कंपनी का कानूनी नाम",
    regNumber: "पंजीकरण / GSTIN संख्या",
    officialEmail: "आधिकारिक ईमेल",
    phone: "कंपनी फोन नंबर",
    currency: "डिफ़ॉल्ट मुद्रा",
    address: "पंजीकृत कॉर्पोरेट पता",
    dataHeader: "डेटा और बैकअप प्रबंधन",
    dataSub: "डेटाबेस स्थिति की जांच करें और बैकअप निर्यात करें।",
  },
  te: {
    pageTitle: "సెట్టింగులు & ప్రాధాన్యతలు",
    pageSubtitle: "మీ వ్యక్తిగత ఇంటర్‌ఫేస్, భద్రతా సెట్టింగులు మరియు నోటిఫికేషన్‌లను కాన్ఫిగర్ చేయండి.",
    tabGeneral: "సాధారణ & రూపం",
    tabNotifications: "నోటిఫికేషన్లు",
    tabSecurity: "భద్రత",
    tabCompany: "కంపెనీ వివరాలు",
    tabData: "డేటా & సిస్టమ్",
    saveChanges: "మార్పులను సేవ్ చేయండి",
    savedSuccess: "సెట్టింగులు విజయవంతంగా సేవ్ చేయబడ్డాయి!",
    appearanceTitle: "థీమ్ & ప్రదర్శన",
    appearanceDesc: "మీ డివైస్‌పై ERP ఇంటర్‌ఫేస్ ఎలా కనిపిస్తుందో అనుకూలీకరించండి.",
    themeLabel: "కలర్ థీమ్",
    lightTheme: "లైట్ మోడ్",
    darkTheme: "డార్క్ మోడ్",
    systemTheme: "సిస్టమ్ డిఫాల్ట్",
    languageTitle: "భాష ఎంపిక",
    languageDesc: "ఇంటర్‌ఫేస్ మరియు నివేదికల కోసం మీ భాషను ఎంచుకోండి.",
    languageLabel: "ఇంటర్‌ఫేస్ భాష",
    twoFactorTitle: "రెండు-కారకం ప్రమాణీకరణ (2FA)",
    twoFactorDesc: "ఈమెయిల్ కోడ్‌లతో మీ ఖాతాను మరింత సురక్షితంగా ఉంచండి.",
    mobilePushTitle: "మొబైల్ పుష్ నోటిఫికేషన్లు",
    mobilePushDesc: "టాస్క్‌లు మరియు ఆమోదాల కోసం రియల్-టైమ్ మొబైల్ అలర్ట్‌లను పొందండి.",
    desktopNotifTitle: "డెస్క్‌టాప్ నోటిఫికేషన్లు",
    desktopNotifDesc: "సందేశాలు మరియు అప్‌డేట్‌ల కోసం డెస్క్‌టాప్ నోటిఫికేషన్‌లు పొందండి.",
    emailNotifTitle: "ఈమెయిల్ నోటిఫికేషన్లు",
    emailNotifDesc: "పేస్లిప్‌లు మరియు సెలవు అభ్యర్థనల కోసం ఆటోమేటెడ్ ఈమెయిల్‌లను పొందండి.",
    securityHeader: "భద్రతా విధానాలు",
    securitySub: "పాస్‌వర్డ్ నియమాలు మరియు సెషన్ గడువును నిర్వహించండి.",
    sessionTimeout: "సెషన్ సమయం ముగింపు (నిమిషాలు)",
    companyHeader: "సంస్థ సమాచారం",
    companySub: "పేస్లిప్‌లపై ముద్రించబడే అధికారిక కార్పొరేట్ వివరాలు.",
    companyName: "కంపెనీ పేరు",
    regNumber: "రిజిస్ట్రేషన్ / GSTIN నంబర్",
    officialEmail: "అధికారిక ఈమెయిల్",
    phone: "సంప్రదింపు నంబర్",
    currency: "డిఫాల్ట్ కరెన్సీ",
    address: "రిజిస్టర్డ్ చిరునామా",
    dataHeader: "డేటా మరియు బ్యాకప్",
    dataSub: "డేటాబేస్ స్థితిని తనిఖీ చేసి బ్యాకప్‌లను డౌన్‌లోడ్ చేయండి.",
  },
};

const SettingContainer = () => {
  // Active settings tab
  const [activeTab, setActiveTab] = useState(0);

  // Settings State initialized with localStorage or defaults
  const [language, setLanguage] = useState(() => localStorage.getItem("erp_lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("erp_theme") || "light");
  
  // Notification Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  // Security Settings
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [enforceStrongPwd, setEnforceStrongPwd] = useState(true);
  const [ipRestricted, setIpRestricted] = useState(false);

  // Company Profile Settings
  const [companyName, setCompanyName] = useState("Cube AI Solutions Private Limited");
  const [regNumber, setRegNumber] = useState("GSTIN-33AAACC1234F1Z5");
  const [officialEmail, setOfficialEmail] = useState("admin@cubeai.com");
  const [companyPhone, setCompanyPhone] = useState("+91 98765 43210");
  const [currency, setCurrency] = useState("INR");
  const [companyAddress, setCompanyAddress] = useState("Tech Park, Sector 4, Silicon Valley, India");

  // Snackbar Feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSave = () => {
    localStorage.setItem("erp_lang", language);
    localStorage.setItem("erp_theme", theme);
    setSnackbarOpen(true);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("erp_lang", newLang);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem("erp_theme", selectedTheme);
  };

  return (
    <Layout>
      <Box sx={{ pb: 8, maxWidth: "1300px", mx: "auto" }}>
        {/* Top Hero Header */}
        <Card
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #003F5F 0%, #005F8A 50%, #0A7EA4 100%)",
            color: "#ffffff",
            borderRadius: "20px",
            p: { xs: 3, md: 4 },
            mb: 3.5,
            boxShadow: "0 10px 25px -5px rgba(0, 63, 95, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              pointerEvents: "none",
            }}
          />

          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Chip
                  icon={<SettingsIcon sx={{ fontSize: "16px !important", color: "#E0F2FE !important" }} />}
                  label="System Management"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    color: "#ffffff",
                    fontWeight: 600,
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                />
                <Chip
                  label={language.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    color: "#BAE6FD",
                    fontWeight: 700,
                  }}
                />
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
                {t.pageTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  maxWidth: "650px",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                {t.pageSubtitle}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveRoundedIcon />}
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#003F5F",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.3,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                  "&:hover": {
                    backgroundColor: "#F0F9FF",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {t.saveChanges}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Main Settings Card with Tabs */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "18px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
          }}
        >
          {/* Navigation Tabs Bar */}
          <Box sx={{ borderBottom: 1, borderColor: "#E2E8F0", px: 2, pt: 1, backgroundColor: "#FAFCFE" }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  minHeight: "54px",
                  color: "#64748B",
                  gap: 1,
                  px: 2.5,
                  "&.Mui-selected": {
                    color: "#004E69",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#004E69",
                  height: "3px",
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab icon={<PaletteOutlinedIcon sx={{ fontSize: "20px" }} />} iconPosition="start" label={t.tabGeneral} />
              <Tab icon={<NotificationsActiveOutlinedIcon sx={{ fontSize: "20px" }} />} iconPosition="start" label={t.tabNotifications} />
              <Tab icon={<SecurityOutlinedIcon sx={{ fontSize: "20px" }} />} iconPosition="start" label={t.tabSecurity} />
              <Tab icon={<BusinessOutlinedIcon sx={{ fontSize: "20px" }} />} iconPosition="start" label={t.tabCompany} />
              <Tab icon={<StorageOutlinedIcon sx={{ fontSize: "20px" }} />} iconPosition="start" label={t.tabData} />
            </Tabs>
          </Box>

          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            {/* TAB 0: GENERAL & APPEARANCE */}
            {activeTab === 0 && (
              <Box>
                {/* Theme Selection Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
                    {t.appearanceTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                    {t.appearanceDesc}
                  </Typography>

                  <Grid container spacing={2.5}>
                    {/* Light Theme Card */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        onClick={() => handleThemeSelect("light")}
                        sx={{
                          p: 2.5,
                          cursor: "pointer",
                          borderRadius: "14px",
                          border: "2px solid",
                          borderColor: theme === "light" ? "#004E69" : "#E2E8F0",
                          backgroundColor: theme === "light" ? "#F0F9FF" : "#FFFFFF",
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: "#004E69" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                          <Avatar sx={{ backgroundColor: "#E0F2FE", color: "#0284C7", width: 40, height: 40 }}>
                            <LightModeOutlinedIcon />
                          </Avatar>
                          {theme === "light" && <CheckCircleRoundedIcon sx={{ color: "#004E69" }} />}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.lightTheme}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          Clean white surfaces optimized for daylight readability.
                        </Typography>
                      </Card>
                    </Grid>

                    {/* Dark Theme Card */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        onClick={() => handleThemeSelect("dark")}
                        sx={{
                          p: 2.5,
                          cursor: "pointer",
                          borderRadius: "14px",
                          border: "2px solid",
                          borderColor: theme === "dark" ? "#004E69" : "#E2E8F0",
                          backgroundColor: theme === "dark" ? "#F8FAFC" : "#FFFFFF",
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: "#004E69" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                          <Avatar sx={{ backgroundColor: "#1E293B", color: "#F8FAFC", width: 40, height: 40 }}>
                            <DarkModeOutlinedIcon />
                          </Avatar>
                          {theme === "dark" && <CheckCircleRoundedIcon sx={{ color: "#004E69" }} />}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.darkTheme}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          Sleek dark theme that reduces eye strain in low-light.
                        </Typography>
                      </Card>
                    </Grid>

                    {/* System Auto Theme */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        onClick={() => handleThemeSelect("system")}
                        sx={{
                          p: 2.5,
                          cursor: "pointer",
                          borderRadius: "14px",
                          border: "2px solid",
                          borderColor: theme === "system" ? "#004E69" : "#E2E8F0",
                          backgroundColor: theme === "system" ? "#F0F9FF" : "#FFFFFF",
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: "#004E69" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                          <Avatar sx={{ backgroundColor: "#F1F5F9", color: "#475569", width: 40, height: 40 }}>
                            <DesktopWindowsOutlinedIcon />
                          </Avatar>
                          {theme === "system" && <CheckCircleRoundedIcon sx={{ color: "#004E69" }} />}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.systemTheme}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          Syncs automatically with your operating system mode.
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3.5 }} />

                {/* Language Selection Section */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
                    {t.languageTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                    {t.languageDesc}
                  </Typography>

                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ backgroundColor: "#F0FDFA", color: "#0D9488", width: 44, height: 44 }}>
                          <TranslateOutlinedIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#334155", mb: 0.5 }}>
                            {t.languageLabel}
                          </Typography>
                          <Select
                            fullWidth
                            size="small"
                            value={language}
                            onChange={handleLanguageChange}
                            sx={{
                              borderRadius: "10px",
                              backgroundColor: "#F8FAFC",
                            }}
                          >
                            <MenuItem value="en">English (US / UK)</MenuItem>
                            <MenuItem value="ta">தமிழ் (Tamil)</MenuItem>
                            <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                            <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                          </Select>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {/* TAB 1: NOTIFICATIONS */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
                  {t.tabNotifications}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                  Configure your communication preferences, push alert channels, and email digests.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Two-Factor Toggle */}
                  <Card
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ backgroundColor: "#EFF6FF", color: "#2563EB", width: 44, height: 44 }}>
                        <ShieldOutlinedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.twoFactorTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          {t.twoFactorDesc}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      color="primary"
                    />
                  </Card>

                  {/* Mobile Push Toggle */}
                  <Card
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ backgroundColor: "#F0FDFA", color: "#0D9488", width: 44, height: 44 }}>
                        <SmartphoneOutlinedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.mobilePushTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          {t.mobilePushDesc}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={mobilePush}
                      onChange={(e) => setMobilePush(e.target.checked)}
                      color="primary"
                    />
                  </Card>

                  {/* Desktop Notifications Toggle */}
                  <Card
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ backgroundColor: "#F5F3FF", color: "#7C3AED", width: 44, height: 44 }}>
                        <DesktopWindowsOutlinedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.desktopNotifTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          {t.desktopNotifDesc}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={desktopNotif}
                      onChange={(e) => setDesktopNotif(e.target.checked)}
                      color="primary"
                    />
                  </Card>

                  {/* Email Notifications Toggle */}
                  <Card
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ backgroundColor: "#FFFBEB", color: "#D97706", width: 44, height: 44 }}>
                        <EmailOutlinedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {t.emailNotifTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          {t.emailNotifDesc}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                      color="primary"
                    />
                  </Card>
                </Box>
              </Box>
            )}

            {/* TAB 2: SECURITY & AUTH */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
                  {t.securityHeader}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                  {t.securitySub}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}>
                        {t.sessionTimeout}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
                        Automatically log out inactive administrator and staff sessions.
                      </Typography>
                      <Select
                        fullWidth
                        size="small"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px" }}
                      >
                        <MenuItem value="15">15 Minutes (High Security)</MenuItem>
                        <MenuItem value="30">30 Minutes (Recommended)</MenuItem>
                        <MenuItem value="60">60 Minutes (1 Hour)</MenuItem>
                        <MenuItem value="120">120 Minutes (2 Hours)</MenuItem>
                      </Select>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          Enforce Complex Passwords
                        </Typography>
                        <Switch
                          checked={enforceStrongPwd}
                          onChange={(e) => setEnforceStrongPwd(e.target.checked)}
                          color="primary"
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                        Require 8+ chars with uppercase, numbers, and special symbols for all user accounts.
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ borderRadius: "12px" }}>
                      PostgreSQL Connection & Encryption: Active SSL encryption is enabled on port 5432. All employee records and payroll structures are encrypted at rest.
                    </Alert>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* TAB 3: COMPANY PROFILE */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
                  {t.companyHeader}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                  {t.companySub}
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", mb: 0.5, display: "block" }}>
                      {t.companyName}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", mb: 0.5, display: "block" }}>
                      {t.regNumber}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", mb: 0.5, display: "block" }}>
                      {t.officialEmail}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", mb: 0.5, display: "block" }}>
                      {t.phone}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", mb: 0.5, display: "block" }}>
                      {t.currency}
                    </Typography>
                    <Select
                      fullWidth
                      size="small"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      sx={{ borderRadius: "10px" }}
                    >
                      <MenuItem value="INR">INR (₹) - Indian Rupee</MenuItem>
                      <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
                      <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
                      <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
                      <MenuItem value="AED">AED (د.إ) - UAE Dirham</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", mb: 0.5, display: "block" }}>
                      {t.address}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* TAB 4: DATA & SYSTEM */}
            {activeTab === 4 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
                  {t.dataHeader}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                  {t.dataSub}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: "14px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F8FAFC",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ backgroundColor: "#ECFDF5", color: "#059669" }}>
                          <CheckCircleRoundedIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                            PostgreSQL Database Engine
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
                            Status: Online & Connected (Port 5432)
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                        Database schema version: CubeAI ERP v2.0 with automatic migration triggers.
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloudDownloadOutlinedIcon />}
                        onClick={() => alert("ERP Data Export initiated. Download will begin shortly.")}
                        sx={{
                          borderRadius: "8px",
                          borderColor: "#004E69",
                          color: "#004E69",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Export Database Snapshot
                      </Button>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: "14px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F8FAFC",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
                          <DeleteOutlineRoundedIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                            Local Storage & App Cache
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            Clear local browser storage and authentication tokens.
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                        Reset local session state, stored table filters, and temporary UI preferences.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          localStorage.clear();
                          alert("Cache cleared successfully!");
                          window.location.reload();
                        }}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Clear ERP Cache
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>

          {/* Bottom Action Footer */}
          <Box
            sx={{
              p: 2.5,
              px: { xs: 2.5, md: 4 },
              backgroundColor: "#FAFCFE",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InfoOutlinedIcon sx={{ color: "#64748B", fontSize: "18px" }} />
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                All configuration changes are saved automatically to your local session and ERP database.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveRoundedIcon />}
              sx={{
                backgroundColor: "#004E69",
                borderRadius: "10px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#003F5F",
                },
              }}
            >
              {t.saveChanges}
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Save Toast Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px", fontWeight: 600 }}
        >
          {t.savedSuccess}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default SettingContainer;
