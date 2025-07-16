import React,{useEffect, useState,useRef} from 'react'
import { Offcanvas,Card,Image, Form, Button } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { FriendsAction } from '../Actions/FollowActions'
import { use } from 'react'
// share post action
import { SharepostAction } from '../Actions/SharepostActions'
import Lottie from 'lottie-react'
import FormLoader from '../assets/animations/formloader.json'

const ShareSection = ({handleClose,show,post}) => {
  console.log("Seleted_post:",post)
  const dispatch=useDispatch()
  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
  const access_token = userinfo?.access
  const {friends,loading,error} = useSelector((state)=>state.Friendslist)
  console.log("Friends_list:",friends)

  useEffect(()=>{
      dispatch(FriendsAction(access_token))
  },[access_token])

  // share handler
  const [selectedids,Setselectedids] = useState([])
  const [send,Setsend] = useState(false)

  const handleselecteduser = (e)=>{
    const id = parseInt(e.target.value)
    console.log("ID:",id)
    Setselectedids((prev)=>e.target.checked?[...prev,id]:prev.filter((uid)=>uid!==id))
  }
  
  useEffect(()=>{
    if(selectedids.length>0){
      Setsend(true)
    }else{
      Setsend(false)
    }
  },[selectedids])
  
  
  const [sharemsg,Setsharemsg]= useState('')

  console.log("Selected_id:",selectedids)

  const socketRef = useRef(null)
  const handleshare = ()=>{
    console.log("Share tringerr.....")
    dispatch(SharepostAction(access_token, post, selectedids, sharemsg, socketRef, userinfo))
    console.log("Selected_id:",selectedids)
    Setsharemsg('')
    Setselectedids([])
    handleClose();
  }
  const postshare = useSelector((state)=>state.Sharepost?.payload?.details)
  console.log("Postshare:",postshare)

  return (
    <Offcanvas placement='end' show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Share</Offcanvas.Title>
      </Offcanvas.Header>
        
        <Offcanvas.Body>
          {
            loading?(
              <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
              </div>
            ):
            friends_list.length>0?(
              friends_list.map((user,index)=>(
                
                <div key={user.id}>
                    <Card className='mb-3' style={{width:'19rem'}}>
                    <Card.Body className='p-2 d-flex align-items-center justify-content-between px-3'>
                        <div className="d-flex align-items-center gap-3">
                                <Image
                                src={`${user.image}`}
                                className='rounded-circle'
                                height='40'
                                width='40'
                                alt='image'/>
                            <span className='fw-bold'>{user.username}</span>
                            
                        </div>
                        <Form.Check onClick={handleselecteduser} value={user.user} checked={selectedids.includes(user.user)}/>
                    </Card.Body>
                  </Card>
                </div>
                  
              ))
              
            ):(
              <p>No frineds...</p>
            )
          }


                <Form>
                  <Form.Control as='textarea'  placeholder='message...' value={sharemsg} onChange={(e)=>Setsharemsg(e.target.value)} className='mb-3'/>
                  <div className='justify-content-end d-flex'>
                      <Button variant='warning'  type='submit' disabled={!send} onClick={handleshare}>Send</Button>
                  </div>
                </Form>
          
          
        </Offcanvas.Body>
    </Offcanvas>
    
  )
}

export default ShareSection