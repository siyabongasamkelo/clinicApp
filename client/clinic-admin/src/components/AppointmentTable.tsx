import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAppointments } from "../context/AppointmentContext";
import { Appointment, Status } from "../types/appointment.type";

const AppointmentTable: React.FC = () => {
  const SESSION_MAP = [
    { id: 1, start: "04:00", end: "05:30" },
    { id: 2, start: "05:30", end: "07:00" },
    { id: 3, start: "07:00", end: "08:30" },
    { id: 4, start: "08:30", end: "10:00" },
    { id: 5, start: "10:00", end: "11:30" },
    { id: 6, start: "11:30", end: "13:00" },
    { id: 7, start: "13:00", end: "14:30" },
    { id: 8, start: "14:30", end: "16:00" },
    { id: 9, start: "16:00", end: "17:30" },
    { id: 10, start: "17:30", end: "19:00" },
  ];

  const { todaysAppointments, loading } = useAppointments();

  // Type-safe handler
  const handleStatusUpdate = (id: string, newStatus: Status) => {
    console.log(`Updating ${id} to ${newStatus}`);
    // This is where your AppointmentService.updateStatus call will go later
  };

  if (loading) return <Typography>Syncing with clinic database...</Typography>;

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, backgroundColor: "#fcfcfc" }}>
              Patient Details
            </TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: "#fcfcfc" }}>
              Scheduled Time
            </TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: "#fcfcfc" }}>
              Service Type
            </TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: "#fcfcfc" }}>
              Status
            </TableCell>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#fcfcfc" }}
              align="right"
            >
              Management
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todaysAppointments.length > 0 ? (
            todaysAppointments.map((app: Appointment) => (
              <TableRow
                key={app?._id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* <Avatar src={app?.avatarUrl} sx={{ width: 35, height: 35, fontSize: '0.9rem' }}>
                      {app.patientName.charAt(0)}
                    </Avatar> */}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {app.username}
                    </Typography>
                  </Stack>
                </TableCell>
                {/* <TableCell>{app.time}</TableCell> */}
                <TableCell>{SESSION_MAP[app?.sessionId]}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: 1,
                    }}
                  >
                    {app.serviceName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={app.status} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      disableElevation
                      onClick={() => handleStatusUpdate(app._id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      onClick={() => handleStatusUpdate(app._id, "Cancelled")}
                    >
                      Reject
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ py: 5, color: "text.secondary" }}
              >
                No appointments scheduled for today.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Helper Component for Status Logic
const StatusChip = ({ status }: { status: AppointmentStatus }) => {
  const config = {
    Approved: { color: "success" as const, label: "Confirmed" },
    Pending: { color: "warning" as const, label: "Review Required" },
    Cancelled: { color: "error" as const, label: "Declined" },
    Completed: { color: "info" as const, label: "Finished" },
  };

  const { color, label } = config[status] || {
    color: "default",
    label: status,
  };

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant="filled"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default AppointmentTable;
