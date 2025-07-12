import { RESETPASSWORDREQUEST,RESETPASSWORDSUCCESS,RESETPASSWORDFAIL } from "../Constants/ResetpasswordConstants";

const initialState = {
  loading: false,
  error: null,
  payload: null,
};

export const ResetpasswordReducer = (state=initialState,action)=>{
    switch(action.type){
        case RESETPASSWORDREQUEST:
            return {loading:true}

        case RESETPASSWORDSUCCESS:
            return {loading:false,payload:action.payload.details,error:null}

        case RESETPASSWORDFAIL:
            return {loading:false,error:action.payload}
        case 'CLEAR_RESET_PASSWORD':
            return { ...initialState };
        
        default:
            return state
    }

}