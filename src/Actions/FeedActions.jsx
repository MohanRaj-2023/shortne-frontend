import axios from 'axios'
import api from '../Api/api'
import { FEED_REQUEST, FEED_SUCCESS, FEED_FAIL } from '../Constants/FeedContext'


export const FeedAction = (access_token, nextUrl = null) => async (dispatch) => {
    try {
        // console.log("➡️ Fetching feed...")
        if (!nextUrl) {
            dispatch({ type: FEED_REQUEST });
        }


        const config = {
            'headers': {
                Authorization: `Bearer ${access_token}`
            }
        }

        // const endpoint = nextUrl || `post/home/`;

        // const { data } = await api.get(endpoint, config)
        console.log("Next URL:", nextUrl)
        const { data } = await (nextUrl
            ? axios.get(nextUrl, config) // use full URL directly
            : api.get('post/home/', config) // relative for first page
        );


        // dispatch({
        //     type: FEED_SUCCESS,
        //     payload: data
        // })

        dispatch({
            type: nextUrl ? 'FEED_APPEND_SUCCESS' : FEED_SUCCESS,
            payload: {
                feeds: data.results,
                next: data.next,
            },
        });
        console.log("Feed_Action:", data)
    } catch (error) {
        console.log("🔥 FeedAction error:");
        console.log("message:", error.message);
        console.log("status:", error?.response?.status);
        console.log("response data:", error?.response?.data);
        dispatch({
            type: FEED_FAIL,
            error: error.response?.data?.details || "Can't fetch feeds"
        })
    }
}