import React from 'react';
import { useSelector } from 'react-redux';

const Sidebar = ({ setActivePage }) => {
    const userDetails = useSelector((state) => state.userDetails);
    const { user } = userDetails;
    
    console.log(user)
  return (
    <div className="w-20% bg-gray-800 text-white h-full p-6">
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold">Welcome {user?.name}</h3>
      </div>
      <div className="space-y-4">
        <button className="w-full bg-gray-700 p-3 rounded cursor-pointer" onClick={() => setActivePage('Page2')}>Quiz</button>
        <button className="w-full bg-gray-700 p-3 rounded cursor-pointer" onClick={() => setActivePage('Page1')}>Progress Reports</button>
        <button className="w-full bg-gray-700 p-3 rounded cursor-pointer" onClick={() => setActivePage('Page3')}>PTMs</button>
        {/* <button className="w-full bg-gray-700 p-3 rounded" onClick={() => setActivePage('Page4')}>Page 4</button>
        <button className="w-full bg-gray-700 p-3 rounded" onClick={() => setActivePage('Page5')}>Page 5</button> */}
      </div>
    </div>
  );
};

export default Sidebar;
