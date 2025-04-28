import { MDBCol } from "mdb-react-ui-kit";
import React from "react";
import SubSidebarHeader from "../utlis/SubSIdebarHeader";
import LevelBoostUI from "../utlis/LevelBoostUI";

const SubSidebar = React.memo((props: any) => {
  return (
    <MDBCol md={3} className='sub-sidebar p-0'>
        <SubSidebarHeader />
        <LevelBoostUI />
    </MDBCol>
  )
})

export default SubSidebar;
