import React from "react";
import ChannelListHeader from "./ChannelListHeader";
import ChannelListItem from "./ChannelListItem";

const ChannelList = React.memo((props: any) => {
  return (
    <div className="channel-list mb-3">
        <ChannelListHeader title="Information"/>
        <ChannelListItem title="welcome-and-rules" url="channel/welcome-and-rules" />
        <ChannelListItem title="notes-and-sharing" url="channel/notes-and-sharing"/>
    </div>
  )
});

export default ChannelList
