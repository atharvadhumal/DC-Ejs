import React, { useCallback, useLayoutEffect, useRef } from "react";
import Icons from "../../shared/icons";
import ProfilePreview from "../profile-comps/ProfilePreview";

const MessageBox = React.memo((props: any) => {
  const profilePreviewerRef = useRef<HTMLDivElement | null>(null);

  const handleShowPreviewer = useCallback((e:any) => {
    e.stopPropagation();
    profilePreviewerRef.current?.classList.remove('profile-previewer-d-none');
    profilePreviewerRef.current?.classList.add('profile-previewer-d-flex');
    },
    [profilePreviewerRef.current],
  );

  useLayoutEffect(() => {
    document.onclick = (e: any) => {
      e.stopPropagation();
      const target = e.target


      if (!target?.classList.contains('profile-previewer') && profilePreviewerRef.current?.classList.contains('profile-previewer-d-flex')) {
        profilePreviewerRef.current?.classList.remove('profile-previewer-d-flex')
        profilePreviewerRef.current?.classList.add('profile-previewer-d-none')
      }
    }

  }, [profilePreviewerRef.current])

  return (
    <div className="message-box mb-2">
        <div onClick={handleShowPreviewer}>
          {
            false ? <Icons.DiscordLogo /> : <img src="https://imageio.forbes.com/specials-images/imageserve/5f962df3991e5636a2f68758/0x0.jpg" alt="" />
          }

          <ProfilePreview ref={profilePreviewerRef} />
        </div>

        <div>
          <div className="user-name">
            Atharva <span>Today at 1:26 pm</span>
          </div>

          <div className="message-display">
              hello hi this is message
          </div>
        </div>

        <div className="tools">
          <Icons.SmileyFace />
          <Icons.EditIcon />
          <Icons.Thread />
          <Icons.More />

        </div>
    </div>
  )
})

export default MessageBox;
