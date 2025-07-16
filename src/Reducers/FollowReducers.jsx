import { FOLLOW_REQUEST,FOLLOW_SUCCESS,FOLLOW_FAIL,
        UNFOLLOW_REQUEST,UNFOLLOW_SUCCESS,UNFOLLOW_FAIL,
        FOLLOW_STATUS_REQUEST,FOLLOW_STATUS_SUCCESS,FOLLOW_STATUS_FAIL,
        FOLLOWERS_REQUEST,FOLLOWERS_SUCCESS,FOLLOWERS_FAIL,
        FRIENDS_REQUEST,FRIENDS_SUCCESS,FRIENDS_FAIL } 
        from "../Constants/FollowConstants";

//FollowReducer

export const FollowReducer = (state={},actions)=>{
    switch(actions.type){
        case FOLLOW_REQUEST:
            return {loading:true}

        case FOLLOW_SUCCESS:
            return {loading:false,payload:actions.payload}

        case FOLLOW_FAIL:
            return {loading:false , error:actions.error}
        
            default:
            return state
    }
}

//UnfollowReducer

export const UnfollowReducer = (state={},actions)=>{
    switch(actions.type){
        case UNFOLLOW_REQUEST:
            return {loading:true}
        case UNFOLLOW_SUCCESS:
            return {loading:false,payload:actions.payload}
        case UNFOLLOW_FAIL:
            return {loading:false,error:actions.error}
        default:
            return state
    }
}

//FollowStatusReducer

export const FollowStatusReducer = (state={},actions)=>{
    switch(actions.type){
        case FOLLOW_STATUS_REQUEST:
            return {loading:true}
        case FOLLOW_STATUS_SUCCESS:
            return {loading:false,followstatus:actions.payload}
        case FOLLOW_STATUS_FAIL:
            return{loading:false,error:actions.error}
        default:
            return state
    }
}

//FollowersReducer

export const FollowersReducer  = (state={},actions)=>{
    switch(actions.type){
        case FOLLOWERS_REQUEST:
            return {loading:true}
        case FOLLOWERS_SUCCESS:
            console.log("Followers_Reducer:",actions.payload.details)
            return {loading:false,newfollowers:actions.payload.details}
        case FOLLOWERS_FAIL:
            return {loading:false,error:actions.error}
        default:
            return state
    }
}

// friends reducer
export const FriendsReducer = (state={},action)=>{
    switch(action.type){
        case FRIENDS_REQUEST:
            return {...state,loading:true,error:null}
        case FRIENDS_SUCCESS:
            return {...state,loading:false,friends:action.payload.details}
        case FRIENDS_FAIL:
            return {...state,loading:false,error:action.error}
        default:
            return state
    }
}