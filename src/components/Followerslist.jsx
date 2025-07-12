import React,{useEffect} from 'react'
import { Offcanvas,Card,Image, Button} from 'react-bootstrap'
import { useSelector,useDispatch } from 'react-redux'
import {FollowersAction} from '../Actions/FollowActions'
import FollowButton from './FollowButton'
import Acceptrequest from './Acceptrequest'
import Lottie from 'lottie-react'
import FormLoader from '../assets/animations/formloader.json'

const Followerslist = ({show,handleClose}) => {

    const dispatch= useDispatch()

    const userinfo = useSelector((state)=>state.UserSigninReducer?.userinfo)
    const access_token = userinfo?.access

    const {loading,error,newfollowers} = useSelector((state)=>state.Followers)
    console.log("Followers:",newfollowers)

    useEffect(()=>{
        dispatch(FollowersAction(access_token))
    },[access_token,dispatch])
    
  return (
    <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Follow Request</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
            {newfollowers && newfollowers.length>0? (
                newfollowers.map((user,index)=>(
                    <div key={user.id}>
                        <Card className='mb-3'>
                    <Card.Body className='d-flex align-items-center justify-content-between px-3 p-2'>
                        <div className="d-flex align-items-center gap-3">
                                <Image
                         src={`http://127.0.0.1:8000${user.image}`}
                         className='rounded-circle'
                         height='40'
                         width='40'/>
                            <span className='fw-bold'>{user.username}</span>
                        </div>

                        <Acceptrequest username={user.username}/>
                        
                    </Card.Body>
                    </Card>
                    </div>
                    
                ))
                
            ):loading ?
                (<div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                </div>):
            (
                <p className='text-center'>No new follow request.</p>
            )}


            
        </Offcanvas.Body>
    </Offcanvas>
    
  )
}

export default Followerslist