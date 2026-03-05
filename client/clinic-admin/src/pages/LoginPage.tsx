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
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              fontWeight="bold"
            >
              Clinic Portal
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Internal Staff Access Only
            </Typography>

            <form>
              <TextField fullWidth label="Staff ID" margin="normal" required />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
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
                sx={{
                  mt: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Login
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
