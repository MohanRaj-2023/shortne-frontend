import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Form, FloatingLabel, CardBody } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SignupAction } from '../../Actions/SignupActions'
import Lottie from 'lottie-react'
import FormLoader from '../../assets/animations/formloader.json'

import { ClearSignup } from '../../Actions/ClearStateMsg'

const SignupScreen = () => {
  const dispatch = useDispatch()
  const UserSignup = useSelector((state) => state.UserSignup)
  const { error, loading, payload } = UserSignup

  const [email, Setemail] = useState('')
  const [username, Setusername] = useState('')
  const [password, Setpassword] = useState('')
  const [conpassword, Setconpassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConPassword, setConShowPassword] = useState(false)

  const [validated, setValidated] = useState(false)

  const isvalidEmail = (email) => {
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailregex.test(email)
  }

  const isvalidPassword = (password) => {
    const passwordregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordregex.test(password)
  }

  const passwordmatch = (conpassword) => {
    if (password == conpassword) {
      return true
    }
  }

  const FormHandler = (e) => {

    e.preventDefault();
    if (!isvalidEmail(email) || !isvalidPassword(password) || !password || !conpassword || !passwordmatch(conpassword)) {
      setValidated(true)
      e.stopPropagation()
      return
    }

    setValidated(true)
    dispatch(SignupAction(email, username, password))
    if (error) {
      console.log("Signup_error:", error)
    }

    if (payload) {
      console.log("Signup_payload:", payload)
    }
  }

  useEffect(()=>{
    dispatch(ClearSignup())
  },[dispatch])

  return (
    <Container
      fluid
      className='d-flex justify-content-center align-items-center min-vh-100 mt-3'>
      <Card style={{ maxWidth: '400px' }} className=''>
        <Card.Header className='text-center'>
          <span style={{ fontFamily: 'roboto', fontWeight: 'bolder', fontSize: '28px' }}>Signup</span>
        </Card.Header>

        <CardBody>
          <Form noValidate validated={validated} onSubmit={FormHandler}>
            <Form.Group className='mb-3'>
              <FloatingLabel label={<span><i className='fa-solid fa-envelope'></i> Email address</span>}>
                <Form.Control
                  type='email'
                  placeholder=''
                  value={email}
                  onChange={(e) => Setemail(e.target.value)}
                  isInvalid={validated && !isvalidEmail(email)}
                  isValid={validated && isvalidEmail(email)}
                  required />

                <Form.Control.Feedback type='invalid'>
                  {!email ? "Enter a email" : !isvalidEmail(email) ? "Enter a valid email" : ""}
                </Form.Control.Feedback>

              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mb-3'>
              <FloatingLabel label={<span><i className='fa-solid fa-user'></i> Username</span>}>
                <Form.Control
                  type='text'
                  placeholder=''
                  value={username}
                  onChange={(e) => Setusername(e.target.value)}
                  required />

                <Form.Control.Feedback type='invalid'>
                  {!username ? "Enter a username" : ""}
                </Form.Control.Feedback>

              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mb-3'>
              <FloatingLabel label={<span><i className='fa-solid fa-lock'></i> Password</span>}>
                <Form.Control
                  type={!showPassword ? 'password' : 'text'}
                  placeholder=''
                  value={password}
                  onChange={(e) => Setpassword(e.target.value)}
                  isInvalid={validated && !isvalidPassword(password)}
                  isValid={validated && isvalidPassword}
                  required />

                {password &&
                  <div
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="password-toggle-icon pt-2 text-end"
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </div>

                }
                <Form.Text>
                  Your password must be atleast 6 characters and should include a combination of numbers, letters and special characters (!$#@&)
                </Form.Text>
                <Form.Control.Feedback type='invalid'>
                  {!password ? "Enter a password" : !isvalidPassword(password) ? "Enter a valid password" : ""}
                </Form.Control.Feedback>


              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mb-3'>
              <FloatingLabel label={<span><i className='fa-solid fa-lock'></i> Confirm Password</span>}>
                <Form.Control
                  type={!showConPassword ? 'password' : 'text'}
                  placeholder=''
                  value={conpassword}
                  onChange={(e) => Setconpassword(e.target.value)}
                  isInvalid={validated && !passwordmatch(conpassword)}
                  isValid={validated && passwordmatch(conpassword)}
                  required />

                <Form.Control.Feedback type='invalid'>
                  {!conpassword ? "Enter a confirm password" : !passwordmatch(conpassword) ? "Password not match" : ""}
                </Form.Control.Feedback>

                {conpassword &&

                  <div
                    onClick={() => setConShowPassword((prev) => !prev)}
                    className="password-toggle-icon pt-2 text-end"
                    style={{ cursor: 'pointer' }}
                  >
                    {showConPassword ? '👁️' : '🙈'}
                  </div>
                }
              </FloatingLabel>
            </Form.Group>

            <div className="d-grid mb-3">
              <Button type='submit' size='sm' style={{ fontWeight: 'bold' }}>Sign up</Button>
            </div>

            <div className="mb-3 text-center">
              <Form.Text>Already have an account?<Link to='/signin' style={{ textDecoration: 'none' }}> Sign in</Link></Form.Text>
            </div>

            <div className="mb-3 text-center">
              {
                loading &&
                <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                </div>
              }
              {error &&
                (
                  <Form.Text className='text-danger' >{error}</Form.Text>
                )}
              {payload &&
                (
                  <Form.Text className='text-success' >{payload.details} !</Form.Text>
                )}

            </div>

          </Form>
        </CardBody>
      </Card>
    </Container>
  )
}

export default SignupScreen