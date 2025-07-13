import {SIGNUP_REQUEST,SIGNUP_SUCCESS,SIGNUP_FAIL} from '../Constants/signupConstants'
import api from '../Api/api'

export const SignupAction = (email,username,password)=>async (dispatch)=>{
    try{
        dispatch({
            type:SIGNUP_REQUEST
        })

        const {data} = await api.post(`user/signup/`,
            {
                'email':email,
                'username':username,
                'password':password
            },
            {
                'headers':{
                    "Content-Type":'application/json'
                }
            }
        )

        dispatch({
            type:SIGNUP_SUCCESS,
            payload:data
        }
        )
    }
    catch(error){
        dispatch({
            type:SIGNUP_FAIL,
            error:error.response?.data?.details || 'User already exists...'
        })
    }
}