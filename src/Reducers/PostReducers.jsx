import {
    POSTS_REQUEST, POSTS_SUCCESS, POSTS_FAIL,
    POST_REQUEST, POST_SUCCESS, POST_FAIL,
    VIDEO_POST_REQUEST, VIDEO_POST_SUCCESS, VIDEO_POST_FAIL,
    SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAIL
} from "../Constants/PostConstants";


export const PostsReducer = (state = {}, actions) => {
    switch (actions.type) {
        case POSTS_REQUEST:
            return { loading: true }

        case POSTS_SUCCESS:
            // console.log("POST_REDUCER:",actions.payload)
            // return { loading: false, posts: actions.payload }
            return {
                posts: actions.payload.posts,
                next: actions.payload.next,
                loading: false,
            };

        case 'POSTS_APPEND_SUCCESS':
            return {
                posts: [...state.posts, ...actions.payload.posts],
                next: actions.payload.next,
                loading: false,
            };

        case POSTS_FAIL:
            return { loading: false, error: actions.error }

        default:
            return state
    }
}

// Video Post
const initialState = {
  video_posts: [],
  next: null,
  loading: false,
  error: null
}

export const VideoPostReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case VIDEO_POST_REQUEST:
            return {...state, loading: true }
        case VIDEO_POST_SUCCESS:
            // return { loading: false, videoposts: actions.payload }
            return {
                video_posts: actions.payload.video_posts,
                next: actions.payload.next,
                loading: false,
            };
        case 'VIDEO_POSTS_APPEND_SUCCESS':
            return {
                video_posts: [...state.video_posts, ...actions.payload.video_posts],
                next: actions.payload.next,
                loading: false,
            };
        case VIDEO_POST_FAIL:
            return {...state, loading: false, error: actions.error }
        default:
            return state
    }
}


export const PostReducer = (state = {}, actions) => {
    switch (actions.type) {
        case POST_REQUEST:
            return { loading: true }

        case POST_SUCCESS:
            // console.log("POST_REDUCER:",actions.payload)
            return { loading: false, post: actions.payload }


        case POST_FAIL:
            return { loading: false, error: actions.error }

        default:
            return state
    }
}


// Search reducer

export const SearchReducer = (state = {}, actions) => {
    switch (actions.type) {
        case SEARCH_REQUEST:
            return { loading: true }

        case SEARCH_SUCCESS:
            // console.log("SEARCH_REDUCER:",actions.payload)
            return { loading: false, searchresult: actions.payload }


        case SEARCH_FAIL:
            return { loading: false, error: actions.error }

        default:
            return state
    }
}