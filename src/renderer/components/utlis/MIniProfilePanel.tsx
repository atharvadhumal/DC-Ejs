// src/renderer/components/utlis/MiniProfilePanel.tsx
import React, { useCallback, useRef } from "react";
import Icons from "../../shared/icons";
import ProfilePreview from "../profile-comps/ProfilePreview";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/AuthContext";

const MiniProfilePanel = React.memo(() => {
  const { user } = useAuth();
  const profilePreviewerRef = useRef<HTMLDivElement | null>(null);

  const handleShowPreviewer = useCallback((e: any) => {
    e.stopPropagation();

    document.querySelectorAll('.profile-previewer').forEach(el => {
      el.classList.remove('profile-previewer-d-flex')
      el.classList.add('profile-previewer-d-none')
    })
    profilePreviewerRef.current?.classList.remove('profile-previewer-d-none');
    profilePreviewerRef.current?.classList.add('profile-previewer-d-flex');
  },
  [profilePreviewerRef.current],
  );

  // Create user profile object from Google user
  const userProfile = user ? {
    name: user.name,
    user_name: user.email?.split('@')[0] || '',
    image: user.picture,
    date_joined: new Date().toLocaleDateString(),
    status: 'Online'
  } : {
    name: 'Guest',
    user_name: 'guest',
    image: 'https://via.placeholder.com/150',
    date_joined: new Date().toLocaleDateString(),
    status: 'Online'
  };

  return (
    <div className="mini-profile-panel">
      <div>
        <div className="profile-img" onClick={handleShowPreviewer}>
          {
            !user?.picture ? <Icons.DiscordLogo className='profile-img-logo'/> :
            <img src={user.picture} alt="" />
          }

          {/* <ProfilePreview user_profile={userProfile} ref={profilePreviewerRef} /> */}
        </div>
        <div className="profile-details">
          <div>{user?.name || 'Guest'}</div>
          <div className="status">Online</div>
        </div>
      </div>

      <div>
        <Icons.MicMuted className="mic" />
        <Icons.Headset />
        <Link to={'/settings/main-profile'}>
          <Icons.Settings />
        </Link>
      </div>
    </div>
  );
});

export default MiniProfilePanel;
