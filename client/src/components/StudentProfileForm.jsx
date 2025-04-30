import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStudentProfile } from '../actions/projectActions';
import { 
  FaUser, 
  FaIdCard, 
  FaPhone, 
  FaCalendarAlt, 
  FaVenusMars, 
  FaGraduationCap, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaCheckCircle 
} from 'react-icons/fa';

const StudentProfileForm = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.studentProfileCreate);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    standard: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createStudentProfile(formData));
  };

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        date_of_birth: '',
        gender: '',
        standard: '',
      });
      
      // Hide success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
      <div className="flex items-center mb-6">
        <FaUser className="text-indigo-600 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
      </div>

      {showSuccess && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" />
          <p className="text-green-700">Student profile created successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="student_id"
                placeholder="Enter student ID"
                value={formData.student_id}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="phone_number"
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaVenusMars className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          {/* Standard/Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Standard/Grade</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGraduationCap className="text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="number"
                name="standard"
                placeholder="Enter standard (e.g. 10)"
                value={formData.standard}
                onChange={handleChange}
                min="1"
                max="12"
              />
            </div>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 font-medium"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Creating Profile...
              </>
            ) : (
              'Create Student Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfileForm;