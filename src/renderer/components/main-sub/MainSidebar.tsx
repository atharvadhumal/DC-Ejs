import { MDBCol } from 'mdb-react-ui-kit';
import React from 'react';
import ServerBtn from '../utlis/ServerBtns';

const MainSidebar = React.memo((props: any) => {
  return (
    <MDBCol md={3} className='main-sidebar flex-wrap d-block bg-info p-0'>
      <div className='w-100' style={{height: 40, flexShrink: 0}}></div>

      <ServerBtn
        title="Test Server"
        url="server/0"
        img="https://imageio.forbes.com/specials-images/imageserve/5f962df3991e5636a2f68758/0x0.jpg"
      />
      <ServerBtn
        title="Test Server"
        url="server/0"
        img="https://imageio.forbes.com/specials-images/imageserve/5f962df3991e5636a2f68758/0x0.jpg"
      />


    </MDBCol>
  );
});

export default MainSidebar;
