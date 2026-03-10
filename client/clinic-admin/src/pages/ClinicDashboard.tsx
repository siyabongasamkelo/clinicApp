import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAppointments } from "../context/AppointmentContext";
import { useEffect } from "react";

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const { getAppointmentsByDate, todaysAppointments } = useAppointments();

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    getAppointmentsByDate({ date: dateStr }).catch(() => {
      // context handles errors/loading state
    });
  }, []);

  console.log("TodaysAppointments on Dashboard", todaysAppointments);

  return (
    <Box sx={{ display: "flex" }}>
      {/* 1. SIDEBAR (Left Panel) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Dashboard", "Appointments", "Patients", "Settings"].map(
              (text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <DashboardIcon /> : <PeopleIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ),
            )}
          </List>
        </Box>
      </Drawer>

      {/* 2. RIGHT PANEL (Main Content) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "background.paper",
            borderRadius: 2,
            mb: 4,
            boxShadow: 1,
          }}
        >
          {/* 1. Left Side: Welcome Message */}
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, Dr. Smith
            </Typography>
          </Box>

          {/* 2. Middle/Right: Search and Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Search Box */}
            <TextField
              size="small"
              placeholder="Search patients..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />

            {/* Notifications */}
            <IconButton>
              <NotificationsIcon />
            </IconButton>

            {/* User Profile Section */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}
            >
              <Typography variant="body1" fontWeight="500">
                John Doe
              </Typography>
              <Avatar
                alt="John Doe"
                src="/path-to-avatar.jpg" // Material UI shows initials if src is empty
                sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
              />
            </Box>
          </Box>
        </Box>

        {/* TOP STATS ROW (4 Small Boxes) */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "Total Bookings",
              value: "128",
              icon: <CalendarMonthIcon color="primary" />,
            },
            {
              label: "Pending Approval",
              value: "12",
              icon: <CheckCircleIcon color="warning" />,
            },
            {
              label: "Today's Patients",
              value: "5",
              icon: <PeopleIcon color="success" />,
            },
            {
              label: "Cancellations",
              value: "2",
              icon: <PeopleIcon color="error" />,
            },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: 80,
                }}
              >
                <Box>{stat.icon}</Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* BOTTOM SECTION (Patient List / CRUD) */}
        <Paper sx={{ p: 3, width: "100%", minHeight: "400px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Patients Awaiting Approval
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* This is where your CRUD Table will live */}
          <Typography color="text.secondary" align="center" sx={{ mt: 10 }}>
            List of patients will be mapped here...
          </Typography>
          {/* Displaying list of patients here */}
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
