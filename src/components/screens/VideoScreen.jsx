import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Row, Col, Container, Spinner } from 'react-bootstrap'
import PostComponent from '../PostComponent'
import { VideoPostAction } from '../../Actions/PostActions'
import { useDispatch, useSelector } from 'react-redux'
import CommantSection from '../CommentSection'
import ShareSection from '../ShareSection'
import Description from '../Description'
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/animations/loading.json"

const VideoScreen = () => {
    const dispatch = useDispatch()
    const { video_posts, next, loading } = useSelector((state) => state.VideoPosts)
    console.log("Video_posts:", video_posts)

    const user = useSelector((state) => state.UserSigninReducer?.userinfo)
    const access_token = user?.access

    useEffect(() => {
        if (access_token && Array.isArray(video_posts) && video_posts.length === 0) {
            dispatch(VideoPostAction(access_token))
        }
    }, [dispatch, access_token, video_posts?.length])



    const loader = useRef(null);

    // ✅ Intersection Observer Callback
    const handleObserver = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting && next && !loading) {
                dispatch(VideoPostAction(access_token, next)); // Fetch next page
            }
        },
        [next, dispatch, access_token, loading]
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


    // Show description
    const [showdescription, Setshowdescription] = useState(false)
    // commant
    const [showcommant, Setshowcommant] = useState(false)
    // share
    const [share, Setshare] = useState(false)
    // selected post
    const [selectedpost, Setselectedpost] = useState(null)

    //Handle interaction
    const HandleInteraction = (type, Post) => {
        if (type == 'share') {
            Setselectedpost(Post)
            Setshare((prev) => !prev)
        }
        if (type == 'commant') {
            Setselectedpost(Post)
            Setshowcommant((prev) => !prev)
        }
        if (type == 'description') {
            Setselectedpost(Post)
            Setshowdescription((prev) => !prev)
        }
    }



    if (loading && video_posts.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "60px" }}>
                <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150 }} />
            </div>
        )
    }
    return (
        <Container className="d-flex justify-content-center align-items-center mt-5 mb-3">
            <div className="d-flex flex-column align-items-center" style={{ maxWidth: '600px', width: '100%' }} >
                {video_posts?.length > 0 && (
                    video_posts.map((post, index) => (
                        <div className="w-100 mb-2" key={post.id}>
                            <PostComponent Post={post} onInteraction={HandleInteraction} />

                            {showdescription && selectedpost.id === post.id && (
                                <Description post={post} show={showdescription} handleClose={() => Setshowdescription((prev) => !prev)} />
                            )}
                        </div>
                    ))
                )}

                {showcommant ? (
                    <CommantSection post={selectedpost} show={showcommant} handleClose={() => Setshowcommant((prev) => !prev)} />
                ) : share ? (
                    <ShareSection show={share} handleClose={() => Setshare((prev) => !prev)} post_id={selectedpost.id} />
                ) : ''}

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

export default VideoScreen