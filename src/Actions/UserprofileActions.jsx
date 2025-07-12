import api from "../Api/api";
import {PROFILE_INFO_REQUEST,PROFILE_INFO_SUCCESS,PROFILE_INFO_FAIL,
        PROFILE_EDIT_REQUEST,PROFILE_EDIT_SUCCESS,PROFILE_EDIT_FAIL
} from '../Constants/UserprofileConstants'

export const ProfileAction = (access_token,username)=> async(dispatch,getState)=>{
      const existing = getState().Profileinfo?.profileinfo;
      console.log("Userprofile action username:",username)
        // Prevent re-dispatching if same profile already fetched
     if (existing?.username === username) return;

    try{
        dispatch({
            type:PROFILE_INFO_REQUEST
        })

        const config={
            params:{
                'username':username
            },
            'headers':{
                Authorization:`Bearer ${access_token}`
            }
        }
        console.log("Fetching....")

        const {data} = await api.get(`user/user-profile/`,
            
            config)

        // console.log("USERPROFILE_Action:",data)

        dispatch({
            type:PROFILE_INFO_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:PROFILE_INFO_FAIL,
            error: error.response?.data?.details || "User not exist....."
        })
    }
}

// profile edit action
export const ProfileEditAction = (access_token,formData)=> async(dispatch)=>{
    try{
        dispatch({
            type:PROFILE_EDIT_REQUEST
        })

        // console.log("updating...........")
        
        const {data} = await api.patch(`user/user-profile/edit/`,formData,
            {
                'headers':{
                    'Authorization':`Bearer ${access_token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        )

        // console.log("EDITPROFILE_Action:",data.profileinfo)

        dispatch({
            type:PROFILE_EDIT_SUCCESS,
            payload:data.profileinfo
        })
    }catch(error){
        dispatch({
            type:PROFILE_EDIT_FAIL,
            error: error.response?.data?.details || "User not exist....."
        })
    }
}