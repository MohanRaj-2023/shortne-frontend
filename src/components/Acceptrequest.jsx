import React, { useEffect,useState } from 'react'
import { Button } from 'react-bootstrap'
import { FollowAction,UnfollowAction } from '../Actions/FollowActions'
import { useDispatch,useSelector } from 'react-redux'
import { Link} from 'react-router-dom' 

const Acceptrequest = ({username}) => {
    const dispatch = useDispatch()
    const [follow,Setfollow] = useState(false)
    const {error,loading,payload} = useSelector((state)=>state.Follow)

    const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo);
    const access_token = userinfo?.access
    
    console.log("Followback:",payload)

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
            !follow?(
                    <Button size='sm' onClick={Followhandler}>Follow Back</Button>
            ):(
                <Button size='sm' onClick={UnFollowhandler} variant='secondary'>Following</Button>
            )
        }
        
    </div>
  )
}

export default Acceptrequest