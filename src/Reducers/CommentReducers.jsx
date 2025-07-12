import { COMMENT_REQUEST,COMMENT_SUCCESS,COMMENT_FAIL,
         POST_COMMENT_REQUEST,POST_COMMENT_SUCCESS,POST_COMMENT_FAIL,
         EDIT_COMMENT_REQUEST,EDIT_COMMENT_SUCCESS,EDIT_COMMENT_FAIL,
         DELETE_COMMENT_REQUEST,DELETE_COMMENT_SUCCESS,DELETE_COMMENT_FAIL
 } from "../Constants/CommentConstants";

// Comment

const initialState = {
  loading: false,
  comments:[],
  error: null
};

export const CommentReducer = (state=initialState,action)=>{
    switch(action.type){

        // Fetching comments
        case  COMMENT_REQUEST:
            return {...state,loading:true,error:null}
        case COMMENT_SUCCESS:
            return {...state,loading:false,comments:action.payload.details}
        case COMMENT_FAIL:
            return {...state,loading:false,error:action.error}

        // Post comment

        case POST_COMMENT_REQUEST:
            return {...state,loading:true,error:null}
        case POST_COMMENT_SUCCESS:
            console.log("Comment_post_reducer:",action.payload.comment)
            return {...state,loading:false,comments:[...state.comments,action.payload.comment]}
        case POST_COMMENT_FAIL:
            return {...state,loading:false,error:action.error}

        //Edit Comment
        case EDIT_COMMENT_REQUEST:
            return {...state,loading:true,error:null}
        case EDIT_COMMENT_SUCCESS:
            const updated_comment = action.payload.comment
            console.log("Update_Reducer:",updated_comment)
            return {...state,
                    loading:false,
                    comments:state.comments.map(comment=>comment.id === updated_comment.id?updated_comment:comment)
                    }

        case EDIT_COMMENT_FAIL:
            return {...state,loading:false,error:action.error}

        
        // Delete Comment

        case DELETE_COMMENT_REQUEST:
            return {...state,loading:true,error:null}
        case DELETE_COMMENT_SUCCESS:
            const deleted_id = Number(action.payload)
            const delete_updated_comment = (state.comments || []).filter(comment=>comment.id !== deleted_id) 
            return {...state,
                    loading:false,
                    comments:delete_updated_comment
                   }
        case DELETE_COMMENT_FAIL:
            return {...state,loading:false,error:action.error}

        default:
            // console.log("Unhandled action in commentReducer:", action.type)
            return state
    }
}
