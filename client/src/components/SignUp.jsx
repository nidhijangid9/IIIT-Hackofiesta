import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../actions/projectActions';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [animateLeft, setAnimateLeft] = useState(false);
  const [animateRight, setAnimateRight] = useState(false);
  
    useEffect(() => {
      // Reset animation states when component mounts (re-renders)
      setAnimateLeft(false);
      setAnimateRight(false);
  
      // Trigger the animation after a short delay to allow the reset
      const timer = setTimeout(() => {
        setAnimateLeft(true);
        setAnimateRight(true);
      }, 50);
  
      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }, []);

  const { name, email, password, password2 } = formData;

  const dispatch = useDispatch();
  const userSignup = useSelector((state) => state.userSignup) || {};
  const { loading, error, userInfo } = userSignup;

  const navigate = useNavigate(); // useNavigate hook from react-router-dom to navigate to a new page when signup is successful

  useEffect(() => {
      if (userInfo) {
          // Handle successful signup (e.g., redirect to a different page)
          alert('Signup successful');
          console.log('Signup successful', userInfo);
      }
  }, [userInfo]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    // form validation
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    } else {
      // signup logic here
      dispatch(signup(name, email, password,password2));
      setFormData({ name: '', email: '', password: '', password2: '' });
      console.log('Form submitted');
    }

    navigate('/signin')
  };
  return (
    <div className='flex h-screen bg-[#dee0e0]'>
      {/* Left div */}
      <div
        className={`w-1/2 h-screen overflow-hidden flex transform ${animateLeft ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-[1s] ease-out`}
      >
        <img
          src="https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration-enter-application-mobile-screen-user-login-form-website-page-interface-ui-new-profile-registration-email-account_335657-936.jpg"
          alt=""
          className="w-full border-black"
        />
      </div>
      <div className={`mt-20 w-1/2 h-96px mx-auto ${animateRight ? 'translate-x-0' : 'translate-x-full'}
        } transition-transform duration-[1s] ease-out mt-50`}>
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-5">Sign Up</h2>
          {/* {error && <div className="alert alert-danger">{error}</div>}
                {loading && <div>Loading...</div>} */}
          <form className="max-w-md mx-auto" onSubmit={e => onSubmit(e)}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={email}
                onChange={e => onChange(e)}
              />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Email address
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="password"
                id="floating_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={password}
                onChange={e => onChange(e)}
              />
              <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Password
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="password2"
                id="floating_repeat_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={password2}
                onChange={e => onChange(e)}
              />
              <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Confirm password
              </label>
            </div>
            <div className="grid md:grid-cols-1 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="name"
                  id="floating_first_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={name}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Name
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            <p className="mt-5 text-blue-500 text-sm">
              <Link to={"/signin"}>Already have an account?, LogIn</Link>
            </p>
          </form>
        </div>
      </div>
    </div>

  )
}

export default SignUp