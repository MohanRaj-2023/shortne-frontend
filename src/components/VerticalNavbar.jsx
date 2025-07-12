import React,{useState} from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Friendslist from '../components/Followerslist'
//Use Post Modal
import { usePostModal } from './PoastmodalContext'

const VerticalNavbar = ({ openPostModal,handleFollowersList }) => {

    const [showfollowers,Setshowfollowers] = useState(false)

    
  return (
    <>
    <Nav className="flex-column bg-light p-3" style={{  height: 'calc(100vh - 56px)', width: '70px', position: 'fixed', top: '56px', left: 0 , zIndex: 1000, marginTop: '' }}>
      <Nav.Link as={Link} to="/" className="text-center mb-3" style={{textDecoration:'none'}}>
        <i className="fa-solid fa-house" style={{color:'black'}}></i>
      </Nav.Link>
      <Nav.Link onClick={()=>Setshowfollowers((prev)=>!prev)} className="text-center mb-3">
        <i className="fa-solid fa-user-group" style={{color:'black'}}></i>
      </Nav.Link>
      <Nav.Link as={Link} to="/video" className="text-center mb-3">
        <i className="fa-solid fa-video" style={{color:'black'}}></i>
      </Nav.Link>
      <Nav.Link onClick={openPostModal} className="text-center">
        <i className="fa-solid fa-square-plus" style={{color:'black'}}></i>
      </Nav.Link>
    </Nav>
    {
        showfollowers && (
              <Friendslist  show={showfollowers} handleClose={()=>Setshowfollowers((prev)=>!prev)}/>
        )
    }
    </>
    
    
  )
}

export default VerticalNavbar