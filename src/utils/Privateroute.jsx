import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)

  if (!userinfo || !userinfo.access) {
    return <Navigate to="/signin" />
  }

  return children
}

export default PrivateRoute
