import React, { useEffect, useState } from 'react'
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Interactionbar from '../Interactionbar'
import CommantSection from '../CommentSection'
import ShareSection from '../ShareSection'
import { PostAction } from '../../Actions/PostActions'
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/animations/loading.json"

// post component
import PostComponent from '../PostComponent'
import Description from '../Description'

const PoastScreen = () => {

    const { post_id } = useParams()
    const dispatch = useDispatch()
    const Post = useSelector((state) => state.Post)
    const { error, loading, post } = Post
    console.log("Postscreen-------:",post)
    const [showcommant, Setshowcommant] = useState(false)
    const [share, Setshare] = useState(false)
    

    // To get access token
    const isLogedin = useSelector((state) => state.UserSigninReducer?.userinfo);

    useEffect(() => {
        const access_token = isLogedin.access
        dispatch(PostAction(access_token, post_id))
    }, [post_id])



    // Show description
    const [showdescription, Setshowdescription] = useState(false)
    // selected post
    const [selectedpost,Setselectedpost] = useState(null)

    //Handle interaction
    const HandleInteraction = (type, post) => {
        if (type == 'share') {
            Setselectedpost(post)
            Setshare((prev) => !prev)
        }
        if (type == 'commant') {
            Setselectedpost(post)
            Setshowcommant((prev) => !prev)
        }
        if(type == 'description'){
            Setselectedpost(post)
            Setshowdescription((prev)=>!prev)
        }
    }

    if (!post) {
       return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
      </div>
      )
    }
    return (
        <Container className='mt-5'>
            <Row className='justify-content-center'>
                <Col className='d-flex justify-content-center' xs={12}
                md={7}>
                    {/* Post component */}
                    <PostComponent Post={post} onInteraction={HandleInteraction} />

                        {showdescription && (
                            <Description post={post} show={showdescription} handleClose={()=>Setshowdescription((prev)=>!prev)} />   
                        )}
                    
                    {showcommant ? (
                            <CommantSection post={selectedpost} show={showcommant} handleClose={() => Setshowcommant((prev) => !prev)} />
                        ) : share ? (
                            <ShareSection show={share} handleClose={() => Setshare((prev) => !prev)} post_id={selectedpost.id}/>
                    ) : ''}

                </Col>


            </Row>




        </Container>
    )
}

export default PoastScreen