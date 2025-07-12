import {NEWPASSWORDREQUEST,NEWPASSWORDSUCCESS,NEWPASSWORDFAIL} from '../Constants/NewpasswordConstants'

const initialState = {
  loading: false,
  error: null,
  payload: null,
};

export const NewpasswordReducer = (state=initialState,action)=>{

    switch(action.type){
        case NEWPASSWORDREQUEST:
            return {loading:true,payload:{}}

        case NEWPASSWORDSUCCESS:
            return {loading:false,payload:action.payload}

        case NEWPASSWORDFAIL:
            return {loading:false,error:action.error}
            
        case 'CLEAR_NEW_PASSWORD':
            return { ...initialState };
            
        default:
            return state
    }
}