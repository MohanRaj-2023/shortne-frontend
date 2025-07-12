import api from '../Api/api'
import { USER_SIGNIN_REQUEST,USER_SIGNIN_SUCCESS,USER_SIGNIN_FAIL,SIGN_OUT_SUCCESS } from '../Constants/signinConstants'


export const UserSigninAction = (email,password)=>async (dispatch)=>{
    try{
       dispatch(
        {
            type:USER_SIGNIN_REQUEST
        }
       )
       

       const {data} = await api.post(`user/signin/`,
        {
            'email':email,
            'password':password
        },
        {
            'headers':{
                'Content-Type':'application/json'
            }
        }
       )

       dispatch({
        type:USER_SIGNIN_SUCCESS,
        payload:data
       })

       localStorage.setItem('userinfo',JSON.stringify(data))

    }catch(error){
        dispatch({
            type:USER_SIGNIN_FAIL,
            payload: error.response?.data?.Error ||'Invalid credentials'
        })
    }
}

// export const Signout = ()=>(dispatch)=>{
//         localStorage.removeItem('userinfo')
//         dispatch({
//             type: SIGN_OUT_SUCCESS
//         })
// }