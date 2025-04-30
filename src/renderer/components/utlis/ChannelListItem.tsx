import React from "react";
import Icons from "../../shared/icons";
import { Link } from "react-router-dom";

const ChannelListItem = React.memo(({url, title, icon, tools}: {url: string; title: any; icon?:any; tools: boolean;}) => {
  return (
     <Link to={url} className="channel-list-item">
        <div>
          {icon || <Icons.HashSign className="hash-sign" />}
          <span>{title}</span>
        </div>

        <div>
          {
            tools === undefined &&
            <>
              <Icons.AddUser />
              <Icons.Settings />
            </>
          }
        </div>

     </Link>
  )
})

export default ChannelListItem;
