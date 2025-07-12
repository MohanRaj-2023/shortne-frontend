import api from "../Api/api";
import {SIGNOUT_REQUEST,SIGNOUT_SUCCESS,SIGNOUT_FAIL} from '../Constants/signoutConstants'
import { USER_SIGNIN_SUCCESS } from "../Constants/signinConstants";

export const SignoutAction = (refresh_token,access_token)=> async(dispatch)=>{
    try{
        dispatch({
            type:SIGNOUT_REQUEST
        })

        const {data} = await api.post(`user/signout/`,
            {
                'refresh':refresh_token
            },
            {
                'headers':{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
        console.log("Signout_Action:",data)

        // Clear from localStorage
        localStorage.removeItem('userinfo')

        // Reset Redux userinfo
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: null })

        dispatch({
            type:SIGNOUT_SUCCESS,
            payload:data
        })

    }catch(error){
        dispatch({
            type:SIGNOUT_FAIL,
            error:error.request?.data?.details || "Can't logout..."
        })
    }
}