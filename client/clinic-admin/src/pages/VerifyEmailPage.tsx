import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/toast";

const VerifyEmailPage: React.FC = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const handleNavigation = (): void => {
    navigate("/login");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !token) {
      console.error("Missing verification data");
      return;
    }

    try {
      await verifyEmail({ email, token });
      notify.success(`Email verified Successfully`);
      setLoading(false);
    } catch (err) {
      console.log("Email Verification Failed");
      notify.error("Email Verification Failed");
      setLoading(false);
      throw err;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            width: "100%",
          }}
        >
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 80, mb: 2 }}
          />

          <Typography variant="h4" component="h1" gutterBottom align="center">
            Thanks for verifying!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Your account is now active. You can start managing your clinic
            appointments immediately.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleVerify}
          >
            {loading ? (
              <div className="spinner">
                <CircularProgress size={20} color="inherit" />
              </div>
            ) : (
              "Verify Email"
            )}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;
