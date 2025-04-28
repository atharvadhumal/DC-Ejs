import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React from "react";
import SubSidebar from "../server-sub/SubSidebar";
import SubDisplay from "../server-sub/SubDisplay";

const MainDisplay = React.memo((props: any) => {
  return (
    <MDBCol md={9} className="main-display bg-warning p-0 h-100">
      <MDBContainer fluid className='p-0 h-100'>
        <MDBRow className='m-0 p-0 h-100'>
          <SubSidebar />
          <SubDisplay />
        </MDBRow>
      </MDBContainer>
    </MDBCol>
  )
})

export default MainDisplay;
