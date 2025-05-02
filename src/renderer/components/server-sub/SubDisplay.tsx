import { MDBCol } from 'mdb-react-ui-kit';
import React, { useRef } from 'react';
import SubDisplayHeader from '../utlis/SubDisplayHeader';
import TextBox from '../utlis/TextBox';
import WelcomeMessage from '../utlis/WelcomeMessage';
import MessageBox from '../utlis/MessageBox';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../shared/rdx-hooks';

const SubDisplay = React.memo((props: any) => {
  const textBoxRef = useRef<HTMLDivElement | null>(null);

  const routeParams = useParams();
  const channelId = routeParams.channelId || '';
  const messages = useAppSelector(state => state.main.messages);

  // Get messages for the current channel (or empty array if none exist)
  const channelMessages = messages[channelId] || [];

  return (
    <MDBCol
      md={9}
      className="sub-display h-100 p-0 d-flex flex-wrap justify-content-between"
    >
      <SubDisplayHeader />
      <div className="sub-display-mid-container">
        <WelcomeMessage />

        {channelMessages.map((msg, index) => (
          <MessageBox key={msg.id || index} msg={msg} />
        ))}
      </div>
      <TextBox />
    </MDBCol>
  );
});

export default SubDisplay;
