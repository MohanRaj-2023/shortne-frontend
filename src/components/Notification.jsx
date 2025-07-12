import React,{useEffect, useState,useRef} from 'react'
import { Row,Col,Offcanvas,Card } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { NotificationDeleteAction,NotificationAction } from '../Actions/NotificationActions'
import { Navigate, useNavigate } from 'react-router-dom'
import { MarkreadAction } from '../Actions/NotificationActions'
// Notification socket
import useNotificationsocket from '../utils/useNotificationsocket'
import Lottie from 'lottie-react'
import FormLoader from '../assets/animations/formloader.json'


const Notification = ({show,handleClose}) => {
  // console.log("Notification_Screen:",notifications)

  const userinfo = useSelector((state)=>state.UserSigninReducer?.userinfo)

  const dispatch = useDispatch()
  // const [Isnot,Setisnot] = useState(false)
  // const id = notifications?.id
  const access_token = userinfo?.access
  
  // realtime notification update
  useNotificationsocket(access_token)

  const {loading,error,notifications}  =  useSelector((state)=>state.Notifications) 

  console.log("Notifications:",notifications)

  useEffect(()=>{
    if(show){
      dispatch(NotificationAction(access_token))
      // Setlocalnotification(notifications)
      }
    },[access_token,show,dispatch])


  const deletehandler = (id)=>{
    dispatch(NotificationDeleteAction(id,access_token)).then(()=>{
      dispatch(NotificationAction(access_token))
    })
    console.log('deleted.......!!!!')
  }

  const gettimeage = (time)=>{
      console.log("TIme:",time)
      
      const now = new Date();
      console.log("Current_time:",now)
      // Remove microseconds if needed
      const cleanTime = time.split('.')[0] + 'Z'; // removes microseconds, keeps the 'Z'
      const date = new Date(cleanTime);
      const diff = Math.floor((now-date)/1000) //in seconds

      if (diff < 60 ) return `${diff}sec age`;
      if (diff <3600) return `${Math.floor(diff/60)}min ago`
      if (diff <86400) return `${Math.floor(diff/3600)}hr ago`
      if (diff <604800)  {
          const days = Math.floor(diff / 86400);
          return `${days} day${days > 1 ? 's' : ''} ago`;
        }
      return date.toLocaleDateString();
  }

  const [shownot,Setshownot] = useState(null)
  const navigate = useNavigate()

  const handleshownot=(not)=>{
      console.log("Clicked_Notification:",not)
     // Setshownot((prev)=>(prev === id ? null : id))

      if(not.notification_type==='follow'){
        dispatch(MarkreadAction(access_token,not.id))
         handleClose()  // ✅ close the notification panel
        navigate(`/profile/${not.from_user_username}`)
        
      }
      else if(not.notification_type === "new_post" && not.post_id){
        dispatch(MarkreadAction(access_token,not.id))
        handleClose()  // ✅ close the notification panel
        navigate(`/poast/${not.post_id}`)
      }
  }


  return(
    <Offcanvas show={show} onHide={handleClose} placement='end' >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notification</Offcanvas.Title>
      </Offcanvas.Header>

          <Offcanvas.Body>
          {
        notifications?.length>0 && (
          notifications.map((not,index)=>(
                <div key={not.id} >
                  <Card className='mb-3' style={{cursor:'pointer'}}>
                    <Card.Body  className='d-flex justify-content-between'>
                      <div>
                        <div onClick={()=>handleshownot(not)}>{shownot == not.id ?not.message: `${not.message.substring(0,25)}.`}</div>
                        <div className='text-muted'  style={{ fontSize: '0.8rem' }}>
                          {gettimeage(not.created_at)}
                        </div>
                      </div>
                    <i className='fa-solid fa-trash' onClick={()=>deletehandler(not.id)} style={{cursor:'pointer'}} ></i>
                    </Card.Body>
                  </Card>
                </div>
          ))
        )
      }

      {
        loading && (
          <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
          </div>
        )
      }
         </Offcanvas.Body>
        
      
    </Offcanvas>
    
  )
}

export default Notification