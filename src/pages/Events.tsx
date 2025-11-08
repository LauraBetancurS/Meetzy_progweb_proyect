import { useNavigate } from "react-router-dom";
import { subscribeToEvent } from "../redux/slices/EventsSlice";
import { useAppDispatch } from "../redux/hooks";

const dispatch = useAppDispatch();
const navigate = useNavigate();

function handleJoin(ev: EventModel) {
  if (!userId) return;
  dispatch(subscribeToEvent({ eventId: ev.id, userId }));
}

function handleAbout(ev: EventModel) {
  navigate(`/events/${ev.id}`);
}
