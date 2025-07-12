import api from "../Api/api";
import {NEWPASSWORDREQUEST,NEWPASSWORDSUCCESS,NEWPASSWORDFAIL} from '../Constants/NewpasswordConstants'


export const NewpasswordAction = (uid,token,new_password)=>async(dispatch)=>{
    try{
        dispatch({
            type:NEWPASSWORDREQUEST
        })

        const {data} = await api.post(`user/accounts/password/reset/confirm/`,
            {
                'user_id':uid,
                'token':token,
                'new_password':new_password
            },
            {
                'headers':{
                    'Content-Type':'application/json'
                }
            }
        )

        dispatch({
            type:NEWPASSWORDSUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:NEWPASSWORDFAIL,
            error: error.response?.data?.details || 'Password reset failed'
        })
    }
}