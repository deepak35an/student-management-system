import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  BookOpen, 
  Bell, 
  FileText, 
  Award, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';

const StudentDashboard = ({ userEmail, userData, posts, attendanceData, onViewAssignments, onCheckResults, onViewAttendance }) => {
  console.log("✅ StudentDashboard component mounted with email:", userEmail);

  // Default props in case they're not provided
  const defaultUserData = {
    user: {
      name: "Student Name",
      email: userEmail || "student@school.edu",
      role: "student"
    },
    rollNumber: "Loading...",
    className: "Loading...",
    feesPaid: false
  };

  const defaultPosts = [
    {
      _id: "1",
      title: "Welcome to Student Portal",
      type: "notice",
      content: "Welcome! Your data is being loaded...",
      className: "General",
      postedBy: { name: "System" },
      createdAt: new Date()
    }
  ];

  const defaultAttendance = [
    { date: new Date().toISOString().split('T')[0], status: "present" }
  ];

  // Use provided props or fallback to defaults
  const [studentData, setStudentData] = useState(userData || defaultUserData);
  const [postsData, setPostsData] = useState(posts || defaultPosts);
  const [attendanceRecords, setAttendanceRecords] = useState(attendanceData || defaultAttendance);

  // Update state when props change
  useEffect(() => {
    if (userData) {
      setStudentData({
        ...userData,
        user: {
          ...userData.user,
          email: userEmail || userData.user.email
        }
      });
    }
  }, [userData, userEmail]);

  useEffect(() => {
    if (posts) {
      setPostsData(posts);
    }
  }, [posts]);

  useEffect(() => {
    if (attendanceData) {
      setAttendanceRecords(attendanceData);
    }
  }, [attendanceData]);

  // Calculate attendance percentage
  const attendancePercentage = Math.round(
    (attendanceRecords.filter(record => record.status === "present").length / attendanceRecords.length) * 100
  );

  const getPostIcon = (type) => {
    switch(type) {
      case 'assignment': return <FileText className="w-4 h-4" />;
      case 'result': return <Award className="w-4 h-4" />;
      case 'notice': return <Bell className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPostColor = (type) => {
    switch(type) {
      case 'assignment': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'result': return 'bg-green-50 border-green-200 text-green-800';
      case 'notice': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleViewAssignments = () => {
    if (onViewAssignments) {
      onViewAssignments(userEmail);
    }
  };

  const handleCheckResults = () => {
    if (onCheckResults) {
      onCheckResults(userEmail);
    }
  };

  const handleViewAttendance = () => {
    if (onViewAttendance) {
      onViewAttendance(userEmail);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {studentData.user.name}!</p>
          <p className="text-sm text-gray-500">Account: {studentData.user.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="text-lg font-semibold text-gray-900">{studentData.rollNumber}</p>
              </div>
            </div>
          </div>

          {/* Class Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-lg font-semibold text-gray-900">{studentData.className}</p>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-lg font-semibold text-gray-900">{attendancePercentage}%</p>
              </div>
            </div>
          </div>

          {/* Fee Status Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Fee Status</p>
                <div className="flex items-center">
                  {studentData.feesPaid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-1" />
                  )}
                  <p className="text-lg font-semibold text-gray-900">
                    {studentData.feesPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Posts
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {postsData.map((post) => (
                    <div key={post._id} className={`p-4 rounded-lg border ${getPostColor(post.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center mb-2">
                          {getPostIcon(post.type)}
                          <span className="ml-2 text-sm font-medium capitalize">{post.type}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                      <p className="text-xs text-gray-500">Posted by: {post.postedBy.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Info
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{studentData.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{studentData.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <p className="text-gray-900 capitalize">{studentData.user.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Attendance
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {attendanceRecords.slice(-5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center">
                        {record.status === 'present' ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium capitalize ${
                          record.status === 'present' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Overall Attendance</span>
                    <span className={`text-sm font-semibold ${
                      attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {attendancePercentage}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          attendancePercentage >= 75 ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button 
                    onClick={handleViewAssignments}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View All Assignments
                  </button>
                  <button 
                    onClick={handleCheckResults}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Check Results
                  </button>
                  <button 
                    onClick={handleViewAttendance}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Full Attendance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;