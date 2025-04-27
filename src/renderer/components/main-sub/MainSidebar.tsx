import { MDBCol } from 'mdb-react-ui-kit';
import React from 'react';
import ServerBtn from '../utlis/ServerBtns';

const MainSidebar = React.memo((props: any) => {
  return (
    <MDBCol md={3} className='main-sidebar bg-info'>
      <ServerBtn title="Test Server" url="server/0" />
    </MDBCol>
  );
});

export default MainSidebar;
