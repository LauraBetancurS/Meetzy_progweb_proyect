import { useMemo } from "react";
import { useAppSelector } from "../redux/hooks";

export default function Events() {
  const events = useAppSelector((s) => s.events.events);
  const [userId, setUserId] = useState<string | null>(null);

  const { myEvents, subscribedEvents, generalEvents } = useMemo(() => {
    if (!userId) {
      return {
        myEvents: [],
        subscribedEvents: [],
        generalEvents: [],
      };
    }

    const mine = events
      .filter((e) => e.created_by === userId)
      .map((e) => mapRowToModel(e, true, true));

    const subs = events
      .filter((e) => e.created_by !== userId && (e.subscribers || []).includes(userId))
      .map((e) => mapRowToModel(e, false, true));

    const general = events
      .filter(
        (e) => e.created_by !== userId && !(e.subscribers || []).includes(userId)
      )
      .map((e) => mapRowToModel(e, false, false));

    return { myEvents: mine, subscribedEvents: subs, generalEvents: general };
  }, [events, userId]);
