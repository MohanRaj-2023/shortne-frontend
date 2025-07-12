import React, { useEffect,useState } from 'react'
import { Button } from 'react-bootstrap'
import { FollowAction } from '../Actions/FollowActions'
import { UnfollowAction } from '../Actions/FollowActions'
import { FollowStatusAction } from '../Actions/FollowActions'
import { useDispatch,useSelector } from 'react-redux'
import { Link} from 'react-router-dom' 
import { ProfileAction } from '../Actions/UserprofileActions'

const FollowButton = ({username}) => {
  const dispatch = useDispatch()
  const Follow = useSelector((state)=>state.Follow?.payload)

  const userinfo = useSelector((state)=>state.UserSigninReducer?.userinfo)
  const access_token = userinfo.access

  useEffect(()=>{
    dispatch(ProfileAction(access_token,username))
  },[access_token,dispatch])

  const Profileinfo = useSelector((state)=>state.Profileinfo)
  // console.log("Profileinfo:",Profileinfo?.profileinfo)
  const profileinfo=Profileinfo?.profileinfo

  const ismyprofile=userinfo?.username=== profileinfo?.username
  // console.log("IS_myprofile:",ismyprofile)

  
  const Isfollowing = useSelector((state)=>state.FollowStatus?.followstatus)

  const [follow,Setfollow] = useState(false)
  useEffect(()=>{
    if(typeof Isfollowing?.details === 'boolean'){
      Setfollow(Isfollowing.details)
    }
  },[Isfollowing])

  useEffect(()=>{
    if(!Isfollowing ||  userinfo?.username!==username){
      dispatch(FollowStatusAction(access_token,username))
      // Setfollow(Isfollowing?.details)
    }
  },[dispatch,access_token,username])

  // console.log("UserName:",username)

  const Followhandler = ()=>{
      dispatch(FollowAction(access_token,username))
      Setfollow(true)
  }

  const UnFollowhandler = ()=>{
    dispatch(UnfollowAction(access_token,username))
    Setfollow(false)
  }

  return (
    <div className='text-center d-flex justify-content-end'>
        {
        ismyprofile?(
          
            <Link to={`/profile/edit/`} className='btn btn-sm btn-dark' variant='dark' size='sm'>Edit <span><i className='fa-solid fa-user-pen'></i></span> </Link>
        ):follow?(
          <Button size='sm' onClick={UnFollowhandler} variant='secondary'>Following</Button>
        ):(
          <Button size='sm' onClick={Followhandler}>Follow</Button>
        )
      }
    </div>
    
  )
}
export default FollowButton