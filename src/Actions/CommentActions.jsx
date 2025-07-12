import api from '../Api/api'
import {COMMENT_REQUEST,COMMENT_SUCCESS,COMMENT_FAIL,
        POST_COMMENT_REQUEST,POST_COMMENT_SUCCESS,POST_COMMENT_FAIL,
        EDIT_COMMENT_REQUEST,EDIT_COMMENT_SUCCESS,EDIT_COMMENT_FAIL,
        DELETE_COMMENT_REQUEST,DELETE_COMMENT_SUCCESS,DELETE_COMMENT_FAIL
} from '../Constants/CommentConstants'

// Get Comments
export const CommentAction = (postid,access_token)=> async(dispatch)=>{
    try{
        dispatch({
            type:COMMENT_REQUEST
        })
        console.log("Fetching....")

        const config = {
            params:{
                'postid':postid
            },
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }
        const {data} = await api.get(`interaction/comment-view/`,config)
        console.log("Comment_action:",data)

        dispatch({
            type:COMMENT_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:COMMENT_FAIL,
            error:error.response?.data?.details || "Unable to fetch comment's."
        })
    }
}

// Create Comment 
export const PostCommentAction = (comment,access_token,postid)=> async(dispatch)=>{
    try{
        dispatch({
            type:POST_COMMENT_REQUEST
        })

        

        const {data} = await api.post(`interaction/comment/`,
            {
                'postid':postid,
                'comment':comment
            },
            {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
            }
        )

        dispatch({
            type:POST_COMMENT_SUCCESS,
            payload:{
                comment:data.comment
            }
        })
        
    }catch(error){
        dispatch({
            type:POST_COMMENT_FAIL,
            error:error.response?.data?.details || 'Unable to post a commant.'
        })
    }
}


//Edit Comment

export const EditCommentAction = (comment,id,access_token)=> async(dispatch)=>{
    try{
        dispatch(
            {type:EDIT_COMMENT_REQUEST}
        )

        console.log("Comment_id:",id)
        console.log("Comment:",comment)
        const {data} = await api.patch(`interaction/comment-edit/`,
            {
                'comment':comment,
                'id':id
            },
            {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${access_token}`
                }
            }
            
        )

        console.log("Edit_Action:",data)

        dispatch({
            type:EDIT_COMMENT_SUCCESS,
            payload:{
                comment:data.comment
            }
        })
    }catch(error){
        dispatch({
            type:EDIT_COMMENT_FAIL,
            error:error.response?.data?.details || 'Unable to Edit a comment...'
        })
    }
}

// Delete Comment Action

export const DeleteCommentAction = (id,access_token)=> async(dispatch)=>{
    try{
        dispatch({
            type:DELETE_COMMENT_REQUEST
        })

        const config = {
            params:{
                'id':id
            },
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }

        const {data} = await api.delete(`interaction/comment-delete/`,config)

        dispatch({
            type:DELETE_COMMENT_SUCCESS,
            payload:data.comment_id
        })
        console.log("Delteing_id:",data.comment_id)
    }catch(error){
        dispatch({
            type:DELETE_COMMENT_FAIL,
            error:error.response?.data?.details || 'Unable to delete the comment.'
        })
    }
}