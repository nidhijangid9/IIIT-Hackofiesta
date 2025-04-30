import React, { useEffect, useState, useRef } from "react";
import { Clock, Calendar, ExternalLink } from "lucide-react";

const Page2 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, []);

  // Sample upcoming sessions data
  const upcomingSessions = [
    { 
      id: 1, 
      teacher: "Dr. Sarah Johnson", 
      subject: "Biology", 
      time: "2:30 PM - 3:45 PM", 
      timeRemaining: "2h 30m", 
      imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYwRQ44vQYL7OI-dXJafiAjFS3yU2Nq86AnA&s",
      urgency: "medium"
    }, 
    { 
      id: 2, 
      teacher: "Prof. Michael Chen", 
      subject: "Physics", 
      time: "5:00 PM - 6:15 PM", 
      timeRemaining: "5h", 
      imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUXnp4FKMxk7C_3UbORLMHkyHqG-ePQeP79A&s",
      urgency: "low"
    },
    { 
      id: 4, 
      teacher: "Prof. David Maxwell", 
      subject: "Mathematics", 
      time: "11:15 AM - 12:30 PM", 
      timeRemaining: "30m", 
      imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjC-K-Pz9FFCITBGurhXFz_mutrO0dBWzSlQ&s",
      urgency: "high"
    },
  ];

  const getUrgencyStyles = (urgency) => {
    switch(urgency) {
      case "high":
        return {
          card: "border-l-4 border-red-500",
          badge: "bg-red-50 text-red-700 border border-red-200",
          icon: "text-red-500",
          gradient: "from-red-500 to-pink-500"
        };
      case "medium":
        return {
          card: "border-l-4 border-blue-500",
          badge: "bg-blue-50 text-blue-700 border border-blue-200",
          icon: "text-blue-500",
          gradient: "from-blue-500 to-indigo-500"
        };
      case "low":
      default:
        return {
          card: "border-l-4 border-gray-400",
          badge: "bg-gray-50 text-gray-700 border border-gray-200",
          icon: "text-gray-500",
          gradient: "from-gray-400 to-gray-600"
        };
    }
  };

  return (
    <div ref={pageRef} className="bg-white-50 py-8 pb-20 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 flex-grow">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Upcoming Sessions
            </span>
          </h1>
          
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Your scheduled learning sessions are listed below. Click on any card to join the meeting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingSessions.map((session) => {
              const styles = getUrgencyStyles(session.urgency);
              
              return (
                <div 
                  key={session.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${styles.card} group overflow-hidden h-64`}
                  onClick={() => window.open("https://meet.google.com/hfg-mfhr-bna", "_blank")}
                >
                  <div className="p-6 cursor-pointer flex flex-col h-full relative">
                    {/* Top decorative element */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${styles.gradient} opacity-10 rounded-bl-full transform transition-all duration-500 group-hover:scale-150`}></div>
                    
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4 overflow-hidden shadow-md border-2 border-white">
                        <img 
                          src={session.imageUrl}
                          alt={session.teacher}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900">{session.teacher}</h3>
                        <p className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">{session.subject}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center text-base text-gray-600">
                        <Calendar size={18} className={`mr-3 ${styles.icon}`} />
                        <span>Today</span>
                      </div>
                      <div className="flex items-center text-base text-gray-600">
                        <Clock size={18} className={`mr-3 ${styles.icon}`} />
                        <span>{session.time}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <span className={`text-sm px-4 py-2 rounded-full ${styles.badge} font-medium`}>
                        Starts in {session.timeRemaining}
                      </span>
                      <button className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-all duration-300 group-hover:rotate-12">
                        <ExternalLink size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page2;