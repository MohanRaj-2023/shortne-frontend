import { SIGNUP_REQUEST,SIGNUP_SUCCESS,SIGNUP_FAIL } from "../Constants/signupConstants";

const initialState={
    loading:false,
    payload:null,
    error:null
}
export const SignupReducer = (state=initialState,actions)=>{
    switch(actions.type){
            case SIGNUP_REQUEST:
                return {loading:true,payload:{}}
            case SIGNUP_SUCCESS:
                return {loading:false,payload:actions.payload}
            case SIGNUP_FAIL:
                return {loading:false,error:actions.error}
            case 'CLEAR_SIGNUP_SCREEN':
                return {...initialState}
            default:
                return state
    }
}