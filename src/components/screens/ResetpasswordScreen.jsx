import React from 'react'
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Resetpassword } from '../../Actions/ResetpasswordActions'
import Lottie from 'lottie-react'
import FormLoader from '../../assets/animations/formloader.json'
import { ClearResetPassword } from '../../Actions/ClearStateMsg'

const ResetpasswordScreen = () => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const ResetPassword = useSelector((state) => state.ResetPassword)
  const { error, loading, payload } = ResetPassword
  const [Error,setError] = useState('')
  const [isvalidated, Setisvalidated] = useState(false)



  useEffect(() => {
    if (payload) {
      setError('')
    }
  }, [payload])

  useEffect(()=>{
    if(error){
      setError(error)
    }
  },[error])

  useEffect(()=>{
    dispatch(ClearResetPassword())
  },[dispatch])

  const validemail = (email) => {
    const email_regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email_regx.test(email)
  }
  const formhandler = (event) => {
    event.preventDefault()
    if (!validemail(email)) {
      Setisvalidated(true)
      event.stopPropagation()
      return
    }

    Setisvalidated(true)
    dispatch(Resetpassword(email))
  }
  return (
    <Container className='mt-5'>
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Form noValidate className='d-flex flex-column align-items-center' onSubmit={formhandler} validated={isvalidated}>
                <div className="text-center mb-3">
                  <b>Trouble with logging in?</b>
                </div>

                <div className='text-center mb-3'>
                  <Form.Text>
                    Enter your email address, and we'll send you a link to reset your account password.
                  </Form.Text>
                </div>

                <InputGroup className='mb-3'>
                  <InputGroup.Text>Email</InputGroup.Text>
                  <Form.Control
                    type='email'
                    placeholder='you@gmail.com'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    isValid={isvalidated && validemail(email)}
                    isInvalid={isvalidated && !validemail(email)}></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {!email ? 'Enter a email' : !validemail(email) ? 'Enter a valid email' : ''}
                  </Form.Control.Feedback>
                </InputGroup>

                <div className='d-grid gap-2'>
                  <Button variant='primary' type='submit' className='rounded'>Send Link</Button>
                </div>

              </Form>
            </Card.Body>
            <Card.Footer className='text-center'>
              <Link to='/' style={{ textDecoration: "none", fontWeight: 'bold' }} className='text-dark'>Back to login</Link>
            </Card.Footer>
          </Card>
          {
            loading &&
            <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
              <Lottie animationData={FormLoader} loop={true} style={{ width: 80 }} />
            </div>
          }
          {
            payload &&
            <div className="mt-5">
              <p className='text-success text-center'>{payload}</p>
            </div>
          }
          {
            error &&
            <div className="mt-5">
              <p className='text-danger text-center'>{Error}</p>
            </div>
          }

        </Col>
      </Row>
    </Container>
  )
}

export default ResetpasswordScreen