import React, { useState ,useEffect} from 'react'
import {Row,} from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import VideoCard from './VideoCard'
import { PostDeleteAction } from '../Actions/PostCreateActions'
import Lottie from 'lottie-react'
import loadingAnimation from "../assets/animations/loading.json"

const VideoTab = ({ userposts, profileuser, onDelete, profileinfo }) => {
    const [SelectedPost, setSelectedPost] = useState(null)
    const navigate = useNavigate()
    const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
    const access_token = userinfo?.access
    const dispatch = useDispatch()

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

    if (!userposts || !profileuser) {
        return (
          <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
                      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
          </div>
        )
      } 

    // console.log("Video:",profileuser.image)

    
  return (
    <Row>
      {InitialPosts.map((post, index) => (
        <VideoCard
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

export default VideoTab