import React, { useCallback, useRef } from "react";
import Icons from "../../shared/icons";
import ProfilePreview from "../profile-comps/ProfilePreview";

const MiniProfilePanel = React.memo((props:any) => {
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

  return (
    <div className="mini-profile-panel">
      <div>
        <div className="profile-img" onClick={handleShowPreviewer}>
          {
            false ? <Icons.DiscordLogo className='profile-img-logo'/> :
            <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRcbLjcZKWWHRRpf5gdOSCI78jLz3gpNgL67AcTD3zFE-zU_GTG" alt="" />
          }

          {/* <ProfilePreview ref={profilePreviewerRef} /> */}

        </div>
        <div className="profile-details">
          <div>Paulos Ab</div>
          <div className="status">Online</div>
        </div>
      </div>

      <div>
        <Icons.MicMuted className="mic" />
        <Icons.Headset />
        <Icons.Settings />
      </div>
    </div>
  );
});

export default MiniProfilePanel;
