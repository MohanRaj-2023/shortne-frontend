import React, { useState, useRef, useEffect, use } from 'react'
import { Card, Image, Row, Col, Spinner, Dropdown } from 'react-bootstrap'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import { PostDeleteAction } from '../Actions/PostCreateActions'
import { useDispatch, useSelector } from 'react-redux'
import Postcard from './Postcard'
// lottie animation
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json"

const PostTab = ({ userposts, profileuser, onDelete, profileinfo }) => {
  const [SelectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()
  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
  const access_token = userinfo?.access
  const dispatch = useDispatch()
  console.log("User_Posts:",userposts)

  const Posts = Array.isArray(userposts) ? userposts : []
  const [InitialPosts, setInitialPosts] = useState(Posts || [])

  useEffect(() => {
    setInitialPosts(Posts)
  }, [Posts])

  const handleEdit = (post) => {
    console.log("Postmodal Trigerd....")
    navigate(`/post-edit/${post.id}`)
  }

  const handleDelete = (post) => {
    if (access_token && post) {
      dispatch(PostDeleteAction(access_token, post?.id))
      onDelete(post.id)
    }
  }
  // const deleted = useSelector((state) => state.Deletepost?.payload)

  if (!userposts || !profileuser) {
    return (
     <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
            <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
     </div>
    )
  }

  return (

    <Row>
      {InitialPosts.map((post, index) => (
        <Postcard
          key={post.id || index}
          post={post}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedPost={SelectedPost}
          setSelectedPost={setSelectedPost}
          profileinfo={profileinfo}
        />
      ))}
    </Row>

  )
}

export default PostTab