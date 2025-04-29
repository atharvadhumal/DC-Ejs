import { MDBCol } from "mdb-react-ui-kit";
import React from "react";
import SubSidebarHeader from "../utlis/SubSIdebarHeader";
import LevelBoostUI from "../utlis/LevelBoostUI";
import ChannelList from "../utlis/ChannelList";
import MiniProfilePanel from "../utlis/MIniProfilePanel";

const SubSidebar = React.memo((props: any) => {
  return (
    <MDBCol md={3} className='sub-sidebar p-0 h-100'>
        <SubSidebarHeader />
        <div className="sub-sidebar-inner px-2">
          <LevelBoostUI />
          <ChannelList />
        </div>
        <MiniProfilePanel />

    </MDBCol>
  )
})

export default SubSidebar;
