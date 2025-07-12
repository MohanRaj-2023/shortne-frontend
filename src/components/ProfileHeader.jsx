import React,{useState} from 'react'
import {Container,Image,Button, Card,Form ,Row,Col} from 'react-bootstrap'
import FollowButton from './FollowButton';

const ProfileHeader = ({profileuser,ismyprofile}) => {

  if(!profileuser) return <div>Loading...</div>;
  

  return (
    <Container className='d-flex justify-content-center align-items-center mb-4'>
 
        <div className=' d-flex flex-column'>
        <Image
        src={`${profileuser.image}`}
        alt={profileuser.username}
        className='rounded-circle'
        width='100'
        height='100'/>
      </div>

       <div className='d-flex  flex-grow-1'>
        <p style={{fontFamily:'Inter', fontSize:"32px",paddingLeft:'30px'}} className='fw-bold'>{profileuser.username}</p>
       </div>

    </Container>

  )
}

export default ProfileHeader