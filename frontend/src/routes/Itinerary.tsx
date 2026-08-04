import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type Activity = string;
type Day = {
  day: number;
  activities: Activity[];
};
type Trip = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  days?: Day[];
};

// Temporary mock data, used only when the backend returns no itineraries
// (GET /itinerary currently always returns an empty list). Remove once real
// itinerary generation is wired up.
const MOCK_TRIPS: Trip[] = [
  {
    destination: "Paris",
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    days: [
      { day: 1, activities: ["Visit the Eiffel Tower", "Walk along the Seine"] },
      { day: 2, activities: ["Louvre Museum tour", "Dinner in Montmartre"] },
    ],
  },
];

function Itinerary() {
  const [itineraries, setItineraryData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTripIndex, setEditingTripIndex] = useState<number | null>(null);
  const [draftDays, setDraftDays] = useState<Day[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.get("/itinerary");
        const payload = response?.data?.data ?? response?.data ?? [];
        setItineraryData(payload.length > 0 ? payload : MOCK_TRIPS);
      } catch (error) {
        console.error("Error fetching itinerary data:", error);
        setItineraryData(MOCK_TRIPS);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, []);

  const startEditing = (tripIndex: number) => {
    setEditingTripIndex(tripIndex);
    setDraftDays(itineraries[tripIndex].days ?? []);
  };

  const cancelEditing = () => {
    setEditingTripIndex(null);
    setDraftDays([]);
  };

  const handleModify = (dayIndex: number, activityIndex: number, value: string) => {
    setDraftDays((prev) =>
      prev.map((day, dIdx) =>
        dIdx !== dayIndex
          ? day
          : {
            ...day,
            activities: day.activities.map((activity, aIdx) =>
              aIdx !== activityIndex ? activity : value
            ),
          }
      )
    );
  };

  const handleReplace = (dayIndex: number, activityIndex: number) => {
    handleModify(dayIndex, activityIndex, "");
  };

  const handleSave = (tripIndex: number) => {
  // TODO: call the backend update endpoint once it exists (e.g. PATCH /itinerary/{id}).
  // For now, changes are only saved to local component state.
    const finalizedDays = draftDays.map((day) => ({
      ...day,
      activities: day.activities.map((activity) =>
        activity.trim() === "" ? "Just Chilling" : activity
      ),
    }));
    setItineraryData((prev) =>
      prev.map((trip, tIdx) => (tIdx !== tripIndex ? trip : { ...trip, days: finalizedDays }))
    );
    setEditingTripIndex(null);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }} gutterBottom>
        Travel Itineraries
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your planned trips and daily activities.
      </Typography>
      <Stack spacing={4}>
        {itineraries.map((trip, tripIndex) => {
          const isEditing = editingTripIndex === tripIndex;
          const displayDays = isEditing ? draftDays : trip.days ?? [];

          return (
            <Card key={tripIndex} elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", mb: 2, justifyContent: "space-between" }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <PlaceIcon color="primary" />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {trip.destination}
                    </Typography>
                  </Stack>
                  {!isEditing && (
                    <Tooltip title="Edit itinerary">
                      <IconButton onClick={() => startEditing(tripIndex)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mb: 3 }}>
                  <Chip icon={<CalendarMonthIcon />} label={`Start: ${trip.startDate}`} />
                  <Chip icon={<EventIcon />} label={`End: ${trip.endDate}`} />
                </Stack>
                <Divider sx={{ mb: 3 }} />
                {displayDays.map((day, dayIndex) => (
                  <Box key={day.day} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Day {day.day}
                    </Typography>
                    <List>
                      {(day.activities ?? []).map((activity, activityIndex) =>
                        isEditing ? (
                          <ListItem key={activityIndex} sx={{ gap: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              value={activity}
                              onChange={(e) =>
                                handleModify(dayIndex, activityIndex, e.target.value)
                              }
                              placeholder="Enter activity"
                            />
                            <Tooltip title="Replace activity">
                              <IconButton
                                onClick={() => handleReplace(dayIndex, activityIndex)}
                              >
                                <RestartAltIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItem>
                        ) : (
                          <ListItem key={activityIndex}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: "success.main",
                                  boxShadow: 1,
                                }}
                              />
                            </ListItemIcon>
                            <Typography>{activity}</Typography>
                          </ListItem>
                        )
                      )}
                    </List>
                  </Box>
                ))}
                {isEditing && (
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <IconButton color="primary" onClick={() => handleSave(tripIndex)}>
                      <SaveIcon />
                    </IconButton>
                    <Typography
                      variant="button"
                      sx={{ cursor: "pointer", alignSelf: "center" }}
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Itinerary saved
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Itinerary;