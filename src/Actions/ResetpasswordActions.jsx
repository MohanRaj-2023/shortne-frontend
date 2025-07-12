import api from '../Api/api'
import { RESETPASSWORDREQUEST, RESETPASSWORDSUCCESS, RESETPASSWORDFAIL } from '../Constants/ResetpasswordConstants'



export const Resetpassword = (email) => async (dispatch) => {
    try {
        dispatch({
            type: RESETPASSWORDREQUEST
        })

        const { data } = await api.post(`user/accounts/password/reset/`,
            {
                'email': email
            },
            {
                'headers': {
                    'Content-Type': 'application/json'
                }
            }

        )

        console.log("REset_password_Mail:",email)

        // dispatch({
        //     type:RESETPASSWORDSUCCESS,
        //     payload:data
        // })

        if (data.Error) {
            dispatch({
                type: RESETPASSWORDFAIL,
                payload: data.Error, // set proper error message
            });
            console.log("Reset_password_Action_Error+++:", data?.Error)
        } else {
            dispatch({
                type: RESETPASSWORDSUCCESS,
                payload: data, // success message (like { details: "Please check your email..." })
            });
            console.log("Reset_password_Action_Success:", data)
        }

        
    } catch (error) {
        dispatch({
            type: RESETPASSWORDFAIL,
            payload: error.response?.data?.Error || 'Invalid email address'
        })
        console.log("Reset_password_Action_Error:", error.response?.data?.Error)
    }
}