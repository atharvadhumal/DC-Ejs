import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React from "react";
import SubSidebar from "../server-sub/SubSidebar";
import SubDisplay from "../server-sub/SubDisplay";
import { Outlet } from "react-router-dom";

const MainDisplay = React.memo((props: any) => {
  return (
    <MDBCol md={9} className="main-display p-0 h-100">
      <MDBContainer fluid className='p-0 h-100'>
        <MDBRow className='m-0 p-0 h-100'>
            <SubSidebar />
            <Outlet />
        </MDBRow>
      </MDBContainer>
    </MDBCol>
  );
});

export default MainDisplay;
