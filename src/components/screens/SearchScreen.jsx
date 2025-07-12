import React, { useState, useEffect } from 'react'
import { SearchAction } from '../../Actions/PostActions'
import { useDispatch, useSelector } from 'react-redux'
import PostComponent from '../PostComponent'
import { useLocation } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import ProfileHeader from '../ProfileHeader'
import FollowButton from '../FollowButton'
import ProfileStats from '../ProfileStats'
import CommantSection from '../CommentSection'
import ShareSection from '../ShareSection'
import Description from '../Description'
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/animations/loading.json"

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchScreen = () => {
    const query = useQuery().get('query')
    const [results, setResults] = useState({ users: [], posts: [] })
    const dispatch = useDispatch()
    const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
    const access_token = userinfo?.access

    useEffect(() => {
        dispatch(SearchAction(access_token, query))
    }, [access_token, query])

    const { searchresult, loading } = useSelector((state) => state.Search)
    useEffect(() => {
        if (searchresult) {
            setResults(searchresult);
        }
    }, [searchresult]);
    console.log("Search_Result:====", results)


    //Handle interaction

    // Show description
    const [showdescription, Setshowdescription] = useState(false)
    // selected post
    const [selectedpost, Setselectedpost] = useState(null)
    const [showcommant, Setshowcommant] = useState(false)
    const [share, Setshare] = useState(false)

    const HandleInteraction = (type, post) => {
        if (type == 'share') {
            Setselectedpost(post)
            Setshare((prev) => !prev)
        }
        if (type == 'commant') {
            Setselectedpost(post)
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
        <Container className='mt-md-5 mt-5' style={{ maxWidth: '600px' }}>
            <b>Search Result for "{query}":</b>
            <Row className='w-100 mt-3'>
                <h5>Users:</h5>
                    {
                        results.users.length > 0 ? (
                            results.users.map(
                                (user) => (<Col
                                    key={user.id}
                                    className="w-100 mb-3 shadow-sm col-md-8 col-lg-6 p-3 rounded"
                                    style={{minWidth:'320px', border:'solid 1px gray'}}
                                >
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 gap-3">
                                            {/* Profile Info */}
                                            <div className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start w-100">

                                                <ProfileHeader profileuser={user} />
                                                {/* Stats */}
                                                <div className="mt-2 w-100">
                                                    <ProfileStats details={user} />
                                                </div>
                                            </div>

                                            
                                        <div className="mt-3 mt-md-0 ms-md-auto text-md-end col-md-2" style={{ paddingRight: '10px' }}>
                                            <FollowButton username={user.username} />
                                        </div>

                                        </div>

                                </Col>
                                )
                            )
                        ) : (
                            <p className='text-center'>No userprofile found....</p>
                        )
                    }
              
            </Row>
            <Row className='mt-4'>
                <h5>Posts:</h5>
                
                    {
                        results.posts.length > 0 ? (
                            results.posts.map(
                                (post) =>
                                    <Col>

                                        <PostComponent key={post.id} Post={post} onInteraction={HandleInteraction} />
                                        {showdescription && (
                                            <Description post={post} show={showdescription} handleClose={() => Setshowdescription((prev) => !prev)} />
                                        )}

                                        {showcommant ? (
                                            <CommantSection post={selectedpost} show={showcommant} handleClose={() => Setshowcommant((prev) => !prev)} />
                                        ) : share ? (
                                            <ShareSection show={share} handleClose={() => Setshare((prev) => !prev)} post_id={selectedpost.id} />
                                        ) : ''}
                                    </Col>


                            )
                        ) : (
                            <p className='text-center'>No post found....</p>
                        )
                    }
                
            </Row>


        </Container>
    )
}

export default SearchScreen