import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Image, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Interactionbar from './Interactionbar'
// Useref for video play
import { useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { ReactionAction } from '../Actions/ReactionActions'
import Lottie from 'lottie-react';
import VideoLoader from '../assets/animations/videoanimat.json'

const PostComponent = ({ Post, onInteraction }) => {
    const dispatch = useDispatch()

    // Videoref
    const Videoref = useRef(null)
    const user = useSelector((state) => state.UserSigninReducer?.userinfo)
    const access_token = user?.access

    const [like_count, setLikeCount] = useState(Post?.like_count || 0);
    const [dislike_count, setDislikeCount] = useState(Post?.dislike_count || 0);
    const [reactstate, setReactstate] = useState(Post?.is_like); // true, false or null

    const handleLike = (id) => {
        const currentState = reactstate;

        if (currentState === true) {
            // Remove like
            setLikeCount(prev => prev - 1);
            setReactstate(null);
        } else if (currentState === false) {
            // Dislike → Like
            setLikeCount(prev => prev + 1);
            setDislikeCount(prev => prev - 1);
            setReactstate(true);
        } else {
            // Neutral → Like
            setLikeCount(prev => prev + 1);
            setReactstate(true);
        }

        dispatch(ReactionAction(access_token, id, true));
    };

    const handleDislike = (id) => {
        const currentState = reactstate;

        if (currentState === false) {
            // Remove dislike
            setDislikeCount(prev => prev - 1);
            setReactstate(null);
        } else if (currentState === true) {
            // Like → Dislike
            setDislikeCount(prev => prev + 1);
            setLikeCount(prev => prev - 1);
            setReactstate(false);
        } else {
            // Neutral → Dislike
            setDislikeCount(prev => prev + 1);
            setReactstate(false);
        }

        dispatch(ReactionAction(access_token, id, false));
    };

    const handleShare = () => onInteraction('share', Post)
    const handleCommant = () => onInteraction('commant', Post)
    const handleDescription = () => onInteraction('description', Post)

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoaded(true);
        }, 8000); // 8 seconds fallback

        return () => clearTimeout(timeout);
    }, []);


    if (!Post || typeof Post !== 'object') {
        console.error('Invalid Post:////////////////////////////', Post);
        return null
    }



    if (!Post) return <div>Loading...</div>

    return (
        <Card className='shadow-sm  mb-3' style={{ width: '100%', overflow: 'hidden', borderRadius: '16px', minWidth: '250px' }} >
            <Card.Header>
                <Image
                    src={`${Post.profileimage.image}`}
                    className='rounded-circle'
                    width='40'
                    height='40'
                    fluid
                />

                {/* Navigate to user profile */}
                <Link to={`/profile/${Post.username}`} style={{ textDecoration: 'none', marginLeft: '10px', color: 'black', fontFamily: 'Inter' }}>{Post.username} </Link>

            </Card.Header>
            <Card.Body className='position-relative p-0'>
                {
                    !loaded && (
                        <div className='d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-white'
                            style={{ zIndex: 1 }}>
                            <Lottie animationData={VideoLoader} loop={true} style={{ width: '50px' }} />
                        </div>
                    )
                }
                <div>
                    {Post.media_type == 'image' ? (
                        <div className='h-100'>
                            <Card.Img
                                src={`${Post.media}`}
                                onLoad={() => setLoaded(true)}
                                alt='post-img'
                                // className={`w-100 h-100 ${loaded ? '' : 'd-none'}`}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    maxHeight: '100%',
                                }}
                            />

                        </div>

                    ) : (
                        <div className='ratio ratio-16x9 w-100'>

                            <video
                                ref={Videoref}
                                src={`${Post.media}`}
                                loop
                                playsInline
                                controls
                                className={`w-100 h-100 object-fit-cover ${loaded ? '' : 'd-none'}`}
                                style={{
                                    borderRadius: '10px',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                }}
                                onPlay={() => {
                                    const video = Videoref.current;

                                    // Pause previously playing video
                                    if (
                                        window.currentPlayingVideo &&
                                        window.currentPlayingVideo !== video
                                    ) {
                                        window.currentPlayingVideo.pause();
                                    }

                                    // Set the currently playing video
                                    window.currentPlayingVideo = video;
                                }}
                                onPause={() => {
                                    const video = Videoref.current;
                                    if (window.currentPlayingVideo === video) {
                                        window.currentPlayingVideo = null;
                                    }
                                }}
                                onLoadStart={() => setLoaded(false)}
                                onLoadedData={() => setLoaded(true)}
                            />


                        </div>


                    )}
                </div>


            </Card.Body>
            <Card.Footer>
                <Interactionbar onLike={() => handleLike(Post.id)} liked={reactstate} onDislike={() => handleDislike(Post.id)} onShare={handleShare} onCommant={handleCommant} onDescription={handleDescription} like_count={like_count} dislike_count={dislike_count} />
            </Card.Footer>
        </Card>

    )
}

export default PostComponent