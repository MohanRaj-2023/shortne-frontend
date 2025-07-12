import React, { useState, useEffect } from 'react'
import { Form, Button, Offcanvas, Card, Image } from 'react-bootstrap'
const Description = ({ post, show, handleClose }) => {
  if(!post) return <div>Loading....</div>
  return (
    <Offcanvas show={show} placement='end' onHide={handleClose} className='bg-light'>
        <Offcanvas.Header>
            <Offcanvas.Title>Description</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div className='mb-3'>{post.caption}</div>

            {post?.hashtags.length > 0 && (
                                            post?.hashtags.map((tag, index) => (
                                                <span key={index} className='text-primary'> #{tag}</span>
                                            ))
                                        )
            }
        </Offcanvas.Body>
    </Offcanvas>
    
  )
}

export default Description