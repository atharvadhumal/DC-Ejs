import React from "react";
import { IServerBtn } from "../../shared/types";

const ServerBtn = React.memo(((icon, img, title, url): IServerBtn) => {
  return (
    <div className="channel-btn">
      {
      icon || <img src={img} alt="" />
      }
    </div>
  )
})

export default ServerBtn
