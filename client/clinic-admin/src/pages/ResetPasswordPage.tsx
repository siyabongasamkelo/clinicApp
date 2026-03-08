// import { Link} from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useLoginForm } from "../hooks/useLoginForm";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/toast";
import React, { useState } from "react";

function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const { userId, token } = useParams<keyof ResetParams>() as ResetParams;
  const { formik, serverError } = useLoginForm();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = formik?.values?.email;
    const password = formik?.values?.password;

    console.log("token", token);

    if (!email || !password || !userId || !token) {
      console.error("Missing verification data");
      notify.error("Missing verification data");
      return;
    }

    try {
      await resetPassword({ email, token, id: userId, password });
      notify.success(`Password reset successfully`);
      setLoading(false);
    } catch (err) {
      console.log("Password reset Failed", err);
      notify.error("Password reset Failed");
      setLoading(false);
      throw err;
    }
  };

  return (
    <>
      <CssBaseline />

      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={4} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Reset Password
            </Typography>

            <form onSubmit={handleReset}>
              {serverError && <Alert severity="error">{serverError}</Alert>}

              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={formik.isSubmitting}
                sx={{
                  mt: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <div className="spinner">
                    <CircularProgress size={20} color="inherit" />
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default ResetPasswordPage;
