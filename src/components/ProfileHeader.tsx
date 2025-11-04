// src/components/profile/ProfileHeader.tsx
import React from "react";

type Props = {
  fullName?: string | null;
  userName?: string | null;
  avatarUrl?: string | null;
  tagline?: string | null;
};

const ProfileHeader: React.FC<Props> = ({ fullName, userName, avatarUrl, tagline }) => {
  const fallbackInitial = (fullName || userName || "U").charAt(0).toUpperCase();

  return (
    <div className="profile-card">
      <div className="profile-card__left">
        <div className="profile-card__avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName || userName || "User"} />
          ) : (
            <div className="profile-card__avatar--placeholder">{fallbackInitial}</div>
          )}
        </div>
      </div>

      <div className="profile-card__right">
        <div className="profile-card__name">{fullName || "User"}</div>
        <div className="profile-card__username">@{userName || "username"}</div>
        {tagline ? <div className="profile-card__tagline">“{tagline}”</div> : null}

        <div className="profile-card__tabs">
          <button className="profile-card__tab profile-card__tab--active">Eventos</button>
          <button className="profile-card__tab">Comunidades</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
