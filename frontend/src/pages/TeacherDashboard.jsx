import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function TeacherDashboard() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("post");
  const [className, setClassName] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    className: '',
    type: 'assignment',
    postedBy: ''
  });

  // Helper function to get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const user = getUserData();
        if (!user) {
          console.error('No user data found');
          return;
        }

        const response = await axios.get('http://localhost:5005/api/auth/get-teacher');
        const teachers = response.data;
        const filteredList = teachers.filter((t) => t.user.email === user.email);
        setFiltered(filteredList);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/auth/get-student');
        const studentsData = response.data;
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchTeacher();
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.content || !formData.className || !formData.type) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const user = getUserData();
      const token = getAuthToken();
      
      if (!user || !token) {
        alert('Authentication required. Please login again.');
        return;
      }

      await axios.post('http://localhost:5005/api/auth/post',
        {
          title: formData.title,
          content: formData.content,
          className: formData.className,
          type: formData.type,
          postedBy: user.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      alert("Post created successfully!");

      // Reset form after submission
      setFormData({
        title: '',
        content: '',
        className: '',
        type: 'assignment',
        postedBy: ''
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!className || !date) {
      alert('Please select class name and date');
      return;
    }

    const attendanceEntries = Object.entries(attendance);
    if (attendanceEntries.length === 0) {
      alert('Please mark attendance for at least one student');
      return;
    }

    setLoading(true);

    try {
      const records = attendanceEntries.map(([studentId, status]) => ({
        student: studentId,
        status,
      }));
      
      const token = getAuthToken();
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      await axios.post(
        "http://localhost:5005/api/auth/attendance",
        {
          className,
          date,
          records,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      alert("Attendance marked successfully!");
      setAttendance({});
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert("Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
  };

  // Filter students by class name
  const filteredStudents = students.filter((student) => 
    !className || student.className === className
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {filtered?.[0]?.user?.name?.charAt(0) || "T"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {filtered?.[0]?.user?.name || "Loading..."}
                </h1>
                <p className="text-indigo-200 text-sm">Teacher Dashboard</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-2">
              <button 
                onClick={() => setView("post")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  view === "post" 
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm" 
                    : "text-indigo-200 hover:text-white hover:bg-white/10"
                }`}
              >
                📝 Create Post
              </button>
              <button 
                onClick={() => setView("attendance")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  view === "attendance" 
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm" 
                    : "text-indigo-200 hover:text-white hover:bg-white/10"
                }`}
              >
                📋 Attendance
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium text-indigo-200 hover:text-white hover:bg-red-500/20 transition-all duration-200"
              >
                🚪 Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "post" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3">📝</span>
                  Create New Post
                </h2>
                <p className="text-indigo-100 mt-2">Share announcements, assignments, and updates with your students</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Post Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter an engaging title"
                    />
                  </div>

                  <div>
                    <label htmlFor="className" className="block text-sm font-semibold text-gray-700 mb-2">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="className"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., CSE2026"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="assignment">📚 Assignment</option>
                    <option value="result">📊 Result</option>
                    <option value="notice">📢 Notice</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="6"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Write your post content here..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Post...
                    </span>
                  ) : (
                    "🚀 Create Post"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === "attendance" && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3">📋</span>
                  Mark Attendance
                </h2>
                <p className="text-emerald-100 mt-2">Track student attendance for your classes</p>
              </div>

              <form onSubmit={handleSubmitAttendance} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., CSE2026"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Students Table */}
                {filteredStudents.length > 0 ? (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Students ({filteredStudents.length})
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          Present
                        </span>
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          Absent
                        </span>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Roll No</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredStudents.map((student, index) => (
                            <tr key={student._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {student.rollNumber}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-semibold">
                                      {student.user.name.charAt(0)}
                                    </span>
                                  </div>
                                  {student.user.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAttendanceChange(student._id, 'present')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                      attendance[student._id] === 'present'
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                                    }`}
                                  >
                                    ✓ Present
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAttendanceChange(student._id, 'absent')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                      attendance[student._id] === 'absent'
                                        ? 'bg-red-500 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                    }`}
                                  >
                                    ✗ Absent
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-gray-400 text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {className ? "No students found for this class" : "Enter a class name to see students"}
                    </h3>
                    <p className="text-gray-500">
                      {className ? "Check if the class name is correct" : "Type the class name in the field above"}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || filteredStudents.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Attendance...
                    </span>
                  ) : (
                    "📊 Submit Attendance"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}