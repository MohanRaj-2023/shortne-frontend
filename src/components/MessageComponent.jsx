import React from 'react'
import {Offcanvas,Card} from'react-bootstrap'

const MessageComponent = ({show,handleClose}) => {
  return (
    <Offcanvas show={show} placement='end' onHide={handleClose} >
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Message</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>

            <Card className='mb-3'>
                <Card.Body>
                      <span>Message Component</span>          
                </Card.Body>
            </Card>

        </Offcanvas.Body>
    </Offcanvas>
    
  )
}

export default MessageComponent