import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { NewpasswordAction } from '../../Actions/NewpasswordActions'
import { useParams, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import FormLoader from '../../assets/animations/formloader.json'
import { ClearNewPassword } from '../../Actions/ClearStateMsg';

const NewpasswordScreen = () => {
  const { uid, token } = useParams()
  const [isvalidated, Setisvalidated] = useState(false)
  const [Error, SetError] = useState('')

  const [new_password, Setnewpassword] = useState('')
  const [conpassword, Setconpassword] = useState('')
  const dispatch = useDispatch()
  const Newpassword = useSelector((state) => state.Newpassword)
  const { error, loading, payload } = Newpassword

  const [showPassword, setShowPassword] = useState(false)
  const [showConPassword, setConShowPassword] = useState(false)

  useEffect(() => {
    if (payload) {
      SetError('')
      // Setnewpassword('')
      // Setconpassword('')
    }
  }, [payload])

  useEffect(() => {
    dispatch(ClearNewPassword())
  }, [dispatch])


  const isvalidPassword = (password) => {
    const passwordregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordregex.test(password)
  }

  const passwordmatch = (conpassword) => {
    if (new_password == conpassword) {
      return true
    }
  }

  const Formhandler = (event) => {
    event.preventDefault()
    if (!new_password || !conpassword || !isvalidPassword(new_password) || !passwordmatch(conpassword)) {
      Setisvalidated(true)
      event.stopPropagation()
      return
    }

    Setisvalidated(true) //amar@123
    dispatch(NewpasswordAction(uid, token, new_password))
  }


  if (error) {
    console.log("New_password:", error)
  }

  return (
    <Container className='mt-5'>
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <Card>
            <Card.Body className='d-flex flex-column align-items-center'>
              <Form noValidate validated={isvalidated} onSubmit={Formhandler}>
                <div className='mb-3 text-center'>
                  <b>Create A Strong Password</b>
                </div>

                <div className="mb-3 text-center">
                  <Form.Text>
                    Your password must be atleast 6 characters and should include
                    a combination of numbers, letters and special characters (!$#@&)
                  </Form.Text>
                </div>

                <div className="mb-4">
                  <Form.Control
                    type={!showPassword ? 'password' : 'text'}
                    placeholder='New Password'
                    value={new_password}
                    onChange={(event) => Setnewpassword(event.target.value)}
                    isInvalid={isvalidated && !isvalidPassword(new_password)}
                    isValid={isvalidated && isvalidPassword(new_password)}
                    className='pe-5'
                    required
                  />
                  {new_password &&
                    <div
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="password-toggle-icon pt-2 text-end"
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </div>
                  }

                  <Form.Control.Feedback type='invalid'>
                    {!new_password ? "Enter a new password" : !isvalidPassword(new_password) ? "Enter a valid password" : ""}
                  </Form.Control.Feedback>
                </div>


                <div className="mb-4">
                  <Form.Control
                    type={!showConPassword ? 'password' : 'text'}
                    placeholder='Confirm Password'
                    value={conpassword}
                    onChange={(event) => Setconpassword(event.target.value)}
                    isInvalid={isvalidated && !passwordmatch(conpassword)}
                    isValid={isvalidated && passwordmatch(conpassword)}
                    className='pr-5'
                    required
                  />
                  {conpassword &&
                    <div
                      onClick={() => setConShowPassword((prev) => !prev)}
                      className="password-toggle-icon pt-2 text-end"
                      style={{ cursor: 'pointer' }}
                    >
                      {showConPassword ? '👁️' : '🙈'}
                    </div>
                  }
                  <Form.Control.Feedback type='invalid'>
                    {!conpassword ? "Enter a confirm password" : !passwordmatch(conpassword) ? "Password not match" : ""}
                  </Form.Control.Feedback>

                </div>

                <div className="d-grid">
                  <Button variant='primary' type='submit' className='rounded'>Reset Password</Button>
                </div>
                {
                  loading &&
                  <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "20px" }}>
                    <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                  </div>
                }
                {
                  Error &&
                  <div className="mt-4 text-center">
                    <Form.Text className='text-danger'>{Error}</Form.Text>
                  </div>
                }
                {error &&
                  <div className="mt-4 text-center">
                    <Form.Text className='text-danger'>{error}</Form.Text>
                  </div>
                }
                {payload &&
                  <div className="mt-4 text-center">
                    <Form.Text className='text-success'>{payload.details}</Form.Text>
                  </div>
                }

              </Form>
            </Card.Body>
          </Card>
          
            <div className="mt-3 text-end">
              <Link className='btn btn-outline-dark btn-sm' to={`/signin`} >Back to Signin</Link>
            </div>
          



        </Col>
      </Row>
    </Container>
  )
}

export default NewpasswordScreen