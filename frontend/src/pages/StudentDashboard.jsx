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

const StudentDashboard = () => {
  console.log("✅ StudentDashboard component mounted");

  // Mock student data - in real app, this would come from your backend
  const [studentData, setStudentData] = useState({
    user: {
      name: "John Doe",
      email: "john.doe@school.edu",
      role: "student"
    },
    rollNumber: "CS2024001",
    className: "Computer Science - Year 3",
    feesPaid: true
  });

  // Mock posts data
  const [posts, setPosts] = useState([
    {
      _id: "1",
      title: "Assignment 1: Data Structures",
      type: "assignment",
      content: "Complete the binary tree implementation assignment. Due date: March 15, 2024.",
      className: "Computer Science - Year 3",
      postedBy: { name: "Dr. Smith" },
      createdAt: new Date("2024-03-01")
    },
    {
      _id: "2",
      title: "Mid-term Results Published",
      type: "result",
      content: "Mid-term examination results are now available. Check your grades in the results section.",
      className: "Computer Science - Year 3",
      postedBy: { name: "Prof. Johnson" },
      createdAt: new Date("2024-03-05")
    },
    {
      _id: "3",
      title: "Holiday Notice",
      type: "notice",
      content: "University will be closed on March 20th for Spring Festival. Classes will resume on March 21st.",
      className: "Computer Science - Year 3",
      postedBy: { name: "Admin Office" },
      createdAt: new Date("2024-03-10")
    }
  ]);

  // Mock attendance data
  const [attendanceData, setAttendanceData] = useState([
    { date: "2024-03-01", status: "present" },
    { date: "2024-03-02", status: "present" },
    { date: "2024-03-03", status: "absent" },
    { date: "2024-03-04", status: "present" },
    { date: "2024-03-05", status: "present" },
    { date: "2024-03-06", status: "present" },
    { date: "2024-03-07", status: "absent" },
  ]);

  // Calculate attendance percentage
  const attendancePercentage = Math.round(
    (attendanceData.filter(record => record.status === "present").length / attendanceData.length) * 100
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {studentData.user.name}!</p>
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
                  {posts.map((post) => (
                    <div key={post._id} className={`p-4 rounded-lg border ${getPostColor(post.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center mb-2">
                          {getPostIcon(post.type)}
                          <span className="ml-2 text-sm font-medium capitalize">{post.type}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {post.createdAt.toLocaleDateString()}
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
                  {attendanceData.slice(-5).map((record, index) => (
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
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    View All Assignments
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Award className="w-4 h-4 mr-2" />
                    Check Results
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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