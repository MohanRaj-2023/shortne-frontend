import React from 'react'
import { Container, Row, Col, Image, Form, FloatingLabel, Button, Alert, InputGroup } from 'react-bootstrap'
import Lottie from 'lottie-react'
import FormLoader from '../../assets/animations/formloader.json'

// Actions
import { UserSigninAction } from '../../Actions/signinActions'
import { ClearSignin } from '../../Actions/ClearStateMsg'

//Usesate useeffect and dispatch
import { useDispatch, useSelector } from 'react-redux'

import { useState, useEffect } from 'react'

//Link
import { Link, useNavigate } from 'react-router-dom' 

const SigninScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const UserSigninReducer = useSelector((state) => state.UserSigninReducer?.userinfo)
  const { error, loading, userinfo } = useSelector((state) => state.UserSigninReducer);


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const userinfo = localStorage.getItem('userinfo')
    if (userinfo) {
      navigate("/");
      }
  }, [userinfo, navigate]);

  // clear error when component mounts
  useEffect(()=>{
    dispatch(ClearSignin())
  },[dispatch])

  console.log("userinfo_Signin screen:", userinfo);
  const [validated, setValidated] = useState(false)

  const isValidemail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
  }

  const FormHandler = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (!isValidemail(email) || !form.checkValidity()) {
      setValidated(true)
      e.stopPropagation()
      return
    }

    dispatch(UserSigninAction(email, password))

    if (error) {
      console.log("Error:", error)
      return
    }

      console.log("userinfo:", userinfo)
    
      
    setValidated(true)
    

  }

  return (
    <>
      <Container className='my-5'>
        <Row>
          <Col md={6} className='d-none d-lg-flex justify-content-center mt-5'>
            <Image
              src='/signin-img.png'
              alt='sigin-banner'
              fluid
              rounded
              style={{ maxidth: '100%' }} 
              />
          </Col>

          <Col xs={12} lg={6} className='mt-5 text-center d-flex flex-column justify-content-center align-items-center'>
            <h2>Shortne</h2>

            <div className='mt-3 d-flex flex-column align-items-center'>
              <Form noValidate validated={validated} onSubmit={FormHandler} className='d-flex flex-column align-items-center'>

                <Form.Group className='mb-3'>
                  <FloatingLabel
                    label='Email address'>
                    <Form.Control
                      type='email'
                      placeholder='you@gmail.com'
                      style={{ width: '300px', position: 'relative' }}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      isInvalid={validated && !isValidemail(email)}
                      isValid={validated && isValidemail(email)}
                    ></Form.Control>

                    <Form.Control.Feedback type='invalid' className='text-start'>
                      {!email ? "Please enter an email" : !isValidemail(email) ? "Please enter an valid email" : ""}
                    </Form.Control.Feedback>

                  </FloatingLabel>
                </Form.Group>


                <Form.Group className='mb-3'>
                  <FloatingLabel label='Password'>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder='*****'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      style={{ width: '300px' }}
                    />
                    <Form.Control.Feedback type='invalid' className='text-start'>Please eneter a password</Form.Control.Feedback>
                    {password && 
                        <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: '10px',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: '#6c757d'
                        }}
                      >
                        {showPassword ? '👁️' : '🙈'}
                      </span>
                    }
                    
                  </FloatingLabel>
                </Form.Group>


                <div className='align-self-start mb-3' style={{ margin: "0px 0px 0px 47px" }}>
                  <Link to='/reset-password' style={{textDecoration:'none'}} >Forgotten your password?</Link>
                </div>

                <div className="d-grid gap-2 mx-5">
                  <Button type='submit' variant='primary' size='lg' style={{ width: '300px' }} className='btn-sm rounded' >Login</Button>
                </div>

                <div className="d-flex align-items-center my-4 w-100 px-5">
                  <hr className="flex-grow-1 border-top border-secondary opacity-100"></hr>
                  <span className="mx-3 text-muted">OR</span>
                  <hr className="flex-grow-1 border-top border-secondary opacity-100"></hr>
                </div>

              </Form>

              {
                loading &&
                <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                </div>
              }

              {error &&
                <p className='text-danger' >{error}</p>
              }
              <Form.Text>Don't have an account? <Link to='/signup' style={{ textDecoration: 'none' }}>Sign up</Link> </Form.Text>
            </div>
          </Col>
        </Row>

      </Container>
    </>

  )
}

export default SigninScreen