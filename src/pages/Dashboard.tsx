// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import Composer from "../components/dashboard/composer/Composer";
import EventsSection from "../components/dashboard/events/EventsSection";
import "./Dashboard.css";

import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

// Mock de eventos públicos
import { PUBLIC_EVENTS } from "../mocks/publicEvents.mock";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("Friend");

  useEffect(() => {
    let mounted = true;

    async function loadUsername() {
      if (!user) {
        if (mounted) setUsername("Friend");
        return;
      }

      // 1) Intenta leer de la tabla profiles (prioridad: user_name)
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

      // 2) Fallback: metadata del usuario
      const metaUser =
        (user.user_metadata as any)?.user_name ||
        (user.user_metadata as any)?.full_name;

      if (metaUser && mounted) {
        setUsername(String(metaUser));
        return;
      }

      // 3) Último fallback: prefijo del email
      const emailPrefix = user.email ? String(user.email).split("@")[0] : "Friend";
      if (mounted) setUsername(emailPrefix);
    }

    loadUsername();
    return () => {
      mounted = false;
    };
  }, [user]);

  function handleSearch(q: string) {
    console.log("Buscar:", q);
  }

  function handlePost({ text, communityId }: { text: string; communityId: string }) {
    console.log("Post enviado:", { text, communityId });
  }

  // Redirección al crear evento
  function goCreateEvent() {
    navigate("/events/new");
  }

  const events = (PUBLIC_EVENTS as any[]) || [];

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

        {/* SECCIÓN: Events (usa PublicEventCard) */}
        <EventsSection events={events} onCreate={goCreateEvent} />
      </section>

      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
