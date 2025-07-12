import { FEED_REQUEST, FEED_SUCCESS, FEED_FAIL } from '../Constants/FeedContext'

const initialState = {
    feeds: [],
    loading: false,
    error: null,
};

export const FeedReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case FEED_REQUEST:
            return { ...state, loading: true }
        case FEED_SUCCESS:
            // prevent unnecessary updates (optional but good)
            console.log("Feed_Reducer:", actions.payload)
            if (JSON.stringify(state.feeds) === JSON.stringify(actions.payload)) {
                return { ...state, loading: false }; // no change

            }

            // return {loading: false, feeds: actions.payload };
            return {
                feeds: actions.payload.feeds,
                next: actions.payload.next,
                loading: false,
            };
        case 'FEED_APPEND_SUCCESS':
            return {
                feeds: [...state.feeds, ...actions.payload.feeds],
                next: actions.payload.next,
                loading: false,
            };
        case FEED_FAIL:
            return { ...state, loading: false, error: actions.error };
        default:
            return state
    }
}