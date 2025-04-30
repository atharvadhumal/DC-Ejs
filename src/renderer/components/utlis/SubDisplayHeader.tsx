import React from "react";
import Icons from "../../shared/icons";

const SubDisplayHeader = React.memo((props: any) => {
  return (
    <div className="sub-display-header w-100">
      <div className="header-title">
          <Icons.HashSign />
          <span>notes-resources</span>
      </div>
      <div>
        <Icons.Thread />
        <Icons.Notification />
        <Icons.Pinned />
        <Icons.Users />
        <div className="search-box">
          <input type="text" placeholder="Search" />
        </div>
        <Icons.Inbox />
        <Icons.Info />
      </div>
    </div>
  )
})

export default SubDisplayHeader;
