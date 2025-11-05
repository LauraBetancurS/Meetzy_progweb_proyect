// src/pages/Dashboard.tsx
import { useEffect, useState, useCallback } from "react";
import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import Composer from "../components/dashboard/composer/Composer";
import EventsSection from "../components/dashboard/events/EventsSection";
import "./Dashboard.css";

import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

// 🆕 service that reads events from Supabase (already created earlier)
import { fetchPublicEvents } from "../services/events.service";
import type { EventModel } from "../types/Event";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("Friend");

  // 🆕 public events state
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // -------- Username (unchanged) ----------
  useEffect(() => {
    let mounted = true;

    async function loadUsername() {
      if (!user) {
        if (mounted) setUsername("Friend");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_name, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && profile) {
        const pick =
          (profile.user_name && profile.user_name.trim()) ||
          (profile.full_name && profile.full_name.trim());
        if (pick && mounted) {
          setUsername(pick);
          return;
        }
      }

      const metaUser =
        (user.user_metadata as any)?.user_name ||
        (user.user_metadata as any)?.full_name;

      if (metaUser && mounted) {
        setUsername(String(metaUser));
        return;
      }

      const emailPrefix = user.email ? String(user.email).split("@")[0] : "Friend";
      if (mounted) setUsername(emailPrefix);
    }

    loadUsername();
    return () => {
      mounted = false;
    };
  }, [user]);

  // -------- Public events from Supabase ----------
  const loadPublicEvents = useCallback(async () => {
    setLoadingEvents(true);
    setEventsError(null);
    const { data, error } = await fetchPublicEvents();
    if (error) setEventsError(error);
    setEvents(data || []);
    setLoadingEvents(false);
  }, []);

  useEffect(() => {
    loadPublicEvents();
  }, [loadPublicEvents]);

  function handleSearch(q: string) {
    console.log("Buscar:", q);
  }

  function handlePost({ text, communityId }: { text: string; communityId: string }) {
    console.log("Post enviado:", { text, communityId });
  }

  function goCreateEvent() {
    navigate("/events/new");
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

        {/* SECCIÓN: Events (usa PublicEventCard internamente) */}
        <EventsSection
          events={events}
          onCreate={goCreateEvent}
          loading={loadingEvents}
          error={eventsError || undefined}
          onRetry={loadPublicEvents}
        />
      </section>

      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
