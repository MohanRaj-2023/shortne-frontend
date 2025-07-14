import React, { useEffect, useState,useRef,useCallback } from 'react'
import Postcreatemodal from '../Postcreatemodal'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import PostComponent from '../PostComponent'
import { FeedAction } from '../../Actions/FeedActions'
import CommantSection from '../CommentSection'
import ShareSection from '../ShareSection'

import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/animations/loading.json"

// Reaction action
import { ReactionAction } from '../../Actions/ReactionActions'
import Description from '../Description'

import { useNavigate } from 'react-router-dom'

const HomeScreen = () => {

  const [selectedPost, setSelectedPost] = useState(null)
  const [showcommant, Setshowcommant] = useState(false)
  const [share, Setshare] = useState(false)
  const [showdescription, Setshowdescription] = useState(false)


  const dispatch = useDispatch()
  const navigate = useNavigate() // ⬅️ ADD this

  // Get user info
  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
  const access_token = userinfo?.access

  const {feeds,next,loading} = useSelector((state) => state.Feeds)

  useEffect(() => {
    if (!userinfo || !access_token) {
      navigate('/signin')
    }
  }, [userinfo, access_token, navigate])

  useEffect(() => {
    if (access_token && feeds.length === 0) {
      console.log("📥 Dispatching FeedAction...");
      dispatch(FeedAction(access_token))
    }
  }, [dispatch, access_token, feeds.length])

  

  const loader = useRef(null);

  // ✅ Intersection Observer Callback
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && next) {
        dispatch(FeedAction(access_token, next)); // Fetch next page
      }
    },
    [next, dispatch, access_token]
  );

  // ✅ Setup observer on loader div
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);


  // selected post
  const [selectedpost, Setselectedpost] = useState(null)

  //Handle interaction
  const HandleInteraction = (type, post) => {
    if (type == 'share') {
      setSelectedPost(post)
      Setshare((prev) => !prev)
    }
    if (type == 'commant') {
      setSelectedPost(post)
      Setshowcommant((prev) => !prev)
    }
    if (type == 'description') {
      Setselectedpost(post)
      Setshowdescription((prev) => !prev)
    }
  }


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
      </div>
    )
  }

  
  return (
    <Container className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-column align-items-center justify-content-center"  style={{maxWidth: '600px', width: '100%'}} >
              {Array.isArray(feeds) &&
        feeds.map((post, index) => (
          <div key={post.id || index} className="w-100 mb-2">
            <PostComponent Post={post} onInteraction={(type) => HandleInteraction(type, post)} />

            {showdescription && selectedpost?.id === post.id && (
              <Description post={post} show={showdescription} handleClose={() => Setshowdescription((prev) => !prev)} />
            )}

            {showcommant && selectedPost?.id === post.id && (
              <CommantSection post={selectedPost} show={showcommant} handleClose={() => Setshowcommant((prev) => !prev)} />
            )}

            {share && selectedPost?.id === post.id && (
              <ShareSection show={share} handleClose={() => Setshare((prev) => !prev)} post={selectedPost} />
            )}
          </div>
        ))}

         {/* ✅ Loader for infinite scroll */}
      {next && (
        <div ref={loader} className="text-muted mb-3">
          <small>Loading more posts...</small>
        </div>
      )}
      
      </div>
      
    </Container>

  )
}

export default HomeScreen