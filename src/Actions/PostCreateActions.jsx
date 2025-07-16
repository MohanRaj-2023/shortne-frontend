import api from "../Api/api";
import {POST_CREATE_REQUEST,POST_CREATE_SUCCESS,POST_CREATE_FAIL,
        EDIT_POST_REQUEST,EDIT_POST_SUCCESS,EDIT_POST_FAIL,
        DELETE_POST_REQUEST,DELETE_POST_SUCCESS,DELETE_POST_FAIL,
} from '../Constants/PostCreateConstants'


export const PostCreateAction = (access_token,formData)=> async (dispatch)=>{
    try{
        dispatch(
            {
                type:POST_CREATE_REQUEST
            }
        )
        const {data} = await api.post(`post/post-create/`,
                formData,
                {
                'headers':{
                    'Content-Type':'multipart/form-data',
                    'Authorization':`Bearer ${access_token}`,
                     }
               }
        )

        console.log("post create success:",data)
        dispatch({
            type:POST_CREATE_SUCCESS,
            payload:data.details
        })

    }
    catch(error){
         console.error("Full error object:", error);
    console.log("error.response:", error.response);
    console.log("error.response?.data:", error.response?.data);
    console.log("error.response?.data?.error:", error.response?.data?.error);
        dispatch({
            type:POST_CREATE_FAIL,
            error:error.response?.data?.error || "Unable to create a post..."
        })
    }

}

// Edit
export const PostEditAction = (access_token,formData)=> async (dispatch)=>{
    try{
        dispatch(
            {
                type:EDIT_POST_REQUEST
            }
        )
        console.log("Edit_form:",formData)
        const {data} = await api.patch(`post/post-edit/`,
                formData,
                {
                'headers':{
                    'Content-Type':'multipart/form-data',
                    'Authorization':`Bearer ${access_token}`,
                     }
               }
        )


        dispatch({
            type:EDIT_POST_SUCCESS,
            payload:data
        })
    }
    catch(error){
        dispatch({
            type:EDIT_POST_FAIL,
            error:error.response?.data?.details || "Unable to Edit a post..."
        })
    }
}

// Delete
// Edit
export const PostDeleteAction = (access_token,post_id)=> async (dispatch)=>{
    try{
        dispatch(
            {
                type:DELETE_POST_REQUEST
            }
        )
        console.log("Delete_id:",post_id)
        const {data} = await api.delete(`post/post-delete/${post_id}/`,{},
                {
                'headers':{
                    'Content-Type':'multipart/form-data',
                    'Authorization':`Bearer ${access_token}`,
                     }
               }
        )
        dispatch({
            type:DELETE_POST_SUCCESS,
            payload:data
        })
    }
    catch(error){
        dispatch({
            type:DELETE_POST_FAIL,
            error:error.response?.data?.details || "Unable to Delete a post..."
        })
    }
}