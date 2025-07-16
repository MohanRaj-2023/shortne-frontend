import React from 'react'
import HeaderNavbar from './HeaderNavbar'
import VerticalNavbar from './VerticalNavbar'
import { Outlet } from 'react-router-dom'

const Layout = ({ openPostModal, handleFollowersList }) => {
  return (
    <div className='d-flex'>
      <div className="d-none d-md-block mt-5">
        <VerticalNavbar openPostModal={openPostModal} handleFollowersList={handleFollowersList} />
      </div>
      <div style={{  paddingTop: '56px', width: '100%' }}>
        <HeaderNavbar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout