import { MDBContainer, MDBRow } from 'mdb-react-ui-kit'
import React from 'react'
import MainSidebar from './main-sub/MainSidebar'
import MainDisplay from './main-sub/MainDisplay'
import { Outlet } from 'react-router-dom'

const MainComponent = React.memo((props: any) => {
  return (
    <MDBContainer fluid className="main-component bg-success p-0">
      <MDBRow className="w-100 h-100 m-0">
        <MainSidebar />
        <Outlet />
      </MDBRow>
    </MDBContainer>
  )
})

export default MainComponent
