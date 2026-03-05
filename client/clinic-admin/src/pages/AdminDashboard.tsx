import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CssBaseline,
} from "@mui/material";

function AdminDashboard() {
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Admin login logic goes here");
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

            <form onSubmit={handleLogin}>
              <TextField fullWidth label="Staff ID" margin="normal" required />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 4, py: 1.5, textTransform: "none", fontSize: "1rem" }}
              >
                Sign In
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default AdminDashboard;
