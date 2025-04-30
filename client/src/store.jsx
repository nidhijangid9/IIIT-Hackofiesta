import {combineReducers,createStore,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension';
import { signupProjectReducers,loginProjectReducers, userDetailReducers, mentorsListReducer, blogPostReducer, lectureRecommendReducer, studentProfileCreateReducer } from './reducers/projectReducers';

// ✅ 1. Get userInfo from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;



const rootReducer = combineReducers({
    userSignup:signupProjectReducers,
    userLogin: loginProjectReducers,
    userDetails:userDetailReducers,
    mentorsList:mentorsListReducer,
    blogPost:blogPostReducer,
    lectureRecommend :lectureRecommendReducer,
    studentProfileCreate: studentProfileCreateReducer
})


// ✅ 3. Preload the state with userInfo
const initialState = {
    userLogin: {
      userInfo: userInfoFromStorage,
      isAuthenticated: userInfoFromStorage ? true : false,
    },
  };


const middleware=[thunk]


const store = createStore(rootReducer, initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store;