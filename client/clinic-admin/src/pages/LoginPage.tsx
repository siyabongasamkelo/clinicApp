import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useLoginForm } from "../hooks/useLoginForm";

function LoginPage() {
  const { formik, serverError } = useLoginForm();

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
              component="h1"
              variant="h5"
              color="primary"
              gutterBottom
              align="center"
            >
              Impilo Clinic Portal
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Internal Staff Access Only
            </Typography>

            <form onSubmit={formik.handleSubmit}>
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

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
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
                {formik.isSubmitting ? (
                  <div className="spinner">
                    <CircularProgress size={20} color="inherit" />
                  </div>
                ) : (
                  "Login"
                )}
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="body2" sx={{ mr: 0.5 }}>
                  Don't have an account?
                </Typography>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  fontWeight="bold"
                  sx={{ textDecoration: "none" }}
                >
                  Register now
                </Link>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default LoginPage;
