// import React, { useEffect, useState } from 'react'
// import NavBar from './NavBar'
// import Page1 from './LandingPages/Page1';
// import Page2 from './LandingPages/Page2';

// const Home = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//       // Trigger the animation by changing the state after the component mounts
//       const timer = setTimeout(() => setIsVisible(true), 100); // Small delay for smooth entry
//       return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className='h-full bg-[#dee0e0]'>
//         {/* <NavBar /> */}
//         <Page1/>
//         <Page2/>
//     </div>
//   )
// }

// export default Home
import React, { useEffect, useState, useRef } from 'react';
import NavBar from './NavBar';
import Page1 from './LandingPages/Page1';
import Page2 from './LandingPages/Page2';
 

const Home = () => {
 

  return (
    <div className="relative">
      <Page1 />
      <Page2 />


      <footer class="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-0">
        <div class="w-full max-w-screen-xl mx-auto md:py-8">
          <hr class="my-6 border-gray-500 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span class="block text-xl text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="https://flowbite.com/" class="hover:underline">CodeAstra</a>. All Rights Reserved.</span>
        </div>
      </footer>


    </div>
  );
};

export default Home;