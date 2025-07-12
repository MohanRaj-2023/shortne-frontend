import React from 'react'
import { Container } from 'react-bootstrap'

const ProfileStats = ({details}) => {
  if(!details) return <p>loading...</p>
  return (
    <Container className='d-flex justify-content-between align-items-center mb-4 me-5'>
        <div className='' style={{paddingLeft:'10px'}}> 
          <span><b>{details.posts_count}</b> Posts</span>  
        </div>
        <div className='' style={{paddingLeft:'10px'}}> 
          <span><b>{details.followers_count}</b> Followers</span>  
        </div>
        <div className='' style={{paddingLeft:'10px'}}> 
          <span><b>{details.following_count}</b> Following</span>  
        </div>

        
    </Container>
  )
}

export default ProfileStats