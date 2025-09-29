import { useState } from "react";
import type { ComposerProps, CommunityOption } from "../../../types/ui";
import TertiaryButton from "../../UI/TertiaryButton";
import "./Composer.css";

const DEFAULT_COMMUNITIES: CommunityOption[] = [
  { id: "1", name: "General" },
  { id: "2", name: "Meetzy Crew" },
  { id: "3", name: "Announcements" },
];

function Composer(props: ComposerProps) {
  const { onPost, className = "", communities = DEFAULT_COMMUNITIES } = props;

  const [text, setText] = useState("");
  const [communityId, setCommunityId] = useState(communities[0]?.id ?? "1");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onPost({ text: text.trim(), communityId });
    setText("");
  }

  return (
    <section className={`composer ${className}`}>
      {/* Encabezado: label + selector de comunidad */}
      <div className="composer__head">
        <span className="composer__label">Select a community to post:</span>

        <div className="composer__select">
          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            aria-label="Select community"
          >
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="composer__caret">▾</span>
        </div>
      </div>

      {/* Cuerpo */}
      <form onSubmit={handleSubmit} className="composer__body">
        <textarea
          className="composer__input"
          placeholder="¿Qué está pasando?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="composer__actions">
          {/* Botón de “poll” (icono de barras) */}
          <button
            type="button"
            className="composer__iconBtn"
            title="Create poll (próximamente)"
            aria-label="Create poll"
          >
            {/* Icono: gráfico de barras, hereda color con currentColor */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="3" y="10" width="4" height="10" rx="1.2" stroke="currentColor" />
              <rect x="10" y="6"  width="4" height="14" rx="1.2" stroke="currentColor" />
              <rect x="17" y="3"  width="4" height="17" rx="1.2" stroke="currentColor" />
            </svg>
          </button>

          {/* Botón terciario “Postear” */}
          <TertiaryButton
            type="submit"
            disabled={!text.trim()}
            className="composer__postBtn"
          >
            Postear
          </TertiaryButton>
        </div>
      </form>
    </section>
  );
}

export default Composer;
