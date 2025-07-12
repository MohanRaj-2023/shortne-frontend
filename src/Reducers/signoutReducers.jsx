import { SIGNOUT_REQUEST,SIGNOUT_SUCCESS,SIGNOUT_FAIL } from "../Constants/signoutConstants";


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