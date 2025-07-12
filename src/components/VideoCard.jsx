import React, { useState, useRef } from 'react'
import { Card, Col, Dropdown, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import VideoLoader from '../assets/animations/videoanimat.json'

const VideoCard = ({ post, onEdit, onDelete, selectedPost, setSelectedPost, profileinfo }) => {
    const [loaded, setLoaded] = useState(false);
    const dropdownRef = useRef(null);
    const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo);
    // console.log("Logedinuser:",isLogedin?.access)

    const isMyprofile = userinfo?.username === profileinfo?.username

    return (

        <Col sm={6} xs={12} className='d-flex justify-content-center'>
            <Card style={{ width: '200px', height: '300px', overflow: 'visible', position: 'relative' }} className='mb-3'>
                {isMyprofile && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1000 }}>
                        <div
                            onClick={() => setSelectedPost(prev => (prev === post.id ? null : post.id))}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '50%',
                                padding: '4px 6px',
                                cursor: 'pointer',
                                display: 'inline-block'
                            }}
                        >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>

                        {selectedPost === post.id && (
                            <Dropdown.Menu show align="end" style={{ position: 'absolute', top: '30px', right: '0px' }}>
                                <Dropdown.Item onClick={() => { onEdit(post); setSelectedPost(null); }}>
                                    <i className="fa-solid fa-pen-to-square me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => { onDelete(post); setSelectedPost(null); }}>
                                    <i className="fa-solid fa-trash me-2 text-danger"></i>Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        )}
                    </div>
                )}
                <Card.Body as={Link} to={`/poast/${post.id}`} className='p-0 h-100'>
                    {!loaded && (
                        <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                            <Lottie animationData={VideoLoader} loop={true} style={{width:'50px'}} />
                        </div>
                    )}
                    <video
                        src={post.media}
                        onLoadedData={() => setLoaded(true)}
                        className={`w-100 h-100 object-fit-cover ${loaded ? '' : 'd-none'}`}
                        muted
                        loop
                        playsInline
                        style={{ borderRadius: '10px' }}
                    />
                </Card.Body>
            </Card>
        </Col>
    )
}

export default VideoCard