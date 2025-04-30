import React from "react";
import ChannelListHeader from './ChannelListHeader';
import ChannelListItem from './ChannelListItem';

const ChannelList = React.memo(({title, channels}: {title:string; channels?: Array<{title: string; url:string}>}) => {
  return (
    <div className="channel-list mb-3">
        <ChannelListHeader title={title} />
        {
        channels?.map((channel) =>
          <ChannelListItem title={channel.title} url={channel.url} />
        )
        }
     </div>
  )
});

export default ChannelList;
