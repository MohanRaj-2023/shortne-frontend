import React from 'react'
import { Container } from 'react-bootstrap'

const ProfileBio = ({ profileinfo }) => {

  if (!profileinfo) return <div>Loading....</div>

  return (
    <Container>
      <div className='mb-4'>
        <b>Bio:</b>
        <p>{profileinfo.bio}</p>
        {/* Conditionally show external link */}
        {profileinfo.link && (
          <p>
            <b>Link: </b>
            <a href={profileinfo.link} target="_blank" rel="noopener noreferrer">
              {profileinfo.link}
            </a>
          </p>
        )}
      </div>
    </Container>
  )
}

export default ProfileBio