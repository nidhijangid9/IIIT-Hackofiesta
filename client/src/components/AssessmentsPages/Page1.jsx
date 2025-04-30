import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const Page1 = () => {
  const [emailStatus, setEmailStatus] = useState(null);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const pieData = [
    { name: 'Maths', value: 85 },
    { name: 'Physics', value: 78 },
    { name: 'Chemistry', value: 92 },
    { name: 'Biology', value: 74 },
    { name: 'Marathi', value: 88 },
  ];

  const COLORS = ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B'];

  const lineData = [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: 90 },
    { month: 'Jul', score: 92 },
    { month: 'Aug', score: 94 },
    { month: 'Sep', score: 96 },
    { month: 'Oct', score: 98 },
    { month: 'Nov', score: 99 },
    { month: 'Dec', score: 100 },
  ];

  const skillData = [
    { name: 'Critical Thinking', value: 85, fill: '#3B82F6' },
    { name: 'Problem Solving', value: 78, fill: '#8B5CF6' },
    { name: 'Research', value: 92, fill: '#EC4899' },
    { name: 'Teamwork', value: 74, fill: '#10B981' },
    { name: 'Communication', value: 88, fill: '#F59E0B' },
  ];

  const handleEmailSend = async () => {
    setIsEmailSending(true);
    try {
      // Match the exact URL pattern from your Django URLs
      const response = await fetch('http://127.0.0.1:8000/reports/api/send-report-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: 'Parth Shah',
          studentId: 'STD12345',
          class: 'Grade 10',
          academicYear: '2024-2025',
        }),
      });
      
      // Check if the response is valid
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEmailStatus({
          success: true,
          message: data.message || 'Email sent successfully!'
        });
        setTimeout(() => setEmailStatus(null), 5000);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus({
        success: false,
        message: error.message || 'Failed to send email. Please try again.'
      });
      setTimeout(() => setEmailStatus(null), 5000);
    } finally {
      setIsEmailSending(false);
    }
  };

  // Function to generate PDF
  const handleSubmit = async () => {
    try {
      // Create a new jsPDF instance
      const { jsPDF } = await import('jspdf');
      const { autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title and styling
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text("Student Progress Report", 105, 20, { align: "center" });
      
      // Add student info
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Student: Nidhi Jangid", 20, 35);
      doc.text("ID: STD12345", 20, 45);
      doc.text("Class: Grade 10", 20, 55);
      doc.text("Academic Year: 2024-2025", 20, 65);
      
      // Add performance metrics
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text("Performance Overview", 20, 80);
      
      // Add summary data in a table
      autoTable(doc, {
        startY: 85,
        head: [["Metric", "Value"]],
        body: [
          ["Completed Modules", "24/30"],
          ["Average Score", "87%"],
          ["Study Hours", "156"],
          ["Achievement Rank", "Top 5%"]
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Subject Performance
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text("Subject Performance", 20, doc.lastAutoTable.finalY + 20);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [["Subject", "Score"]],
        body: pieData.map(item => [item.name, `${item.value}%`]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Skill Development
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text("Skill Development", 20, doc.lastAutoTable.finalY + 20);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [["Skill", "Proficiency"]],
        body: skillData.map(item => [item.name, `${item.value}%`]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Learning Analytics
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text("Learning Analytics", 20, doc.lastAutoTable.finalY + 20);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [["Metric", "Value"]],
        body: [
          ["Assignment Completion", "85%"],
          ["Attendance Rate", "92%"],
          ["Engagement Score", "4.2/5"],
          ["Quiz Average", "78%"]
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Report generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2, 
          doc.internal.pageSize.height - 10, 
          { align: "center" }
        );
      }
      
      // Save PDF
      doc.save("student_progress_report.pdf");
      
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-end mb-6">
          <motion.button
            onClick={handleEmailSend}
            disabled={isEmailSending}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isEmailSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Send Report to Parent
              </>
            )}
          </motion.button>
        </div>
        
        {/* Email Status Notification */}
        {emailStatus && (
          <motion.div
            className={`mb-6 p-4 rounded-lg ${emailStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              {emailStatus.success ? (
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
              )}
              <p className={`font-medium ${emailStatus.success ? 'text-green-700' : 'text-red-700'}`}>{emailStatus.message}</p>
            </div>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Learning Journey</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Track your progress, identify strengths and areas for improvement, and celebrate your achievements.</p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Completed Modules", value: "24/30", icon: "📚", color: "bg-blue-500" },
            { title: "Average Score", value: "87%", icon: "🎯", color: "bg-purple-500" },
            { title: "Study Hours", value: "156", icon: "⏱️", color: "bg-indigo-500" },
            { title: "Achievement Rank", value: "Top 5%", icon: "🏆", color: "bg-pink-500" }
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`h-2 ${card.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-700">{card.title}</h3>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <p className="text-4xl font-bold text-gray-800">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Chart 1 - Subject Performance */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden border border-gray-100"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Subject Performance</h2>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8" 
                    dataKey="value" 
                    label
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: "0.5rem" }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2 - Progress Over Time */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden border border-gray-100"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Monthly Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: "0.5rem" }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#EC4899' }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Skill Development Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Skill Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {skillData.map((skill, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="font-semibold">{skill.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="h-3 rounded-full"
                      style={{ width: `${skill.value}%`, backgroundColor: skill.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  barSize={20} 
                  data={skillData}
                >
                  <RadialBar
                    minAngle={15}
                    background={{ fill: "#f3f4f6" }}
                    clockWise
                    dataKey="value"
                    animationDuration={1500}
                  />
                  <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: "0.5rem" }} />
                  <Legend iconSize={10} verticalAlign="bottom" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Learning Analytics & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Learning Analytics */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Learning Analytics</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Assignment Completion", value: "85%" },
                { label: "Attendance Rate", value: "92%" },
                { label: "Engagement Score", value: "4.2/5" },
                { label: "Quiz Average", value: "78%" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{item.value}</p>
                  <p className="text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Download Detailed Report
            </button>
          </motion.div>

          {/* Alerts */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Actionable Alerts</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  <p className="font-semibold text-yellow-700">Warning</p>
                </div>
                <p className="mt-1 text-gray-700">Math homework completion rate dropped below 80%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <p className="font-semibold text-green-700">Success</p>
                </div>
                <p className="mt-1 text-gray-700">Science quiz scores improved by 15%</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  <p className="font-semibold text-red-700">Urgent</p>
                </div>
                <p className="mt-1 text-gray-700">Reading assignments pending for 3 days</p>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recommended Actions</h2>
            <div className="space-y-4">
              {[
                { title: "Interactive Math Practice", desc: "Focus on geometry concepts", icon: "📐" },
                { title: "Reading Challenge", desc: "Complete chapter 5 with comprehension", icon: "📚" },
                { title: "Physics Lab Simulation", desc: "Complete the pendulum experiment", icon: "🔬" },
                { title: "Group Discussion", desc: "Join the scheduled debate on climate change", icon: "👥" }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-md">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Learning Timeline</h2>
          <div className="relative pl-8">
            {[
              { date: "Mar 12", title: "Completed Advanced Algebra", desc: "Score: 92% - Excellent understanding of concepts" },
              { date: "Mar 8", title: "Started Science Project", desc: "Topic: Renewable Energy Sources" },
              { date: "Mar 3", title: "Reading Challenge", desc: "Completed 3 books this month" },
              { date: "Feb 28", title: "Group Presentation", desc: "Team scored highest in the class" }
            ].map((item, index) => (
              <div key={index} className="mb-8 relative">
                <div className="absolute left-0 -ml-8 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-4 border-white shadow-md"></div>
                <div className={`absolute left-0 -ml-5 w-0.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500 ${index === 3 ? 'hidden' : ''}`}></div>
                <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Challenge Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 mb-12"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2 text-white">Ready for a new challenge?</h2>
              <p className="text-blue-100">Push your skills further with our advanced modules and personalized learning paths.</p>
            </div>
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
              Explore Advanced Courses
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page1;