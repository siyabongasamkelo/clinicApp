import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRegisterForm } from "../hooks/userRegisterForm";

const RegisterPage: React.FC = () => {
  const { formik, serverError } = useRegisterForm();

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
            Clinic Registration
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
                label="Username"
                autoFocus
                {...formik.getFieldProps("username")}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                margin="normal"
                fullWidth
                select
                label="Role"
                {...formik.getFieldProps("role")}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </TextField>

              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  color={
                    formik.errors.profilePic && formik.touched.profilePic
                      ? "error"
                      : "primary"
                  }
                  sx={{ py: 1.5, borderStyle: "dashed" }}
                >
                  {formik.values.profilePic
                    ? "Change Image"
                    : "Upload Profile Picture"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="profilePic"
                    onChange={(event) => {
                      // Grab the file from the input
                      const file = event.currentTarget.files
                        ? event.currentTarget.files[0]
                        : null;
                      // Manually set it in Formik state
                      formik.setFieldValue("profilePic", file);
                    }}
                  />
                </Button>

                {/* Display Error Message */}
                {formik.touched.profilePic && formik.errors.profilePic && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {formik.errors.profilePic as string}
                  </Typography>
                )}

                {/* Display Selected Filename */}
                {formik.values.profilePic && !formik.errors.profilePic && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1, color: "text.secondary" }}
                  >
                    File: {(formik.values.profilePic as File).name}
                  </Typography>
                )}
              </Box>

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
                  "Register"
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
