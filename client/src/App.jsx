// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
// ... (keep your existing imports)
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import Main from './components/AssessmentsPages/Main';
import LecturePage1 from './components/Learning/LecturePage1';
import Blogs from './components/Engagement/Blogs';
import LectureDetailPage from './components/Learning/RecommLecDetails';
// import Chat from './components/ChatBot/Chat';
import SolarSystem from './components/SolarSystem';
import QRCodeList from './components/QRCodeList';
import BlogDetail from './components/Engagement/BlogDetail';
import Quiz from './components/AssessmentsPages/Quiz';
import Page1 from './components/AssessmentsPages/Page1';
import Chat from './components/ChatBot/Chat';
import ChatBotIcon from './components/ChatBot/ChatBotIcon';
import ConnectIQ from './components/ConnectIQ';
import Visualisation from './components/Visualisation.jsx/Visualisation';
import Chat1 from './components/ChatBot/Chat1';
import Badges from './components/Badges';
import PhysicsChat from './components/PhysicsChat';
import ChemistryChat from './components/ChemistryChat';
import Notes from './components/Notes';
import RoadMap from './components/RoadMap';
import Page3 from './components/AssessmentsPages/Page3';
import RecommLec from './components/Learning/RecommLec';
import StudentProfileForm from './components/StudentProfileForm';
import RecommLecDetails from './components/Learning/RecommLecDetails';

const App = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Routes where NavBar should not be displayed
  const noNavBarRoutes = ['/signin', '/'];
  
  // Routes where ChatBot should not be displayed
  const noChatBotRoutes = ['/signin'];

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className=''>
      {/* Conditionally render NavBar */}
      {!noNavBarRoutes.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/signup" element={<SignUp />}/>

        <Route path="/" element={<SignUp />} />
        <Route path="/assessment" element={<Main />} />
        <Route path="/core_learning" element={<RecommLec />} />
        <Route path="/core_learning/mentor/:id" element={<LecturePage1 />} />
        <Route path="/enangement" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/lecture/:id" element={<LectureDetailPage />} />
        <Route path="/support" element={<Chat1 />} />
        <Route path="/quiz/:lectureId" element={<Quiz />} />
        <Route path="/progress" element={<Page1 />} />
        <Route path="/solar" element={<SolarSystem />} />
        <Route path="/chem3d" element={<QRCodeList />} />
        <Route path="/connectIQ" element={<ConnectIQ />} />
        <Route path="/visualise" element={<Visualisation />} />
        <Route path="/badges" element={<Badges/>}/>
        <Route path="/physics-chat" element={<PhysicsChat/>} />
        <Route path="/chemistry-chat" element={<ChemistryChat/>}/>
        <Route path="/notes" element={<Notes/>}/>
        <Route path="/roadmap" element={<RoadMap/>}/>
        <Route path="/meeting" element={<Page3 />} />
        <Route path="/stu_profile" element={<StudentProfileForm/>} />
        <Route path="/lectures/:lectureId" element={<RecommLecDetails />} />
      </Routes>

      {/* Render ChatBot Icon and Chat component if not in excluded routes */}
      {!noChatBotRoutes.includes(location.pathname) && (
        <>
          <ChatBotIcon isOpen={isChatOpen} toggleChat={toggleChat} />
          <Chat isOpen={isChatOpen} toggleChat={toggleChat} />
        </>
      )}
    </div>
  );
};

export default App;