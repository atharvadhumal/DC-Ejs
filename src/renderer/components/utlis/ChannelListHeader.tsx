import React from 'react'
import Icons from '../../shared/icons'

const ChannelListHeader = React.memo(({title}: {title : string}) => {
  return (
    <div className='channel-header'>
        <div>
          <Icons.AngleBottom />
          <span>{title}</span>
        </div>
        <Icons.Plus />
    </div>
  )
})

export default ChannelListHeader;
