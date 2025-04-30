import React from "react";
import Icons from "../../shared/icons";
import { MDBBtn } from "mdb-react-ui-kit";

const WelcomeMessage = React.memo((props:any) => {
  return (
    <div className="welcome-message">
        <div>
          <Icons.HashSign />
        </div>

        <div className="title">
          Welcome to #notes-resources
        </div>

        <div>
          This is start of the #notes-resources channel
        </div>

        <div>
          <MDBBtn>
            <Icons.EditIcon className="mx-2" /> Edit Channel
          </MDBBtn>
        </div>
    </div>
  )
})

export default WelcomeMessage;
