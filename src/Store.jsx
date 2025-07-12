import {createStore,combineReducers,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension';

// import {composeWithDevTools} from 'redux-devtools-extension'
// Reducers
import { SignupReducer } from './Reducers/SignupReducers'
import { SigninReducers } from './Reducers/signinReducers'
import { SignoutReducer } from './Reducers/signoutReducers'
import { ResetpasswordReducer } from './Reducers/ResetpasswordReducers'
import { NewpasswordReducer } from './Reducers/NewpasswordReducers'
import { ProfileEditReducer, ProfileinfoReducer } from './Reducers/UserprofileReducers'
import { HashtagSearchReducer } from './Reducers/HashtagsSearchReducers'
import { PostCreateReducer,PostEditReducer,PostDeleteReducer } from './Reducers/PostCreateReducers';
import { PostsReducer } from './Reducers/PostReducers';
import { PostReducer } from './Reducers/PostReducers';
import { FeedReducer } from  './Reducers/FeedReducers';
import { FollowReducer } from './Reducers/FollowReducers';
import { UnfollowReducer } from './Reducers/FollowReducers';
import { FollowStatusReducer } from './Reducers/FollowReducers';
import { NotificationReducer } from './Reducers/NotificationReducers';
import { NotificationDeleteReducer } from './Reducers/NotificationReducers';
import { FollowersReducer } from './Reducers/FollowReducers';
import { VideoPostReducer } from './Reducers/PostReducers';
import { CommentReducer } from './Reducers/CommentReducers';
import { ReactionReducer } from './Reducers/ReactionReducers';
import { CommentReactionReducer } from './Reducers/ReactionReducers';
import { FriendsReducer } from './Reducers/FollowReducers';
import { SharepostReducer } from './Reducers/SharepostReducers';
import { ChatidReducer } from './Reducers/MessageReducers';
import { ChatReducer } from './Reducers/MessageReducers';
import { MarkreadReducer } from './Reducers/MessageReducers';
import { UseronlinestatusReducer } from './Reducers/MessageReducers';
import { UnreadmessagecountReducer } from './Reducers/MessageReducers';
import { LastchatReducer } from './Reducers/MessageReducers';
import { SearchReducer } from './Reducers/PostReducers';
import { UnreadReducer,MarknotireadReducer } from './Reducers/NotificationReducers';

const reducer = combineReducers({
    UserSignup : SignupReducer,
    UserSigninReducer:SigninReducers,
    ResetPassword : ResetpasswordReducer,
    Newpassword : NewpasswordReducer,
    Signout : SignoutReducer,
    Profileinfo : ProfileinfoReducer,
    HashtagSearch : HashtagSearchReducer,
    PostCreate : PostCreateReducer,
    Posts : PostsReducer,
    Post : PostReducer,
    VideoPosts : VideoPostReducer,
    Feeds : FeedReducer,
    Follow : FollowReducer,
    Unfollow : UnfollowReducer,
    FollowStatus : FollowStatusReducer,
    Friendslist : FriendsReducer,
    Notifications : NotificationReducer,
    DeleteNotification : NotificationDeleteReducer,
    Followers : FollowersReducer,
    Comment: CommentReducer,
    React : ReactionReducer,
    ReactComment  :CommentReactionReducer,
    Sharepost : SharepostReducer,
    Chatid : ChatidReducer,
    Chat : ChatReducer,
    Isread : MarkreadReducer,
    Unreadmsgcount: UnreadmessagecountReducer,
    Onlinestatus : UseronlinestatusReducer,
    Lastchat : LastchatReducer,
    Editprofile : ProfileEditReducer,
    Search : SearchReducer,
    Unreadcounts : UnreadReducer,
    MarkRead : MarknotireadReducer,
    Editpost : PostEditReducer,
    Deletepost : PostDeleteReducer
})

const initialState={
    UserSigninReducer:{
        userinfo:localStorage.getItem('userinfo')?
        JSON.parse(localStorage.getItem('userinfo')):
        null
    }
}

const middleweare = [thunk]

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleweare)))

export default store;