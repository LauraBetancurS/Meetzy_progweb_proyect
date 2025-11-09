import { useState, useEffect } from "react";
import type { ComposerProps } from "../../../types/ui";
import TertiaryButton from "../../UI/TertiaryButton";
import "./Composer.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";



function Composer(props: ComposerProps) {

  const { communities: reduxCommunities } = useSelector((state: RootState) => state.communities)

  const { onPost, className = "", communities: propCommunities, defaultCommunityId, hideCommunitySelector, showpoll } = props;

  
  const communities = propCommunities || reduxCommunities || [];

  const [text, setText] = useState("");
  const [communityId, setCommunityId] = useState(defaultCommunityId || communities[0]?.id || "");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  
  useEffect(() => {
    if (defaultCommunityId) {
      setCommunityId(defaultCommunityId);
    }
  }, [defaultCommunityId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !communityId) return;
    onPost({
      text: text.trim(),
      communityId,
      createdById: user?.id  || "",
      postiamgeUrl: imageUrl.trim() || null,
    });
    setText("");
    setImageUrl("");
    setShowImageUrlInput(false);
  }

  return (
    <section className={`composer ${className}`}>
      
      {!hideCommunitySelector && communities.length > 0 && (
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
      )}

      {/* Cuerpo */}
      <form onSubmit={handleSubmit} className="composer__body">
        <textarea
          className="composer__input"
          placeholder="¿Qué está pasando?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {showImageUrlInput && (
          <div className="composer__urlInputWrapper">
            <input
              type="text"
              className="composer__urlInput"
              placeholder="Pega aquí la URL de la imagen…"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div style={{ position: 'relative', marginTop: 6 }}>
                <img src={imageUrl} alt="Previsualización" className="composer__imagePreview" style={{maxWidth: 220, maxHeight: 120, borderRadius: 8}}/>
                <button type="button" className="composer__removeImageBtn" onClick={()=>setImageUrl("")}>×</button>
              </div>
            )}
          </div>
        )}
        <div className="composer__actions">
          <button
            type="button"
            className="composer__iconBtn"
            title="Adjuntar imagen por URL"
            aria-label="Adjuntar imagen por URL"
            onClick={() => setShowImageUrlInput(v => !v)}
          >
            {/* Link icon SVG */}
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" stroke="currentColor"><path d="M10.5 6.5a4 4 0 015.66 5.66l-3.88 3.88a4 4 0 01-5.66-5.66l.71-.71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 13.5a4 4 0 01-5.66-5.66l3.88-3.88a4 4 0 015.66 5.66l-.7.71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            type="button"
            onClick={showpoll}
            className="composer__iconBtn"
            title="Create poll (próximamente)"
            aria-label="Create poll"
          >
          
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
          <TertiaryButton
            type="submit"
            disabled={!text.trim() && !imageUrl}
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
