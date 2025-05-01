import React, { useCallback, useLayoutEffect, useRef } from "react";
import Icons from "../../shared/icons";
import ProfilePreview from "../profile-comps/ProfilePreview";
import { TMessage } from "../../shared/types";

const MessageBox = React.memo(({msg}: {msg: TMessage}) => {
  const profilePreviewerRef = useRef<HTMLDivElement | null>(null);

  const handleShowPreviewer = useCallback((e:any) => {
    e.stopPropagation();

    // Toggle the current profile previewer instead of manipulating all of them
    if (profilePreviewerRef.current?.classList.contains('profile-previewer-d-flex')) {
      // If already showing, hide it
      profilePreviewerRef.current?.classList.remove('profile-previewer-d-flex');
      profilePreviewerRef.current?.classList.add('profile-previewer-d-none');
    } else {
      // Close any other open previewers first
      document.querySelectorAll('.profile-previewer').forEach(el => {
        el.classList.remove('profile-previewer-d-flex');
        el.classList.add('profile-previewer-d-none');
      });

      // Show this one
      profilePreviewerRef.current?.classList.remove('profile-previewer-d-none');
      profilePreviewerRef.current?.classList.add('profile-previewer-d-flex');
    }
  }, [profilePreviewerRef.current]);

  useLayoutEffect(() => {
    // Handle clicks outside the modal to close it
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;

      // Check if click is outside the profile previewer and not on the profile image
      if (profilePreviewerRef.current?.classList.contains('profile-previewer-d-flex') &&
          !profilePreviewerRef.current?.contains(target) &&
          !target.closest('.profile-img-trigger')) {
        profilePreviewerRef.current?.classList.remove('profile-previewer-d-flex');
        profilePreviewerRef.current?.classList.add('profile-previewer-d-none');
      }
    };

    // Add the event listener
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profilePreviewerRef.current]);

  return (
    <div className="message-box mb-2">
        <div className="profile-img-trigger" onClick={handleShowPreviewer}>
          {
            false ? <Icons.DiscordLogo /> : <img src="https://imageio.forbes.com/specials-images/imageserve/5f962df3991e5636a2f68758/0x0.jpg" alt="" />
          }

          <ProfilePreview user_profile={msg.profile} ref={profilePreviewerRef} />
        </div>

        <div>
          <div className="user-name">
            {msg.profile.name} <span>{msg.date}</span>
          </div>

          <div className="message-display">
              {msg.message}
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
