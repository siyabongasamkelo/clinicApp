import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

const ForgotPasswordPage: React.FC = () => {
  const { formik, serverError } = useForgotPasswordForm();

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Typography
            component="h1"
            variant="h5"
            color="primary"
            gutterBottom
            align="center"
          >
            Forgot Password
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Box>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                autoComplete="email"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold" }}
              >
                {formik.isSubmitting ? (
                  <div className="spinner">
                    <CircularProgress size={20} color="inherit" />
                  </div>
                ) : (
                  "Get reset password link"
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
