import { SIGNOUT_REQUEST,SIGNOUT_SUCCESS,SIGNOUT_FAIL,DELETE_ACCOUNT_REQUEST,DELETE_ACCOUNT_SUCCESS,DELETE_ACCOUNT_FAIL } from "../Constants/signoutConstants";


export const SignoutReducer = (state={},actions)=>{
    switch(actions.type){
        case SIGNOUT_REQUEST:
            return {loading:true}

        case SIGNOUT_SUCCESS:
            return {loading:false,signout:true}

        case SIGNOUT_FAIL:
            return {loading:false,error:actions.error}
        
        default:
            return state 
    }
}


// Delete account
const initialState = {
    accountdelete:false,
    loading:false,
    error:null
}
export const DeleteAccountReducer = (state=initialState,actions)=>{
    switch(actions.type){
        case DELETE_ACCOUNT_REQUEST:
            return {loading:true}

        case DELETE_ACCOUNT_SUCCESS:
            return {loading:false,accountdelete:true}

        case DELETE_ACCOUNT_FAIL:
            return {loading:false,error:actions.error}
        
        default:
            return state 
    }
}