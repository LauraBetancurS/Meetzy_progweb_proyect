// src/pages/Dashboard.tsx
import { useEffect, useState, useCallback } from "react";
import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import Composer from "../components/dashboard/composer/Composer";
import EventsSection from "../components/dashboard/events/EventsSection";
import "./Dashboard.css";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

import {
  fetchPublicEvents,
  fetchMyEvents,
  fetchSubscribedEvents,
} from "../services/events.service";
import { joinEventThunk } from "../redux/slices/EventsSlice";
import type { EventModel } from "../types/Event";

export default function Dashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("Friend");

  // Public events enriched with flags
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // ---------- Resolve username (profiles → metadata → email prefix) ----------
  useEffect(() => {
    let mounted = true;
    async function loadUsername() {
      if (!user) return setUsername("Friend");
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_name, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const pick =
        profile?.user_name?.trim() ||
        profile?.full_name?.trim() ||
        (user.user_metadata as any)?.user_name ||
        (user.user_metadata as any)?.full_name ||
        (user.email ? user.email.split("@")[0] : "Friend");

      if (mounted) setUsername(pick);
    }
    loadUsername();
    return () => {
      mounted = false;
    };
  }, [user]);

  // ---------- Load & enrich public events ----------
  const loadPublicEvents = useCallback(async () => {
    setLoadingEvents(true);
    setEventsError(null);

    // 1) Read public events
    const [{ data: pubs, error: e1 }, { data: mine, error: e2 }, { data: subs, error: e3 }] =
      await Promise.all([fetchPublicEvents(), fetchMyEvents(), fetchSubscribedEvents()]);

    if (e1 || e2 || e3) {
      setEventsError(e1 || e2 || e3 || "Error loading events");
      setEvents([]);
      setLoadingEvents(false);
      return;
    }

    const myIds = new Set((mine ?? []).map((e) => e.id));
    const joinedIds = new Set((subs ?? []).map((e) => e.id));

    const enriched = (pubs ?? []).map((e) => ({
      ...e,
      isOwner: myIds.has(e.id),
      isJoined: joinedIds.has(e.id),
    }));

    setEvents(enriched);
    setLoadingEvents(false);
  }, []);

  useEffect(() => {
    loadPublicEvents();
  }, [loadPublicEvents]);

  function handleSearch(q: string) {
    console.log("Buscar:", q);
  }

  function handlePost({ text }: { text: string; communityId: string }) {
    console.log("Post enviado:", { text });
  }

  function goCreateEvent() {
    navigate("/events/new");
  }

  // ---------- Join from dashboard ----------
  async function handleJoin(ev: EventModel) {
    await dispatch(joinEventThunk(ev));
    // Refresh flags so the button disappears
    loadPublicEvents();
  }

  return (
    <div className="dash-grid">
      <section className="dash-center">
        <SearchBar onSearch={handleSearch} />

        <div className="dash-hero">
          <h1 className="dash-title">
            Dive in! <span>{username}</span>
          </h1>
          <p className="dash-sub">
            Turn plans into moments. Subtitle: Set the details, vote in real time, and keep every memory in one place.
          </p>
        </div>

        <Composer onPost={handlePost} />

        <EventsSection
          events={events}
          onCreate={goCreateEvent}
          loading={loadingEvents}
          error={eventsError || undefined}
          onRetry={loadPublicEvents}
          onAbout={(ev) => navigate(`/events/${ev.id}`)}
          onJoin={handleJoin}
        />
      </section>

      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
