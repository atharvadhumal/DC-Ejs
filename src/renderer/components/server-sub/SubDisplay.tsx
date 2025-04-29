import { MDBCol } from "mdb-react-ui-kit";
import React from "react";
import SubDisplayHeader from "../utlis/SubDisplayHeader";
import TextBox from "../utlis/TextBox";

const SubDisplay = React.memo((props: any) => {
  return (
    <MDBCol md={9} className='sub-display p-0'>
        <SubDisplayHeader />
        <TextBox />
    </MDBCol>
  )
})

export default SubDisplay;
