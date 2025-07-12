import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Navbar, Nav, NavbarBrand, Form, Button, NavDropdown, Offcanvas, Modal } from 'react-bootstrap'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
// import { UserSigninAction,Signout } from '../Actions/signinActions'
import { useDispatch, useSelector } from 'react-redux'

import { SignoutAction } from '../Actions/signoutActions'
import { ProfileAction } from '../Actions/UserprofileActions'

//Use Post Modal
import { usePostModal } from './PoastmodalContext'

//Notification Component
import Notification from './Notification'
import useNotificationSocket from '../utils/useNotificationsocket'
import useMessagesocket from '../utils/useMessagesocket'

import { UnreadAction } from '../Actions/NotificationActions'

import Friendslist from './Followerslist'

const HeaderNavbar = () => {
  const dispatch = useDispatch()
  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
  // const userinfo = UserSigninReducer


  const [signin, Setsignin] = useState(false)
  const navigate = useNavigate()
  const { openPostModal } = usePostModal()


  useEffect(() => {
    if (userinfo != null) {
      Setsignin(true)
    } else {
      Setsignin(false)
    }
  }, [userinfo])

  //unread count
  const access_token = userinfo?.access
  useEffect(() => {
    if (access_token) {
      console.log("Dispatching UnreadAction with access_token:", access_token)
      dispatch(UnreadAction(access_token))
    }
  }, [access_token])

  //notification 
  const { unread_notifications } = useSelector((state) => state.Unreadcounts);


  const unread_messages = useSelector((state) => state.Unreadmsgcount?.payload)

  
  console.log("Unread_notificount:", unread_notifications)

  // const {unread_messages} = useSelector((state)=>state.Unreadcounts)
  console.log("Unread_msgcount+++++++++++++++:", unread_messages)

  // Live Notification
  useNotificationSocket(access_token)
  useMessagesocket(access_token)

  // const navigate = useNavigate()

  const signout_handler = () => {
    if (userinfo) {
      const refresh_token = userinfo.refresh
      const access_token = userinfo.access
      localStorage.removeItem('userinfo')
      Setsignin(false)
      dispatch(SignoutAction(refresh_token, access_token))
      navigate('/signin')
    }
    else {
      alert("Userinfo is not available")
    }
  }

  // handleNotification
  const [shownot, Setshownot] = useState(false)

  const handleNotification = () => {
    Setshownot((prev) => !prev)
  }


  // handle friendslist
  const [showfollowers, Setshowfollowers] = useState(false)

  //  handle search
  const [query, setQuery] = useState('')

  const handlesearch = (e) => {
    e.preventDefault()
    if (query.trim() != '') {
      navigate(`/search?query=${encodeURIComponent(query)}`)
      setQuery('')
    }

  }
  const username = userinfo?.username
  useEffect(() => {
    if (access_token) {
      dispatch(ProfileAction(access_token, username))
    }

  }, [username, dispatch, access_token])

  // console.log("Logedin_uername:",userinfo?.username)
  const { profileinfo, loading } = useSelector((state) => state.Profileinfo)
  const [userprofileimg,setUserprofileimg]=useState(null)

  useEffect(()=>{
    if(profileinfo?.username===userinfo?.username){
      setUserprofileimg(profileinfo?.image)
    }
  })

  

  // console.log("Profileinfo_Home screen:",profileinfo)
  return (

    <>
        <Navbar className='bg-body-tertiary fixed-top shadow-sm z-3 ' expand='md'>
      <Container fluid>
        <div className="row w-100 align-items-center">
          {/* App name */}
          {/* Brand - Left */}
          <div className="col-2 col-md-2 text-start  d-flex align-items-center">
            <NavbarBrand className=' d-flex align-items-center gap-2' as={Link} to="/">
              {/* Image logo (visible only below md) */}
              <img
                src="/shortne-favicon-32x32.png"
                alt="Shortne Logo"
                className="d-block d-md-none"
                style={{ height: '40px', objectFit: 'contain' }}
              />
              <span className="d-none d-md-block" style={{
                fontFamily: "'Righteous', sans-serif",
                fontWeight: 700,
                fontSize: '1.8rem',
                letterSpacing: '0.5px',
                color: '#FFD700', // Bright yellow
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                Shortne
              </span>
            </NavbarBrand>
          </div>

          {/* search bar */}
          {/* Search Bar - Centered */}
          <div className="col-8 col-md-8 text-center " style={{ marginRight: "0px" }}>
            <Form className='w-100'>
              <Form.Control
                type='search'
                placeholder='search...'
                // style={{ width: "200px" }}
                value={query}
                className=''
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlesearch(e)}
                // style={{ maxWidth: '250px', margin: '0 auto' }}
                style={{ minWidth: '185px', maxWidth: '250px', margin: '0 auto' }}
              />
            </Form>
          </div>

          {/* Post create modal */}
          {/* Toggle + Icons - Right */}
          <div className="col-2 col-md-2 text-end">
            <Navbar.Toggle
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.9rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f8f9fa',
              }}></Navbar.Toggle>
          </div>

        </div>

        {/* offcanvas */}

        <Navbar.Offcanvas placement='end' >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Zone</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav>
              <Nav.Link as={Link} to={'/messenger'} className='mx-2'>
                <div className='icon-wrapper position-relative'>
                  <i className='fa-solid fa-message' style={{ cursor: 'pointer' }}></i>
                  {unread_messages > 0 && (
                    <span className="badge rounded-circle bg-danger position-absolute top-0 start-100 translate-middle">
                      {unread_messages}
                    </span>
                  )}
                </div>
              </Nav.Link>
              <Nav.Link className='mx-2'>
                <div className='icon-wrapper position-relative'>
                  <i className='fa-solid fa-bell' onClick={handleNotification} style={{ cursor: 'pointer' }}></i>
                  {unread_notifications > 0 && (
                    <span className="badge rounded-circle bg-danger position-absolute top-0 start-100 translate-middle">
                      {unread_notifications}
                    </span>
                  )}
                </div>
              </Nav.Link>

              {signin ? (
                <NavDropdown title={<span id="basic-nav-dropdown">
                  <img
                    src={userprofileimg ? `${userprofileimg}` : '/defaultimg.jpg'}
                    alt="Profile"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </span>} drop='start' className='' >
                  <NavDropdown.Item as={Link} to={`/profile/${userinfo.username}`}>Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={signout_handler} >Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (

                <NavDropdown title={<span id="basic-nav-dropdown"><i className='fa-solid fa-user'></i></span>} drop='start' className='' >
                  <NavDropdown.Item as={Link} to='/signup'>Signup</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to='/signin'>Signin</NavDropdown.Item>
                </NavDropdown>
              )


              }
            </Nav>


          </Offcanvas.Body>

        </Navbar.Offcanvas>

        {/* Notification */}
        {
          shownot ? (
            <Notification show={shownot} handleClose={() => Setshownot((prev) => !prev)} />
          ) :
            showfollowers ? (
              <Friendslist show={showfollowers} handleClose={() => Setshowfollowers((prev) => !prev)} />
            ) : ''
        }

        {/* icons for sm screen */}
        {/* <div className="mx-auto mt-2 overflow-auto d-md-none" style={{ whiteSpace: 'nowrap' }}>
          <Nav className='d-flex flex-row d-md-none gap-5' style={{ minWidth: 'max-content' }}>
            <Nav.Link as={Link} to="/" active ><span><i className='fa-solid fa-house'></i></span></Nav.Link>
            <Nav.Link as={Link} onClick={() => Setshowfollowers((prev) => !prev)} ><span><i className='fa-solid fa-user-group'></i></span></Nav.Link>
            <Nav.Link as={Link} to="/video" ><span><i className='fa-solid fa-video'></i></span></Nav.Link>
            <Nav.Link onClick={openPostModal}  ><span><i className='fa-solid fa-square-plus'></i></span></Nav.Link>
          </Nav>
        </div> */}

      </Container>
    </Navbar>
            {/* ✅ Bottom nav bar for small screens only */}
      <div className="d-md-none fixed-bottom bg-white border-top py-2 shadow-sm">
        <Nav className="d-flex justify-content-around align-items-center">
          <Nav.Link as={Link} to="/" active><i className='fa-solid fa-house text-dark'></i></Nav.Link>
          <Nav.Link onClick={() => Setshowfollowers((prev) => !prev)}><i className='fa-solid fa-user-group text-dark'></i></Nav.Link>
          <Nav.Link as={Link} to="/video"><i className='fa-solid fa-video text-dark'></i></Nav.Link>
          <Nav.Link onClick={openPostModal}><i className='fa-solid fa-square-plus text-dark'></i></Nav.Link>
        </Nav>
      </div>
    </>
        
  )
}

export default HeaderNavbar