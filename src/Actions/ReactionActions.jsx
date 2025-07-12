import api from "../Api/api";
import { REACTION_REQUEST,REACTION_SUCCESS,REACTION_FAIL,
         COMMENT_REACTION_REQUEST,COMMENT_REACTION_SUCCESS,COMMENT_REACTION_FAIL
 } from "../Constants/ReactionConstants";

// reaction action
export const ReactionAction = (access_token,post_id,is_like)=> async(dispatch)=>{
    try{
        dispatch({
            type:REACTION_REQUEST
        })

        const {data} = await api.post(`interaction/post-react/`,
            {
                "post_id":post_id,
                "is_like":is_like
            },
            {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${access_token}`
                }
            }
        )

        dispatch({
            type:REACTION_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:REACTION_FAIL,
            error:error.response?.data?.details || "Can't react to the post"
        })
    }
}

// Comment reaction
export const CommentReactionAction = (access_token,comment_id,is_like)=> async(dispatch)=>{
    try{
        dispatch({
            type:COMMENT_REACTION_REQUEST
        })

        const {data} = await api.post(`interaction/comment-react/`,
            {
                "comment_id":comment_id,
                "is_like":is_like
            },
            {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${access_token}`
                }
            }
        )

        console.log("Comment_Like_Action:",data)

        dispatch({
            type:COMMENT_REACTION_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:COMMENT_REACTION_FAIL,
            error:error.response?.data?.details || "Can't react to the comment"
        })
    }
}
