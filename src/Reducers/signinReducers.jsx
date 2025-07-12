import { USER_SIGNIN_REQUEST,USER_SIGNIN_SUCCESS,USER_SIGNIN_FAIL} from "../Constants/signinConstants";

const userinfoFromStorage = localStorage.getItem("userinfo")
  ? JSON.parse(localStorage.getItem("userinfo"))
  : null

const initialState = {
    userinfo: userinfoFromStorage
}



export const SigninReducers = (state={userinfo:null},actions)=>{
    switch(actions.type){
        case USER_SIGNIN_REQUEST:
            return {loading:true}
        
        case USER_SIGNIN_SUCCESS:
            return {loading:false,userinfo:actions.payload}

        case USER_SIGNIN_FAIL:
            return {loading:false,error:actions.payload}
    
        case 'CLEAR_SIGNIN_SCREEN':
            return{...state,payload:null,error:null};

        default:
            return state    
    }
    
}

