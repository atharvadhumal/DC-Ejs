import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React from "react";
import SubSidebar from "../server-sub/SubSidebar";
import SubDisplay from "../server-sub/SubDisplay";

const MainDisplay = React.memo((props: any) => {
  return (
    <MDBCol md={9} className="main-display bg-warning">
      <MDBContainer fluid>
        <MDBRow>
          <SubSidebar />
          <SubDisplay />
        </MDBRow>
      </MDBContainer>
    </MDBCol>
  )
})

export default MainDisplay;
