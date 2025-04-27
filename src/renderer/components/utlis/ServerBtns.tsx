import React from "react";
import { IServerBtn } from "../../shared/types";
import { Link } from "react-router-dom";

const ServerBtn = React.memo(({ icon, img, title, url }: IServerBtn) => {
  return (
    <Link to={url} className="channel-btn mb-2">
      {
        icon || <img src={img} alt="" />
      }
    </Link>
  );
});

export default ServerBtn;
