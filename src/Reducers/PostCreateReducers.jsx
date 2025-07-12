import { POST_CREATE_REQUEST,POST_CREATE_SUCCESS,POST_CREATE_FAIL,
         EDIT_POST_REQUEST,EDIT_POST_SUCCESS,EDIT_POST_FAIL,
         DELETE_POST_REQUEST,DELETE_POST_SUCCESS,DELETE_POST_FAIL,POST_EDIT_RESET
 } from "../Constants/PostCreateConstants";


export const PostCreateReducer = (state={},actions)=>{
    switch(actions.type){
        case POST_CREATE_REQUEST:
            return {loading:true}
        case POST_CREATE_SUCCESS:
            return {loading:false,payload:actions.payload}
        case POST_CREATE_FAIL:
            
            return {loading:false,error:actions.error}

        default:
            return state
    }
}

// Edit
export const PostEditReducer = (state={},actions)=>{
    switch(actions.type){
        case EDIT_POST_REQUEST:
            return {loading:true}
        case EDIT_POST_SUCCESS:
            console.log("Edit_post_reducer:",actions.payload)
            return {loading:false,payload:actions.payload}
        case POST_EDIT_RESET:
            return {}
        case EDIT_POST_FAIL:
            return {loading:false,error:actions.error}

        default:
            return state
    }
}

// Delete
export const PostDeleteReducer = (state={},actions)=>{
    switch(actions.type){
        case DELETE_POST_REQUEST:
            return {loading:true}
        case DELETE_POST_SUCCESS:
            return {loading:false,payload:actions.payload}
        case DELETE_POST_FAIL:
            return {loading:false,payload:actions.error}

        default:
            return state
    }
}