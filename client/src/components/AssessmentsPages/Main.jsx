import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';

const Main = () => {
  const [activePage, setActivePage] = useState('Page2');

  const renderPage = () => {
    switch (activePage) {
      case 'Page1':
        return <Page1 />;
      case 'Page2':
        return <Page2 setActivePage={setActivePage} />;
      case 'Page3':
        return <Page3 />
      default:
        return <Page2 />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden"> {/* Added h-screen and overflow-hidden */}
      {/* Sidebar - Static */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="h-screen flex-none" // Added flex-none to prevent shrinking
      >
        <Sidebar setActivePage={setActivePage} />
      </motion.div>

      {/* Content Area - Scrollable */}
      <motion.div
        className="flex-1 overflow-y-auto p-4 bg-[#dee0e0]" // Added overflow-y-auto
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderPage()}
      </motion.div>
    </div>
  );
};

export default Main;