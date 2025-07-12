import React, { useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

const Interactionbar = ({ onLike, onDislike, onShare, onCommant, onDescription, liked, like_count, dislike_count }) => {




  return (
    <Container className='d-flex flex-row gap-4 justify-content-around'  style={{
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    width: '100%',
  }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {
                liked===true ?(<span><i class="fa-solid fa-thumbs-up" style={{fontSize:'25px', cursor:'pointer' }} onClick={onLike}></i></span>):
                (<span><i class="fa-regular fa-thumbs-up" style={{fontSize:'25px', cursor:'pointer' }} onClick={onLike}></i></span>)
              }
              <span style={{ fontSize: '18px' }}>{like_count}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {
                liked===false?(<span><i class="fa-solid fa-thumbs-down" style={{fontSize:'25px', cursor:'pointer' }} onClick={onDislike}></i></span>):
                (<span><i class="fa-regular fa-thumbs-down" style={{fontSize:'25px', cursor:'pointer' }} onClick={onDislike}></i></span>)
              }
              <span style={{ fontSize: '18px'}}>{dislike_count}</span>            
            </div>

            <div>
            <span><i class="fa-solid fa-share" style={{fontSize:'25px', cursor:'pointer'}} onClick={onShare} ></i></span>
            </div>

            <div>
                <span><i class="fa-regular fa-comment" style={{fontSize:'25px',cursor:'pointer'}} onClick={onCommant}></i></span>
            </div>

            <div>
                <span><i class="fa-brands fa-readme" style={{fontSize:'25px',cursor:'pointer'}} onClick={onDescription}></i></span>
            </div>
     </Container>

  )
}

export default Interactionbar