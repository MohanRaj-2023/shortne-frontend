import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { ProfileAction } from '../../Actions/UserprofileActions'
import { PostsAction } from '../../Actions/PostActions'
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/animations/loading.json"

import { useParams } from 'react-router-dom';


//Components
import ProfileHeader from '../ProfileHeader'
import ProfileStats from '../ProfileStats'
import ProfileBio from '../ProfileBio'
import FollowButton from '../FollowButton'
import PostTab from '../PostTab'
import VideoTab from '../VideoTab'


const ProfileScreen = () => {
  const { username } = useParams()
  // console.log("Profile_username:",username)
  const dispatch = useDispatch()
  const { profileinfo, loading } = useSelector((state) => state.Profileinfo)

  // console.log("Profile_screeninfo:", profileinfo)

  // Post
  const Posts = useSelector((state) => state.Posts)
  const { error: Posterror, posts, next, loading: Postloading } = Posts
  const [UserPosts, setUserPosts] = useState([])
  useEffect(() => {
    if (posts?.length > 0) {
      setUserPosts(posts)
    }
  }, [posts])

  console.log("Posts:", posts)


  const isLogedin = useSelector((state) => state.UserSigninReducer?.userinfo);
  // console.log("Logedinuser:",isLogedin?.access)

  const isMyprofile = isLogedin?.username === profileinfo?.username

  const handledeletedpost = (post_id) => {
    setUserPosts((prevPost) => prevPost.filter(post => post.id !== post_id))
  }

  const access_token = isLogedin.access
  useEffect(() => {
    if (access_token && (!profileinfo || profileinfo.username !== username)) {
      dispatch(ProfileAction(access_token, username))
    }

  }, [username, dispatch, profileinfo, access_token])

  useEffect(() => {
    if (access_token && username) {
      dispatch(PostsAction(access_token, username))
    }
  }, [access_token, username, dispatch])

  // When scrolled to bottom
  const loader = useRef(null);
  const postLoaderRef = useRef(null); // For post tab
  const [activeTab, setActiveTab] = useState('post');

  const fetchedUrls = useRef(new Set());
const handleObserver = useCallback(
  (entries) => {
    const target = entries[0];
    if (target.isIntersecting && next && !Postloading && !fetchedUrls.current.has(next)) {
      fetchedUrls.current.add(next); // ✅ mark this page as fetched
      dispatch(PostsAction(access_token, username, next));
    }
  },
  [next, Postloading, access_token, username, dispatch]
);


  // useEffect(() => {
  //   const option = {
  //     root: null,
  //     rootMargin: '20px',
  //     threshold: 1.0,
  // };

  //   const observer = new IntersectionObserver(handleObserver, option);
  //   if (postLoaderRef.current) observer.observe(postLoaderRef.current);

  //   return () => observer.disconnect();
  // }, [handleObserver]);
  
  useEffect(() => {
  if (activeTab !== 'post') return;

  const option = {
    root: null,
    rootMargin: '20px',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(handleObserver, option);
  if (postLoaderRef.current) observer.observe(postLoaderRef.current);

  return () => observer.disconnect();
}, [handleObserver, activeTab]);


  useEffect(() => {
  fetchedUrls.current = new Set(); // ✅ clear cache on new profile
}, [username]);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
      </div>
    )
  }
  return (
    <Container className='mx-auto p-4 max-w-3xl mt-5' >
      {/* Header */}
      <Row className='justify-content-center'>
        <Col className='col-md-3 col-lg-4'  style={{minWidth:'120px'}}>
          <ProfileHeader
            profileuser={profileinfo}
            ismyprofile={isMyprofile} />
        </Col>

        <Col className='col-md-4 col-lg-2 d-flex flex-column justify-content-center mb-3' style={{minWidth:'120px',marginLeft:'0px'}} >
          <FollowButton
            username={profileinfo?.username}
          />
        </Col>
      </Row>

      {/* Stats */}
      <Row className='justify-content-center'>
        <Col className='col-md-8 col-lg-6' style={{minWidth:'340px'}}>
          <ProfileStats details={profileinfo} />
        </Col>
      </Row>

      {/* Bio */}
      <Row className='justify-content-center'>
        <Col className='col-md-8 col-lg-6' style={{minWidth:'340px'}}>
          <ProfileBio
            profileinfo={profileinfo} />
        </Col>
      </Row>

      {/* Tab */}

      <Row className='justify-content-center'>
        <Col className='col-md-8 col-lg-6' style={{minWidth:'340px'}} >

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)} // Track active tab
            defaultActiveKey='post'
            className='mb-3'
            fill>

            <Tab eventKey='post' title={<span>Post <i className='fa-solid fa-image-portrait'></i></span>} >
              {
                Postloading ?
                  (
                    <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
                      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
                    </div>
                  ) :

                  posts?.length > 0 ? (
                    <>
                      <PostTab userposts={UserPosts.filter(post => post.media_type === 'image')} profileuser={profileinfo} onDelete={handledeletedpost} profileinfo={profileinfo} />
                      
                      {next && (
                        <div ref={postLoaderRef} className="text-center my-3 text-muted">
                          <small>Loading more posts...</small>
                        </div>
                      )}
                    </>

                  ) : (
                    <p className='text-center'>No posts found....</p>
                  )
              }
            </Tab>

            <Tab eventKey='video' title={<span>Video <i className='fa-solid fa-video'></i></span>}>
              {
                Postloading ?
                  (
                    <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
                      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
                    </div>
                  ) :
                  posts?.length > 0 ? (
                    <>
                      <VideoTab profileuser={profileinfo} userposts={UserPosts.filter(post => post.media_type === 'video')} onDelete={handledeletedpost} profileinfo={profileinfo} />

                      {next && (
                        <div ref={loader} className="text-center my-3 text-muted">
                          <small>Loading more posts...</small>
                        </div>
                      )}
                    </>

                  ) : (
                    <p className='text-center'>No posts found....</p>
                  )
              }

            </Tab>

          </Tabs>

        </Col>
      </Row>
    </Container>
  )
}

export default ProfileScreen