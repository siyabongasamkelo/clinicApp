import React from "react";
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

const DashboardHeader: React.FC = () => {
  return (
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
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
  );
};

export default DashboardHeader;
