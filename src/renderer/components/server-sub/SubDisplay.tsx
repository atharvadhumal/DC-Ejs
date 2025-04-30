import { MDBCol } from 'mdb-react-ui-kit';
import React, { useRef } from 'react';
import SubDisplayHeader from '../utlis/SubDisplayHeader';
import TextBox from '../utlis/TextBox';
import WelcomeMessage from '../utlis/WelcomeMessage';
import MessageBox from '../utlis/MessageBox';

const SubDisplay = React.memo((props: any) => {
  const textBoxRef = useRef<HTMLDivElement | null>(null);

  return (
    <MDBCol
      md={9}
      className="sub-display h-100 p-0 d-flex flex-wrap justify-content-between"
    >
      <SubDisplayHeader />
      <div className="sub-display-mid-container">
        <WelcomeMessage />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
      </div>
      <TextBox />
    </MDBCol>
  );
});

export default SubDisplay;
