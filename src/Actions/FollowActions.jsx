import api from '../Api/api'
import { FOLLOW_REQUEST,FOLLOW_SUCCESS,FOLLOW_FAIL,UNFOLLOW_REQUEST,UNFOLLOW_SUCCESS,UNFOLLOW_FAIL,
        FOLLOW_STATUS_REQUEST,FOLLOW_STATUS_SUCCESS,FOLLOW_STATUS_FAIL,
        FOLLOWERS_REQUEST,FOLLOWERS_SUCCESS,FOLLOWERS_FAIL,
        FRIENDS_REQUEST,FRIENDS_SUCCESS,FRIENDS_FAIL
 } from '../Constants/FollowConstants'



//FollowAction

export const FollowAction = (access_token,username)=>async (dispatch)=>{
    try{
        dispatch({
            type:FOLLOW_REQUEST
        })

        console.log("Following_name:",username)

        const {data}= await api.post(`user/follow/`,
            {
                'follow':username
            },
            {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            }
        )

        dispatch({
            type:FOLLOW_SUCCESS,
            payload:data
        })

    }catch(error){
        dispatch({
            type:FOLLOW_FAIL,
            error:error.response?.data?.details || "Can't follow the user..."
        })
    }
}

// UnfollowAction

export const UnfollowAction = (access_token,username)=> async(dispatch)=>{
    try{
        dispatch({
            type:UNFOLLOW_REQUEST
        })

        const config = {
            params:{
                    'unfollow':username
            },
            headers:{
                Authorization:`Bearer ${access_token}`
            }

        }

        const {data} = await api.delete(`user/unfollow/`,config)

        dispatch({
            type:UNFOLLOW_SUCCESS,
            payload:data
        })
    }
    catch(error){
        dispatch({
            type:UNFOLLOW_FAIL,
            error:error.response?.data?.details || 'Unable to unfollow...'
        })
    }
}

// FolloStatus Action
export const FollowStatusAction = (access_token,username)=> async (dispatch)=>{
    try{
        dispatch({
            type: FOLLOW_STATUS_REQUEST
        })

       console.log("Fetching Follo Status....")
       console.log("Username:",username)
       const config = {
        params:{
            'username':username
        },
        headers:{
                Authorization:`Bearer ${access_token}`
        }
       }

        const {data} = await api.get(`user/follow/status/`,config)

        console.log("Follostatus_actions:",data)

        dispatch({
            type: FOLLOW_STATUS_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:FOLLOW_STATUS_FAIL,
            error:error.response?.data?.details || 'Unable to fetch details...'
        })
    }
}


// Followers Action

export const FollowersAction = (access_token)=> async (dispatch)=>{
    try{
        dispatch({
            type: FOLLOWERS_REQUEST
        })

        const config = {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }

        const {data} = await api.get(`user/followers/`,config)

        dispatch({
            type:FOLLOWERS_SUCCESS,
            payload:data
        })

    }catch(error){
        dispatch({
            type:FOLLOWERS_FAIL,
            error:error.response?.data?.details || 'Unable tofetch followers...'
        })
    }
}

//  Friends Action

export const FriendsAction = (access_token)=>async(dispatch)=>{
    try{
        dispatch({
            type:FRIENDS_REQUEST
        })

        const {data} = await api.get(`user/friends/`,
            {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            }
        )
        dispatch({
            type:FRIENDS_SUCCESS,
            payload:data
        })

        // console.log("Friend_Action:",data)
    }catch(error){
        dispatch({
            type:FRIENDS_SUCCESS,
            error:error.response?.data?.details || 'Unable to fetch friends list'
        })
    }
}