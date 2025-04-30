import { DETECT_EMOTION_FAIL, DETECT_EMOTION_REQUEST, DETECT_EMOTION_SUCCESS, GET_LECTURES_FAIL, GET_LECTURES_REQUEST, GET_LECTURES_SUCCESS, GET_USERDETAIL_FAIL, GET_USERDETAIL_REQUEST, GET_USERDETAIL_SUCCESS, LECTURE_RECOMMEND_FAIL, LECTURE_RECOMMEND_REQUEST, LECTURE_RECOMMEND_SUCCESS, LOGIN_PROJECT_FAIL, LOGIN_PROJECT_REQUEST, LOGIN_PROJECT_SUCCESS, LOGOUT_PROJECT, MENTORS_FAIL, MENTORS_REQUEST, MENTORS_SUCCESS, POST_BLOG_FAIL, POST_BLOG_REQUEST, POST_BLOG_SUCCESS, SIGNUP_PROJECT_FAIL, SIGNUP_PROJECT_REQUEST, SIGNUP_PROJECT_SUCCESS, STUDENT_CREATE_FAIL, STUDENT_CREATE_REQUEST, STUDENT_CREATE_SUCCESS, STUDENT_PROFILE_CREATE_FAIL, STUDENT_PROFILE_CREATE_REQUEST, STUDENT_PROFILE_CREATE_SUCCESS } from "../constants/projectConstants";



const initialState = {
    loading: false,
    userInfo: null,
    error: null,
};
      
export const signupProjectReducers = (state = initialState, action) => {
switch (action.type) {
    case SIGNUP_PROJECT_REQUEST:
    return {
        ...state,
        loading: true,
    };
    case SIGNUP_PROJECT_SUCCESS:
    return {
        ...state,
        loading: false,
        userInfo: action.payload,
    };
    case SIGNUP_PROJECT_FAIL:
    return {
        ...state,
        loading: false,
        error: action.payload,
    };
    default:
    return state;
}
};


const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState2 = {
  userLogin: { userInfo: userInfoFromStorage },
};


export const loginProjectReducers = (state = initialState2, action) => {
    switch (action.type) {
      case LOGIN_PROJECT_REQUEST:
        return { loading: true , isAuthenticated: false};
      case LOGIN_PROJECT_SUCCESS:
        return { loading: false,isAuthenticated: true, userInfo: action.payload };
      case LOGIN_PROJECT_FAIL:
        return { loading: false, isAuthenticated: false, error: action.payload };
      case LOGOUT_PROJECT:
        return {isAuthenticated: false, userInfo: null,};
      default:
        return state;
    }
};

export const userDetailReducers = (state = {}, action) =>{
    switch(action.type){
        case GET_USERDETAIL_REQUEST:
            return {
                loading: true
            }
        case GET_USERDETAIL_SUCCESS:
            return {
                loading: false,
                user: action.payload
            }
        case GET_USERDETAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}




const initialState3 = {
    loading: false,
    lectures: [],
    error: null,
  };
  
  export const lectureReducer = (state = initialState3, action) => {
    switch (action.type) {
      case GET_LECTURES_REQUEST:
        return { ...state, loading: true };
  
      case GET_LECTURES_SUCCESS:
        return { ...state, loading: false, lectures: action.payload };
  
      case GET_LECTURES_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };

  export const mentorsListReducer = (state = { mentors: [] }, action) => {
    switch (action.type) {
      case MENTORS_REQUEST:
        return { loading: true, mentors: [] };
      case MENTORS_SUCCESS:
        return { loading: false, mentors: action.payload };
      case MENTORS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };




export const blogPostReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_BLOG_REQUEST:
      return { loading: true };
    case POST_BLOG_SUCCESS:
      return { loading: false, success: true, blog: action.payload };
    case POST_BLOG_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};




export const lectureRecommendReducer = (state = { lectures: [] }, action) => {
  switch (action.type) {
    case LECTURE_RECOMMEND_REQUEST:
      return { loading: true, lectures: [] };
    case LECTURE_RECOMMEND_SUCCESS:
      return { loading: false, lectures: action.payload };
    case LECTURE_RECOMMEND_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};



export const studentProfileCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case STUDENT_PROFILE_CREATE_REQUEST:
      return { loading: true };
    case STUDENT_PROFILE_CREATE_SUCCESS:
      return { loading: false, success: true, profile: action.payload };
    case STUDENT_PROFILE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};