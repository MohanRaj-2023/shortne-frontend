import { REACTION_REQUEST,REACTION_SUCCESS,REACTION_FAIL,
         COMMENT_REACTION_REQUEST,COMMENT_REACTION_SUCCESS,COMMENT_REACTION_FAIL
 } from "../Constants/ReactionConstants";


// Reaction reducer
export const ReactionReducer = (state={},action)=>{
    switch(action.type){
        case  REACTION_REQUEST:
            return {...state,loading:true,error:null}
        case REACTION_SUCCESS:
            return {...state,loading:false,payload:action.payload}
        case REACTION_FAIL:
            return {...state,loading:false,error:action.error}
        default:
            return state
    }
}


export const CommentReactionReducer = (state={},action)=>{
    switch(action.type){
        
        // Comment reaction reducer
        case  COMMENT_REACTION_REQUEST:
            return {...state,loading:true,error:null}
        case COMMENT_REACTION_SUCCESS:
            return {...state,loading:false,payload:action.payload}
        case COMMENT_REACTION_FAIL:
            return {...state,loading:false,error:action.error}
            
        default:
            return state
    }
}