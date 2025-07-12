import api from "../Api/api";
import {
    POSTS_REQUEST, POSTS_SUCCESS, POSTS_FAIL,
    POST_REQUEST, POST_SUCCESS, POST_FAIL,
    VIDEO_POST_REQUEST, VIDEO_POST_SUCCESS, VIDEO_POST_FAIL,
    SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAIL,
    
} from "../Constants/PostConstants";


export const PostsAction = (access_token, username, nextUrl = null) => async (dispatch) => {

    try {
        // If it's the first page, dispatch POSTS_REQUEST
        if (!nextUrl) {
            dispatch({ type: POSTS_REQUEST });
        }

        const config = {
            'headers': {
                Authorization: `Bearer ${access_token}`
            },
            params:{username} 
            
            

        }
        // Use full `nextUrl` if provided (e.g., ?page=2), else default to first page endpoint
        const endpoint = nextUrl || `post/posts/`;

        const { data } = await api.get(endpoint, config)


        // 
        dispatch({
            type: nextUrl ? 'POSTS_APPEND_SUCCESS' : POSTS_SUCCESS,
            payload: {
                posts: data.results,
                next: data.next,
            }
        })
        console.log("Post's_Action:", data)
    }
    catch (error) {
        dispatch({
            type: POSTS_FAIL,
            error: error.response?.data?.details || "Can't fetch any post"
        })
    }

}


// Video post

export const VideoPostAction = (access_token,nextUrl = null) => async (dispatch) => {
    try {
        // If it's the first page, dispatch POSTS_REQUEST
        if (!nextUrl) {
            dispatch({ type: VIDEO_POST_REQUEST });
        }

        const config = {
            'headers': {
                Authorization: `Bearer ${access_token}`
            }
        }

        const endpoint = nextUrl || `post/videos/`;

        const { data } = await api.get(endpoint, config)

        dispatch({
            type: nextUrl ? 'VIDEO_POSTS_APPEND_SUCCESS' : VIDEO_POST_SUCCESS,
            payload: {
                video_posts: data.results,
                next: data.next,
            }
        })
    } catch (error) {
        dispatch({
            type: VIDEO_POST_FAIL,
            error: error.response?.data?.details || 'Unable to fetch videos...'
        })
    }
}

export const PostAction = (access_token, post_id) => async (dispatch) => {
    try {
        dispatch({
            type: POST_REQUEST
        })


        const config = {
            'headers': {
                Authorization: `Bearer ${access_token}`
            }
        }
        const { data } = await api.get(`post/post-view/${post_id}`, config)

        dispatch({
            type: POST_SUCCESS,
            payload: data
        })

        console.log("Post_Action:", data)
    }
    catch (error) {
        dispatch({
            type: POST_FAIL,
            error: error.response?.data?.details || "Can't fetch any post"
        })
    }

}

// Search
export const SearchAction = (access_token, query) => async (dispatch) => {
    try {
        dispatch({
            type: SEARCH_REQUEST
        })

        const config = {
            'headers': {
                Authorization: `Bearer ${access_token}`
            }
        }

        const { data } = await api.get(`post/search/?query=${query}`, config)

        dispatch({
            type: SEARCH_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: SEARCH_FAIL,
            error: error.response?.data?.details || 'Unable to fetch search result...'
        })
    }
}