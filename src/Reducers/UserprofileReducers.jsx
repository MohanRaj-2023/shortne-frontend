import {PROFILE_INFO_REQUEST,PROFILE_INFO_SUCCESS,PROFILE_INFO_FAIL,
        PROFILE_EDIT_REQUEST,PROFILE_EDIT_SUCCESS,PROFILE_EDIT_FAIL,PROFILE_EDIT_RESET
} from '../Constants/UserprofileConstants'

const initialstate = {
    loading:false,
    error:null,
    profileinfo:{}
}

export const ProfileinfoReducer = (state=initialstate,actions)=>{
    switch(actions.type){
        case PROFILE_INFO_REQUEST :
            return {...state,loading:true}
        case PROFILE_INFO_SUCCESS:
            return {loading:false,profileinfo:actions.payload}
        case PROFILE_INFO_FAIL:
            return {...state,loading:false,error:actions.error}

        default:
            return state
    }
}

// edit profile reducer

export const ProfileEditReducer = (state={},actions)=>{
    switch(actions.type){
        case PROFILE_EDIT_REQUEST :
            return {loading:true}
        case PROFILE_EDIT_SUCCESS:
            // console.log("EditReducer:",actions.payload)
            return {loading:false,profileinfo :actions.payload}
        case PROFILE_EDIT_FAIL:
            return {loading:false,error:actions.error}
        case PROFILE_EDIT_RESET:
            return {}
        default:
            return state
    }
}