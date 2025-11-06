// src/components/auth/RegisterForm.tsx
import React, { useMemo, useState } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";
import type { Field, FormProps } from "../../types/ui";
import "./RegisterForm.css";

function RegisterForm(props: FormProps) {
  const {
    title,
    subtitle,
    fields,
    initialValues,
    onSubmit,
    submitLabel = "Register",
    secondaryLabel = "Cancel",
    onSecondary,
    rightImageUrl,
    logoUrl,
    bottomText,
    bottomLinkLabel,
    onBottomLink,
  } = props;

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [avatarOk, setAvatarOk] = useState<boolean>(true);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Reset preview state if the avatarUrl changes
    if (name === "avatarUrl") setAvatarOk(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(values);
  }

  // quick URL check (just to avoid trying to load garbage)
  const avatarUrlCandidate: string | null = useMemo(() => {
    const raw = String(values?.avatarUrl || "").trim();
    if (!raw) return null;
    try {
      const u = new URL(raw);
      return /^https?:/.test(u.protocol) ? raw : null;
    } catch {
      return null;
    }
  }, [values?.avatarUrl]);

  return (
    <div className="form-wrapper">
      {/* Izquierda */}
      <div className="form-left">
        <div className="form-left-inner">
          {logoUrl && <img src={logoUrl} alt="Meetzy" className="form-logo" />}
          {title && <h1 className="form-title">{title}</h1>}
          {subtitle && <p className="form-subtitle">{subtitle}</p>}

          <form onSubmit={handleSubmit} className="form-grid">
            {fields.map((f: Field) => (
              <div key={f.name} className="form-group">
                <label htmlFor={f.name} className="form-label">
                  {f.label}
                </label>

                {f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={values[f.name] || ""}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                ) : (
                  <input
                    id={f.name}
                    type={f.type || "text"}
                    name={f.name}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={values[f.name] || ""}
                    onChange={handleChange}
                    className="form-input"
                  />
                )}

                {/* Avatar preview if this is the avatarUrl field */}
                {f.name === "avatarUrl" && avatarUrlCandidate && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: 8 }}>
                    {avatarOk ? (
                      <img
                        src={avatarUrlCandidate}
                        alt="Avatar preview"
                        onError={() => setAvatarOk(false)}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "999px",
                          objectFit: "cover",
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 12, color: "#c0392b" }}>
                        Couldn’t load the image. Check the URL.
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: "#666" }}>
                      Preview of your profile picture
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Acciones */}
            <div className="form-actions">
              <PrimaryButton type="submit" fullWidth>
                {submitLabel}
              </PrimaryButton>

              {onSecondary && (
                <SecondaryButton onClick={onSecondary}>{secondaryLabel}</SecondaryButton>
              )}
            </div>
          </form>

          {(bottomText || bottomLinkLabel) && (
            <div className="form-bottom">
              <span>{bottomText}</span>
              {bottomLinkLabel && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBottomLink && onBottomLink();
                  }}
                >
                  {bottomLinkLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Derecha */}
      {rightImageUrl && (
        <div className="form-right">
          <img src={rightImageUrl} alt="Form side" />
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
