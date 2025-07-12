import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//Redux
import store from './Store.jsx';
import { Provider } from 'react-redux';

// Router
// import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import ScrollTop from './components/ScrollTop.jsx';


// Screens
import HeaderNavbar from './components/HeaderNavbar.jsx';
import SigninScreen from './components/screens/SigninScreen.jsx'
import HomeScreen from './components/screens/HomeScreen.jsx';
import ResetpasswordScreen from './components/screens/ResetpasswordScreen.jsx';
import NewpasswordScreen from './components/screens/NewpasswordScreen.jsx';
import SignupScreen from './components/screens/SignupScreen.jsx';
import ProfileScreen from './components/screens/ProfileScreen.jsx';
import PoastScreen from './components/screens/PoastScreen.jsx';
import { PostModalProvider } from './components/PoastmodalContext.jsx';
import Postcreatemodal from './components/Postcreatemodal.jsx';
import VideoScreen from './components/screens/VideoScreen.jsx';
import MessengerScreen from './components/screens/MessengerScreen.jsx';
import EditprofileScreen from './components/screens/EditprofileScreen.jsx';
import SearchScreen from './components/screens/SearchScreen.jsx';

import Layout from './components/Layout.jsx';
import { usePostModal } from './components/PoastmodalContext.jsx';
import PrivateRoute from './utils/Privateroute.jsx';
import Editpostscreen from './components/screens/Editpostscreen.jsx';

const LayoutWithContext = () => {
  const { openPostModal } = usePostModal()
  return(
    <>
      <Layout openPostModal={openPostModal} />
      <Postcreatemodal/>
    </>
  ) 
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <PostModalProvider>
  <Provider store={store}>
    
      <Router>
        <ScrollTop/>
        <Routes>
          {/* Layout routes with Header and VerticalNavbar */}
          <Route element={<LayoutWithContext />}>
              <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomeScreen />
                </PrivateRoute>
              }
            />
            {/* <Route path="/" element={<HomeScreen />} /> */}
            <Route path="/profile/:username" element={<ProfileScreen />} />
            <Route path="/poast/:post_id" element={<PoastScreen />} />
            <Route path="/video" element={<VideoScreen />} />
            <Route path="/messenger" element={<MessengerScreen />} />
            <Route path="/profile/edit/" element={<EditprofileScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/post-edit/:post_id" element={<Editpostscreen/>} />
          </Route>

          {/* Standalone routes without layout (e.g., auth) */}
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/reset-password" element={<ResetpasswordScreen />} />
          <Route path="/reset-password/:uid/:token" element={<NewpasswordScreen />} />
        </Routes>
      </Router>
  </Provider>
  </PostModalProvider>
</StrictMode>
)
