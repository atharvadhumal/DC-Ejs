import React from "react";
import Icons from "../../shared/icons";
import { Link } from "react-router-dom";

const ChannelListItem = React.memo(({url, title}: {url: string; title: string;}) => {
  return (
     <Link to={url} className="channel-list-item">
        <div>
          <Icons.HashSign className='hash-sign'/>
          <span>welcome-and-rules</span>
        </div>
        <div>
          <Icons.AddUser />
          <Icons.Settings />
        </div>
     </Link>
  )
})

export default ChannelListItem;
