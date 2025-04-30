import axios from 'axios'
import { DETECT_EMOTION_FAIL, DETECT_EMOTION_REQUEST, DETECT_EMOTION_SUCCESS, GET_USERDETAIL_FAIL, GET_USERDETAIL_REQUEST, GET_USERDETAIL_SUCCESS, LECTURE_RECOMMEND_FAIL, LECTURE_RECOMMEND_REQUEST, LECTURE_RECOMMEND_SUCCESS, LOGIN_PROJECT_FAIL, LOGIN_PROJECT_REQUEST, LOGIN_PROJECT_SUCCESS, LOGOUT_PROJECT, MENTORS_FAIL, MENTORS_REQUEST, MENTORS_SUCCESS, POST_BLOG_FAIL, POST_BLOG_REQUEST, POST_BLOG_SUCCESS, SIGNUP_PROJECT_FAIL, SIGNUP_PROJECT_REQUEST, SIGNUP_PROJECT_SUCCESS, STUDENT_CREATE_FAIL, STUDENT_CREATE_REQUEST, STUDENT_CREATE_SUCCESS, STUDENT_PROFILE_CREATE_FAIL, STUDENT_PROFILE_CREATE_REQUEST, STUDENT_PROFILE_CREATE_SUCCESS } from '../constants/projectConstants';


export const signup = (name, email, password, password2) => async (dispatch) => {
    try {
        dispatch({ type: SIGNUP_PROJECT_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post('http://127.0.0.1:8000/user/signup/', { name, email, password, password2 }, config);

        dispatch({
            type: SIGNUP_PROJECT_SUCCESS,
            payload: data
        });

        // You may also want to save user info in local storage
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: SIGNUP_PROJECT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const loginProject = (email, password) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_PROJECT_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { email, password },
        config
      );
  
      dispatch({
        type: LOGIN_PROJECT_SUCCESS,
        payload: data,
      });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: LOGIN_PROJECT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
};

export const logoutProject = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: LOGOUT_PROJECT });
};

export const getUserDetails = (token,userId) => async (dispatch) => {
    try {
      dispatch({ type: GET_USERDETAIL_REQUEST });
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get(`http://127.0.0.1:8000/user/${userId}/`, config); // Adjust the endpoint accordingly
  
        dispatch({
            type: GET_USERDETAIL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: GET_USERDETAIL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
  };

  export const emotionReducer = (state = { emotion: '' }, action) => {
    switch (action.type) {
      case DETECT_EMOTION_REQUEST:
        return { loading: true };
      case DETECT_EMOTION_SUCCESS:
        return { loading: false, emotion: action.payload.emotion };
      case DETECT_EMOTION_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
};

export const detectEmotion = (frame) => async (dispatch) => {
    try {
      dispatch({ type: DETECT_EMOTION_REQUEST });
  
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/emotion/', frame, config);
  
      dispatch({ type: DETECT_EMOTION_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: DETECT_EMOTION_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    }
};


export const getLectures = () => async (dispatch) => {
  try {
    dispatch({ type: GET_LECTURES_REQUEST });

    const { data } = await axios.get('/api/lectures/');  // Update this URL as per your backend

    dispatch({
      type: GET_LECTURES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_LECTURES_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};

export const listMentors = () => async (dispatch) => {
  try {
    dispatch({ type: MENTORS_REQUEST });

    const { data } = await axios.get('http://127.0.0.1:8000/mentors/');  // Adjust the URL to match your API endpoint
    dispatch({
      type: MENTORS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MENTORS_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};

export const postBlog = (blogData) => async (dispatch) => {
  try {
    dispatch({ type: POST_BLOG_REQUEST });

    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('http://127.0.0.1:8000/blog/', blogData, config);

    dispatch({ type: POST_BLOG_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_BLOG_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};


export const fetchLectureRecommendations = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LECTURE_RECOMMEND_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.get('http://127.0.0.1:8000/my-recommendation/', config);

    dispatch({
      type: LECTURE_RECOMMEND_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LECTURE_RECOMMEND_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};



export const createStudentProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch({ type: STUDENT_PROFILE_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.post('http://127.0.0.1:8000/profile/create-profile/', profileData, config);

    dispatch({ type: STUDENT_PROFILE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: STUDENT_PROFILE_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
