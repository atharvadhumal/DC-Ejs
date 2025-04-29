import React from "react";
import Icons from "../../shared/icons";

const MiniProfilePanel = React.memo((profile) => {
  return (
    <div className="mini-profile-panel">
      <div>
        <div className="profile-img">
          {
            false ? <Icons.DiscordLogo className='profile-img-logo'/> :
            <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRcbLjcZKWWHRRpf5gdOSCI78jLz3gpNgL67AcTD3zFE-zU_GTG" alt="" />
          }
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
  )
})

export default MiniProfilePanel;
